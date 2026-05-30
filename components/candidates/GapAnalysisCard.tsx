import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GapAnalysisCardProps {
  experienceGap: string;
}

export function GapAnalysisCard({ experienceGap }: GapAnalysisCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Experience Gap Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {experienceGap}
        </p>
      </CardContent>
    </Card>
  );
}
