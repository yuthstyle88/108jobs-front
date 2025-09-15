import JobBoardDetail from "@/components/JobBoardDetail";
import {generateLocalizedMetadata} from "@/lib/metadata";

export async function generateMetadata() {
  return generateLocalizedMetadata("catalog");
}

export default async function Categories({
  params,
}: {
  params: any;
}) {
  return (
    <main className="w-full min-h-screen bg-[#F6F9FE] pt-16">
      <JobBoardDetail jobId={Number(params.jobId)}/>
    </main>
  );
}

