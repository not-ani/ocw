"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Units as Chapter, Lessons, Units } from "@/server/db/schema";
import { Course } from "@/server/db/schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn, extractNotionId, handleError } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import { ChaptersList } from "./lessons-list";
import { api } from "@/trpc/react";

interface ChaptersFormProps {
  initialData: Units & { lessons: Lessons[] };
  unitId: number;
  courseId: number;
};

const formSchema = z.object({
  name: z.string().min(1),
  embedId: z.string().url()
});

//FIX: DOESN'T WORK
export const LessonsForm = ({
  initialData,
  courseId,
  unitId,
}: ChaptersFormProps) => {

  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const { mutate: create, isPending } = api.lessons.create.useMutation({
    onSuccess() {
      toast.success("Created")
      setIsCreating(false)
      router.refresh()
    },
    onError(error) {
      handleError(error)
      router.refresh()
    }
  })

  const { mutate: reorder, isPending: isUpdating } = api.units.reorderLessons.useMutation({
    onSuccess() {
      toast.success("Reordered")
      setIsCreating(false)
      router.refresh()
    },
    onError(error) {
      handleError(error)
      router.refresh()
    }
  })



  const toggleCreating = () => {
    setIsCreating((current) => !current);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    create({
      name: values.name,
      embedId: values.embedId,
      unitId: unitId,
    })
    router.refresh();
  }

  const onReorder = async (updateData: { id: number; position: number }[]) => {
    reorder({
      courseId: courseId,
      unitId: unitId,
      list: updateData
    })
  }

  const onEdit = (id: number) => {
    router.push(`/courses/${courseId}/units/${unitId}/lesson/${id}?edit=true`);
  }

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Unit Lessons
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a Unit
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="embedId"
              render={({ field }) => (
                <FormItem>

                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="The Published Notion Link"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={!isValid || isSubmitting}
              type="submit"
            >
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isPending && (
        <div className={cn(
          "text-sm mt-2",
          !initialData.lessons.length && "text-slate-500 italic"
        )}>
          {!initialData.lessons.length && "No Lessons"}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.lessons || []}
          />
        </div>
      )}
      {!isPending && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the lessons
        </p>
      )}
    </div>
  )
}
