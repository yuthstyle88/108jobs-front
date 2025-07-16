import { Choice } from "@/utils/types";
import { Instance } from "../../lib/lemmy-js-client";

export default function instanceToChoice({ id, domain }: Instance): Choice {
  return {
    value: id.toString(),
    label: domain,
  };
}
