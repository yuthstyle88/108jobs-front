import JobBoardDetail from "@/components/JobBoardDetail";
import { generateLocalizedMetadata } from "@/lib/metadata";

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
      <JobBoardDetail jobId={resolvedParams.jobId}/>
    </main>
  );
}

