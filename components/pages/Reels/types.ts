export interface Reel {
  item: {
    userId: string;
    reels: {
      id: string;
      videoUrl: string;
      description: string;
    }[];

    user: {
      name: string;
      avatar: string;
    };
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
