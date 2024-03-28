"use client";

import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { ConfirmModal } from "@/components/confirm-modal";

interface ActionsProps {
  disabled: boolean;
  courseId: number;
  isPublished: boolean;
};

export const Actions = ({
  disabled,
  courseId,
  isPublished
}: ActionsProps) => {
  const { mutate: update, isPending } = api.courses.update.useMutation({

  })
  const { mutate: deleteAction, isPending: isLoading } = api.courses.delete.useMutation({})

  const onClick = async () => {
    update({
      id: courseId,
      isPublic: isPublished
    })
  }

  const onDelete = async () => {
    deleteAction({
      id: courseId
    })
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading || isPending}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading || isPending}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}
