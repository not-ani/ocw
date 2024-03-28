"use client"
import React from "react"
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { CollapsibleTrigger, CollapsibleContent, Collapsible } from "@/components/ui/collapsible"
import { ChevronDown, Play, SidebarOpenIcon } from 'lucide-react'
import { RouterOutputs } from '@/types/trpc';
import Link from "next/link"

export function MobileLessonsSidebar(props: {
  data: RouterOutputs["courses"]["getSidebar"];
  lessonId: number;
  courseId: number;
  unitId: number;
}) {
  const { data, lessonId, courseId } = props;

  const [openUnits, setOpenUnits] = React.useState<string[]>(data.map((unit) => unit.id.toString()));

  const handleOpenChange = (unitId: string) => {
    setOpenUnits((currentOpenUnits) =>
      currentOpenUnits.includes(unitId)
        ? currentOpenUnits.filter((id) => id !== unitId)
        : [...currentOpenUnits, unitId]
    );
  }

  return (
    <Sheet>
      <SheetTrigger>
        <SidebarOpenIcon />
      </SheetTrigger>
      <SheetContent>
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
                    {unit.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <Link
                          className={`flex items-center rounded-md px-3 py-2 text-sm font-medium w-full dark:hover:bg-gray-800 ${lessonId === lesson.id ? "font-semibold text-red-400" : "text-gray-600 hover:text-primary"}`}
                          href={`/courses/${courseId}/units/${unit.id}/lessons/${lesson.id}`}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {lesson.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  )
}
