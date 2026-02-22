export interface AiAnalysisResult {
  suggestedSpecialty: string | null;
  confidence: number | null;
  top3: Record<string, number> | null; // ✅ added top_3
}
