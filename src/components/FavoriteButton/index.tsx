"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { API_ROUTES } from "@/api/endpoints";
import { usePrivateDelete, usePrivateFetchParams, usePrivatePost } from "@/hooks/api-hooks";
import useNotification from "@/hooks/useNotification";

interface FavoriteButtonProps {
  label?: string;
  jobId: string;
}

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

  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          custom={i}
          initial="initial"
          animate="animate"
          variants={heartVariants}
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
  const { success_message } = useNotification();
  const { data: checkFavorite } = usePrivateFetchParams<boolean>(
    `${API_ROUTES.job.check_is_favorite_job}/${jobId}`
  );

  const { trigger: sendFavorite, isMutating: isAddMutating } = usePrivatePost(
    API_ROUTES.job.update_favorite_job
  );

  const { trigger: deleteFavorite, isMutating: isDeleteMutating } =
    usePrivateDelete(API_ROUTES.job.delete_favorite_job);

  const isMutating = isAddMutating || isDeleteMutating;

  useEffect(() => {
    if (checkFavorite !== undefined) {
      setIsFavorited(checkFavorite);
    }
  }, [checkFavorite]);

  const handleFavoriteClick = async () => {
    if (isMutating) return;

    const willFavorite = !isFavorited;

    try {
      if (willFavorite) {
        await sendFavorite({ job_id: jobId });
        setIsFavorited(true);
        setShowBurst(true);
        setTimeout(() => setShowBurst(false), 600);
        success_message("job", "update_favorite");
      } else {
        await deleteFavorite({ job_id: jobId });
        setIsFavorited(false);
        success_message("job", "delete_favorite");
      }
    } catch (err) {
      console.error("Toggle favorite failed", err);
    }
  };

  return (
    <div
      className={`select-none relative flex flex-row items-center justify-center min-w-[34px] border-r-1 border-border_primary p-2 cursor-pointer ${
        isMutating ? "opacity-60 cursor-not-allowed" : ""
      }`}
      onClick={handleFavoriteClick}
    >
      <FontAwesomeIcon
        icon={isFavorited ? fasHeart : farHeart}
        className={`transition-all duration-300 ${
          isFavorited ? "text-red-500 scale-110" : "text-text_secondary"
        }`}
      />
      <p className="ml-2 text-center cursor-pointer">{label}</p>
      {showBurst && <HeartBurst />}
    </div>
  );
};

export default FavoriteButton;
