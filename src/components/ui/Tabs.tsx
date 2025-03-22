// src/components/ui/Tabs.tsx
import React from "react";
import { cn } from "@/utils/cn";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  children: React.ReactNode;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, className, children, ...props }, ref) => {
    // State to track the active tab
    const [activeTab, setActiveTab] = React.useState(defaultValue);

    // Clone children to provide context
    const contextValue = { activeTab, setActiveTab };
    const childrenWithProps = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, {
          activeTab,
          setActiveTab,
        });
      }
      return child;
    });

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {childrenWithProps}
      </div>
    );
  }
);
Tabs.displayName = "Tabs";

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, activeTab, setActiveTab, ...props }, ref) => {
    // Clone children to provide context
    const childrenWithProps = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, {
          activeTab,
          setActiveTab,
        });
      }
      return child;
    });

    return (
      <div
        ref={ref}
        className={cn(
          "flex p-1 bg-gray-100 rounded-lg",
          className
        )}
        {...props}
      >
        {childrenWithProps}
      </div>
    );
  }
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  activeTab?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, activeTab, setActiveTab, disabled, children, ...props }, ref) => {
    const isActive = activeTab === value;

    return (
      <button
        ref={ref}
        className={cn(
          "flex-1 px-3 py-2 text-sm font-medium text-center rounded-md transition-all",
          isActive
            ? "bg-white text-purple-700 shadow-sm"
            : "text-gray-500 hover:text-gray-700",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={() => {
          if (!disabled && setActiveTab) {
            setActiveTab(value);
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

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  activeTab?: string;
  children: React.ReactNode;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, activeTab, children, ...props }, ref) => {
    const isActive = activeTab === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        className={cn("mt-2 focus:outline-none", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";