"use client";

import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/confirm-modal";
import { api } from "@/trpc/react";
import { handleError } from "@/lib/utils";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: number;
  lessonId: number;
  isPublished: boolean;
};

export const LessonsAction = ({
  disabled,
  courseId,
  lessonId: chapterId,
  isPublished
}: ChapterActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: update } = api.lessons.update.useMutation({
    onSuccess() {
      toast.success("Updated Lesson Visiblity")
      router.refresh()
    },

    onError(error) {
      handleError(error)
      router.refresh()
    },
  })

  const { mutate: deleteUnit } = api.lessons.delete.useMutation({
    onSuccess() {
      toast.success("Deleted Lessons")
    },

    onError(error) {
      handleError(error)
    },
  })

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        update({
          id: chapterId,
          isPublic: false
        })
      } else {
        update({
          id: chapterId,
          isPublic: true
        })
      }
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true);

      deleteUnit({
        id: chapterId
      })
      router.refresh();
      router.push(`/dashboard/courses/${courseId}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}
