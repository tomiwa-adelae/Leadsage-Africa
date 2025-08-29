"use client";
import { Theme, themes } from "@/constants";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import React, { useState } from "react";

export const Themes = () => {
  const { setTheme, theme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  const ThemeCard = ({ theme }: { theme: Theme }) => {
    const isSelected = selectedTheme === theme.id;

    const SplitPreview = () => (
      <div className="rounded-t-md h-32 relative overflow-hidden flex">
        {/* Light side */}
        <div className="w-1/2 bg-accent dark:bg-white p-2 pr-0">
          {/* Header bar */}
          <div className="bg-white dark:bg-accent/10 rounded-sm h-3 mb-2 flex justify-between items-center px-2">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
            <div className="flex space-x-1">
              {theme.buttonColors.map((color, index) => (
                <div
                  key={`light-${index}`}
                  className={`w-1 h-1 ${color} rounded-full`}
                ></div>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="bg-white dark:bg-accent/10 rounded-sm h-4 mb-2"></div>
          <div
            className={`${theme.accentColor} rounded-sm h-3 w-3/4 opacity-80`}
          ></div>
          <div className="bg-white dark:bg-accent/10 rounded-sm h-1 w-1/2 mt-2 opacity-60"></div>

          {/* Side panel */}
          <div className="absolute right-1/2 top-8 bg-white rounded-sm w-3 h-12 opacity-40 mr-1"></div>
        </div>

        {/* Dark side */}
        <div className="w-1/2 bg-gray-800 p-2 pl-0">
          {/* Header bar */}
          <div className="bg-gray-700 rounded-sm h-3 mb-2 flex justify-between items-center px-2">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            </div>
            <div className="flex space-x-1">
              {theme.buttonColors.map((color, index) => (
                <div
                  key={`dark-${index}`}
                  className={`w-1 h-1 ${color} rounded-full`}
                ></div>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="bg-gray-700 rounded-sm h-4 mb-2"></div>
          <div
            className={`${theme.accentColor} rounded-sm h-3 w-3/4 opacity-80`}
          ></div>
          <div className="bg-gray-700 rounded-sm h-1 w-1/2 mt-2 opacity-60"></div>

          {/* Side panel */}
          <div className="absolute left-1/2 top-8 bg-gray-700 rounded-sm w-3 h-12 opacity-40 ml-1"></div>
        </div>

        {/* Center divider line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-0.5"></div>
      </div>
    );

    return (
      <div
        className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
          isSelected
            ? "border-blue-500 ring-2 ring-blue-200"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onClick={() => {
          setSelectedTheme(theme.id);
          setTheme(theme.id);
        }}
      >
        {/* Theme Preview */}

        {theme.bgColor === "split" ? (
          <SplitPreview />
        ) : (
          <div
            className={cn(
              `${theme.bgColor} rounded-t-md p-4 h-32 relative overflow-hidden`
            )}
          >
            {/* Header bar */}
            <div
              className={`${theme.headerColor} rounded-sm h-3 mb-3 flex justify-between items-center px-2`}
            >
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
              <div className="flex space-x-1">
                {theme.buttonColors.map((color, index) => (
                  <div
                    key={index}
                    className={`w-1 h-1 ${color} rounded-full`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Content area */}
            <div className={`${theme.headerColor} rounded-sm h-6 mb-2`}></div>
            <div
              className={`${theme.accentColor} rounded-sm h-4 w-3/4 opacity-80`}
            ></div>
            <div
              className={`${theme.headerColor} rounded-sm h-2 w-1/2 mt-2 opacity-60`}
            ></div>

            {/* Side panel */}
            <div
              className={`absolute right-2 top-12 ${theme.headerColor} rounded-sm w-6 h-16 opacity-40`}
            ></div>
          </div>
        )}

        {/* Theme info */}
        <div className="p-3 bg-white dark:bg-gray-900 rounded-b-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                )}
              </div>
              <span className="font-medium text-gray-900 text-sm dark:text-gray-100">
                {theme.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {themes.map((theme) => (
        <ThemeCard theme={theme} />
      ))}
    </div>
  );
};
