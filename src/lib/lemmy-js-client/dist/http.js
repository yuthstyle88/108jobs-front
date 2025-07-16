"use strict";
var Decorate = (this && this.Decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Param = (this && this.Param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Classprivatefieldset = (this && this.Classprivatefieldset) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var Classprivatefieldget = (this && this.Classprivatefieldget) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var LemmyhttpInstances, LemmyhttpApiurl, LemmyhttpHeaders, LemmyhttpFetchfunction, LemmyhttpBuildfullurl, LemmyhttpUpload, LemmyhttpUploadwithquery, LemmyhttpWrapper;
Object.defineProperty(exports, "Esmodule", { value: true });
exports.LemmyError = exports.LemmyHttp = void 0;
import runtime1  from "@tsoa/runtime";
import otherTypes1 from "./other_types";
var HttpType;
(function (HttpType) {
    HttpType["Get"] = "GET";
    HttpType["Post"] = "POST";
    HttpType["Put"] = "PUT";
    HttpType["Delete"] = "DELETE";
})(HttpType || (HttpType = {}));
/**
 * Helps build lemmy HTTP requests.
 */
let LemmyHttp = class LemmyHttp extends runtime1.Controller {
    /**
     * Generates a new instance of LemmyHttp.
     * @param baseUrl the base url, without the vX version: https://lemmy.ml -> goes to https://lemmy.ml/api/vX
     * @param headers optional headers. Should contain `x-real-ip` and `x-forwarded-for` .
     */
    constructor(baseUrl, options) {
        super();
        LemmyhttpInstances.add(this);
        LemmyhttpApiurl.set(this, void 0);
        LemmyhttpHeaders.set(this, {});
        LemmyhttpFetchfunction.set(this, fetch.bind(globalThis));
        Classprivatefieldset(this, LemmyhttpApiurl, `${baseUrl.replace(/\/+$/, "")}/api/${otherTypes1.VERSION}`, "f");
        if (options?.headers) {
            Classprivatefieldset(this, LemmyhttpHeaders, options.headers, "f");
        }
        if (options?.fetchFunction) {
            Classprivatefieldset(this, LemmyhttpFetchfunction, options.fetchFunction, "f");
        }
    }
    /**
     * @summary Gets the site, and your user data.
     */
    async getSite(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/site", {}, options);
    }
    /**
     * @summary Create your site.
     */
    async createSite(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/site", form, options);
    }
    /**
     * @summary Edit your site.
     */
    async editSite(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/site", form, options);
    }
    /**
     * @summary Leave the Site admins.
     */
    async leaveAdmin(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/admin/leave", {}, options);
    }
    /**
     * @summary Generate a TOTP / two-factor secret.
     *
     * Generate a TOTP / two-factor secret.
     * Afterwards you need to call `/account/auth/totp/update` with a valid token to enable it.
     */
    async generateTotpSecret(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/auth/totp/generate", {}, options);
    }
    /**
     * @summary Get data of current user.
     */
    async getMyUser(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/account", {}, options);
    }
    /**
     * @summary Export a backup of your user settings.
     *
     * Export a backup of your user settings, including your saved content,
     * followed communities, and blocks.
     */
    async exportSettings(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/account/settings/export", {}, options);
    }
    /**
     * @summary Import a backup of your user settings.
     */
    async importSettings(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/settings/import", form, options);
    }
    /**
     * @summary List login tokens for your user
     */
    async listLogins(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/account/listLogins", {}, options);
    }
    /**
     * @summary Returns an error message if your auth token is invalid
     */
    async validateAuth(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/account/validateAuth", {}, options);
    }
    /**
     * @summary List all the media for your account.
     */
    async listMedia(form = {}, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/account/media/list", form, options);
    }
    /**
     * @summary Delete media for your account.
     */
    async deleteMedia(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Delete, "/account/media", form, options);
    }
    /**
     * @summary Delete any media. (Admin only)
     */
    async deleteMediaAdmin(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Delete, "/image", form, options);
    }
    /**
     * @summary List all the media known to your instance.
     */
    async listMediaAdmin(form = {}, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/image/list", form, options);
    }
    /**
     * @summary Enable / Disable TOTP / two-factor authentication.
     *
     * To enable, you need to first call `/account/auth/totp/generate` and then pass a valid token to this.
     *
     * Disabling is only possible if 2FA was previously enabled. Again it is necessary to pass a valid token.
     */
    async updateTotp(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/auth/totp/update", form, options);
    }
    /**
     * @summary Get the modlog.
     */
    async getModlog(form = {}, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/modlog", form, options);
    }
    /**
     * @summary Search lemmy. If `searchTerm` is a url it also attempts to fetch it, just like `resolveObject`.
     */
    async search(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/search", form, options);
    }
    /**
     * @summary Fetch a non-local / federated object.
     */
    async resolveObject(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/resolveObject", form, options);
    }
    /**
     * @summary Create a new community.
     */
    async createCommunity(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/community", form, options);
    }
    /**
     * @summary Get / fetch a community.
     */
    async getCommunity(form = {}, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/community", form, options);
    }
    /**
     * @summary Edit a community.
     */
    async editCommunity(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/community", form, options);
    }
    /**
     * @summary List communities, with various filters.
     */
    async listCommunities(form = {}, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/community/list", form, options);
    }
    /**
     * @summary Follow / subscribe to a community.
     */
    async followCommunity(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/community/follow", form, options);
    }
    /**
     * @summary Get a community's pending follows count.
     */
    async getCommunityPendingFollowsCount(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/community/pendingFollows/count", form, options);
    }
    /**
     * @summary Get a community's pending followers.
     */
    async listCommunityPendingFollows(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/community/pendingFollows/list", form, options);
    }
    /**
     * @summary Approve a community pending follow request.
     */
    async approveCommunityPendingFollow(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/community/pendingFollows/approve", form, options);
    }
    /**
     * @summary Block a community.
     */
    async blockCommunity(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/block/community", form, options);
    }
    /**
     * @summary Delete a community.
     */
    async deleteCommunity(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/community/delete", form, options);
    }
    /**
     * @summary Hide a community from public / "All" view. Admins only.
     */
    async hideCommunity(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/community/hide", form, options);
    }
    /**
     * @summary A moderator remove for a community.
     */
    async removeCommunity(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/community/remove", form, options);
    }
    /**
     * @summary Transfer your community to an existing moderator.
     */
    async transferCommunity(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/community/transfer", form, options);
    }
    /**
     * @summary Ban a user from a community.
     */
    async banFromCommunity(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/community/banUser", form, options);
    }
    /**
     * @summary Add a moderator to your community.
     */
    async addModToCommunity(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/community/mod", form, options);
    }
    /**
     * @summary Get a random community.
     */
    async getRandomCommunity(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/community/random", form, options);
    }
    /**
     * @summary Create a report for a community.
     */
    async createCommunityReport(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/community/report", form, options);
    }
    /**
     * @summary Resolve a report for a private message.
     */
    async resolveCommunityReport(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/community/report/resolve", form, options);
    }
    /**
     * @summary Create a post.
     */
    async createPost(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/post", form, options);
    }
    /**
     * @summary Get / fetch a post.
     */
    async getPost(form = {}, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/post", form, options);
    }
    /**
     * @summary Edit a post.
     */
    async editPost(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/post", form, options);
    }
    /**
     * @summary Delete a post.
     */
    async deletePost(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/post/delete", form, options);
    }
    /**
     * @summary A moderator remove for a post.
     */
    async removePost(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/post/remove", form, options);
    }
    /**
     * @summary Mark a post as read.
     */
    async markPostAsRead(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/post/markAsRead", form, options);
    }
    /**
     * @summary Mark multiple posts as read.
     */
    async markManyPostAsRead(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/post/markAsRead/many", form, options);
    }
    /**
     * @summary Hide a post from list views.
     */
    async hidePost(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/post/hide", form, options);
    }
    /**
     * @summary A moderator can lock a post ( IE disable new comments ).
     */
    async lockPost(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/post/lock", form, options);
    }
    /**
     * @summary A moderator can feature a community post ( IE stick it to the top of a community ).
     */
    async featurePost(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/post/feature", form, options);
    }
    /**
     * @summary Get / fetch posts, with various filters.
     */
    async getPosts(form = {}, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/post/list", form, options);
    }
    /**
     * @summary Like / vote on a post.
     */
    async likePost(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/post/like", form, options);
    }
    /**
     * @summary List a post's likes. Admin-only.
     */
    async listPostLikes(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/post/like/list", form, options);
    }
    /**
     * @summary Save a post.
     */
    async savePost(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/post/save", form, options);
    }
    /**
     * @summary Report a post.
     */
    async createPostReport(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/post/report", form, options);
    }
    /**
     * @summary Resolve a post report. Only a mod can do this.
     */
    async resolvePostReport(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/post/report/resolve", form, options);
    }
    /**
     * @summary Fetch metadata for any given site.
     */
    async getSiteMetadata(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/post/siteMetadata", form, options);
    }
    /**
     * @summary Create a comment.
     */
    async createComment(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/comment", form, options);
    }
    /**
     * @summary Edit a comment.
     */
    async editComment(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/comment", form, options);
    }
    /**
     * @summary Delete a comment.
     */
    async deleteComment(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/comment/delete", form, options);
    }
    /**
     * @summary A moderator remove for a comment.
     */
    async removeComment(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/comment/remove", form, options);
    }
    /**
     * @summary Mark a comment as read.
     */
    async markCommentReplyAsRead(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/comment/markAsRead", form, options);
    }
    /**
     * @summary Like / vote on a comment.
     */
    async likeComment(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/comment/like", form, options);
    }
    /**
     * @summary List a comment's likes. Admin-only.
     */
    async listCommentLikes(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/comment/like/list", form, options);
    }
    /**
     * @summary Save a comment.
     */
    async saveComment(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/comment/save", form, options);
    }
    /**
     * @summary Distinguishes a comment (speak as moderator)
     */
    async distinguishComment(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/comment/distinguish", form, options);
    }
    /**
     * @summary Get / fetch comments.
     */
    async getComments(form = {}, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/comment/list", form, options);
    }
    /**
     * @summary Get / fetch comments, but without the post or community.
     */
    async getCommentsSlim(form = {}, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/comment/list/slim", form, options);
    }
    /**
     * @summary Get / fetch comment.
     */
    async getComment(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/comment", form, options);
    }
    /**
     * @summary Report a comment.
     */
    async createCommentReport(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/comment/report", form, options);
    }
    /**
     * @summary Resolve a comment report. Only a mod can do this.
     */
    async resolveCommentReport(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/comment/report/resolve", form, options);
    }
    /**
     * @summary Create a private message.
     */
    async createPrivateMessage(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/privateMessage", form, options);
    }
    /**
     * @summary Edit a private message.
     */
    async editPrivateMessage(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/privateMessage", form, options);
    }
    /**
     * @summary Delete a private message.
     */
    async deletePrivateMessage(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/privateMessage/delete", form, options);
    }
    /**
     * @summary Mark a private message as read.
     */
    async markPrivateMessageAsRead(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/privateMessage/markAsRead", form, options);
    }
    /**
     * @summary Create a report for a private message.
     */
    async createPrivateMessageReport(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/privateMessage/report", form, options);
    }
    /**
     * @summary Resolve a report for a private message.
     */
    async resolvePrivateMessageReport(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/privateMessage/report/resolve", form, options);
    }
    /**
     * @summary Register a new user.
     */
    async register(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/auth/register", form, options);
    }
    /**
     * @summary Log into lemmy.
     */
    async login(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/auth/login", form, options);
    }
    /**
     * @summary Invalidate the currently used auth token.
     */
    async logout(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/auth/logout", {}, options);
    }
    /**
     * @summary Get the details for a person.
     */
    async getPersonDetails(form = {}, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/person", form, options);
    }
    /**
     * @summary List the content for a person.
     */
    async listPersonContent(form = {}, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/person/content", form, options);
    }
    /**
     * @summary Mark a person mention as read.
     */
    async markCommentMentionAsRead(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/mention/comment/markAsRead", form, options);
    }
    /**
     * @summary Mark a person post body mention as read.
     */
    async markPostMentionAsRead(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/mention/post/markAsRead", form, options);
    }
    /**
     * @summary Ban a person from your site.
     */
    async banPerson(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/admin/ban", form, options);
    }
    /**
     * @summary Get a list of users.
     */
    async listUsers(form = {}, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/admin/users", form, options);
    }
    /**
     * @summary Block a person.
     */
    async blockPerson(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/block/person", form, options);
    }
    /**
     * @summary Fetch a Captcha.
     */
    async getCaptcha(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/account/auth/getCaptcha", {}, options);
    }
    /**
     * @summary Delete your account.
     */
    async deleteAccount(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/delete", form, options);
    }
    /**
     * @summary Reset your password.
     */
    async passwordReset(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/auth/passwordReset", form, options);
    }
    /**
     * @summary Change your password from an email / token based reset.
     */
    async passwordChangeAfterReset(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/auth/passwordChange", form, options);
    }
    /**
     * @summary Mark all replies as read.
     */
    async markAllNotificationsAsRead(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/markAsRead/all", {}, options);
    }
    /**
     * @summary Save your user settings.
     */
    async saveUserSettings(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/account/settings/save", form, options);
    }
    /**
     * @summary Change your user password.
     */
    async changePassword(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/account/auth/changePassword", form, options);
    }
    /**
     * @summary Get counts for your reports.
     */
    async getReportCount(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/account/reportCount", form, options);
    }
    /**
     * @summary Get your unread counts.
     */
    async getUnreadCount(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/account/unreadCount", {}, options);
    }
    /**
     * @summary Get your inbox (replies, comment mentions, post mentions, and messages)
     */
    async listInbox(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/account/inbox", form, options);
    }
    /**
     * @summary Verify your email
     */
    async verifyEmail(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/auth/verifyEmail", form, options);
    }
    /**
     * @summary Resend a verification email.
     */
    async resendVerificationEmail(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/auth/resendVerificationEmail", form, options);
    }
    /**
     * @summary List your saved content.
     */
    async listPersonSaved(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/account/saved", form, options);
    }
    /**
     * @summary List your read content.
     */
    async listPersonRead(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/account/read", form, options);
    }
    /**
     * @summary List your hidden content.
     */
    async listPersonHidden(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/account/hidden", form, options);
    }
    /**
     * @summary List your liked content.
     */
    async listPersonLiked(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/account/liked", form, options);
    }
    /**
     * @summary Add an admin to your site.
     */
    async addAdmin(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/admin/add", form, options);
    }
    /**
     * @summary Get the unread registration applications count.
     */
    async getUnreadRegistrationApplicationCount(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/admin/registrationApplication/count", {}, options);
    }
    /**
     * @summary List the registration applications.
     */
    async listRegistrationApplications(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/admin/registrationApplication/list", form, options);
    }
    /**
     * @summary Approve a registration application
     */
    async approveRegistrationApplication(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/admin/registrationApplication/approve", form, options);
    }
    /**
     * @summary Get the application a user submitted when they first registered their account
     */
    async getRegistrationApplication(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/admin/registrationApplication", form, options);
    }
    /**
     * @summary Purge / Delete a person from the database.
     */
    async purgePerson(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/admin/purge/person", form, options);
    }
    /**
     * @summary Purge / Delete a community from the database.
     */
    async purgeCommunity(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/admin/purge/community", form, options);
    }
    /**
     * @summary Purge / Delete a post from the database.
     */
    async purgePost(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/admin/purge/post", form, options);
    }
    /**
     * @summary Purge / Delete a comment from the database.
     */
    async purgeComment(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/admin/purge/comment", form, options);
    }
    /**
     * @summary Create a new custom emoji.
     */
    async createCustomEmoji(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/customEmoji", form, options);
    }
    /**
     * @summary Edit an existing custom emoji.
     */
    async editCustomEmoji(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/customEmoji", form, options);
    }
    /**
     * @summary Delete a custom emoji.
     */
    async deleteCustomEmoji(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/customEmoji/delete", form, options);
    }
    /**
     * @summary List custom emojis
     */
    async listCustomEmojis(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/customEmoji/list", form, options);
    }
    /**
     * @summary Create a new tagline
     */
    async createTagline(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/admin/tagline", form, options);
    }
    /**
     * @summary Edit an existing tagline
     */
    async editTagline(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/admin/tagline", form, options);
    }
    /**
     * @summary Delete a tagline
     */
    async deleteTagline(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/admin/tagline/delete", form, options);
    }
    /**
     * @summary List taglines.
     */
    async listTaglines(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/admin/tagline/list", form, options);
    }
    /**
     * @summary Create a community post tag.
     */
    createCommunityTag(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/community/tag", form, options);
    }
    /**
     * @summary Update a community post tag.
     */
    updateCommunityTag(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/community/tag", form, options);
    }
    /**
     * @summary Delete a post tag in a community.
     */
    deleteCommunityTag(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Delete, "/community/tag", form, options);
    }
    /**
     * @summary Create a new oauth provider method
     */
    async createOAuthProvider(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/oauthProvider", form, options);
    }
    /**
     * @summary Edit an existing oauth provider method
     */
    async editOAuthProvider(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/oauthProvider", form, options);
    }
    /**
     * @summary Delete an oauth provider method
     */
    async deleteOAuthProvider(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/oauthProvider/delete", form, options);
    }
    /**
     * @summary Authenticate with OAuth
     */
    async authenticateWithOAuth(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/oauth/authenticate", form, options);
    }
    /**
     * @summary Fetch federated instances.
     */
    async getFederatedInstances(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/federatedInstances", {}, options);
    }
    /**
     * @summary List user reports.
     */
    async listReports(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/report/list", form, options);
    }
    /**
     * @summary Block an instance as user.
     */
    async userBlockInstance(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/account/block/instance", form, options);
    }
    /**
     * @summary Globally block an instance as admin.
     */
    async adminBlockInstance(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/admin/instance/block", form, options);
    }
    /**
     * @summary Globally allow an instance as admin.
     */
    async adminAllowInstance(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/admin/instance/allow", form, options);
    }
    /**
     * @summary Upload new user avatar.
     */
    async uploadUserAvatar(image, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpUpload).call(this, "/account/avatar", image, options);
    }
    /**
     * @summary Delete the user avatar.
     */
    async deleteUserAvatar(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Delete, "/account/avatar", {}, options);
    }
    /**
     * @summary Upload new user banner.
     */
    async uploadUserBanner(image, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpUpload).call(this, "/account/banner", image, options);
    }
    /**
     * @summary Delete the user banner.
     */
    async deleteUserBanner(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Delete, "/account/banner", {}, options);
    }
    /**
     * @summary Upload new community icon.
     */
    async uploadCommunityIcon(query, image, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpUploadwithquery).call(this, "/community/icon", query, image, options);
    }
    /**
     * @summary Delete the community icon.
     */
    async deleteCommunityIcon(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Delete, "/community/icon", form, options);
    }
    /**
     * @summary Upload new community banner.
     */
    async uploadCommunityBanner(query, image, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpUploadwithquery).call(this, "/community/banner", query, image, options);
    }
    /**
     * @summary Delete the community banner.
     */
    async deleteCommunityBanner(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Delete, "/community/banner", form, options);
    }
    /**
     * @summary Upload new site icon.
     */
    async uploadSiteIcon(image, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpUpload).call(this, "/site/icon", image, options);
    }
    /**
     * @summary Delete the site icon.
     */
    async deleteSiteIcon(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Delete, "/site/icon", {}, options);
    }
    /**
     * @summary Upload new site banner.
     */
    async uploadSiteBanner(image, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpUpload).call(this, "/site/banner", image, options);
    }
    /**
     * @summary Delete the site banner.
     */
    async deleteSiteBanner(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Delete, "/site/banner", {}, options);
    }
    /**
     * @summary Upload an image to the server.
     */
    async uploadImage(image, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpUpload).call(this, "/image", image, options);
    }
    /**
     * @summary Health check for image functionality
     */
    async imageHealth(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/image/health", {}, options);
    }
    /**
     * Mark donation dialog as shown, so it isn't displayed anymore.
     */
    donationDialogShown(options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/user/donationDialogShown", {}, options);
    }
    createMultiCommunity(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/multiCommunity", form, options);
    }
    updateMultiCommunity(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Put, "/multiCommunity", form, options);
    }
    getMultiCommunity(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/multiCommunity", form, options);
    }
    createMultiCommunityEntry(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/multiCommunity/entry", form, options);
    }
    deleteMultiCommunityEntry(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Delete, "/multiCommunity/entry", form, options);
    }
    listMultiCommunities(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Get, "/multiCommunity/list", form, options);
    }
    followMultiCommunity(form, options) {
        return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpWrapper).call(this, HttpType.Post, "/multiCommunity/follow", form, options);
    }
    /**
     * Set the headers (can be used to set the auth header)
     */
    setHeaders(headers) {
        Classprivatefieldset(this, LemmyhttpHeaders, headers, "f");
    }
};
exports.LemmyHttp = LemmyHttp;
LemmyhttpApiurl = new WeakMap();
LemmyhttpHeaders = new WeakMap();
LemmyhttpFetchfunction = new WeakMap();
LemmyhttpInstances = new WeakSet();
LemmyhttpBuildfullurl = function LemmyhttpBuildfullurl(endpoint) {
    return `${Classprivatefieldget(this, LemmyhttpApiurl, "f")}${endpoint}`;
};
LemmyhttpUpload = async function LemmyhttpUpload(path, { image }, options) {
    const formData = createFormData(image);
    const response = await Classprivatefieldget(this, LemmyhttpFetchfunction, "f").call(this, Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpBuildfullurl).call(this, path), {
        ...options,
        method: HttpType.Post,
        body: formData,
        headers: Classprivatefieldget(this, LemmyhttpHeaders, "f"),
    });
    return response.json();
};
LemmyhttpUploadwithquery = async function LemmyhttpUploadwithquery(path, query, { image }, options) {
    return Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpUpload).call(this, `${path}?${encodeGetParams(query)}`, { image }, options);
};
LemmyhttpWrapper = async function LemmyhttpWrapper(type, endpoint, form, options) {
    let response;
    if (type === HttpType.Get) {
        const getUrl = `${Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpBuildfullurl).call(this, endpoint)}?${encodeGetParams(form)}`;
        response = await Classprivatefieldget(this, LemmyhttpFetchfunction, "f").call(this, getUrl, {
            ...options,
            method: HttpType.Get,
            headers: Classprivatefieldget(this, LemmyhttpHeaders, "f"),
        });
    }
    else {
        response = await Classprivatefieldget(this, LemmyhttpFetchfunction, "f").call(this, Classprivatefieldget(this, LemmyhttpInstances, "m", LemmyhttpBuildfullurl).call(this, endpoint), {
            ...options,
            method: type,
            headers: {
                "Content-Type": "application/json",
                ...Classprivatefieldget(this, LemmyhttpHeaders, "f"),
            },
            body: JSON.stringify(form),
        });
    }
    let json = undefined;
    try {
        json = await response.json();
    }
    catch {
        throw new LemmyError(response.statusText);
    }
    if (!response.ok) {
        let err = new LemmyError(json.error ?? response.statusText, json.message);
        throw err;
    }
    else {
        return json;
    }
};
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Security)({}),
    (0, runtime1.Get)("/site"),
    (0, runtime1.Tags)("Site"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getSite", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/site"),
    (0, runtime1.Tags)("Site"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "createSite", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/site"),
    (0, runtime1.Tags)("Site"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "editSite", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/admin/leave"),
    (0, runtime1.Tags)("Admin"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "leaveAdmin", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/account/auth/totp/generate"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "generateTotpSecret", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/account"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getMyUser", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/account/settings/export"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "exportSettings", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/account/settings/import"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "importSettings", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/account/listLogins"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listLogins", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/account/validateAuth"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "validateAuth", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/account/media/list"),
    (0, runtime1.Tags)("Account", "Media"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listMedia", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Delete)("/account/media"),
    (0, runtime1.Tags)("Account", "Media"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deleteMedia", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Delete)("/image"),
    (0, runtime1.Tags)("Admin", "Media"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deleteMediaAdmin", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/image/list"),
    (0, runtime1.Tags)("Admin", "Media"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listMediaAdmin", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/account/auth/totp/update"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "updateTotp", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Security)({}),
    (0, runtime1.Get)("/modlog"),
    (0, runtime1.Tags)("Miscellaneous"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getModlog", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Security)({}),
    (0, runtime1.Get)("/search"),
    (0, runtime1.Tags)("Miscellaneous"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "search", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Security)({}),
    (0, runtime1.Get)("/resolveObject"),
    (0, runtime1.Tags)("Miscellaneous"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "resolveObject", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/community"),
    (0, runtime1.Tags)("Community"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "createCommunity", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Security)({}),
    (0, runtime1.Get)("/community"),
    (0, runtime1.Tags)("Community"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getCommunity", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/community"),
    (0, runtime1.Tags)("Community"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "editCommunity", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Security)({}),
    (0, runtime1.Get)("/community/list"),
    (0, runtime1.Tags)("Community"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listCommunities", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/community/follow"),
    (0, runtime1.Tags)("Community"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "followCommunity", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/community/pendingFollows/count"),
    (0, runtime1.Tags)("Community"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getCommunityPendingFollowsCount", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/community/pendingFollows/list"),
    (0, runtime1.Tags)("Community"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listCommunityPendingFollows", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/community/pendingFollows/approve"),
    (0, runtime1.Tags)("Community"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "approveCommunityPendingFollow", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/account/block/community"),
    (0, runtime1.Tags)("Account", "Community"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "blockCommunity", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/community/delete"),
    (0, runtime1.Tags)("Community"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deleteCommunity", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/community/hide"),
    (0, runtime1.Tags)("Community", "Admin"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "hideCommunity", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/community/remove"),
    (0, runtime1.Tags)("Community", "Moderator"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "removeCommunity", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/community/transfer"),
    (0, runtime1.Tags)("Community", "Moderator"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "transferCommunity", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/community/banUser"),
    (0, runtime1.Tags)("Community", "Moderator"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "banFromCommunity", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/community/mod"),
    (0, runtime1.Tags)("Community", "Moderator"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "addModToCommunity", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Security)({}),
    (0, runtime1.Get)("/community/random"),
    (0, runtime1.Tags)("Community"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getRandomCommunity", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/community/report"),
    (0, runtime1.Tags)("Community"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "createCommunityReport", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/community/report/resolve"),
    (0, runtime1.Tags)("Community", "Admin"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "resolveCommunityReport", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/post"),
    (0, runtime1.Tags)("Post"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "createPost", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Security)({}),
    (0, runtime1.Get)("/post"),
    (0, runtime1.Tags)("Post"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getPost", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/post"),
    (0, runtime1.Tags)("Post"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "editPost", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/post/delete"),
    (0, runtime1.Tags)("Post"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deletePost", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/post/remove"),
    (0, runtime1.Tags)("Post", "Moderator"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "removePost", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/post/markAsRead"),
    (0, runtime1.Tags)("Post"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "markPostAsRead", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/post/markAsRead/many"),
    (0, runtime1.Tags)("Post"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "markManyPostAsRead", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/post/hide"),
    (0, runtime1.Tags)("Post"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "hidePost", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/post/lock"),
    (0, runtime1.Tags)("Post"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "lockPost", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/post/feature"),
    (0, runtime1.Tags)("Post", "Moderator"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "featurePost", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Security)({}),
    (0, runtime1.Get)("/post/list"),
    (0, runtime1.Tags)("Post"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getPosts", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/post/like"),
    (0, runtime1.Tags)("Post"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "likePost", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/post/like/list"),
    (0, runtime1.Tags)("Post", "Admin"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listPostLikes", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/post/save"),
    (0, runtime1.Tags)("Post"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "savePost", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/post/report"),
    (0, runtime1.Tags)("Post"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "createPostReport", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/post/report/resolve"),
    (0, runtime1.Tags)("Post", "Moderator"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "resolvePostReport", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/post/siteMetadata"),
    (0, runtime1.Tags)("Miscellaneous", "Post"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getSiteMetadata", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/comment"),
    (0, runtime1.Tags)("Comment"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "createComment", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/comment"),
    (0, runtime1.Tags)("Comment"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "editComment", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/comment/delete"),
    (0, runtime1.Tags)("Comment"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deleteComment", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/comment/remove"),
    (0, runtime1.Tags)("Comment", "Moderator"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "removeComment", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/comment/markAsRead"),
    (0, runtime1.Tags)("Comment"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "markCommentReplyAsRead", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/comment/like"),
    (0, runtime1.Tags)("Comment"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "likeComment", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/comment/like/list"),
    (0, runtime1.Tags)("Comment", "Admin"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listCommentLikes", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/comment/save"),
    (0, runtime1.Tags)("Comment"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "saveComment", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/comment/distinguish"),
    (0, runtime1.Tags)("Comment", "Moderator"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "distinguishComment", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Security)({}),
    (0, runtime1.Get)("/comment/list"),
    (0, runtime1.Tags)("Comment"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getComments", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Security)({}),
    (0, runtime1.Get)("/comment/list/slim"),
    (0, runtime1.Tags)("Comment"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getCommentsSlim", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Security)({}),
    (0, runtime1.Get)("/comment"),
    (0, runtime1.Tags)("Comment"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getComment", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/comment/report"),
    (0, runtime1.Tags)("Comment"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "createCommentReport", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/comment/report/resolve"),
    (0, runtime1.Tags)("Comment", "Moderator"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "resolveCommentReport", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/privateMessage"),
    (0, runtime1.Tags)("PrivateMessage"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "createPrivateMessage", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/privateMessage"),
    (0, runtime1.Tags)("PrivateMessage"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "editPrivateMessage", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/privateMessage/delete"),
    (0, runtime1.Tags)("PrivateMessage"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deletePrivateMessage", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/privateMessage/markAsRead"),
    (0, runtime1.Tags)("PrivateMessage"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "markPrivateMessageAsRead", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/privateMessage/report"),
    (0, runtime1.Tags)("PrivateMessage"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "createPrivateMessageReport", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/privateMessage/report/resolve"),
    (0, runtime1.Tags)("PrivateMessage", "Admin"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "resolvePrivateMessageReport", null);
Decorate([
    (0, runtime1.Post)("/account/auth/register"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "register", null);
Decorate([
    (0, runtime1.Post)("/account/auth/login"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "login", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/account/auth/logout"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "logout", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Security)({}),
    (0, runtime1.Get)("/person"),
    (0, runtime1.Tags)("Person"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getPersonDetails", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Security)({}),
    (0, runtime1.Get)("/person/content"),
    (0, runtime1.Tags)("Person"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listPersonContent", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/account/mention/comment/markAsRead"),
    (0, runtime1.Tags)("Account", "Person"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "markCommentMentionAsRead", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/account/mention/post/markAsRead"),
    (0, runtime1.Tags)("Account", "Post"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "markPostMentionAsRead", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/admin/ban"),
    (0, runtime1.Tags)("Admin"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "banPerson", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/admin/users"),
    (0, runtime1.Tags)("Admin", "Miscellaneous"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listUsers", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/account/block/person"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "blockPerson", null);
Decorate([
    (0, runtime1.Get)("/account/auth/getCaptcha"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getCaptcha", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/account/delete"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deleteAccount", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/account/auth/passwordReset"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "passwordReset", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/account/auth/passwordChange"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "passwordChangeAfterReset", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/account/markAsRead/all"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "markAllNotificationsAsRead", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/account/settings/save"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "saveUserSettings", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/account/auth/changePassword"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "changePassword", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/account/reportCount"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getReportCount", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/account/unreadCount"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getUnreadCount", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/account/inbox"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listInbox", null);
Decorate([
    (0, runtime1.Post)("/account/auth/verifyEmail"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "verifyEmail", null);
Decorate([
    (0, runtime1.Post)("/account/auth/resendVerificationEmail"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "resendVerificationEmail", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/account/saved"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listPersonSaved", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/account/read"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listPersonRead", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/account/hidden"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listPersonHidden", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/account/liked"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listPersonLiked", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/admin/add"),
    (0, runtime1.Tags)("Admin"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "addAdmin", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/admin/registrationApplication/count"),
    (0, runtime1.Tags)("Admin"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getUnreadRegistrationApplicationCount", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/admin/registrationApplication/list"),
    (0, runtime1.Tags)("Admin"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listRegistrationApplications", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/admin/registrationApplication/approve"),
    (0, runtime1.Tags)("Admin"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "approveRegistrationApplication", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/admin/registrationApplication"),
    (0, runtime1.Tags)("Admin"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getRegistrationApplication", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/admin/purge/person"),
    (0, runtime1.Tags)("Admin"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "purgePerson", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/admin/purge/community"),
    (0, runtime1.Tags)("Admin"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "purgeCommunity", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/admin/purge/post"),
    (0, runtime1.Tags)("Admin"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "purgePost", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/admin/purge/comment"),
    (0, runtime1.Tags)("Admin"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "purgeComment", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/customEmoji"),
    (0, runtime1.Tags)("CustomEmoji"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "createCustomEmoji", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/customEmoji"),
    (0, runtime1.Tags)("CustomEmoji"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "editCustomEmoji", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/customEmoji/delete"),
    (0, runtime1.Tags)("CustomEmoji"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deleteCustomEmoji", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Security)({}),
    (0, runtime1.Get)("/customEmoji/list"),
    (0, runtime1.Tags)("CustomEmoji"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listCustomEmojis", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/admin/tagline"),
    (0, runtime1.Tags)("Admin", "Tagline"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "createTagline", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/admin/tagline"),
    (0, runtime1.Tags)("Admin", "Tagline"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "editTagline", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/admin/tagline/delete"),
    (0, runtime1.Tags)("Admin", "Tagline"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deleteTagline", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Security)({}),
    (0, runtime1.Get)("/admin/tagline/list"),
    (0, runtime1.Tags)("Admin", "Tagline"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listTaglines", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/community/tag"),
    (0, runtime1.Tags)("Community"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "createCommunityTag", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/community/tag"),
    (0, runtime1.Tags)("Community"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "updateCommunityTag", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Delete)("/community/tag"),
    (0, runtime1.Tags)("Community"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deleteCommunityTag", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/oauthProvider"),
    (0, runtime1.Tags)("Miscellaneous", "OAuth"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "createOAuthProvider", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/oauthProvider"),
    (0, runtime1.Tags)("Miscellaneous", "OAuth"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "editOAuthProvider", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/oauthProvider/delete"),
    (0, runtime1.Tags)("Miscellaneous", "OAuth"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deleteOAuthProvider", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/oauth/authenticate"),
    (0, runtime1.Tags)("Miscellaneous", "OAuth"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "authenticateWithOAuth", null);
Decorate([
    (0, runtime1.Get)("/federatedInstances"),
    (0, runtime1.Tags)("Miscellaneous"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getFederatedInstances", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Get)("/report/list"),
    (0, runtime1.Tags)("Admin"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listReports", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/account/block/instance"),
    (0, runtime1.Tags)("Account"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "userBlockInstance", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/admin/instance/block"),
    (0, runtime1.Tags)("Admin"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "adminBlockInstance", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/admin/instance/allow"),
    (0, runtime1.Tags)("Admin"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "adminAllowInstance", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/account/avatar"),
    (0, runtime1.Tags)("Account", "Media"),
    Param(0, (0, runtime1.UploadedFile)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "uploadUserAvatar", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Delete)("/account/avatar"),
    (0, runtime1.Tags)("Account", "Media"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deleteUserAvatar", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/account/banner"),
    (0, runtime1.Tags)("Account", "Media"),
    Param(0, (0, runtime1.UploadedFile)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "uploadUserBanner", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Delete)("/account/banner"),
    (0, runtime1.Tags)("Account", "Media"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deleteUserBanner", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/community/icon"),
    (0, runtime1.Tags)("Community", "Media"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.UploadedFile)()),
    Param(2, (0, runtime1.Inject)())
], LemmyHttp.prototype, "uploadCommunityIcon", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Delete)("/community/icon"),
    (0, runtime1.Tags)("Community", "Media"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deleteCommunityIcon", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/community/banner"),
    (0, runtime1.Tags)("Community", "Media"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.UploadedFile)()),
    Param(2, (0, runtime1.Inject)())
], LemmyHttp.prototype, "uploadCommunityBanner", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Delete)("/community/banner"),
    (0, runtime1.Tags)("Community", "Media"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deleteCommunityBanner", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/site/icon"),
    (0, runtime1.Tags)("Site", "Media"),
    Param(0, (0, runtime1.UploadedFile)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "uploadSiteIcon", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Delete)("/site/icon"),
    (0, runtime1.Tags)("Site", "Media"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deleteSiteIcon", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/site/banner"),
    (0, runtime1.Tags)("Site", "Media"),
    Param(0, (0, runtime1.UploadedFile)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "uploadSiteBanner", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Delete)("/site/banner"),
    (0, runtime1.Tags)("Site", "Media"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deleteSiteBanner", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/image"),
    (0, runtime1.Tags)("Media"),
    Param(0, (0, runtime1.UploadedFile)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "uploadImage", null);
Decorate([
    (0, runtime1.Get)("/image/health"),
    (0, runtime1.Tags)("Media"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "imageHealth", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/user/donationDialogShown"),
    Param(0, (0, runtime1.Inject)())
], LemmyHttp.prototype, "donationDialogShown", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/multiCommunity"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "createMultiCommunity", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Put)("/multiCommunity"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "updateMultiCommunity", null);
Decorate([
    (0, runtime1.Get)("/multiCommunity"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "getMultiCommunity", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Post)("/multiCommunity/entry"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "createMultiCommunityEntry", null);
Decorate([
    (0, runtime1.Security)("bearerAuth"),
    (0, runtime1.Delete)("/multiCommunity/entry"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "deleteMultiCommunityEntry", null);
Decorate([
    (0, runtime1.Get)("/multiCommunity/list"),
    Param(0, (0, runtime1.Queries)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "listMultiCommunities", null);
Decorate([
    (0, runtime1.Post)("/multiCommunity/follow"),
    Param(0, (0, runtime1.Body)()),
    Param(1, (0, runtime1.Inject)())
], LemmyHttp.prototype, "followMultiCommunity", null);
exports.LemmyHttp = LemmyHttp = Decorate([
    (0, runtime1.Route)("api/v4")
], LemmyHttp);
function encodeGetParams(p) {
    return Object.entries(p)
        .filter(kv => kv[1] !== undefined && kv[1] !== null)
        .map(kv => kv.map(encodeURIComponent).join("="))
        .join("&");
}
function createFormData(image) {
    let formData = new FormData();
    if (image instanceof File) {
        formData.append("images[]", image);
    }
    else {
        // The filename doesn't affect the file type or file name that ends up in pictrs
        formData.append("images[]", new Blob([image], { type: "image/jpeg" }), "image.jpg");
    }
    return formData;
}
/**
 * A Lemmy error type.
 *
 * The name is the i18n translatable error code.
 * The msg is either an empty string, or extra non-translatable info.
 */
class LemmyError extends Error {
    constructor(name, msg) {
        super(msg ?? "");
        this.name = name;
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, LemmyError.prototype);
    }
}
exports.LemmyError = LemmyError;
