import { generateLocalizedMetadata } from "@/lib/metadata";
import MyJobEdit from "../../_components/MyJobEdit";

export async function generateMetadata() {
  return generateLocalizedMetadata("catalog");
}

export default async function Categories({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const resolvedParams = await params;

   return (
   <main className="w-full min-h-screen bg-[#F6F9FE] pt-16">
      <MyJobEdit jobId={resolvedParams.jobId}/>
    </main>
  );
}

