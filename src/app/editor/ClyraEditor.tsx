"use client";

import React from "react";
import { Editor, Frame, Element } from "@craftjs/core";
import { Layers } from "@craftjs/layers";
import HeroNode from "./nodes/HeroNode";
import SettingsPanel from "./SettingsPanel";
type CanvasProps = {
  children?: React.ReactNode;
};

const Canvas = ({ children }: CanvasProps) => {
  return <div className="space-y-6">{children}</div>;
};

(Canvas as any).craft = {
  displayName: "Canvas",
};

export default function ClyraEditor() {
  return (
    <Editor resolver={{ HeroNode, Canvas }}>
      <div className="grid grid-cols-12 h-screen">
        {/* Left */}
        <div className="col-span-2 border-r p-4 bg-white overflow-auto">
          <h2 className="font-bold mb-4">Layers</h2>
          <Layers />
        </div>

        {/* Center */}
        <div className="col-span-8 p-6 bg-gray-50 overflow-auto">
          <Frame>
            <Element is={Canvas} canvas>
              <Element
                is={HeroNode}
                title="Build Your Dream Website"
                subtitle="AI-powered websites in seconds"
              />
            </Element>
          </Frame>
        </div>

        {/* Right */}
       <div className="col-span-2 border-l p-4 bg-white">
  <h2 className="font-bold mb-4">Settings</h2>
  <SettingsPanel />
</div>
      </div>
    </Editor>
  );
}