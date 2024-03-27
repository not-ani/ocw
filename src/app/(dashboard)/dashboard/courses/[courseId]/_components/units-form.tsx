"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type Units as Chapter } from "@/server/db/schema";
import { type Course } from "@/server/db/schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn, handleError } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import { ChaptersList } from "./units-list";
import { api } from "@/trpc/react";

interface ChaptersFormProps {
  initialData: Course & { units: Chapter[] };
  courseId: number;
};

const formSchema = z.object({
  name: z.string().min(1),
});

export const ChaptersForm = ({
  initialData,
  courseId
}: ChaptersFormProps) => {

  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const { mutate: create, isPending } = api.units.create.useMutation({
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

  const { mutate: reorder, isPending: isUpdating } = api.units.reorder.useMutation({
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
      courseId: courseId
    })
    router.refresh();
  }

  const onReorder = async (updateData: { id: number; position: number }[]) => {
    reorder({
      courseId: courseId,
      list: updateData
    })
  }

  const onEdit = (id: number) => {
    router.push(`/dashboard/courses/${courseId}/units/${id}`);
  }

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course Units
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
                      placeholder="e.g. 'Introduction to the course'"
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
          !initialData.units.length && "text-slate-500 italic"
        )}>
          {!initialData.units.length && "No Units"}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.units || []}
          />
        </div>
      )}
      {!isPending && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the units
        </p>
      )}
    </div>
  )
}
