import { Lawyer } from "./Lawyer";

export interface AiRecommendation {
  predictedCategory: string | null;
  confidence: number | null;
  top3: Record<string, number> | null;
  lawyers: Lawyer[];
}
