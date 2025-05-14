
export interface DiagnosisResult {
  disease: string;
  probability: number;
  description: string;
}

export interface ApiResponse {
  class_probabilities: number[];
  predicted_class: number;
}
