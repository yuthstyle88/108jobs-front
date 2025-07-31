import {StartSellingImage} from "@/constants/images";
import Image, {StaticImageData} from "next/image";
import Link from "next/link";

type FreelancerType = {
  title?: {
    main?: string;
    sub?: string;
  };
  image: StaticImageData;
  badgeText?: string;
  badgeClass?: string;
  description?: string;
  benefits?: string[];
};

type Props = {
  data: Record<string, string>;
};

const FreelancerTypes = ({data}: Props) => {
  const freelancerTypes: FreelancerType[] = [
    {
      title: {
        main: data?.freelancerStandard,
        sub: data?.freelancerLabel,
      },
      image: StartSellingImage.compare1,
      description: data?.freelancerStandardDescription,
      benefits: [
        data?.freelancer2 ?? "",
        data?.freelancer3 ?? "",
        data?.freelancer4 ?? "",
        data?.freelancer5 ?? "",
        data?.freelancer6 ?? "",
      ],
    },
    {
      title: {
        main: data?.freelancerSpecialist,
        sub: data?.specialistLabel,
      },
      image: StartSellingImage.compare2,
      badgeClass: "bg-blue-100 text-blue-600",
      description: data?.freelancerSpecialistDescription,
      benefits: [
        data?.specialist2 ?? "",
        data?.specialist3 ?? "",
        data?.specialist4 ?? "",
        data?.specialist5 ?? "",
        data?.specialist6 ?? "",
        data?.specialist7 ?? "",
      ],
    },
    {
      title: {
        main: data?.freelancerProfessional,
        sub: data?.professionalLabel,
      },
      image: StartSellingImage.compare3,
      badgeClass: "bg-blue-600 text-white",
      description:
      data?.freelancerProfessionalDescription,
      benefits: [
        data?.professional2 ?? "",
        data?.professional3 ?? "",
        data?.professional4 ?? "",
        data?.professional5 ?? "",
      ],
    },
  ];
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-primary mb-12">
        {data?.freelancerTypesTitle}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {freelancerTypes.map((type, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-job-card p-6 border border-gray-200"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-primary">
                {type?.title?.main}
              </h3>
              <p className="text-gray-500">{type?.title?.sub}</p>
            </div>

            <div className="aspect-video pb-6 flex items-center justify-center">
              <Image
                src={type.image}
                alt={type?.title?.main || "no image"}
                className="w-[193px] h-full object-cover"
              />
            </div>

            <p className="text-gray-600 mb-6">{type.description}</p>

            <ul className="space-y-3">
              {type.benefits?.map((benefit, benefitIndex) => (
                <li key={benefitIndex} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-third mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="ml-2 text-gray-600">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="grid-container-desktop-banner w-full pt-[64px]">
        <div className="col-start-2 col-end-3 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold text-center text-primary mb-4">
            {data?.ctaTitle}
          </h2>
          <Link prefetch={false} href="/apply-freelance">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              {data?.ctaButton}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FreelancerTypes;
