interface TopBarProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function TopBar({ title, description, action }: TopBarProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pb-6 font-[family-name:var(--font-plus-jakarta-sans)]">
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
