import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GapAnalysisCardProps {
  experienceGap: string;
}

export function GapAnalysisCard({ experienceGap }: GapAnalysisCardProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-gray-800 dark:text-gray-100">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Experience Gap Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
          {experienceGap}
        </p>
      </CardContent>
    </Card>
  );
}
