"use client";

import Modal from "@/src/components/Modal";
import { useDisclosure } from "@/src/hooks/useDisclosure";
import { memo } from "react";

type Props = {
  description: string;
};

const ProblemDescription = ({ description }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <button className="mt-4 line-clamp-2 relative" onClick={onOpen}>
        <p className="text-xs lg:text-sm">{description}</p>
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-mj-mat z-10" />
      </button>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} height="500px">
          <div>
            <p className="text-xl">作者のコメント</p>

            <div className="mt-4">
              <p className="whitespace-pre-line md:text-base text-sm">
                {description}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default memo(ProblemDescription);
