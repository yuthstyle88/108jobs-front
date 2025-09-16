"use client";

import {useMemo, useState} from "react";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {useHttpGet} from "@/hooks/useHttpGet";
import JobBoardTab from "../_components/JobBoardTab";
import {Pagination} from "@/components/Pagination";
import {formatDateTime} from "@/utils";
import Image from "next/image";
import Link from "next/link";
import {ProfileImage} from "@/constants/images";
import Modal from "@/components/ui/Modal";
import { HttpService } from "@/services/HttpService";
import { useMyUser } from "@/hooks/profile-api/useMyUser";
import { dmRoomId } from "@/utils/helpers";
import {Ellipsis, Eye, MessageCircleMore, X} from "lucide-react";

const OffersPage = () => {
  const route = useRouter();
  const params = useParams();
  const currentLang = (params?.lang as string) || 'th';
  const searchParams = useSearchParams();
  const { person: currentUser } = useMyUser();
  const postIdParam = searchParams.get("postId");
  const postId = useMemo(() => (postIdParam ? Number(postIdParam) : undefined), [postIdParam]);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);
  const [selectedProposal, setSelectedProposal] = useState<any | null>(null);
  const [startingChatFor, setStartingChatFor] = useState<number | null>(null);

  const { data: proposals, pagination, isMutating: isLoading } = useHttpGet("getComments", {
    pageCursor: currentCursor,
    ...(postId ? { postId } : {}),
  });

  const handlePageChange = (pageCursor: string | null) => {
    setCurrentCursor(pageCursor || undefined);
  };

  const handleStartChat = async (proposal: any) => {
    const partnerPersonId = proposal?.creator?.id;
    const currentUserId = currentUser?.id;
    if (!partnerPersonId || !currentUserId) return;
    if (partnerPersonId === currentUserId) return;

    const roomId = dmRoomId(currentUserId, partnerPersonId);
    try {
      setStartingChatFor(partnerPersonId);
      try {
        await HttpService.client.createChatRoom({
          partnerPersonId,
          roomId,
          ...(postId ? { postId } : {}),
        });
      } catch (e) {
        // If room already exists or API fails, proceed to navigate anyway
      }
      route.push(`/${currentLang}/chat/message/${roomId}`);
    } finally {
      setStartingChatFor(null);
    }
  };

  return (
    <div className="bg-[#F6F9FE] min-h-screen">
      <div className="max-w-[1280px] mx-auto py-8 px-4 md:px-6 lg:px-8 rounded-lg shadow-sm">
        <div className="border-1 border-border-primary bg-white p-4 rounded-lg">
          <div className="border-b mb-6">
            <JobBoardTab />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl text-primary font-semibold">Proposals</h1>
          </div>
          <div className="overflow-x-auto border-1 border-border-primary rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Proposer</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Content</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {proposals?.comments && proposals.comments.length > 0 ? (
                  proposals.comments.map((p: any) => (
                    <tr key={p.comment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {p.creator?.name ? (
                          <Link href={`/${currentLang}/profile/${p.creator.name}`} aria-label={`View ${p.creator.name} profile`} className="flex items-center group">
                            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                              {p.creator?.avatar ? (
                                <Image src={p.creator.avatar} alt={p.creator.name || "avatar"} width={40} height={40} className="h-10 w-10 object-cover" />
                              ) : (
                                <Image src={ProfileImage.jobBoard} alt="avatar" width={40} height={40} className="h-10 w-10 object-cover" />
                              )}
                            </div>
                            <div className="flex flex-col cursor-pointer">
                              <span className="font-medium text-gray-900 group-hover:underline">{p.creator?.name || p.creator?.displayName || "Unknown"}</span>
                              {p.creator?.name && (<span className="text-xs text-gray-500">@{p.creator.name}</span>)}
                            </div>
                          </Link>
                        ) : (
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                              {p.creator?.avatar ? (
                                <Image src={p.creator.avatar} alt={p.creator.name || "avatar"} width={40} height={40} className="h-10 w-10 object-cover" />
                              ) : (
                                <Image src={ProfileImage.jobBoard} alt="avatar" width={40} height={40} className="h-10 w-10 object-cover" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">{p.creator?.name || p.creator?.displayName || "Unknown"}</span>
                              {p.creator?.name && (<span className="text-xs text-gray-500">@{p.creator.name}</span>)}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-[420px]">
                        <div className="line-clamp-2 whitespace-pre-wrap">{p.comment.content}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDateTime(p.comment.publishedAt, "datetime")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                        <button
                          className="text-gray-700 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-50"
                          onClick={() => setSelectedProposal(p)}
                        >
                            <Eye />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-800 px-3 py-1 rounded-md hover:bg-green-50 disabled:opacity-60"
                          disabled={startingChatFor === (p.creator?.id ?? null)}
                          onClick={() => handleStartChat(p)}
                        >
                          {startingChatFor === (p.creator?.id ?? null) ? <Ellipsis /> : <MessageCircleMore />}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      {isLoading ? <Ellipsis /> : "No proposals found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {pagination && (
            <div className="mt-6">
              <Pagination prevPage={pagination.prevPage} nextPage={pagination.nextPage} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
        <div className="mt-12 h-[148px] bg-[#D0E1FB] rounded-lg overflow-hidden flex justify-center items-center">
          <Image src={ProfileImage.jobBoard} alt="Job Board" />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedProposal && (
        <Modal isOpen={!!selectedProposal} onClose={() => setSelectedProposal(null)} title="Proposal Details" closeOnOutsideClick>
          <div className="space-y-4">
            {selectedProposal.creator?.name ? (
              <Link href={`/${currentLang}/profile/${selectedProposal.creator.name}`} aria-label={`View ${selectedProposal.creator.name} profile`} className="flex items-center group">
                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-3">
                  {selectedProposal.creator?.avatar ? (
                    <Image src={selectedProposal.creator.avatar} alt={selectedProposal.creator.name || "avatar"} width={48} height={48} className="h-12 w-12 object-cover" />
                  ) : (
                    <Image src={ProfileImage.jobBoard} alt="avatar" width={48} height={48} className="h-12 w-12 object-cover" />
                  )}
                </div>
                <div className="cursor-pointer">
                  <div className="font-medium text-gray-900 group-hover:underline">{selectedProposal.creator?.name || selectedProposal.creator?.displayName || "Unknown"}</div>
                  <div className="text-xs text-gray-500">Submitted {formatDateTime(selectedProposal.comment.publishedAt, "datetime")}</div>
                </div>
              </Link>
            ) : (
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-3">
                  {selectedProposal.creator?.avatar ? (
                    <Image src={selectedProposal.creator.avatar} alt={selectedProposal.creator.name || "avatar"} width={48} height={48} className="h-12 w-12 object-cover" />
                  ) : (
                    <Image src={ProfileImage.jobBoard} alt="avatar" width={48} height={48} className="h-12 w-12 object-cover" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{selectedProposal.creator?.name || selectedProposal.creator?.displayName || "Unknown"}</div>
                  <div className="text-xs text-gray-500">Submitted {formatDateTime(selectedProposal.comment.publishedAt, "datetime")}</div>
                </div>
              </div>
            )}
            <div className="p-3 bg-gray-50 rounded whitespace-pre-wrap text-gray-800">
              {selectedProposal.comment.content}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100"
                onClick={() => setSelectedProposal(null)}
              >
                  <X />
              </button>
              <button
                className="px-4 py-2 text-green-600 hover:text-green-800 rounded-md hover:bg-green-50 disabled:opacity-60"
                disabled={startingChatFor === (selectedProposal.creator?.id ?? null)}
                onClick={() => handleStartChat(selectedProposal)}
              >
                {startingChatFor === (selectedProposal.creator?.id ?? null) ? <Ellipsis /> : <MessageCircleMore />}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OffersPage;
