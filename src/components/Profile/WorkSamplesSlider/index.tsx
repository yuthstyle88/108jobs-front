'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronLeft, faChevronRight, faEdit} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import dynamic from 'next/dynamic';
import {WorkSample} from "@/lib/lemmy-js-client/src";
const SlickSlider = dynamic(() => import('react-slick'), { ssr: false });

interface WorkSamplesSliderProps {
    workSamples: WorkSample[];
    isOwnProfile: boolean;
}

const NextArrow = ({ onClick }: any) => (
    <button
        onClick={onClick}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full z-10 shadow"
    >
        <FontAwesomeIcon icon={faChevronRight} className="text-gray-700" />
    </button>
);

const PrevArrow = ({ onClick }: any) => (
    <button
        onClick={onClick}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full z-10 shadow"
    >
        <FontAwesomeIcon icon={faChevronLeft} className="text-gray-700" />
    </button>
);


const WorkSamplesSlider: React.FC<WorkSamplesSliderProps> = ({ workSamples, isOwnProfile }) => {
    const { t } = useTranslation();
    const samplesPerPage = 2;

    const workSampleSettings = {
        dots: true,
        infinite: workSamples.length > samplesPerPage,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        swipeToSlide: true,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };


    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4 sm:mb-5">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                    {t('profile.workSamples')}
                </h2>
                {isOwnProfile && (
                    <Link
                        prefetch={false}
                        href="/account-setting/work-sample"
                        className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label={workSamples.length > 0 ? t('profile.editWorkSamples') : t('profile.addWorkSamples')}
                    >
                        <FontAwesomeIcon icon={faEdit} className="text-gray-600 w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                )}
            </div>
            {workSamples.length > 0 ? (
                <div className="relative bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                    <SlickSlider {...workSampleSettings}>
                        {workSamples.map((sample) => (
                            <div key={sample.id} className="px-2">
                                <div className="p-4 rounded-lg border border-gray-200 transition-transform duration-300 hover:scale-105">
                                    <h4 className="font-medium text-gray-800 text-xs sm:text-sm">{sample.title}</h4>
                                    <p className="text-gray-600 text-xs mt-1">{sample.description}</p>
                                    <Link
                                        href={sample.sampleUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary text-xs hover:underline"
                                        aria-label={`${t('profile.viewWorkSample')}: ${sample.title}`}
                                    >
                                        {t('profile.viewWorkSample')}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </SlickSlider>
                </div>
            ) : (
                <p className="text-gray-600 text-xs sm:text-sm">{t('profile.noWorkSamples')}</p>
            )}
        </div>
    );
};

export default WorkSamplesSlider;