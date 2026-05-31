import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PerformanceCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

export function PerformanceCard({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
}: PerformanceCardProps) {
  const variantStyles = {
    default: "text-gray-900 dark:text-white",
    success: "text-green-600 dark:text-green-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger: "text-red-600 dark:text-red-400",
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className={cn("mt-2 text-3xl font-bold font-heading", variantStyles[variant])}>
              {value}
            </p>
            {subtitle && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
          {icon && <div className="text-gray-500 dark:text-gray-400">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
