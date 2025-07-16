import { Search, SearchType } from "../../lib/lemmy-js-client";
import { fetchLimit } from "@/config";
import {HttpService} from "@/services";


export default function fetchSearchResults(q: string, type_: string) {
  const form: Search = {
    q,
    listing_type: "All",
    limit: fetchLimit,
    sort: "New"
  };

  return HttpService.client.search(form);
}
