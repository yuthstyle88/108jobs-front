"use client";
import CategoryCard from "@/components/CategoryDetail/components/CategoryCard";
import {AssetIcon} from "@/constants/icons";
import {ProfileImage} from "@/constants/images";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {formatDateToLong} from "@/utils/formatDateToLong";
import {interpolateDouble} from "@/utils/interpolate";
import {faEdit, faStar} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CircleCheckBig, ClipboardX, SquarePen} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {Certificate, Education, LanguageSkill, Person, Skill, WorkExperience} from "lemmy-js-client";
import {getProfileData} from "@/utils/getProfileData";
import {useTranslation} from "react-i18next";

const CurrentProfileUser = () => {
    const {t} = useTranslation();

    const {localUser, person} = useMyUser();
    const [activeTab, setActiveTab] = useState<"reviews" | "clients">("reviews");
    const [showFullBio, setShowFullBio] = useState(false);
    const [isClamped, setIsClamped] = useState(false);
    const bioRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (bioRef.current) {
            const el = bioRef.current;
            setIsClamped(el.scrollHeight > el.clientHeight);
        }
    }, [person?.bio]);

    const {
        educations,
        workExperience,
        skill,
        language,
        certAndAward,
        services,
        reviews,
    } = getProfileData(person as Person);

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 h-48 sm:h-64 overflow-hidden">
                <div className="absolute inset-0 bg-opacity-50 bg-black flex items-center justify-center">
                    <Image
                        src={AssetIcon.logoIcon}
                        alt="logoIcon"
                        className="opacity-20 object-contain"
                        width={200}
                        height={200}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div
                            className="bg-white shadow-lg rounded-2xl p-6 -mt-24 relative transition-all duration-300 hover:shadow-xl">
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <Image
                                        src={person?.avatar || ProfileImage.avatar}
                                        alt="Avatar"
                                        className="rounded-full w-32 h-32 sm:w-40 sm:h-40 object-cover border-4 border-white shadow-md"
                                        width={160}
                                        height={160}
                                    />
                                    <Link
                                        prefetch={false}
                                        href="/seller-account-setting/freelance-profile"
                                        className="absolute top-2 right-2 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="text-gray-600"/>
                                    </Link>
                                </div>
                                <h2 className="mt-4 text-xl font-semibold text-gray-800">
                                    {person?.name}
                                </h2>
                                <div className="flex items-center mt-2">
                                    {[...Array(person?.ratings || 0)].map((_, index) => (
                                        <FontAwesomeIcon
                                            icon={faStar}
                                            key={index}
                                            className="text-yellow-400 text-sm"
                                        />
                                    ))}
                                </div>
                                {localUser?.acceptedApplication === true && (
                                    <div
                                        className="mt-4 bg-green-100 text-green-700 px-4 py-2 rounded-full flex items-center text-sm font-medium">
                                        <CircleCheckBig className="w-4 h-4 mr-2"/>
                                        {(t("profile.verified"))}
                                    </div>
                                )}
                                {person?.deleted === true && (
                                    <div
                                        className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-full flex items-center text-sm font-medium">
                                        <ClipboardX className="w-4 h-4 mr-2"/>
                                        {(t("profile.notVerified"))}
                                    </div>
                                )}
                            </div>

                            {/* Profile Stats */}
                            <div className="mt-6 space-y-3 px-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">{t("profile.memberSince")}</span>
                                    <span className="font-medium text-gray-700">
                                        {formatDateToLong(person?.publishedAt)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">{t("profile.jobCount")}</span>
                                    <span className="font-medium text-gray-700">
                                        {person.postCount}
                                    </span>
                                </div>
                            </div>

                            {/* Bio Section */}
                            {person?.bio && (
                                <div className="mt-6 px-4">
                                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                        <p
                                            ref={bioRef}
                                            className={`text-gray-600 text-sm leading-relaxed ${
                                                showFullBio ? "" : "line-clamp-4"
                                            }`}
                                        >
                                            <i>{person?.bio}</i>
                                        </p>
                                        {isClamped && !showFullBio && (
                                            <button
                                                onClick={() => setShowFullBio(true)}
                                                className="mt-2 text-blue-600 text-sm font-medium hover:underline"
                                            >
                                                {t("profile.seeMore")}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Additional Info Sections */}
                            <div className="mt-6 space-y-6">
                                {/* Education */}
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-blue-600 font-semibold">{t("profile.educationTitle")}</h3>
                                        <Link prefetch={false} href="/user/edit/education">
                                            <SquarePen className="w-5 h-5 text-gray-500 hover:text-gray-700"/>
                                        </Link>
                                    </div>
                                    {educations.length > 0 ? (
                                        <div className="space-y-3">
                                            {educations.map((education: Education) => (
                                                <div key={education.id} className="text-sm">
                                                    <p className="font-medium text-gray-800">{education?.schoolName}</p>
                                                    <p className="text-gray-600">{education?.major}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">{t("profile.notProvided")}</p>
                                    )}
                                </div>

                                {/* Work Experience */}
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-blue-600 font-semibold">{t("profile.experienceTitle")}</h3>
                                        <Link prefetch={false} href="/user/edit/experience">
                                            <SquarePen className="w-5 h-5 text-gray-500 hover:text-gray-700"/>
                                        </Link>
                                    </div>
                                    {workExperience.length > 0 ? (
                                        <div className="space-y-3">
                                            {workExperience.map((experience: WorkExperience) => (
                                                <div key={experience.id} className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-800">{t("experience.companyName")}</p>
                                                    <p className="text-sm text-gray-600">{t("experience.position")}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {t("experience.startMonth")} {t("experience.startYear")} -{" "}
                                                        {t("experience.endMonth") || t("experience.present") } {t("experience.endYear") || ""}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">{t("profile.notProvided")}</p>
                                    )}
                                </div>

                                {/* Skills */}
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-blue-600 font-semibold">{t("profile.skillTitle")}</h3>
                                        <Link prefetch={false} href="/user/edit/skills">
                                            <SquarePen className="w-5 h-5 text-gray-500 hover:text-gray-700"/>
                                        </Link>
                                    </div>
                                    {skill.length > 0 ? (
                                        <div className="space-y-3">
                                            {skill.map((skill: Skill) => (
                                                <div key={skill.id} className="flex justify-between items-center">
                                                    <p className="text-sm font-medium text-gray-800">{skill?.skillName}</p>
                                                    <span
                                                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {skill?.levelName}
                          </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">{t("profile.notProvided")}</p>
                                    )}
                                </div>

                                {/* Languages */}
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-blue-600 font-semibold">{t("profile.languageTitle")}</h3>
                                        <Link prefetch={false} href="/user/edit/languages">
                                            <SquarePen className="w-5 h-5 text-gray-500 hover:text-gray-700"/>
                                        </Link>
                                    </div>
                                    {language.length > 0 ? (
                                        <div className="space-y-3">
                                            {language.map((language: LanguageSkill) => (
                                                <div key={language.id} className="flex justify-between items-center">
                                                    <p className="text-sm font-medium text-gray-800">{language?.lang}</p>
                                                    <span
                                                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {language?.levelName}
                          </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">{t("profile.notProvided")}</p>
                                    )}
                                </div>

                                {/* Certifications */}
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-blue-600 font-semibold">{t("profile.certificationTitle")}</h3>
                                        <Link prefetch={false} href="/user/edit/certifications">
                                            <SquarePen className="w-5 h-5 text-gray-500 hover:text-gray-700"/>
                                        </Link>
                                    </div>
                                    {certAndAward.length > 0 ? (
                                        <div className="space-y-3">
                                            {certAndAward.map((cert: Certificate) => (
                                                <div key={cert.id} className="text-sm">
                                                    <p className="font-medium text-gray-800">{cert?.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">{t("profile.notProvided")}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Section */}
                    <section className="lg:col-span-2">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
                            {interpolateDouble(t("profile.workTitle") || "", {
                                username: person?.name,
                            })}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service, index) => (
                                <CategoryCard
                                    data={service}
                                    username={person?.name || ""}
                                    key={index}
                                />
                            ))}
                        </div>

                        {/* Reviews Section */}
                        <div className="mt-8">
                            <div className="border-b border-gray-200 mb-6">
                                <div className="flex space-x-6">
                                    <button
                                        className={`pb-2 text-sm font-medium transition-colors ${
                                            activeTab === "reviews"
                                                ? "text-blue-600 border-b-2 border-blue-600"
                                                : "text-gray-500 hover:text-gray-700"
                                        }`}
                                        onClick={() => setActiveTab("reviews")}
                                    >
                                        {t("profile.reviewTab")} ({t("reviews.length")})
                                    </button>
                                    <button
                                        className={`pb-2 text-sm font-medium transition-colors ${
                                            activeTab === "clients"
                                                ? "text-blue-600 border-b-2 border-blue-600"
                                                : "text-gray-500 hover:text-gray-700"
                                        }`}
                                        onClick={() => setActiveTab("clients")}
                                    >
                                        {t("profile.freelancerReview")} (1)
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {reviews.map((review) => (
                                    <div key={review.id}
                                         className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex items-start">
                                            <Image
                                                src={review.reviewerAvatar || ProfileImage.avatar}
                                                alt={review.reviewerName || "username"}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-full mr-3"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium text-gray-800">{review.reviewerName || "username"}</h4>
                                                        <span
                                                            className="text-sm text-gray-500">{formatDateToLong(review.createdAt)}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="w-5 h-5 text-yellow-400"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                                            />
                                                        </svg>
                                                        <span
                                                            className="ml-1 font-medium text-gray-800">{review.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default CurrentProfileUser;