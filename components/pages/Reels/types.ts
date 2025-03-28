export interface Reel {
  id: string;
  videoUrl: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  user: {
    name: string;
    avatar: string;
  };
}

export interface ReelItemProps {
  item: Reel;
  index: number;
  activeReelIndex: number;
}

export interface ReelActions {
  onLike?: (reelId: string) => void;
  onComment?: (reelId: string) => void;
  onShare?: (reelId: string) => void;
  onUserPress?: (userId: string) => void;
}
