import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function TopBar({ title, description, action, className }: TopBarProps) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 font-[family-name:var(--font-plus-jakarta-sans)]", className)}>
      <div className="pl-12 lg:pl-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {description && (
          <p className="mt-1 text-gray-600 dark:text-gray-300">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
