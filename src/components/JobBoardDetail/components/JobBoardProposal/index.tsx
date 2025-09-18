"use client";

import { ProfileImage } from "@/constants/images";
import { Pagination } from "@/components/Pagination";
import { useHttpGet } from "@/hooks/useHttpGet";
import type { CommentView, PostId } from "lemmy-js-client";
import Image from "next/image";
import React, { useState } from "react";

type JobBoardProposalProps = {
    postId?: PostId;
};

const JobBoardProposal = ({ postId }: JobBoardProposalProps) => {
    const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);

    const { data: proposals, pagination, isMutating: isLoading } = useHttpGet("getComments", {
        pageCursor: currentCursor,
        ...(postId ? { postId } : {}),
    });

    const handlePageChange = (pageCursor: string | null) => {
        setCurrentCursor(pageCursor || undefined);
    };

    return (
        <main className="mt-10 text-[18px] text-text-secondary flex flex-col gap-6 max-w-4xl mx-auto">
            {isLoading && (
                <div className="text-center text-base font-medium animate-pulse">
                    Loading proposals...
                </div>
            )}

            {!isLoading && (!proposals?.comments || proposals.comments.length === 0) && (
                <div className="text-center text-lg font-medium text-text-secondary bg-gray-50 py-6 rounded-lg">
                    No freelancer proposals yet
                </div>
            )}

            {proposals?.comments && proposals.comments.length > 0 && (
                <div className="space-y-6">
                    {proposals.comments.map((cv: CommentView) => (
                        <div
                            key={cv.comment.id}
                            className="p-6 rounded-lg border border-border-secondary bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <section className="grid grid-cols-[3fr_1fr] gap-6 md:gap-8">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row items-center gap-3">
                                        <Image
                                            src={cv.creator?.avatar || ProfileImage.avatar}
                                            alt={cv.creator?.name || "avatar"}
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 object-cover rounded-full border border-border-secondary"
                                        />
                                        <div>
                                            <p className="text-lg font-semibold text-text-primary font-sans">
                                                {cv.creator?.displayName || cv.creator?.name || "Unknown"}
                                            </p>
                                            <p className="text-sm text-text-secondary font-sans">
                                                @{cv.creator?.name || "unknown"}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-base font-normal text-text-primary font-sans break-words whitespace-pre-wrap leading-relaxed">
                                        {cv.comment.content}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col items-end gap-1">
                                        <p className="text-sm font-semibold text-text-primary font-sans">
                                            Submitted
                                        </p>
                                        <p className="text-sm text-text-secondary font-sans">
                                            {new Date(cv.comment.publishedAt).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                                hour12: true,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ))}
                </div>
            )}

            {pagination && (
                <div className="mt-8 flex justify-center">
                    <Pagination
                        prevPage={pagination.prevPage}
                        nextPage={pagination.nextPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </main>
    );
};

export default JobBoardProposal;