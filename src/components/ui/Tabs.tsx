"use client";
import React, { createContext, useContext, useState, forwardRef } from "react";
import { cn } from "@/utils/cn";

// Types
type TabsContextValue = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};

// Context
const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
};

// Main Tabs component
interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export const Tabs = ({ defaultValue, className, children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// TabsList component
interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export const TabsList = ({ className, children }: TabsListProps) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      {children}
    </div>
  );
};

// TabsTrigger component
interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, children, onClick, disabled, ...props }, ref) => {
    const { activeTab, setActiveTab } = useTabs();
    const isActive = activeTab === value;

    return (
      <button
        ref={ref}
        className={cn(
          "flex-1 px-3 py-2 text-sm font-medium text-center rounded-md transition-all",
          isActive ? "bg-white text-indigo-800 shadow-sm" : "text-gray-700 hover:text-gray-900 hover:bg-gray-200",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={(e) => {
          if (!disabled) {
            setActiveTab(value);
            onClick?.(e);
          }
        }}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

// TabsContent component
interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsContent = ({ value, className, children }: TabsContentProps) => {
  const { activeTab } = useTabs();
  
  if (value !== activeTab) {
    return null;
  }

  return (
    <div className={cn("mt-2", className)}>
      {children}
    </div>
  );
};
