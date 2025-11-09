"use client";

import React from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"



function WaitingSlide({ participants }: { participants: any[] }) {
  return (
    <div className="mt-20 px-20 flex flex-col">

        <h1 className="text-3xl font-bold">Waiting players to join.....</h1>
        <span className="text-2xl font-stretch-expanded mt-10 self-center">Total Players joined{participants.length}</span>
        <div className="flex flex-row items-center justify-center mb-10 mt-20 w-full ">
      <AnimatedTooltip items={participants} />
        </div>
    </div>
  );
}

export { WaitingSlide };
