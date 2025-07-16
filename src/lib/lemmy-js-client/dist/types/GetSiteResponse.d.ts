import type { Language } from "./Language";
import type { LanguageId } from "./LanguageId";
import type { LocalSiteUrlBlocklist } from "@/lib/lemmy-js-client";
import type { OAuthProvider } from "./OAuthProvider";
import type { PersonView } from "./PersonView";
import type { PluginMetadata } from "./PluginMetadata";
import type { PublicOAuthProvider } from "./PublicOAuthProvider";
import type { SiteView } from "./SiteView";
import type { Tagline } from "./Tagline";
/**
 * An expanded response for a site.
 */
export type GetSiteResponse = {
    site_view: SiteView;
    admins: Array<PersonView>;
    version: string;
    my_user?: MyUserInfo;
    all_languages: Array<Language>;
    discussion_languages: Array<LanguageId>;
    /**
     * If the site has any taglines, a random one is included here for displaying
     */
    tagline?: Tagline;
    /**
     * A list of external auth methods your site supports.
     */
    oauth_providers: Array<PublicOAuthProvider>;
    admin_oauth_providers: Array<OAuthProvider>;
    blocked_urls: Array<LocalSiteUrlBlocklist>;
    image_upload_disabled: boolean;
    active_plugins: Array<PluginMetadata>;
};
