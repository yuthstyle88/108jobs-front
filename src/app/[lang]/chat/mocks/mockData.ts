import { WorkFlowStatus, Project } from "@/types/workflow"; 

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: "freelancer" | "employer";
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: "text" | "system" | "quote" | "warning";
  metadata?: {
    quoteId?: string;
    amount?: number;
    currency?: string;
  };
}

export interface ChatConversation {
  id: string;
  participants: User[];
  project: Project;
  messages: ChatMessage[];
  lastMessage: ChatMessage;
  unreadCount: number;
  updatedAt: string;
}


export const mockUsers: User[] = [
  {
    id: "1",
    name: "Khoi Tran",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    role: "freelancer",
    isOnline: true,
  },
  {
    id: "2", 
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    role: "employer",
    isOnline: true,
  },
  {
    id: "3",
    name: "Nguyen Manh",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", 
    role: "freelancer",
    isOnline: false,
  },
  {
    id: "4",
    name: "Emily Chen",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    role: "employer", 
    isOnline: true,
  }
];

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    title: "DevOps Engineer for AWS, Azure, GCP",
    description: "Need experienced DevOps engineer to set up CI/CD pipeline and infrastructure",
    currentStatus: WorkFlowStatus.QuotationPending,
    quote: undefined,
    revisions: [],
    createdAt: "2025-08-02T10:00:00Z",
    updatedAt: "2025-08-05T15:30:00Z"
  },
  {
    id: "proj-2", 
    title: "Full Stack React/Node.js Application",
    description: "Build a modern web application with React frontend and Node.js backend",
    currentStatus: WorkFlowStatus.OrderApproved,
    quote: {
      id: "quote-2",
      amount: 50000,
      currency: "đ",
      dueDate: "15/08/2025", 
      description: "Full stack development",
      status: "approved"
    },
    revisions: [],
    createdAt: "2025-07-28T09:00:00Z",
    updatedAt: "2025-08-05T12:15:00Z"
  },
  {
    id: "proj-3",
    title: "Mobile App Development",
    description: "React Native mobile app for e-commerce platform",
    currentStatus: WorkFlowStatus.InProgress,
    quote: {
      id: "quote-3",
      amount: 75000,
      currency: "đ",
      dueDate: "20/08/2025",
      description: "Mobile app development with React Native",
      status: "approved"
    },
    revisions: [],
    createdAt: "2025-08-01T09:00:00Z",
    updatedAt: "2025-08-06T10:00:00Z"
  },
  {
    id: "proj-4",
    title: "Website Redesign",
    description: "Complete website redesign with modern UI/UX",
    currentStatus: WorkFlowStatus.PendingEmployerReview,
    quote: {
      id: "quote-4",
      amount: 30000,
      currency: "đ",
      dueDate: "25/08/2025",
      description: "Website redesign and optimization",
      status: "approved"
    },
    revisions: [],
    createdAt: "2025-07-30T09:00:00Z",
    updatedAt: "2025-08-07T14:00:00Z"
  },
  {
    id: "proj-5",
    title: "AI Chatbot Integration",
    description: "Integrate AI chatbot into existing platform",
    currentStatus: WorkFlowStatus.Completed,
    quote: {
      id: "quote-5",
      amount: 40000,
      currency: "đ",
      dueDate: "10/08/2025",
      description: "AI chatbot development and integration",
      status: "approved"
    },
    revisions: [
      {
        id: "rev-2",
        reason: "Please improve the chatbot response accuracy",
        requestedBy: "employer",
        createdAt: "2025-08-04T10:00:00Z"
      }
    ],
    createdAt: "2025-07-25T09:00:00Z",
    updatedAt: "2025-08-08T16:00:00Z"
  }
];

const generateMessages = (conversationId: string, project: Project): ChatMessage[] => {
  const messages: ChatMessage[] = [];
  
  if (conversationId === "conv-1") {
    // QuotationPending project conversation
    messages.push(
      {
        id: "msg-1",
        senderId: "2",
        content: "Hi Khoi! I saw your proposal for the DevOps engineer position. Your experience looks great!",
        timestamp: "2025-08-02T10:15:00Z",
        type: "text"
      },
      {
        id: "msg-2", 
        senderId: "1",
        content: "Thank you Sarah! I'm excited about this project. I have 5+ years experience with AWS, Azure, and GCP. I need to create a quotation for you first.",
        timestamp: "2025-08-02T10:18:00Z",
        type: "text"
      }
    );
  } else if (conversationId === "conv-2") {
    // OrderApproved project conversation  
    messages.push(
      {
        id: "msg-10",
        senderId: "4",
        content: "Hello! I need a full stack developer for my e-commerce project. Can you help?",
        timestamp: "2025-07-28T09:30:00Z",
        type: "text"
      },
      {
        id: "msg-11",
        senderId: "3", 
        content: "Hi Emily! Absolutely, I specialize in React and Node.js development.",
        timestamp: "2025-07-28T10:00:00Z",
        type: "text"
      },
      {
        id: "msg-12",
        senderId: "system",
        content: "Quote has been approved and payment is complete. Work can now begin.",
        timestamp: "2025-07-29T11:00:00Z",
        type: "system"
      }
    );
  } else if (conversationId === "conv-3") {
    // InProgress project conversation
    messages.push(
      {
        id: "msg-20",
        senderId: "2",
        content: "Great! I've approved your quotation for the mobile app project. You can start working now.",
        timestamp: "2025-08-01T10:00:00Z",
        type: "text"
      },
      {
        id: "msg-21",
        senderId: "1",
        content: "Perfect! I've started working on the React Native app. Setting up the project structure now.",
        timestamp: "2025-08-01T10:30:00Z",
        type: "text"
      },
      {
        id: "msg-22",
        senderId: "system",
        content: "Work is currently in progress. Freelancer is working on the project.",
        timestamp: "2025-08-06T10:00:00Z",
        type: "system"
      }
    );
  } else if (conversationId === "conv-4") {
    // PendingEmployerReview project conversation
    messages.push(
      {
        id: "msg-30",
        senderId: "3",
        content: "Hi! I've completed the website redesign. Please review the deliverables.",
        timestamp: "2025-08-07T13:00:00Z",
        type: "text"
      },
      {
        id: "msg-31",
        senderId: "system",
        content: "Work has been submitted for review. Employer can now review and approve or request revisions.",
        timestamp: "2025-08-07T14:00:00Z",
        type: "system"
      }
    );
  } else if (conversationId === "conv-5") {
    // Completed project conversation
    messages.push(
      {
        id: "msg-40",
        senderId: "4",
        content: "I've reviewed the chatbot integration. Please improve the response accuracy.",
        timestamp: "2025-08-04T09:00:00Z",
        type: "text"
      },
      {
        id: "msg-41",
        senderId: "system",
        content: "Revision requested: Please improve the chatbot response accuracy",
        timestamp: "2025-08-04T10:00:00Z",
        type: "system"
      },
      {
        id: "msg-42",
        senderId: "1",
        content: "Done! I've improved the AI model accuracy and response quality. Please review again.",
        timestamp: "2025-08-08T15:00:00Z",
        type: "text"
      },
      {
        id: "msg-43",
        senderId: "system",
        content: "Work has been approved and completed. Payment has been released.",
        timestamp: "2025-08-08T16:00:00Z",
        type: "system"
      }
    );
  }
  
  return messages;
};

export const mockConversations: ChatConversation[] = [
  {
    id: "conv-1",
    participants: [mockUsers[0], mockUsers[1]], // Khoi & Sarah
    project: mockProjects[0], // QuotationPending
    messages: generateMessages("conv-1", mockProjects[0]),
    lastMessage: {
      id: "msg-2",
      senderId: "1", 
      content: "Thank you Sarah! I'm excited about this project. I have 5+ years experience with AWS, Azure, and GCP. I need to create a quotation for you first.",
      timestamp: "2025-08-02T10:18:00Z",
      type: "text"
    },
    unreadCount: 0,
    updatedAt: "2025-08-02T10:18:00Z"
  },
  {
    id: "conv-2",
    participants: [mockUsers[2], mockUsers[3]], // Nguyen & Emily
    project: mockProjects[1], // OrderApproved
    messages: generateMessages("conv-2", mockProjects[1]),
    lastMessage: {
      id: "msg-12",
      senderId: "system",
      content: "Quote has been approved and payment is complete. Work can now begin.",
      timestamp: "2025-07-29T11:00:00Z", 
      type: "system"
    },
    unreadCount: 1,
    updatedAt: "2025-07-29T11:00:00Z"
  },
  {
    id: "conv-3",
    participants: [mockUsers[0], mockUsers[1]], // Khoi & Sarah
    project: mockProjects[2], // InProgress
    messages: generateMessages("conv-3", mockProjects[2]),
    lastMessage: {
      id: "msg-22",
      senderId: "system",
      content: "Work is currently in progress. Freelancer is working on the project.",
      timestamp: "2025-08-06T10:00:00Z",
      type: "system"
    },
    unreadCount: 0,
    updatedAt: "2025-08-06T10:00:00Z"
  },
  {
    id: "conv-4",
    participants: [mockUsers[2], mockUsers[3]], // Nguyen & Emily
    project: mockProjects[3], // PendingEmployerReview
    messages: generateMessages("conv-4", mockProjects[3]),
    lastMessage: {
      id: "msg-31",
      senderId: "system",
      content: "Work has been submitted for review. Employer can now review and approve or request revisions.",
      timestamp: "2025-08-07T14:00:00Z",
      type: "system"
    },
    unreadCount: 1,
    updatedAt: "2025-08-07T14:00:00Z"
  },
  {
    id: "conv-5",
    participants: [mockUsers[0], mockUsers[3]], // Khoi & Emily
    project: mockProjects[4], // Completed
    messages: generateMessages("conv-5", mockProjects[4]),
    lastMessage: {
      id: "msg-43",
      senderId: "system",
      content: "Work has been approved and completed. Payment has been released.",
      timestamp: "2025-08-08T16:00:00Z",
      type: "system"
    },
    unreadCount: 0,
    updatedAt: "2025-08-08T16:00:00Z"
  }
];