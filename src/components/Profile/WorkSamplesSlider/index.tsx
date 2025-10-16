import { useTranslation } from "react-i18next";
import Link from "next/link";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

interface WorkSample {
    id: number;
    title: string;
    description: string;
    sampleUrl: string;
}

interface WorkSamplesSliderProps {
    workSamples: WorkSample[];
    isOwnProfile: boolean;
}

const WorkSamplesSlider: React.FC<WorkSamplesSliderProps> = ({ workSamples, isOwnProfile }) => {
    const { t } = useTranslation();
    const samplesPerPage = 2;

    const workSampleSettings = {
        dots: true,
        infinite: workSamples.length > samplesPerPage,
        speed: 500,
        slidesToShow: Math.min(samplesPerPage, workSamples.length),
        slidesToScroll: samplesPerPage,
        swipeToSlide: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">{t("profile.workSamples")}</h2>
                {isOwnProfile && (
                    <Link
                        prefetch={false}
                        href="/account-setting/work-sample"
                        className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label={workSamples.length > 0 ? "Edit work samples" : "Add work samples"}
                    >
                        <FontAwesomeIcon icon={faEdit} className="text-gray-600" />
                    </Link>
                )}
            </div>
            {workSamples.length > 0 ? (
                <div className="relative bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <Slider {...workSampleSettings}>
                        {workSamples.map((sample) => (
                            <div key={sample.id} className="p-2">
                                <div className="p-4 rounded-lg border border-gray-200 transition-transform duration-300 hover:scale-105">
                                    <h4 className="font-medium text-gray-800">{sample.title}</h4>
                                    <p className="text-gray-600 text-sm mt-1">{sample.description}</p>
                                    <Link
                                        href={sample.sampleUrl}
                                        target="_blank"
                                        className="text-primary text-sm hover:underline"
                                        aria-label={`View work sample: ${sample.title}`}
                                    >
                                        {t("profile.viewWorkSample")}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            ) : (
                <p className="text-gray-600 text-sm">{t("profile.noWorkSamples")}</p>
            )}
        </div>
    );
};

export default WorkSamplesSlider;