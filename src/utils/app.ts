import {
    BlockCommunityResponse,
    BlockPersonResponse,
    Comment,
    CommentReplyView,
    CommentReportView,
    CommentSortType,
    CommentView,
    CommunityView,
    FederationMode,
    GetSiteResponse,
    Instance,
    Language,
    MyUserInfo,
    PersonCommentMentionView,
    PersonPostMentionView,
    PersonView,
    PostReportView,
    PostSortType,
    PostView,
    RegistrationApplicationView,
    Search,
    SearchType,
} from "lemmy-js-client";
import {
    Choice,
    CommentNodeI,
    CommentNodeView,
    CommunityTribute,
    DataType,
    IsoData,
    PersonTribute,
    RouteData,
    ThemeColor,
    VoteType,
    WithComment,
} from "@/utils/types";
import {editListImmutable, getQueryString, hostname} from "@/utils/helpers";
import {HttpService, UserService} from "@/services/index";
import {isBrowser} from "@/utils/browser";
import Toastify from "toastify-js";

export function buildCommentsTree(
  comments: CommentView[],
  parentComment: boolean,
): CommentNodeI[] {
  const map = new Map<number, CommentNodeI>();
  const depthOffset = !parentComment
    ? 0
    : (getDepthFromComment(comments[0].comment) ?? 0);

  for (const commentView of comments) {
    const depthI = getDepthFromComment(commentView.comment) ?? 0;
    const depth = depthI ? depthI - depthOffset : 0;
    const node: CommentNodeI = {
      commentView,
      children: [],
      depth,
    };
    map.set(commentView.comment.id,
      {...node});
  }

  const tree: CommentNodeI[] = [];

  // if its a parent comment fetch, then push the first comment to the top node.
  if (parentComment) {
    const cNode = map.get(comments[0].comment.id);
    if (cNode) {
      tree.push(cNode);
    }
  }

  // This should not be sorted on the front end, in order to preserve the
  // back end sorts. However, the parent ids must be sorted, so make sure
  // When adding new comments to trees, that they're inserted right after
  // their parent index. This is done in post.tsx
  for (const commentView of comments) {
    const child = map.get(commentView.comment.id);
    if (child) {
      const parentId = getCommentParentId(commentView.comment);
      if (parentId) {
        const parent = map.get(parentId);
        // Necessary because blocked comment might not exist
        if (parent) {
          parent.children.push(child);
        }
      } else {
        if (!parentComment) {
          tree.push(child);
        }
      }
    }
  }

  return tree;
}

export const colorList: string[] = [
  "var(--comment-node-1-color)",
  "var(--comment-node-2-color)",
  "var(--comment-node-3-color)",
  "var(--comment-node-4-color)",
  "var(--comment-node-5-color)",
  "var(--comment-node-6-color)",
  "var(--comment-node-7-color)",
];

function assertType<T>(_: T) {}

export function commentToPostSortType(sort: CommentSortType): PostSortType {
  switch (sort) {
    case "Hot":
    case "New":
    case "Old":
    case "Controversial":
      return sort;
    case "Top":
      return "Top";
    default: {
      assertType<never>(sort);
      return "Hot";
    }
  }
}

export function commentsToFlatNodes(
  comments: CommentNodeView[],
): CommentNodeI[] {
  const nodes: CommentNodeI[] = [];
  for (const comment of comments) {
    nodes.push({commentView: comment, children: [], depth: 0});
  }
  return nodes;
}

export function communityRSSUrl(actorId: string, sort: string): string {
  const url = new URL(actorId);
  return `${url.origin}/feeds${url.pathname}.xml${getQueryString({sort})}`;
}

export async function communitySearch(
  text: string,
): Promise<CommunityTribute[]> {
  const communitiesResponse = await fetchCommunities(text);

  return communitiesResponse.map(cv => ({
    key: `!${cv.community.name}@${hostname(cv.community.apId)}`,
    view: cv,
  }));
}

export function communitySelectName(cv: CommunityView): string {
  return cv.community.local
    ? cv.community.title
    : `${hostname(cv.community.apId)}/${cv.community.title}`;
}

export function communityToChoice(cv: CommunityView): Choice {
  return {
    value: cv.community.id.toString(),
    label: communitySelectName(cv),
  };
}

export function editComment(
  data: CommentView,
  comments: CommentView[],
): CommentView[] {
  return editListImmutable("comment",
    data,
    comments);
}

export function editCommentReply(
  data: CommentReplyView,
  replies: CommentReplyView[],
): CommentReplyView[] {
  return editListImmutable("commentReply",
    data,
    replies);
}

export function editCommentReport(
  data: CommentReportView,
  reports: CommentReportView[],
): CommentReportView[] {
  return editListImmutable("commentReport",
    data,
    reports);
}

export function editCommunity(
  data: CommunityView,
  communities: CommunityView[],
): CommunityView[] {
  return editListImmutable("community",
    data,
    communities);
}

export function editPersonPostMention(
  data: PersonPostMentionView,
  posts: PersonPostMentionView[],
): PersonPostMentionView[] {
  return editListImmutable("personPostMention",
    data,
    posts);
}

export function editPersonCommentMention(
  data: PersonCommentMentionView,
  comments: PersonCommentMentionView[],
): PersonCommentMentionView[] {
  return editListImmutable("personCommentMention",
    data,
    comments);
}

export function editPost(data: PostView, posts: PostView[]): PostView[] {
  return editListImmutable("post",
    data,
    posts);
}

export function editPostReport(
  data: PostReportView,
  reports: PostReportView[],
) {
  return editListImmutable("postReport",
    data,
    reports);
}

export function editRegistrationApplication(
  data: RegistrationApplicationView,
  apps: RegistrationApplicationView[],
): RegistrationApplicationView[] {
  return editListImmutable("registrationApplication",
    data,
    apps);
}

export function editWith<D extends WithComment, L extends WithComment>(
  {
    comment,
    saved,
    myVote,
    creatorBannedFromCommunity,
    creatorBlocked,
    creatorIsAdmin,
    creatorIsModerator,
  }: D,
  list: L[],
) {
  return [
    ...list.map(c =>
      c.comment.id === comment.id
        ? {
          ...c,
          comment,
          saved,
          myVote,
          creatorBannedFromCommunity,
          creatorBlocked,
          creatorIsAdmin,
          creatorIsModerator,
        }
        : c,
    ),
  ];
}

export function commentUpvotesMode(siteRes: GetSiteResponse): FederationMode {
  return siteRes.siteView.localSite.commentUpvotes;
}

export function commentDownvotesMode(siteRes: GetSiteResponse): FederationMode {
  return siteRes.siteView.localSite.commentDownvotes;
}

export function postUpvotesMode(siteRes: GetSiteResponse): FederationMode {
  return siteRes.siteView.localSite.postUpvotes;
}

export function postDownvotesMode(siteRes: GetSiteResponse): FederationMode {
  return siteRes.siteView.localSite.postDownvotes;
}

export function enableNsfw(siteRes?: GetSiteResponse): boolean {
  return !!siteRes?.siteView.site.contentWarning;
}

export async function fetchCommunities(q: string) {
  const res = await fetchSearchResults(q,
    "Communities");

  return res.state === "success"
    ? res.data.results.filter(r => r.type_ === "Community")
    : [];
}

export function fetchSearchResults(searchTerm: string, type_: SearchType) {
  const form: Search = {
    q: searchTerm,
    type: type_,
    sort: "Top",
    listingType: "All",
  };

  return HttpService.client.search(form);
}

export async function fetchThemeList(): Promise<string[]> {
  return fetch("/css/themelist").then(res => res.json());
}

export async function fetchUsers(q: string) {
  const res = await fetchSearchResults(q,
    "Users");

  return res.state === "success"
    ? res.data.results.filter(r => r.type_ === "Person")
    : [];
}


export function getCommentParentId(comment?: Comment): number | undefined {
  const split = comment?.path.split(".");
  // remove the 0
  split?.shift();

  return split && split.length > 1
    ? Number(split.at(split.length - 2))
    : undefined;
}

export function getDataTypeString(dt: DataType) {
  return dt === DataType.Post ? "Post" : "Comment";
}

export function getDepthFromComment(comment?: Comment): number | undefined {
  const len = comment?.path.split(".").length;
  return len ? len - 2 : undefined;
}


export function insertCommentIntoTree(
  tree: CommentNodeI[],
  cv: CommentView,
  parentComment: boolean,
) {
  // Building a fake node to be used for later
  const node: CommentNodeI = {
    commentView: cv,
    children: [],
    depth: 0,
  };

  const parentId = getCommentParentId(cv.comment);
  if (parentId) {
    const parentComment = searchCommentTree(tree,
      parentId);
    if (parentComment) {
      node.depth = parentComment.depth + 1;
      parentComment.children.unshift(node);
    }
  } else if (!parentComment) {
    tree.unshift(node);
  }
}

export function isAuthPath(pathname: string) {
  return /^\/(create_.*?|inbox|settings|admin|reports|registration-applications|activitypub.*?)\b/g.test(
    pathname,
  );
}

export function isPostBlocked(pv: PostView, myUserInfo?: MyUserInfo): boolean {
  return (
    (myUserInfo?.communityBlocks.some(c => c.id === pv.community.id) ||
      myUserInfo?.personBlocks.some(p => p.id === pv.creator.id)) ??
    false
  );
}

/**
 * Warning, do not use this in fetchInitialData
 */
export function myAuth(): string | undefined {
  return UserService.Instance.auth();
}

export function newVote(voteType: VoteType, myVote?: number): number {
  if (voteType === VoteType.Upvote) {
    return myVote === 1 ? 0 : 1;
  } else {
    return myVote === -1 ? 0 : -1;
  }
}

export function nsfwCheck(pv: PostView, myUserInfo?: MyUserInfo): boolean {
  const nsfw = pv.post.nsfw || pv.community.nsfw;
  const myShowNsfw = myUserInfo?.localUserView.localUser.showScore ?? false;
  return !nsfw || (nsfw && myShowNsfw);
}

export async function personSearch(text: string): Promise<PersonTribute[]> {
  const usersResponse = await fetchUsers(text);

  return usersResponse.map(pv => ({
    key: `@${pv.person.name}@${hostname(pv.person.apId)}`,
    view: pv,
  }));
}

export function personSelectName({
  person: {displayName, name, local, apId},
}: PersonView): string {
  const pName = displayName ?? name;
  return local ? pName : `${hostname(apId)}/${pName}`;
}

export function personToChoice(pvs: PersonView): Choice {
  return {
    value: pvs.person.id.toString(),
    label: personSelectName(pvs),
  };
}

// TODO get rid of this
export function postToCommentSortType(sort: PostSortType): CommentSortType {
  switch (sort) {
    case "Hot":
    case "New":
    case "Old":
    case "Controversial": {
      return sort;
    }
    case "Top": {
      return "Top";
    }
    case "NewComments":
    case "MostComments":
    case "Scaled":
    case "Active": {
      return "Hot";
    }
    default: {
      assertType<never>(sort);
      return "Hot";
    }
  }
}

export function searchCommentTree(
  tree: CommentNodeI[],
  id: number,
): CommentNodeI | undefined {
  for (const node of tree) {
    if (node.commentView.comment.id === id) {
      return node;
    }

    for (const child of node.children) {
      const res = searchCommentTree([child],
        id);

      if (res) {
        return res;
      }
    }
  }
  return undefined;
}

/**
 * This shows what language you can select
 *
 * Use showAll for the site form
 * Use showSite for the profile and community forms
 * Use false for both those to filter on your profile and site ones
 */
export function selectableLanguages(
  allLanguages?: Language[],
  siteLanguages?: number[],
  showAll?: boolean,
  showSite?: boolean,
  myUserInfo?: MyUserInfo,
): Language[] {
  const allLangIds = allLanguages?.map(l => l.id);
  let myLangs = myUserInfo?.discussionLanguages ?? allLangIds;
  myLangs = myLangs?.length === 0 ? allLangIds : myLangs;
  const siteLangs = siteLanguages?.length === 0 ? allLangIds : siteLanguages;

  const allLangs = allLanguages ?? [];

  if (showAll) {
    return allLangs;
  } else {
    if (showSite) {
      return allLangs.filter(x => siteLangs?.includes(x.id));
    } else {
      return allLangs
      .filter((x: {id: number}) => siteLangs?.includes(x.id))
      .filter((x: {id: number}) => myLangs?.includes(x.id));
    }
  }
}

export function setIsoData<T extends RouteData>(context: any): IsoData<T> {
  // If its the browser, you need to deserialize the data from the window
  if (isBrowser()) {
    return window.isoData;
  } else return context.router.staticContext;
}

export function showAvatars(myUserInfo?: MyUserInfo): boolean {
  return myUserInfo?.localUserView.localUser.showAvatars ?? true;
}

export function showLocal(isoData: IsoData): boolean {
  return isoData.siteRes?.siteView.localSite.federationEnabled ?? true;
}

export function siteBannerCss(banner: string): string {
  return ` \
      background-image: linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8) ) ,url("${banner}"); \
      background-attachment: fixed; \
      background-position: top; \
      background-repeat: no-repeat; \
      background-size: 100% cover; \
  
      width: 100%; \
      max-height: 100vh; \
      `;
}

export function toast(text: string, background: ThemeColor = "success") {
  if (isBrowser()) {
    const backgroundColor = `var(--bs-${background})`;
    Toastify({
      text: text,
      backgroundColor: backgroundColor,
      gravity: "bottom",
      position: "left",
      duration: 5000,
    }).showToast();
  }
}

export async function pictrsDeleteToast(filename: string) {
  if (isBrowser()) {
    const clickToDeleteText = `click_to_delete_picture ${filename}`;
    const deletePictureText = `picture_deleted ${filename}`;
    const failedDeletePictureText = `failed_to_delete_picture ${filename}`;

    const backgroundColor = `var(--bs-light)`;

    const toast = Toastify({
      text: clickToDeleteText,
      backgroundColor: backgroundColor,
      gravity: "top",
      position: "right",
      duration: 10000,
      onClick: async() => {
        if (toast) {
          const res = await HttpService.client.deleteImage({filename});
          if (res.state === "success") {
            alert(deletePictureText);
          } else {
            alert(failedDeletePictureText);
          }
        }
      },
      close: true,
    });

    toast.showToast();
  }
}

export function updateCommunityBlock(
  data: BlockCommunityResponse,
  myUserInfo?: MyUserInfo,
) {
  if (myUserInfo) {
    if (data.blocked) {
      myUserInfo.communityBlocks.push(data.communityView.community);
      toast(
        `blocked${
          data.communityView.community.name
        }`,
      );
    } else {
      myUserInfo.communityBlocks = myUserInfo.communityBlocks.filter(
        c => c.id !== data.communityView.community.id,
      );
      toast(
        `unblocked ${
          data.communityView.community.name
        }`,
      );
    }
  }
}

export function updatePersonBlock(
  data: BlockPersonResponse,
  myUserInfo?: MyUserInfo,
) {
  if (myUserInfo) {
    if (data.blocked) {
      myUserInfo.personBlocks.push(data.personView.person);
      toast(
        `blocked ${data.personView.person.name}`,
      );
    } else {
      myUserInfo.personBlocks = myUserInfo.personBlocks.filter(
        p => p.id !== data.personView.person.id,
      );
      toast(
        `unblocked ${data.personView.person.name}`,
      );
    }
  }
}

export function updateInstanceBlock(
  blocked: boolean,
  id: number,
  linkedInstances: Instance[],
  myUserInfo?: MyUserInfo,
) {
  if (myUserInfo) {
    const instance = linkedInstances.find(i => i.id === id)!;

    if (blocked) {
      myUserInfo.instanceBlocks.push(instance);
      toast(`blocked ${instance.domain}`);
    } else {
      myUserInfo.instanceBlocks = myUserInfo.instanceBlocks.filter(
        i => i.id !== id,
      );
      toast(`unblocked ${instance.domain}`);
    }
  }
}

export function instanceToChoice({id, domain}: Instance): Choice {
  return {
    value: id.toString(),
    label: domain,
  };
}

export function isAnonymousPath(pathname: string) {
  return /^\/(login.*|signup|password-change.*|verify-email.*)\b/g.test(
    pathname,
  );
}

export function calculateUpvotePct(upvotes: number, downvotes: number): number {
  return (upvotes / (upvotes + downvotes)) * 100;
}
