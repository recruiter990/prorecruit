interface TopBarProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function TopBar({ title, description, action }: TopBarProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="pl-12 lg:pl-0">
        <h1 className="font-heading text-3xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
