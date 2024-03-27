"use client"
import React, { useState } from 'react';
import { ChevronDown, Play } from "lucide-react";
import Link from "next/link";
import { Button } from './ui/button';
import { PanelLeft, PanelRight } from 'lucide-react';
import { RouterOutputs } from '@/types/trpc';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from '@/lib/utils';


export default function LessonSidebar(props: {
  data: RouterOutputs["courses"]["getSidebar"];
  lessonId: number;
  children: React.ReactNode;
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
  }
  // State to manage the visibility of the TestBar
  const [isVisible, setIsVisible] = useState(true);

  // Function to toggle the visibility state
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="flex flex-row h-full">
      <div
        className={`absolute top-0  bg-background lg:bg-white/30 lg:backdrop-blur-xl h-full lg:h-auto lg:relative z-[999] duration-300 transition-all dark:bg-black lg:dark:bg-black/30 w-80 border-r border-r-neutral-200 dark:border-r-neutral-800 ${isVisible ? `left-0` : `-left-80 hidden`} h-full`} style={{ transition: 'left 0.3s ease-in-out' }} // Ensure smooth transition
      >
        <div className="w-full h-full overflow-hidden">
          <div className='w-full h-full p-6 overflow-auto'>
            <div className="mb-2 text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">
              <div className="flex flex-col items-start">
                {data.map((unit) => (
                  <div key={unit.id} className=""> {/* Adjust padding here if necessary to align with the sidebar design */}
                    <Collapsible
                      open={openUnits.includes(unit.id.toString())}
                      onOpenChange={() => handleOpenChange(unit.id.toString())}
                      className="w-full"
                    >
                      <CollapsibleTrigger asChild>
                        <button className="flex items-center text-left space-x-2"> {/* Ensure button is full width and text is aligned left */}
                          <h4 className={`text-lg font-bold ${props.unitId === unit.id ? `text-primary` : ''}`}>
                            {unit.name}
                          </h4>
                          <ChevronDown className="h-4 w-4" />
                          <span className="sr-only">
                            Toggle
                          </span>
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-2 space-y-2">
                        {unit.lessons.map((lesson) => (
                          <div className="flex items-center space-x-2">
                            <Play className="h-4 w-4" />
                            <Link
                              href={`/courses/${courseId}/units/${unit.id}/lessons/${lesson.id}`}
                              key={lesson.id}
                              className={`py-2 text-sm ${lessonId === lesson.id ? "font-semibold text-primary" : "text-gray-600 hover:text-primary"}`}
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
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex flew-col justify-between w-full border">
          <Button
            onClick={toggleVisibility}
            variant={"ghost"}
            className={cn(`${isVisible ? `left-0` : `-left-1`}`)}
            style={{ transition: 'right 0.3s ease-in-out' }} // Smooth transition for the button as well
          >

            {isVisible ?
              <PanelLeft />
              : <PanelRight />}
          </Button>
          <div />
        </div>
        {props.children}
      </div>
    </div>

  );
}
