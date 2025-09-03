export type ChatMessage = {
    id: string;
    senderId: number;
    receiverId?: number;
    content: string;
    status: number;
    createdAt: string;
    roomId: string;
    isOwner: boolean;
};

export interface ChatRoom {
    id: string;
    name: string;
    participants: { id: number; name: string }[];
    lastMessage?: {
        content: string;
        timestamp: string;
        senderId: number;
    };
    unreadCount: number;
}

export type Job = {
    id: string;
    userId: string;
    serviceTypeId: string;
    slug: string;
    title: string;
    basePrice: string;
    priceBeforeDiscount: string;
    banType: string | null;
    bannedAt: string | null;
    show: boolean;
    rating: string;
    status: number;
    isHot: boolean;
    isPro: boolean;
    description: string;
    readyToWorkAt: string | null;
    isInstantHire: boolean;
    purchaseCount: number;
    reviewsCount: number;
    lastApprovedAt: string;
    createdAt: string;
    updatedAt: string;
};

export type ChatResponse = {
    roomId: string;
    partnerId: string;
    senderId: string;
    partnerAvatar: string;
    partnerUsername: string;
    partnerDisplayName: string;
    lastMessage: ChatMessage;
    job: Job;
    jobCoverImage: string;
};
