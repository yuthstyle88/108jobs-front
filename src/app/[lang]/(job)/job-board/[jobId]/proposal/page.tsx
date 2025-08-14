"use client";
import {Button} from "@/components/ui/Button";
import {ProfileImage} from "@/constants/images";
import {zodResolver} from "@hookform/resolvers/zod";
import {AlertTriangle, ArrowLeft, Info, Paperclip} from "lucide-react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {useTranslation} from "react-i18next";

const createJobApplicationSchema = (t: (key: string, options?: any) => string) =>
    z.object({
        whyHireYou: z.string().min(100, t("jobApplication.whyHireYou.required")),
        portfolioUrl: z
            .string()
            .url(t("jobApplication.portfolioUrl.required"))
            .optional()
            .or(z.literal("")),
        portfolioFiles: z.any().optional(),
        price: z
            .coerce
            .number()
            .min(1, t("jobApplication.price.required"))
            .refine((val) => !isNaN(val) && val !== null, {
                message: t("jobApplication.price.required"),
            }),
        timeline: z
            .coerce
            .number()
            .min(1, t("jobApplication.timeline.required"))
            .refine((val) => !isNaN(val) && val !== null, {
                message: t("jobApplication.timeline.required"),
            }),
    });

type JobApplicationFormData = z.infer<ReturnType<typeof createJobApplicationSchema>>;

const JobApplication = () => {
    const {t} = useTranslation();
    const route = useRouter();

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<JobApplicationFormData>({
        resolver: zodResolver(createJobApplicationSchema(t)),
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const onSubmit = (data: JobApplicationFormData) => {
        const formData = new FormData();
        formData.append("whyHireYou", data.whyHireYou);
        formData.append("portfolioUrl", data.portfolioUrl || "");
        formData.append("price", data.price.toString());
        formData.append("timeline", data.timeline.toString());

        if (selectedFiles.length > 0) {
            selectedFiles.forEach((file) => {
                formData.append("portfolioFiles", file);
            });
        }

        route.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
            <div className="max-w-[1280px] w-[88vw] mx-auto px-6 py-8">
                <div className="flex items-center gap-6 mb-8">
                    <button onClick={() => route.back()}
                            className="text-gray-700 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="w-6 h-6"/>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[441px_1fr] gap-10">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h1 className="text-3xl text-gray-900 font-bold mb-4">
                            {t("jobApplication.pageTitle")}
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {t("jobApplication.pageSubheading")}
                        </p>
                        <div className="w-full flex justify-center items-center">
                            <Image
                                src={ProfileImage.proposal}
                                alt="proposal"
                                width={300}
                                height={200}
                                className="rounded-lg object-cover"
                            />
                        </div>
                    </div>

                    <div>
                        <div
                            className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3 animate-pulse">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5"/>
                            <p className="text-sm text-yellow-800">
                                {t("jobApplication.warningMessage")}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <div
                                className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-600 mt-0.5"/>
                                <p className="text-sm text-blue-800">
                                    {t("jobApplication.publicInfoMessage")}
                                </p>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t("jobApplication.whyHireYou.label")}
                                    </label>
                                    <textarea
                                        {...register("whyHireYou")}
                                        placeholder={t("jobApplication.whyHireYou.placeholder")}
                                        className="w-full min-h-[150px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                                    />
                                    {errors.whyHireYou ? (
                                        <p className="text-red-500 text-sm mt-1">{errors.whyHireYou.message}</p>
                                    ) : (
                                        <div className="text-xs text-gray-500 text-right mt-1">
                                            {t("jobApplication.whyHireYou.characterCount", {count: watch("whyHireYou")?.length || 0})}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t("jobApplication.portfolioUrl.label")}
                                    </label>
                                    <input
                                        type="url"
                                        {...register("portfolioUrl")}
                                        placeholder={t("jobApplication.portfolioUrl.placeholder")}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                                    />
                                    {errors.portfolioUrl && (
                                        <p className="text-red-500 text-sm mt-1">{errors.portfolioUrl.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t("jobApplication.portfolioFiles.label")}
                                    </label>
                                    <p className="text-xs text-gray-500 mb-2">{t("jobApplication.portfolioFiles.subtext")}</p>
                                    <input
                                        type="file"
                                        multiple
                                        hidden
                                        id="portfolioFiles"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="portfolioFiles">
                                        <Button variant="outline" type="button"
                                                className="w-full text-gray-900 border-blue-500 hover:bg-blue-50">
                                            <Paperclip className="w-5 h-5 mr-2 text-blue-600"/>
                                            {t("jobApplication.portfolioFiles.button")}
                                        </Button>
                                    </label>
                                    {selectedFiles.length > 0 && (
                                        <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                                            {selectedFiles.map((file, index) => (
                                                <li key={index} className="text-blue-600">{file.name}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t("jobApplication.price.label")}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                {...register("price", {valueAsNumber: true, required: true})}
                                                placeholder={t("jobApplication.price.placeholder")}
                                                className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                                                defaultValue={0}
                                            />
                                            <span
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                {t("jobApplication.price.currency")}
                                            </span>
                                        </div>
                                        {errors.price && (
                                            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t("jobApplication.timeline.label")}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                {...register("timeline", {valueAsNumber: true})}
                                                placeholder={t("jobApplication.timeline.placeholder")}
                                                className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                                                defaultValue={0}
                                            />
                                            <span
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                {t("jobApplication.timeline.unit")}
                                            </span>
                                        </div>
                                        {errors.timeline && (
                                            <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => route.back()}
                                        className="text-gray-900 border-gray-300 hover:bg-gray-50"
                                    >
                                        {t("jobApplication.buttons.cancel")}
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                                    >
                                        {t("jobApplication.buttons.submit")}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobApplication;