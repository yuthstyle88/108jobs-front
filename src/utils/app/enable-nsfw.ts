import { GetSiteResponse } from "../../lib/lemmy-js-client";

export default function enableNsfw(siteRes: GetSiteResponse): boolean {
  return !!siteRes.siteView.site.contentWarning;
}
