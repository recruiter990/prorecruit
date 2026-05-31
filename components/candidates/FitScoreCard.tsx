import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FitScoreGauge } from "@/components/performance/ProductivityChart";
import { Badge } from "@/components/ui/badge";
import { cn, getRecommendationColor } from "@/lib/utils";

interface FitScoreCardProps {
  candidateName: string;
  jobTitle: string;
  fitScore: number;
  recommendation: string;
  matchSummary: string;
  className?: string;
}

export function FitScoreCard({
  candidateName,
  jobTitle,
  fitScore,
  recommendation,
  matchSummary,
  className,
}: FitScoreCardProps) {
  return (
    <Card className={cn("bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", className)}>
      <CardContent className="flex flex-col items-center gap-4 p-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-center sm:text-left">
          <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">{candidateName}</h2>
          <p className="text-gray-600 dark:text-gray-300">{jobTitle}</p>
          <Badge className={`mt-3 ${getRecommendationColor(recommendation)}`}>
            {recommendation}
          </Badge>
          <p className="mt-4 max-w-lg text-sm text-gray-600 dark:text-gray-300">{matchSummary}</p>
        </div>
        <FitScoreGauge score={fitScore} />
      </CardContent>
    </Card>
  );
}
