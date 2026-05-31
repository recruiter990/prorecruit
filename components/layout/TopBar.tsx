interface TopBarProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function TopBar({ title, description, action }: TopBarProps) {
  return (
    <div className="mb-8 px-0 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="pl-12 lg:pl-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {description && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
