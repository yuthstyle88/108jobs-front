"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LemmyHttp_instances, _LemmyHttp_apiUrl, _LemmyHttp_headers, _LemmyHttp_fetchFunction, _LemmyHttp_buildFullUrl, _LemmyHttp_upload, _LemmyHttp_uploadWithQuery, _LemmyHttp_wrapper;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LemmyError = exports.LemmyHttp = void 0;
const runtime_1 = require("@tsoa/runtime");
const other_types_1 = require("./other_types");
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
let LemmyHttp = class LemmyHttp extends runtime_1.Controller {
    /**
     * Generates a new instance of LemmyHttp.
     * @param baseUrl the base url, without the vX version: https://lemmy.ml -> goes to https://lemmy.ml/api/vX
     * @param headers optional headers. Should contain `x-real-ip` and `x-forwarded-for` .
     */
    constructor(baseUrl, options) {
        super();
        _LemmyHttp_instances.add(this);
        _LemmyHttp_apiUrl.set(this, void 0);
        _LemmyHttp_headers.set(this, {});
        _LemmyHttp_fetchFunction.set(this, fetch.bind(globalThis));
        __classPrivateFieldSet(this, _LemmyHttp_apiUrl, `${baseUrl.replace(/\/+$/, "")}/api/${other_types_1.VERSION}`, "f");
        if (options?.headers) {
            __classPrivateFieldSet(this, _LemmyHttp_headers, options.headers, "f");
        }
        if (options?.fetchFunction) {
            __classPrivateFieldSet(this, _LemmyHttp_fetchFunction, options.fetchFunction, "f");
        }
    }
    /**
     * @summary Gets the site, and your user data.
     */
    async getSite(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/site", {}, options);
    }
    /**
     * @summary Create your site.
     */
    async createSite(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/site", form, options);
    }
    /**
     * @summary Edit your site.
     */
    async editSite(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/site", form, options);
    }
    /**
     * @summary Leave the Site admins.
     */
    async leaveAdmin(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/admin/leave", {}, options);
    }
    /**
     * @summary Generate a TOTP / two-factor secret.
     *
     * Generate a TOTP / two-factor secret.
     * Afterwards you need to call `/account/auth/totp/update` with a valid token to enable it.
     */
    async generateTotpSecret(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/auth/totp/generate", {}, options);
    }
    /**
     * @summary Get data of current user.
     */
    async getMyUser(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/account", {}, options);
    }
    /**
     * @summary Export a backup of your user settings.
     *
     * Export a backup of your user settings, including your saved content,
     * followed communities, and blocks.
     */
    async exportSettings(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/account/settings/export", {}, options);
    }
    /**
     * @summary Import a backup of your user settings.
     */
    async importSettings(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/settings/import", form, options);
    }
    /**
     * @summary List login tokens for your user
     */
    async listLogins(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/account/list_logins", {}, options);
    }
    /**
     * @summary Returns an error message if your auth token is invalid
     */
    async validateAuth(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/account/validate_auth", {}, options);
    }
    /**
     * @summary List all the media for your account.
     */
    async listMedia(form = {}, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/account/media/list", form, options);
    }
    /**
     * @summary Delete media for your account.
     */
    async deleteMedia(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Delete, "/account/media", form, options);
    }
    /**
     * @summary Delete any media. (Admin only)
     */
    async deleteMediaAdmin(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Delete, "/image", form, options);
    }
    /**
     * @summary List all the media known to your instance.
     */
    async listMediaAdmin(form = {}, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/image/list", form, options);
    }
    /**
     * @summary Enable / Disable TOTP / two-factor authentication.
     *
     * To enable, you need to first call `/account/auth/totp/generate` and then pass a valid token to this.
     *
     * Disabling is only possible if 2FA was previously enabled. Again it is necessary to pass a valid token.
     */
    async updateTotp(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/auth/totp/update", form, options);
    }
    /**
     * @summary Get the modlog.
     */
    async getModlog(form = {}, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/modlog", form, options);
    }
    /**
     * @summary Search lemmy. If `search_term` is a url it also attempts to fetch it, just like `resolve_object`.
     */
    async search(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/search", form, options);
    }
    /**
     * @summary Fetch a non-local / federated object.
     */
    async resolveObject(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/resolve_object", form, options);
    }
    /**
     * @summary Create a new community.
     */
    async createCommunity(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/community", form, options);
    }
    /**
     * @summary Get / fetch a community.
     */
    async getCommunity(form = {}, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/community", form, options);
    }
    /**
     * @summary Edit a community.
     */
    async editCommunity(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/community", form, options);
    }
    /**
     * @summary List communities, with various filters.
     */
    async listCommunities(form = {}, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/community/list", form, options);
    }
    /**
     * @summary Follow / subscribe to a community.
     */
    async followCommunity(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/community/follow", form, options);
    }
    /**
     * @summary Get a community's pending follows count.
     */
    async getCommunityPendingFollowsCount(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/community/pending_follows/count", form, options);
    }
    /**
     * @summary Get a community's pending followers.
     */
    async listCommunityPendingFollows(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/community/pending_follows/list", form, options);
    }
    /**
     * @summary Approve a community pending follow request.
     */
    async approveCommunityPendingFollow(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/community/pending_follows/approve", form, options);
    }
    /**
     * @summary Block a community.
     */
    async blockCommunity(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/block/community", form, options);
    }
    /**
     * @summary Delete a community.
     */
    async deleteCommunity(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/community/delete", form, options);
    }
    /**
     * @summary Hide a community from public / "All" view. Admins only.
     */
    async hideCommunity(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/community/hide", form, options);
    }
    /**
     * @summary A moderator remove for a community.
     */
    async removeCommunity(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/community/remove", form, options);
    }
    /**
     * @summary Transfer your community to an existing moderator.
     */
    async transferCommunity(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/community/transfer", form, options);
    }
    /**
     * @summary Ban a user from a community.
     */
    async banFromCommunity(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/community/ban_user", form, options);
    }
    /**
     * @summary Add a moderator to your community.
     */
    async addModToCommunity(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/community/mod", form, options);
    }
    /**
     * @summary Get a random community.
     */
    async getRandomCommunity(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/community/random", form, options);
    }
    /**
     * @summary Create a report for a community.
     */
    async createCommunityReport(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/community/report", form, options);
    }
    /**
     * @summary Resolve a report for a private message.
     */
    async resolveCommunityReport(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/community/report/resolve", form, options);
    }
    /**
     * @summary Create a post.
     */
    async createPost(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/post", form, options);
    }
    /**
     * @summary Get / fetch a post.
     */
    async getPost(form = {}, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/post", form, options);
    }
    /**
     * @summary Edit a post.
     */
    async editPost(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/post", form, options);
    }
    /**
     * @summary Delete a post.
     */
    async deletePost(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/post/delete", form, options);
    }
    /**
     * @summary A moderator remove for a post.
     */
    async removePost(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/post/remove", form, options);
    }
    /**
     * @summary Mark a post as read.
     */
    async markPostAsRead(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/post/mark_as_read", form, options);
    }
    /**
     * @summary Mark multiple posts as read.
     */
    async markManyPostAsRead(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/post/mark_as_read/many", form, options);
    }
    /**
     * @summary Hide a post from list views.
     */
    async hidePost(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/post/hide", form, options);
    }
    /**
     * @summary A moderator can lock a post ( IE disable new comments ).
     */
    async lockPost(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/post/lock", form, options);
    }
    /**
     * @summary A moderator can feature a community post ( IE stick it to the top of a community ).
     */
    async featurePost(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/post/feature", form, options);
    }
    /**
     * @summary Get / fetch posts, with various filters.
     */
    async getPosts(form = {}, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/post/list", form, options);
    }
    /**
     * @summary Like / vote on a post.
     */
    async likePost(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/post/like", form, options);
    }
    /**
     * @summary List a post's likes. Admin-only.
     */
    async listPostLikes(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/post/like/list", form, options);
    }
    /**
     * @summary Save a post.
     */
    async savePost(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/post/save", form, options);
    }
    /**
     * @summary Report a post.
     */
    async createPostReport(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/post/report", form, options);
    }
    /**
     * @summary Resolve a post report. Only a mod can do this.
     */
    async resolvePostReport(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/post/report/resolve", form, options);
    }
    /**
     * @summary Fetch metadata for any given site.
     */
    async getSiteMetadata(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/post/site_metadata", form, options);
    }
    /**
     * @summary Create a comment.
     */
    async createComment(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/comment", form, options);
    }
    /**
     * @summary Edit a comment.
     */
    async editComment(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/comment", form, options);
    }
    /**
     * @summary Delete a comment.
     */
    async deleteComment(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/comment/delete", form, options);
    }
    /**
     * @summary A moderator remove for a comment.
     */
    async removeComment(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/comment/remove", form, options);
    }
    /**
     * @summary Mark a comment as read.
     */
    async markCommentReplyAsRead(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/comment/mark_as_read", form, options);
    }
    /**
     * @summary Like / vote on a comment.
     */
    async likeComment(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/comment/like", form, options);
    }
    /**
     * @summary List a comment's likes. Admin-only.
     */
    async listCommentLikes(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/comment/like/list", form, options);
    }
    /**
     * @summary Save a comment.
     */
    async saveComment(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/comment/save", form, options);
    }
    /**
     * @summary Distinguishes a comment (speak as moderator)
     */
    async distinguishComment(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/comment/distinguish", form, options);
    }
    /**
     * @summary Get / fetch comments.
     */
    async getComments(form = {}, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/comment/list", form, options);
    }
    /**
     * @summary Get / fetch comments, but without the post or community.
     */
    async getCommentsSlim(form = {}, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/comment/list/slim", form, options);
    }
    /**
     * @summary Get / fetch comment.
     */
    async getComment(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/comment", form, options);
    }
    /**
     * @summary Report a comment.
     */
    async createCommentReport(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/comment/report", form, options);
    }
    /**
     * @summary Resolve a comment report. Only a mod can do this.
     */
    async resolveCommentReport(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/comment/report/resolve", form, options);
    }
    /**
     * @summary Create a private message.
     */
    async createPrivateMessage(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/private_message", form, options);
    }
    /**
     * @summary Edit a private message.
     */
    async editPrivateMessage(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/private_message", form, options);
    }
    /**
     * @summary Delete a private message.
     */
    async deletePrivateMessage(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/private_message/delete", form, options);
    }
    /**
     * @summary Mark a private message as read.
     */
    async markPrivateMessageAsRead(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/private_message/mark_as_read", form, options);
    }
    /**
     * @summary Create a report for a private message.
     */
    async createPrivateMessageReport(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/private_message/report", form, options);
    }
    /**
     * @summary Resolve a report for a private message.
     */
    async resolvePrivateMessageReport(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/private_message/report/resolve", form, options);
    }
    /**
     * @summary Register a new user.
     */
    async register(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/auth/register", form, options);
    }
    /**
     * @summary Log into lemmy.
     */
    async login(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/auth/login", form, options);
    }
    /**
     * @summary Invalidate the currently used auth token.
     */
    async logout(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/auth/logout", {}, options);
    }
    /**
     * @summary Get the details for a person.
     */
    async getPersonDetails(form = {}, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/person", form, options);
    }
    /**
     * @summary List the content for a person.
     */
    async listPersonContent(form = {}, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/person/content", form, options);
    }
    /**
     * @summary Mark a person mention as read.
     */
    async markCommentMentionAsRead(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/mention/comment/mark_as_read", form, options);
    }
    /**
     * @summary Mark a person post body mention as read.
     */
    async markPostMentionAsRead(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/mention/post/mark_as_read", form, options);
    }
    /**
     * @summary Ban a person from your site.
     */
    async banPerson(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/admin/ban", form, options);
    }
    /**
     * @summary Get a list of users.
     */
    async listUsers(form = {}, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/admin/users", form, options);
    }
    /**
     * @summary Block a person.
     */
    async blockPerson(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/block/person", form, options);
    }
    /**
     * @summary Fetch a Captcha.
     */
    async getCaptcha(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/site/get-captcha", {}, options);
    }
    /**
     * @summary Delete your account.
     */
    async deleteAccount(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/delete", form, options);
    }
    /**
     * @summary Reset your password.
     */
    async passwordReset(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/auth/password_reset", form, options);
    }
    /**
     * @summary Change your password from an email / token based reset.
     */
    async passwordChangeAfterReset(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/auth/password_change", form, options);
    }
    /**
     * @summary Mark all replies as read.
     */
    async markAllNotificationsAsRead(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/mark_as_read/all", {}, options);
    }
    /**
     * @summary Save your user settings.
     */
    async saveUserSettings(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/account/settings/save", form, options);
    }
    /**
     * @summary Change your user password.
     */
    async changePassword(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/account/auth/change_password", form, options);
    }
    /**
     * @summary Get counts for your reports.
     */
    async getReportCount(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/account/report_count", form, options);
    }
    /**
     * @summary Get your unread counts.
     */
    async getUnreadCount(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/account/unread_count", {}, options);
    }
    /**
     * @summary Get your inbox (replies, comment mentions, post mentions, and messages)
     */
    async listInbox(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/account/inbox", form, options);
    }
    /**
     * @summary Verify your email
     */
    async verifyEmail(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/auth/verify_email", form, options);
    }
    /**
     * @summary Resend a verification email.
     */
    async resendVerificationEmail(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/auth/resend_verification_email", form, options);
    }
    /**
     * @summary List your saved content.
     */
    async listPersonSaved(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/account/saved", form, options);
    }
    /**
     * @summary List your read content.
     */
    async listPersonRead(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/account/read", form, options);
    }
    /**
     * @summary List your hidden content.
     */
    async listPersonHidden(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/account/hidden", form, options);
    }
    /**
     * @summary List your liked content.
     */
    async listPersonLiked(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/account/liked", form, options);
    }
    /**
     * @summary Add an admin to your site.
     */
    async addAdmin(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/admin/add", form, options);
    }
    /**
     * @summary Get the unread registration applications count.
     */
    async getUnreadRegistrationApplicationCount(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/admin/registration_application/count", {}, options);
    }
    /**
     * @summary List the registration applications.
     */
    async listRegistrationApplications(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/admin/registration_application/list", form, options);
    }
    /**
     * @summary Approve a registration application
     */
    async approveRegistrationApplication(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/admin/registration_application/approve", form, options);
    }
    /**
     * @summary Get the application a user submitted when they first registered their account
     */
    async getRegistrationApplication(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/admin/registration_application", form, options);
    }
    /**
     * @summary Purge / Delete a person from the database.
     */
    async purgePerson(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/admin/purge/person", form, options);
    }
    /**
     * @summary Purge / Delete a community from the database.
     */
    async purgeCommunity(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/admin/purge/community", form, options);
    }
    /**
     * @summary Purge / Delete a post from the database.
     */
    async purgePost(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/admin/purge/post", form, options);
    }
    /**
     * @summary Purge / Delete a comment from the database.
     */
    async purgeComment(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/admin/purge/comment", form, options);
    }
    /**
     * @summary Create a new custom emoji.
     */
    async createCustomEmoji(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/custom_emoji", form, options);
    }
    /**
     * @summary Edit an existing custom emoji.
     */
    async editCustomEmoji(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/custom_emoji", form, options);
    }
    /**
     * @summary Delete a custom emoji.
     */
    async deleteCustomEmoji(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/custom_emoji/delete", form, options);
    }
    /**
     * @summary List custom emojis
     */
    async listCustomEmojis(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/custom_emoji/list", form, options);
    }
    /**
     * @summary Create a new tagline
     */
    async createTagline(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/admin/tagline", form, options);
    }
    /**
     * @summary Edit an existing tagline
     */
    async editTagline(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/admin/tagline", form, options);
    }
    /**
     * @summary Delete a tagline
     */
    async deleteTagline(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/admin/tagline/delete", form, options);
    }
    /**
     * @summary List taglines.
     */
    async listTaglines(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/admin/tagline/list", form, options);
    }
    /**
     * @summary Create a community post tag.
     */
    createCommunityTag(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/community/tag", form, options);
    }
    /**
     * @summary Update a community post tag.
     */
    updateCommunityTag(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/community/tag", form, options);
    }
    /**
     * @summary Delete a post tag in a community.
     */
    deleteCommunityTag(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Delete, "/community/tag", form, options);
    }
    /**
     * @summary Create a new oauth provider method
     */
    async createOAuthProvider(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/oauth_provider", form, options);
    }
    /**
     * @summary Edit an existing oauth provider method
     */
    async editOAuthProvider(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/oauth_provider", form, options);
    }
    /**
     * @summary Delete an oauth provider method
     */
    async deleteOAuthProvider(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/oauth_provider/delete", form, options);
    }
    /**
     * @summary Authenticate with OAuth
     */
    async authenticateWithOAuth(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/oauth/authenticate", form, options);
    }
    /**
     * @summary Fetch federated instances.
     */
    async getFederatedInstances(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/federated_instances", {}, options);
    }
    /**
     * @summary List user reports.
     */
    async listReports(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/report/list", form, options);
    }
    /**
     * @summary Block an instance as user.
     */
    async userBlockInstance(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/account/block/instance", form, options);
    }
    /**
     * @summary Globally block an instance as admin.
     */
    async adminBlockInstance(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/admin/instance/block", form, options);
    }
    /**
     * @summary Globally allow an instance as admin.
     */
    async adminAllowInstance(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/admin/instance/allow", form, options);
    }
    /**
     * @summary Upload new user avatar.
     */
    async uploadUserAvatar(image, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_upload).call(this, "/account/avatar", image, options);
    }
    /**
     * @summary Delete the user avatar.
     */
    async deleteUserAvatar(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Delete, "/account/avatar", {}, options);
    }
    /**
     * @summary Upload new user banner.
     */
    async uploadUserBanner(image, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_upload).call(this, "/account/banner", image, options);
    }
    /**
     * @summary Delete the user banner.
     */
    async deleteUserBanner(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Delete, "/account/banner", {}, options);
    }
    /**
     * @summary Upload new community icon.
     */
    async uploadCommunityIcon(query, image, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_uploadWithQuery).call(this, "/community/icon", query, image, options);
    }
    /**
     * @summary Delete the community icon.
     */
    async deleteCommunityIcon(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Delete, "/community/icon", form, options);
    }
    /**
     * @summary Upload new community banner.
     */
    async uploadCommunityBanner(query, image, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_uploadWithQuery).call(this, "/community/banner", query, image, options);
    }
    /**
     * @summary Delete the community banner.
     */
    async deleteCommunityBanner(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Delete, "/community/banner", form, options);
    }
    /**
     * @summary Upload new site icon.
     */
    async uploadSiteIcon(image, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_upload).call(this, "/site/icon", image, options);
    }
    /**
     * @summary Delete the site icon.
     */
    async deleteSiteIcon(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Delete, "/site/icon", {}, options);
    }
    /**
     * @summary Upload new site banner.
     */
    async uploadSiteBanner(image, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_upload).call(this, "/site/banner", image, options);
    }
    /**
     * @summary Delete the site banner.
     */
    async deleteSiteBanner(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Delete, "/site/banner", {}, options);
    }
    /**
     * @summary Upload an image to the server.
     */
    async uploadImage(image, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_upload).call(this, "/image", image, options);
    }
    /**
     * @summary Health check for image functionality
     */
    async imageHealth(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/image/health", {}, options);
    }
    /**
     * Mark donation dialog as shown, so it isn't displayed anymore.
     */
    donationDialogShown(options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/user/donation_dialog_shown", {}, options);
    }
    createMultiCommunity(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/multi_community", form, options);
    }
    updateMultiCommunity(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Put, "/multi_community", form, options);
    }
    getMultiCommunity(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/multi_community", form, options);
    }
    createMultiCommunityEntry(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/multi_community/entry", form, options);
    }
    deleteMultiCommunityEntry(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Delete, "/multi_community/entry", form, options);
    }
    listMultiCommunities(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Get, "/multi_community/list", form, options);
    }
    followMultiCommunity(form, options) {
        return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_wrapper).call(this, HttpType.Post, "/multi_community/follow", form, options);
    }
    /**
     * Set the headers (can be used to set the auth header)
     */
    setHeaders(headers) {
        __classPrivateFieldSet(this, _LemmyHttp_headers, headers, "f");
    }
};
exports.LemmyHttp = LemmyHttp;
_LemmyHttp_apiUrl = new WeakMap();
_LemmyHttp_headers = new WeakMap();
_LemmyHttp_fetchFunction = new WeakMap();
_LemmyHttp_instances = new WeakSet();
_LemmyHttp_buildFullUrl = function _LemmyHttp_buildFullUrl(endpoint) {
    return `${__classPrivateFieldGet(this, _LemmyHttp_apiUrl, "f")}${endpoint}`;
};
_LemmyHttp_upload = async function _LemmyHttp_upload(path, { image }, options) {
    const formData = createFormData(image);
    const response = await __classPrivateFieldGet(this, _LemmyHttp_fetchFunction, "f").call(this, __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_buildFullUrl).call(this, path), {
        ...options,
        method: HttpType.Post,
        body: formData,
        headers: __classPrivateFieldGet(this, _LemmyHttp_headers, "f"),
    });
    return response.json();
};
_LemmyHttp_uploadWithQuery = async function _LemmyHttp_uploadWithQuery(path, query, { image }, options) {
    return __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_upload).call(this, `${path}?${encodeGetParams(query)}`, { image }, options);
};
_LemmyHttp_wrapper = async function _LemmyHttp_wrapper(type_, endpoint, form, options) {
    let response;
    if (type_ === HttpType.Get) {
        const getUrl = `${__classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_buildFullUrl).call(this, endpoint)}?${encodeGetParams(form)}`;
        response = await __classPrivateFieldGet(this, _LemmyHttp_fetchFunction, "f").call(this, getUrl, {
            ...options,
            method: HttpType.Get,
            headers: __classPrivateFieldGet(this, _LemmyHttp_headers, "f"),
        });
    }
    else {
        response = await __classPrivateFieldGet(this, _LemmyHttp_fetchFunction, "f").call(this, __classPrivateFieldGet(this, _LemmyHttp_instances, "m", _LemmyHttp_buildFullUrl).call(this, endpoint), {
            ...options,
            method: type_,
            headers: {
                "Content-Type": "application/json",
                ...__classPrivateFieldGet(this, _LemmyHttp_headers, "f"),
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
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Security)({}),
    (0, runtime_1.Get)("/site"),
    (0, runtime_1.Tags)("Site"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getSite", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/site"),
    (0, runtime_1.Tags)("Site"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "createSite", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/site"),
    (0, runtime_1.Tags)("Site"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "editSite", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/admin/leave"),
    (0, runtime_1.Tags)("Admin"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "leaveAdmin", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/account/auth/totp/generate"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "generateTotpSecret", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/account"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getMyUser", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/account/settings/export"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "exportSettings", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/account/settings/import"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "importSettings", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/account/list_logins"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listLogins", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/account/validate_auth"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "validateAuth", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/account/media/list"),
    (0, runtime_1.Tags)("Account", "Media"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listMedia", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Delete)("/account/media"),
    (0, runtime_1.Tags)("Account", "Media"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deleteMedia", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Delete)("/image"),
    (0, runtime_1.Tags)("Admin", "Media"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deleteMediaAdmin", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/image/list"),
    (0, runtime_1.Tags)("Admin", "Media"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listMediaAdmin", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/account/auth/totp/update"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "updateTotp", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Security)({}),
    (0, runtime_1.Get)("/modlog"),
    (0, runtime_1.Tags)("Miscellaneous"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getModlog", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Security)({}),
    (0, runtime_1.Get)("/search"),
    (0, runtime_1.Tags)("Miscellaneous"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "search", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Security)({}),
    (0, runtime_1.Get)("/resolve_object"),
    (0, runtime_1.Tags)("Miscellaneous"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "resolveObject", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/community"),
    (0, runtime_1.Tags)("Community"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "createCommunity", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Security)({}),
    (0, runtime_1.Get)("/community"),
    (0, runtime_1.Tags)("Community"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getCommunity", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/community"),
    (0, runtime_1.Tags)("Community"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "editCommunity", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Security)({}),
    (0, runtime_1.Get)("/community/list"),
    (0, runtime_1.Tags)("Community"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listCommunities", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/community/follow"),
    (0, runtime_1.Tags)("Community"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "followCommunity", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/community/pending_follows/count"),
    (0, runtime_1.Tags)("Community"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getCommunityPendingFollowsCount", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/community/pending_follows/list"),
    (0, runtime_1.Tags)("Community"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listCommunityPendingFollows", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/community/pending_follows/approve"),
    (0, runtime_1.Tags)("Community"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "approveCommunityPendingFollow", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/account/block/community"),
    (0, runtime_1.Tags)("Account", "Community"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "blockCommunity", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/community/delete"),
    (0, runtime_1.Tags)("Community"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deleteCommunity", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/community/hide"),
    (0, runtime_1.Tags)("Community", "Admin"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "hideCommunity", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/community/remove"),
    (0, runtime_1.Tags)("Community", "Moderator"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "removeCommunity", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/community/transfer"),
    (0, runtime_1.Tags)("Community", "Moderator"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "transferCommunity", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/community/ban_user"),
    (0, runtime_1.Tags)("Community", "Moderator"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "banFromCommunity", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/community/mod"),
    (0, runtime_1.Tags)("Community", "Moderator"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "addModToCommunity", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Security)({}),
    (0, runtime_1.Get)("/community/random"),
    (0, runtime_1.Tags)("Community"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getRandomCommunity", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/community/report"),
    (0, runtime_1.Tags)("Community"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "createCommunityReport", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/community/report/resolve"),
    (0, runtime_1.Tags)("Community", "Admin"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "resolveCommunityReport", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/post"),
    (0, runtime_1.Tags)("Post"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "createPost", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Security)({}),
    (0, runtime_1.Get)("/post"),
    (0, runtime_1.Tags)("Post"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getPost", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/post"),
    (0, runtime_1.Tags)("Post"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "editPost", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/post/delete"),
    (0, runtime_1.Tags)("Post"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deletePost", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/post/remove"),
    (0, runtime_1.Tags)("Post", "Moderator"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "removePost", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/post/mark_as_read"),
    (0, runtime_1.Tags)("Post"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "markPostAsRead", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/post/mark_as_read/many"),
    (0, runtime_1.Tags)("Post"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "markManyPostAsRead", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/post/hide"),
    (0, runtime_1.Tags)("Post"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "hidePost", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/post/lock"),
    (0, runtime_1.Tags)("Post"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "lockPost", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/post/feature"),
    (0, runtime_1.Tags)("Post", "Moderator"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "featurePost", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Security)({}),
    (0, runtime_1.Get)("/post/list"),
    (0, runtime_1.Tags)("Post"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getPosts", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/post/like"),
    (0, runtime_1.Tags)("Post"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "likePost", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/post/like/list"),
    (0, runtime_1.Tags)("Post", "Admin"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listPostLikes", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/post/save"),
    (0, runtime_1.Tags)("Post"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "savePost", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/post/report"),
    (0, runtime_1.Tags)("Post"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "createPostReport", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/post/report/resolve"),
    (0, runtime_1.Tags)("Post", "Moderator"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "resolvePostReport", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/post/site_metadata"),
    (0, runtime_1.Tags)("Miscellaneous", "Post"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getSiteMetadata", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/comment"),
    (0, runtime_1.Tags)("Comment"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "createComment", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/comment"),
    (0, runtime_1.Tags)("Comment"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "editComment", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/comment/delete"),
    (0, runtime_1.Tags)("Comment"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deleteComment", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/comment/remove"),
    (0, runtime_1.Tags)("Comment", "Moderator"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "removeComment", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/comment/mark_as_read"),
    (0, runtime_1.Tags)("Comment"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "markCommentReplyAsRead", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/comment/like"),
    (0, runtime_1.Tags)("Comment"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "likeComment", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/comment/like/list"),
    (0, runtime_1.Tags)("Comment", "Admin"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listCommentLikes", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/comment/save"),
    (0, runtime_1.Tags)("Comment"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "saveComment", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/comment/distinguish"),
    (0, runtime_1.Tags)("Comment", "Moderator"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "distinguishComment", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Security)({}),
    (0, runtime_1.Get)("/comment/list"),
    (0, runtime_1.Tags)("Comment"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getComments", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Security)({}),
    (0, runtime_1.Get)("/comment/list/slim"),
    (0, runtime_1.Tags)("Comment"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getCommentsSlim", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Security)({}),
    (0, runtime_1.Get)("/comment"),
    (0, runtime_1.Tags)("Comment"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getComment", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/comment/report"),
    (0, runtime_1.Tags)("Comment"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "createCommentReport", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/comment/report/resolve"),
    (0, runtime_1.Tags)("Comment", "Moderator"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "resolveCommentReport", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/private_message"),
    (0, runtime_1.Tags)("PrivateMessage"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "createPrivateMessage", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/private_message"),
    (0, runtime_1.Tags)("PrivateMessage"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "editPrivateMessage", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/private_message/delete"),
    (0, runtime_1.Tags)("PrivateMessage"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deletePrivateMessage", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/private_message/mark_as_read"),
    (0, runtime_1.Tags)("PrivateMessage"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "markPrivateMessageAsRead", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/private_message/report"),
    (0, runtime_1.Tags)("PrivateMessage"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "createPrivateMessageReport", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/private_message/report/resolve"),
    (0, runtime_1.Tags)("PrivateMessage", "Admin"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "resolvePrivateMessageReport", null);
__decorate([
    (0, runtime_1.Post)("/account/auth/register"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "register", null);
__decorate([
    (0, runtime_1.Post)("/account/auth/login"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "login", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/account/auth/logout"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "logout", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Security)({}),
    (0, runtime_1.Get)("/person"),
    (0, runtime_1.Tags)("Person"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getPersonDetails", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Security)({}),
    (0, runtime_1.Get)("/person/content"),
    (0, runtime_1.Tags)("Person"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listPersonContent", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/account/mention/comment/mark_as_read"),
    (0, runtime_1.Tags)("Account", "Person"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "markCommentMentionAsRead", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/account/mention/post/mark_as_read"),
    (0, runtime_1.Tags)("Account", "Post"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "markPostMentionAsRead", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/admin/ban"),
    (0, runtime_1.Tags)("Admin"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "banPerson", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/admin/users"),
    (0, runtime_1.Tags)("Admin", "Miscellaneous"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listUsers", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/account/block/person"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "blockPerson", null);
__decorate([
    (0, runtime_1.Get)("/account/auth/get_captcha"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getCaptcha", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/account/delete"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deleteAccount", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/account/auth/password_reset"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "passwordReset", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/account/auth/password_change"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "passwordChangeAfterReset", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/account/mark_as_read/all"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "markAllNotificationsAsRead", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/account/settings/save"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "saveUserSettings", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/account/auth/change_password"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "changePassword", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/account/report_count"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getReportCount", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/account/unread_count"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getUnreadCount", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/account/inbox"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listInbox", null);
__decorate([
    (0, runtime_1.Post)("/account/auth/verify_email"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "verifyEmail", null);
__decorate([
    (0, runtime_1.Post)("/account/auth/resend_verification_email"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "resendVerificationEmail", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/account/saved"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listPersonSaved", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/account/read"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listPersonRead", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/account/hidden"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listPersonHidden", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/account/liked"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listPersonLiked", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/admin/add"),
    (0, runtime_1.Tags)("Admin"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "addAdmin", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/admin/registration_application/count"),
    (0, runtime_1.Tags)("Admin"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getUnreadRegistrationApplicationCount", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/admin/registration_application/list"),
    (0, runtime_1.Tags)("Admin"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listRegistrationApplications", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/admin/registration_application/approve"),
    (0, runtime_1.Tags)("Admin"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "approveRegistrationApplication", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/admin/registration_application"),
    (0, runtime_1.Tags)("Admin"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getRegistrationApplication", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/admin/purge/person"),
    (0, runtime_1.Tags)("Admin"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "purgePerson", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/admin/purge/community"),
    (0, runtime_1.Tags)("Admin"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "purgeCommunity", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/admin/purge/post"),
    (0, runtime_1.Tags)("Admin"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "purgePost", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/admin/purge/comment"),
    (0, runtime_1.Tags)("Admin"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "purgeComment", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/custom_emoji"),
    (0, runtime_1.Tags)("CustomEmoji"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "createCustomEmoji", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/custom_emoji"),
    (0, runtime_1.Tags)("CustomEmoji"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "editCustomEmoji", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/custom_emoji/delete"),
    (0, runtime_1.Tags)("CustomEmoji"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deleteCustomEmoji", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Security)({}),
    (0, runtime_1.Get)("/custom_emoji/list"),
    (0, runtime_1.Tags)("CustomEmoji"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listCustomEmojis", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/admin/tagline"),
    (0, runtime_1.Tags)("Admin", "Tagline"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "createTagline", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/admin/tagline"),
    (0, runtime_1.Tags)("Admin", "Tagline"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "editTagline", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/admin/tagline/delete"),
    (0, runtime_1.Tags)("Admin", "Tagline"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deleteTagline", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Security)({}),
    (0, runtime_1.Get)("/admin/tagline/list"),
    (0, runtime_1.Tags)("Admin", "Tagline"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listTaglines", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/community/tag"),
    (0, runtime_1.Tags)("Community"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "createCommunityTag", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/community/tag"),
    (0, runtime_1.Tags)("Community"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "updateCommunityTag", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Delete)("/community/tag"),
    (0, runtime_1.Tags)("Community"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deleteCommunityTag", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/oauth_provider"),
    (0, runtime_1.Tags)("Miscellaneous", "OAuth"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "createOAuthProvider", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/oauth_provider"),
    (0, runtime_1.Tags)("Miscellaneous", "OAuth"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "editOAuthProvider", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/oauth_provider/delete"),
    (0, runtime_1.Tags)("Miscellaneous", "OAuth"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deleteOAuthProvider", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/oauth/authenticate"),
    (0, runtime_1.Tags)("Miscellaneous", "OAuth"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "authenticateWithOAuth", null);
__decorate([
    (0, runtime_1.Get)("/federated_instances"),
    (0, runtime_1.Tags)("Miscellaneous"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getFederatedInstances", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Get)("/report/list"),
    (0, runtime_1.Tags)("Admin"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listReports", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/account/block/instance"),
    (0, runtime_1.Tags)("Account"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "userBlockInstance", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/admin/instance/block"),
    (0, runtime_1.Tags)("Admin"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "adminBlockInstance", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/admin/instance/allow"),
    (0, runtime_1.Tags)("Admin"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "adminAllowInstance", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/account/avatar"),
    (0, runtime_1.Tags)("Account", "Media"),
    __param(0, (0, runtime_1.UploadedFile)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "uploadUserAvatar", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Delete)("/account/avatar"),
    (0, runtime_1.Tags)("Account", "Media"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deleteUserAvatar", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/account/banner"),
    (0, runtime_1.Tags)("Account", "Media"),
    __param(0, (0, runtime_1.UploadedFile)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "uploadUserBanner", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Delete)("/account/banner"),
    (0, runtime_1.Tags)("Account", "Media"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deleteUserBanner", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/community/icon"),
    (0, runtime_1.Tags)("Community", "Media"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.UploadedFile)()),
    __param(2, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "uploadCommunityIcon", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Delete)("/community/icon"),
    (0, runtime_1.Tags)("Community", "Media"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deleteCommunityIcon", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/community/banner"),
    (0, runtime_1.Tags)("Community", "Media"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.UploadedFile)()),
    __param(2, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "uploadCommunityBanner", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Delete)("/community/banner"),
    (0, runtime_1.Tags)("Community", "Media"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deleteCommunityBanner", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/site/icon"),
    (0, runtime_1.Tags)("Site", "Media"),
    __param(0, (0, runtime_1.UploadedFile)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "uploadSiteIcon", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Delete)("/site/icon"),
    (0, runtime_1.Tags)("Site", "Media"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deleteSiteIcon", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/site/banner"),
    (0, runtime_1.Tags)("Site", "Media"),
    __param(0, (0, runtime_1.UploadedFile)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "uploadSiteBanner", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Delete)("/site/banner"),
    (0, runtime_1.Tags)("Site", "Media"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deleteSiteBanner", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/image"),
    (0, runtime_1.Tags)("Media"),
    __param(0, (0, runtime_1.UploadedFile)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "uploadImage", null);
__decorate([
    (0, runtime_1.Get)("/image/health"),
    (0, runtime_1.Tags)("Media"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "imageHealth", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/user/donation_dialog_shown"),
    __param(0, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "donationDialogShown", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/multi_community"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "createMultiCommunity", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Put)("/multi_community"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "updateMultiCommunity", null);
__decorate([
    (0, runtime_1.Get)("/multi_community"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "getMultiCommunity", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Post)("/multi_community/entry"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "createMultiCommunityEntry", null);
__decorate([
    (0, runtime_1.Security)("bearerAuth"),
    (0, runtime_1.Delete)("/multi_community/entry"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "deleteMultiCommunityEntry", null);
__decorate([
    (0, runtime_1.Get)("/multi_community/list"),
    __param(0, (0, runtime_1.Queries)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "listMultiCommunities", null);
__decorate([
    (0, runtime_1.Post)("/multi_community/follow"),
    __param(0, (0, runtime_1.Body)()),
    __param(1, (0, runtime_1.Inject)())
], LemmyHttp.prototype, "followMultiCommunity", null);
exports.LemmyHttp = LemmyHttp = __decorate([
    (0, runtime_1.Route)("api/v4")
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
