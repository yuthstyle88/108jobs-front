import { LandingImage, ProfileImage } from "@/constants/images";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const JobBoardProposal = () => {
  return (
    <main className="mt-8 text-center text-[18px] text-text_secondary flex flex-col gap-4">
      No freelancer proposals yet
      <div className="p-4 rounded-[4px] border-1 border-borderSecondary">
        <section className="grid grid-cols-[7fr_3fr] gap-4 ">
          <div className="grid gap-6">
            <div>
              <div className="flex flex-row items-center gap-[10px] ">
                <Image
                  src={ProfileImage.avatar}
                  alt="avt"
                  width={500}
                  height={500}
                  className="w-9 h-9 object-cover rounded-full"
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
                <div className="rounded-lg">
                  <Image
                    src={LandingImage.topWorks}
                    alt="service"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg">
                  <Image
                    src={LandingImage.topWorks}
                    alt="service"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg">
                  <Image
                    src={LandingImage.topWorks}
                    alt="service"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <p className="text-start text-[16px] font-sans text-text-primary">
                <strong>Attached Services</strong>
              </p>
              <div className="relative min-h-[120px]">
                <Image
                  src={LandingImage.topWorks}
                  alt="service"
                  width={500}
                  height={500}
                  className="w-full h-full absolute inset-0 object-contain"
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
