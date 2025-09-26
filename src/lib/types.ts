

export interface Withdrawal {
  username: string;
  amount: number;
  fee: number;
  totalDeducted: number;
  redeemCode: string;
  timestamp: number;
  status: 'pending' | 'cleared';
  userId: string;
  withdrawalId: string;
}

export interface CopyrightStrike {
    strikeId: string;
    claimantId: string;
    claimantName: string;
    receivedAt: number;
    expiresAt: number;
    status: 'active' | 'expired' | 'retracted';
    postId: string;
}

export interface CopyrightMessage {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: number;
}

export interface CopyrightClaim {
    id: string;
    claimantId: string;
    claimantName: string;
    claimantSignature: string;
    accusedUserId: string;
    accusedUsername: string;
    postId: string;
    action: 'delete_only' | 'delete_and_strike';
    originalContentUrl: string;
    date: number;
    status: 'pending' | 'approved' | 'rejected' | 'retracted';
    messages?: { [key: string]: CopyrightMessage };
}


export interface User {
  id: string;
  name: string;
  avatar: string;
  mainAccountUsername: string;
  isMonetized?: boolean;
  totalViews?: number;
  totalLikes?: number;
  withdrawals?: { [key: string]: Withdrawal };
  dailyPostCount?: {
      count: number;
      date: string;
  };
  copyrightStrikes?: { [key: string]: CopyrightStrike };
  submittedClaims?: { [key: string]: CopyrightClaim };
}
export interface Comment {
    id: string;
    user: User;
    text: string;
    createdAt: number;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  image?: string;
  video?: string;
  imageHint?: string;
  likes: { [key: string]: boolean };
  comments: { [key: string]: Comment };
  views: number;
  createdAt: number;
  viewStage?: 'A' | 'B' | 'C' | 'D' | 'E';
  targetViews?: number;
  stageAssignedAt?: number;
  targetCompletedIn?: number; // hours
  finalViewBoostApplied?: boolean;
  isCopyrighted?: boolean;
}
