"use client";
import { useMyUser } from "@/hooks/profile-api/useMyUser";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Edit, Plus, Trash } from "lucide-react";

interface WorkSample {
    id: number;
    title: string;
    sampleUrl: string;
    description: string;
}

export default function WorkSamples() {
    const { t } = useTranslation();
    const { profileState, person } = useMyUser();

    const defaultWorkSamples: WorkSample[] = profileState === "success" ? person?.workSamples ?? [] : [];
    const [workSamples, setWorkSamples] = useState<WorkSample[]>(defaultWorkSamples);
    const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
    const [newSample, setNewSample] = useState({ title: "", sampleUrl: "", description: "" });
    const [editingSample, setEditingSample] = useState<WorkSample | null>(null);
    const samplesPerPage = 2;

    const handleNextSample = () => {
        setCurrentSampleIndex((prev) =>
            prev + samplesPerPage < workSamples.length ? prev + samplesPerPage : prev
        );
    };

    const handlePrevSample = () => {
        setCurrentSampleIndex((prev) => (prev - samplesPerPage >= 0 ? prev - samplesPerPage : 0));
    };

    const handleAddSample = () => {
        if (newSample.title && newSample.sampleUrl && newSample.description) {
            setWorkSamples([
                ...workSamples,
                {
                    id: workSamples.length + 1,
                    title: newSample.title,
                    sampleUrl: newSample.sampleUrl,
                    description: newSample.description,
                },
            ]);
            setNewSample({ title: "", sampleUrl: "", description: "" });
        }
    };

    const handleEditSample = (sample: WorkSample) => {
        setEditingSample(sample);
        setNewSample({ title: sample.title, sampleUrl: sample.sampleUrl, description: sample.description });
    };

    const handleUpdateSample = () => {
        if (editingSample && newSample.title && newSample.sampleUrl && newSample.description) {
            setWorkSamples(
                workSamples.map((sample) =>
                    sample.id === editingSample.id
                        ? {
                            ...sample,
                            title: newSample.title,
                            sampleUrl: newSample.sampleUrl,
                            description: newSample.description,
                        }
                        : sample
                )
            );
            setEditingSample(null);
            setNewSample({ title: "", sampleUrl: "", description: "" });
        }
    };

    const handleDeleteSample = (id: number) => {
        setWorkSamples(workSamples.filter((sample) => sample.id !== id));
    };

    return (
        <div className="border border-border-primary rounded-lg bg-white py-6 mb-8">
            <div className="border-b border-border-primary px-6">
                <h2 className="text-[16px] font-medium mb-2 text-text-primary">
                    {t("profileInfo.sectionWorkSamples")}
                </h2>
                <p className="text-gray-600 mb-6 text-[14px] font-sans">
                    {t("profileInfo.subtitleWorkSamples")}
                </p>
            </div>

            <div className="px-6">
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        {editingSample ? t("profileInfo.editWorkSample") : t("profileInfo.addWorkSample")}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder={t("profileInfo.sampleTitle")}
                            value={newSample.title}
                            onChange={(e) => setNewSample({ ...newSample, title: e.target.value })}
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                            type="text"
                            placeholder={t("profileInfo.sampleUrl")}
                            value={newSample.sampleUrl}
                            onChange={(e) => setNewSample({ ...newSample, sampleUrl: e.target.value })}
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <textarea
                            placeholder={t("profileInfo.sampleDescription")}
                            value={newSample.description}
                            onChange={(e) => setNewSample({ ...newSample, description: e.target.value })}
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary col-span-1 sm:col-span-2"
                            rows={4}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={editingSample ? handleUpdateSample : handleAddSample}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#063a68] transition-colors duration-200 flex items-center"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        {editingSample ? t("profileInfo.updateWorkSample") : t("profileInfo.addWorkSample")}
                    </button>
                    {editingSample && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingSample(null);
                                setNewSample({ title: "", sampleUrl: "", description: "" });
                            }}
                            className="mt-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            {t("profileInfo.cancel")}
                        </button>
                    )}
                </div>
                <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {workSamples.slice(currentSampleIndex, currentSampleIndex + samplesPerPage).map((sample) => (
                            <div
                                key={sample.id}
                                className="p-4 rounded-lg border border-gray-200 transition-transform duration-300 hover:scale-105"
                            >
                                <h4 className="font-medium text-gray-800">{sample.title}</h4>
                                <p className="text-gray-600 text-sm mt-1">{sample.description}</p>
                                <a
                                    href={sample.sampleUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary text-sm hover:underline"
                                >
                                    {t("profileInfo.viewWorkSample")}
                                </a>
                                <div className="flex justify-start gap-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => handleEditSample(sample)}
                                        className="p-1 text-primary hover:text-blue-800"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSample(sample.id)}
                                        className="p-1 text-red-600 hover:text-red-800"
                                    >
                                        <Trash className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {workSamples.length > samplesPerPage && (
                        <>
                            <button
                                type="button"
                                onClick={handlePrevSample}
                                disabled={currentSampleIndex === 0}
                                className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary text-white backdrop-blur-sm transition-all duration-200 ${
                                    currentSampleIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:backdrop-blur-none hover:bg-[#063a68]"
                                }`}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                type="button"
                                onClick={handleNextSample}
                                disabled={currentSampleIndex + samplesPerPage >= workSamples.length}
                                className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary text-white backdrop-blur-sm transition-all duration-200 ${
                                    currentSampleIndex + samplesPerPage >= workSamples.length
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:backdrop-blur-none hover:bg-[#063a68]"
                                }`}
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}