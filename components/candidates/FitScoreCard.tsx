import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FitScoreGauge } from "@/components/performance/ProductivityChart";
import { Badge } from "@/components/ui/badge";
import { getRecommendationColor } from "@/lib/utils";

interface FitScoreCardProps {
  candidateName: string;
  jobTitle: string;
  fitScore: number;
  recommendation: string;
  matchSummary: string;
}

export function FitScoreCard({
  candidateName,
  jobTitle,
  fitScore,
  recommendation,
  matchSummary,
}: FitScoreCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 p-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-center sm:text-left">
          <h2 className="font-heading text-2xl font-bold">{candidateName}</h2>
          <p className="text-muted-foreground">{jobTitle}</p>
          <Badge className={`mt-3 ${getRecommendationColor(recommendation)}`}>
            {recommendation}
          </Badge>
          <p className="mt-4 max-w-lg text-sm text-muted-foreground">{matchSummary}</p>
        </div>
        <FitScoreGauge score={fitScore} />
      </CardContent>
    </Card>
  );
}
