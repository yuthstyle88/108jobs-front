"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { API_ROUTES } from "@/api/endpoints";
import { Variants } from 'framer-motion';

import {
  usePrivateDelete,
  usePrivateFetchParams,
  usePrivatePost,
} from "@/hooks/api-hooks";
import useNotification from "@/hooks/useNotification";

interface FavoriteButtonProps {
  label?: string;
  jobId: string;
}

type FavoriteResponse = {
  isFavorite: boolean;
  jobId: string;
  success: boolean;
};

const HeartBurst = () => {
  const heartVariants = {
    initial: { opacity: 1, scale: 1, y: 0 },
    animate: (i: number) => ({
      opacity: 0,
      scale: 2,
      y: -30 - i * 5,
      x: (i - 1) * 20,
      transition: { duration: 0.6, ease: "easeOut" },
    }),
  };
  const createHeartVariants = (i: number): Variants => ({
    initial: {
      opacity: 0,
      scale: 0,
      y: 0
    },
    animate: {
      opacity: 1,
      scale: [1, 1.2, 1], // array สำหรับ keyframes
      y: -10,
      x: i * 10,
      transition: {
        duration: 0.6,
        ease: "easeInOut" // ใช้ string preset แทน array
      }
    }
  });


  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          custom={i}
          initial="initial"
          animate="animate"
          variants={createHeartVariants(i)}
          className="absolute text-red-500 text-sm"
          style={{
            top: -10,
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        >
          ❤️
        </motion.div>
      ))}
    </>
  );
};

const FavoriteButton = ({ label, jobId }: FavoriteButtonProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const { successMessage } = useNotification();
  const { data: checkFavorite } = usePrivateFetchParams<FavoriteResponse>(
    `${API_ROUTES.job.checkIsFavoriteJob}/${jobId}`
  );

  const { trigger: sendFavorite, isMutating: isAddMutating } = usePrivatePost(
    API_ROUTES.job.updateFavoriteJob
  );

  const { trigger: deleteFavorite, isMutating: isDeleteMutating } =
    usePrivateDelete(API_ROUTES.job.deleteFavoriteJob);

  const isMutating = isAddMutating || isDeleteMutating;

  useEffect(() => {
    if (checkFavorite !== undefined) {
      setIsFavorited(checkFavorite.isFavorite);
    }
  }, [checkFavorite]);

  const handleFavoriteClick = async () => {
    if (isMutating) return;

    const willFavorite = !isFavorited;

    try {
      if (willFavorite) {
        await sendFavorite({ jobId: jobId });
        setIsFavorited(true);
        setShowBurst(true);
        setTimeout(() => setShowBurst(false), 600);
        successMessage("job", "updateFavorite");
      } else {
        await deleteFavorite({ jobId: jobId });
        setIsFavorited(false);
        successMessage("job", "deleteFavorite");
      }
    } catch (err) {
      console.error("Toggle favorite failed", err);
    }
  };

  return (
    <div
      className={`select-none relative flex flex-row items-center justify-center min-w-[34px] border-r-1 border-borderPrimary p-2 cursor-pointer ${
        isMutating ? "opacity-60 cursor-not-allowed" : ""
      }`}
      onClick={handleFavoriteClick}
    >
      <FontAwesomeIcon
        icon={isFavorited ? fasHeart : farHeart}
        className={`transition-all duration-300 ${
          isFavorited ? "text-red-500 scale-110" : "text-text-secondary"
        }`}
      />
      <p className="ml-2 text-center cursor-pointer">{label}</p>
      {showBurst && <HeartBurst />}
    </div>
  );
};

export default FavoriteButton;
