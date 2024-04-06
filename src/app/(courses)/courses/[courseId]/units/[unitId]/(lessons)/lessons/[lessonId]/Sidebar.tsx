"use client";

import {
  Tree,
  Folder,
  File,
  CollapseButton,
} from "@/components/ui/tree-view-api";

import Link from "next/link";
import { Play } from "lucide-react";
import { type RouterOutputs } from "@/types/trpc";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function LessonsSidebar(props: {
  data: RouterOutputs["courses"]["getSidebar"];
  lessonId: number;
  courseId: number;
  unitId: number;
}) {
  const { data, lessonId, courseId } = props;

  const elements = data.map((unit) => ({
    id: unit.id.toString(),
    isSelectable: true,
    isSelected: true,
    name: unit.name,
    children: unit.lessons.map((lesson) => ({
      id: lesson.id.toString(),
      isSelectable: true,
      name: lesson.name,
    })),
  }));

  return (
    <div className="flex flex-col h-full w-full min-w-[250px] border-r border-gray-200 dark:border-gray-800 p-5">
      <div className="flex-1 flex flex-col">
        <nav className="flex-1 flex flex-col overflow-y-auto">
          <Tree
            className="rounded-md bg-background overflow-hidden p-2 h-full"
            initialSelectedId={lessonId.toString()}
            elements={elements}
          >
            <ScrollArea>
              {data.map((unit) => (
                <Folder key={unit.id} element={unit.name} id={unit.id.toString()}>
                  {unit.lessons.map((lesson) => (
                    <File
                      key={lesson.id}
                      element={lesson.name}
                      id={lesson.id.toString()}
                    >
                      <Link
                        className={`flex items-center text-sm font-medium w-full ${lessonId === lesson.id
                          ? "font-semibold text-red-400"
                          : "text-gray-600 hover:text-primary"
                          }`}
                        href={`/courses/${courseId}/units/${unit.id}/lessons/${lesson.id}`}
                      >
                        {lesson.name}
                      </Link>
                    </File>
                  ))}
                </Folder>
              ))}
              <CollapseButton elements={elements} />
            </ScrollArea>
          </Tree>
        </nav>
      </div>
    </div>
  );
}
