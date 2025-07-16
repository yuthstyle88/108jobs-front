import type { Instance } from "./Instance";
import type { LocalSite } from "./LocalSite";
import type { LocalSiteRateLimit } from "./LocalSiteRateLimit";
import type { Site } from "./Site";
/**
 * A site view.
 */
export type SiteView = {
    site: Site;
    localSite: LocalSite;
    localSiteRateLimit: LocalSiteRateLimit;
    instance: Instance;
};
