export type FriendStatus = 'none' | 'pending' | 'accepted' | 'rejected';

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt?: Date;
}

export interface Friendship {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: Date;
}

export interface FriendListItem {
  id: string;
  username: string;
  imageURL: string;
  status?: FriendStatus;
}