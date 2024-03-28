"use client";
import React, { useState } from "react";
import Link from "next/link";
import { type RouterOutputs } from "@/types/trpc";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Play } from "lucide-react";

export default function Sidebar(props: {
  data: RouterOutputs["courses"]["getSidebar"];
  lessonId: number;
  courseId: number;
  unitId: number;
  isMobile?: boolean;
}) {
  const { data, lessonId, courseId, isMobile } = props;
  const [openUnits, setOpenUnits] = useState<string[]>([]);

  const handleOpenChange = (unitId: string) => {
    setOpenUnits((currentOpenUnits) =>
      currentOpenUnits.includes(unitId)
        ? currentOpenUnits.filter((id) => id !== unitId)
        : [...currentOpenUnits, unitId]
    );
  };

  return (
    <div
      className={
        isMobile
          ? "min-h-screen w-full bg-primary-foreground p-5"
          : "min-h-screen w-64 bg-primary-foreground p-5"
      }
    >
      {data.map((unit) => (
        <div key={unit.id} className="px-10">
          <Collapsible
            open={openUnits.includes(unit.id.toString())}
            onOpenChange={() => handleOpenChange(unit.id.toString())}
            className="w-full space-y-2"
          >
            <div className="flex items-center justify-between space-x-4">
              <CollapsibleTrigger asChild>
                <div className="flex flex-row items-center">
                  <Button className="flex flex-row gap-2" variant="ghost" size="sm">
                    <h4 className={`text-lg font-bold ${props.unitId === unit.id ? `text-primary` : null}`}>{unit.name}</h4>
                    <ChevronDown className="h-4 w-4" />
                    <span className={`sr-only ${props.unitId === unit.id ? `bg-primary` : null}`}>Toggle</span>
                  </Button>
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              {unit.lessons.map((lesson) => (
                <div className="flex flex-row items-center pl-2 gap-2" key={lesson.id}>
                  <Play className="h-4 w-4" />
                  <Link
                    href={`/courses/${courseId}/units/${unit.id}/lessons/${lesson.id}`}
                    key={lesson.id}
                    className={`block py-2 text-sm ${lessonId === lesson.id
                      ? "font-semibold text-primary"
                      : "text-gray-600 hover:text-primary"
                      }`}
                  >
                    {lesson.name}
                  </Link>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  );
}
