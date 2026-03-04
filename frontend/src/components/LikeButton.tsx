"use client";

import PopButton from "@/src/components/PopButton";
import { Spinner } from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

type LikeButtonType = {
  isLiked: boolean;
  likeCount: number;
  isLoading?: boolean;
  handleClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export default function LikeButton({
  isLiked,
  likeCount,
  isLoading = false,
  handleClick,
  type = "button",
}: LikeButtonType) {
  const Icon = () => {
    return isLiked ? (
      <FaHeart color="#f765d6" size={24} />
    ) : (
      <FaRegHeart color="#333" size={24} />
    );
  };

  return (
    <PopButton
      type={type}
      onClick={handleClick}
      defaultClassName="w-10"
      disabled={isLoading}
    >
      <div className="flex items-center gap-1">
        {isLoading ? (
          <div className="w-6 h-6 border-4 border-t-4 border-t-transparent border-pink-500 rounded-full animate-spin"></div>
        ) : (
          <Icon />
        )}
        <div className="font-sans font-semibold text-lg">{likeCount}</div>
      </div>
    </PopButton>
  );
}
