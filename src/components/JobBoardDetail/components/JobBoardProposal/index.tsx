import Link from "next/link";
import React, { memo } from "react";
import LazyImage from "@/components/ui/LazyImage";

type JobBoardProposalProps = Record<string, never>; // Empty props type

// Work sample image component for reuse
const WorkSampleImage = memo<{ alt: string }>(({ alt }) => (
  <div className="rounded-lg">
    <LazyImage
      imagePath="landing/Line_sticker_designdee_505bdaa359.webp"
      alt={alt}
      width={120}
      height={120}
      className="w-full h-full object-cover"
      loading="lazy"
      breakpoints={{
        sm: { width: 80, height: 80 },
        md: { width: 100, height: 100 },
        lg: { width: 120, height: 120 }
      }}
      responsiveSizes={{
        default: "100px",
        sm: "80px",
        md: "100px",
        lg: "120px"
      }}
    />
  </div>
));

WorkSampleImage.displayName = 'WorkSampleImage';

const JobBoardProposal: React.FC<JobBoardProposalProps> = () => {
  // Sample work images data
  const workSamples = [
    { id: 1, alt: "service sample 1" },
    { id: 2, alt: "service sample 2" },
    { id: 3, alt: "service sample 3" },
  ];

  return (
    <main className="mt-8 text-center text-[18px] text-text-secondary flex flex-col gap-4">
      No freelancer proposals yet
      <div className="p-4 rounded-[4px] border-1 border-borderSecondary">
        <section className="grid grid-cols-[7fr_3fr] gap-4 ">
          <div className="grid gap-6">
            <div>
              <div className="flex flex-row items-center gap-[10px] ">
                <LazyImage
                  imagePath="profile/avatar.jpg"
                  alt="avatar"
                  width={36}
                  height={36}
                  className="w-9 h-9 object-cover rounded-full"
                  priority
                />
                <p className="text-base font-normal text-text-primary font-sans">
                  GiangCatluong
                </p>
              </div>
              <p className="text-start font-normal text-text-primary font-sans mt-3 break-words whitespace-pre-wrap">
                I have experience in writing and building seeding content for
                movies on various platforms such as tiktok, youtube, Facebook. I
                am also currently working at a company specializing in
                communications and building community networks.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-start text-[16px] font-sans text-text-primary">
                <strong>Portfolio URL</strong>
              </p>
              <Link prefetch={false} href="/">
                <p className="text-start text-text-primary font-sans">
                  https://jobboard.fastlance.vn/en/jobs/5118a80a-b9ba-4e62-a766-c327e9ec0c97
                </p>
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-start text-[16px] font-sans text-text-primary">
                <strong>Work Samples</strong>
              </p>
              <div className="grid grid-cols-[repeat(5,1fr)] gap-2">
                {workSamples.map(sample => (
                  <WorkSampleImage key={sample.id} alt={sample.alt} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <p className="text-start text-[16px] font-sans text-text-primary">
                <strong>Attached Services</strong>
              </p>
              <div className="relative min-h-[120px]">
                <LazyImage
                  imagePath="landing/Line_sticker_designdee_505bdaa359.webp"
                  alt="service"
                  width={200}
                  height={120}
                  className="w-full h-full absolute inset-0 object-contain"
                  loading="lazy"
                  breakpoints={{
                    sm: { width: 150, height: 90 },
                    md: { width: 180, height: 108 },
                    lg: { width: 200, height: 120 }
                  }}
                  responsiveSizes={{
                    default: "200px",
                    sm: "150px",
                    md: "180px",
                    lg: "200px"
                  }}
                />
              </div>
              <Link prefetch={false} href="/">
                <p className="text-start text-text-primary font-sans">
                  Content writings & content creation
                </p>
              </Link>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className="text-start text-[16px] font-sans text-text-primary">
                <strong>Timeline</strong>
              </p>
              <p className="text-start text-text-primary font-sans">8 days</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default JobBoardProposal;
