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
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={cn("mt-2 text-3xl font-bold font-heading", variantStyles[variant])}>
              {value}
            </p>
            {subtitle && (
              <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
