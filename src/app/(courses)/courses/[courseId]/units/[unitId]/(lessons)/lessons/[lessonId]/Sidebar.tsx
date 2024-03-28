"use client"
import { CollapsibleTrigger, CollapsibleContent, Collapsible } from "@/components/ui/collapsible"
import Link from "next/link"
import { ChevronDown, Play } from "lucide-react";
import { useState } from "react";
import { type RouterOutputs } from '@/types/trpc';

export default function LessonsSidebar(props: {
  data: RouterOutputs["courses"]["getSidebar"];
  lessonId: number;
  courseId: number;
  unitId: number;
}) {
  const { data, lessonId, courseId } = props;
const [openUnits, setOpenUnits] = useState<string[]>(data.map((unit) => unit.id.toString()));

  const handleOpenChange = (unitId: string) => {
    setOpenUnits((currentOpenUnits) =>
      currentOpenUnits.includes(unitId)
        ? currentOpenUnits.filter((id) => id !== unitId)
        : [...currentOpenUnits, unitId]
    );
  }

  return (
    <div className="flex flex-col w-full max-w-xs border-r border-gray-200 dark:border-gray-800 p-5">
      <div className="flex-1 flex flex-col">
        <nav className="flex-1 flex flex-col overflow-y-auto">
          <ul className="grid gap-1">
            {data.map((unit) => (
              <li key={unit.id} className="group">
                <Collapsible
                  open={openUnits.includes(unit.id.toString())}
                  onOpenChange={() => handleOpenChange(unit.id.toString())}
                  className="space-y-2"
                >
                  <CollapsibleTrigger asChild>
                    <li className={`bg-gray-100 rounded-r-md px-3 py-2 flex items-center space-x-2 text-sm font-medium dark:bg-gray-800 ${props.unitId === unit.id ? 'text-primary' : ''}`}>
                      <span className="truncate">{unit.name}</span>
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    </li>
                  </CollapsibleTrigger>
                  <CollapsibleContent asChild>
                    <ul className="grid gap-1">
                      {unit.lessons.map((lesson) => {
                        return (
                        <li key={lesson.id}>
                          <Link
                            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium w-full dark:hover:bg-gray-800 ${lessonId === lesson.id ? "font-semibold text-red-400" : "text-gray-600 hover:text-primary"}`}
                            href={`/courses/${courseId}/units/${unit.id}/lessons/${lesson.id}`}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {lesson.name}
                          </Link>
                        </li>
                       )
                      })}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
