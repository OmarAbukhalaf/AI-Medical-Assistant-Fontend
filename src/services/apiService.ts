
import type { DiagnosisResult, ApiResponse } from "../lib/types";

/**
 * API Service for connecting to the backend
 * Configure your API endpoint URL here
 */

// Replace this URL with your actual backend API endpoint
const API_URL = "https://ai-medical-assistant-backend-i9li.onrender.com";

// Map of disease classes to their names and descriptions
const diseaseClasses: { [key: number]: { name: string; description: string } } = {
  0: {
    name: "Congenital & Genetic",
    description: "Conditions that are present from birth due to genetic or developmental anomalies."
  },
  1: {
    name: "Trauma & Physical Injuries",
    description: "Includes injuries resulting from external forces such as accidents, falls, or impacts."
  },
  2: {
    name: "Vascular & Circulatory",
    description: "Disorders affecting blood vessels and the circulatory system, such as aneurysms or thrombosis."
  },
  3: {
    name: "Infections",
    description: "Diseases caused by pathogenic microorganisms like bacteria, viruses, or fungi."
  },
  4: {
    name: "Neoplasm - Benign & Sarcoma",
    description: "Non-cancerous tumors and sarcomas, which are cancers of connective tissues."
  },
  5: {
    name: "Neoplasm - Carcinoma",
    description: "Cancer that begins in the skin or tissues that line internal organs (carcinomas)."
  },
  6: {
    name: "Neoplasm - Other Malignant",
    description: "Other malignant tumors that do not fall into carcinoma or sarcoma categories."
  },
  7: {
    name: "Inflammatory & Autoimmune",
    description: "Diseases caused by abnormal immune system activity resulting in inflammation."
  },
  8: {
    name: "Metabolic & Endocrine",
    description: "Conditions related to metabolism and hormone-producing glands, such as diabetes or thyroid disorders."
  },
  9: {
    name: "Cysts & Degenerative Conditions",
    description: "Includes fluid-filled sacs and conditions causing tissue deterioration over time."
  },
  10: {
    name: "Obstruction & Structural Abnormalities",
    description: "Conditions causing blockages or deformities in normal body structures."
  },
  11: {
    name: "Miscellaneous Conditions",
    description: "Various other conditions that do not fit into the major diagnostic categories."
  }
};


/**
 * Send image and text data to the backend for diagnosis
 */
export const getDiagnosis = async (imageFiles: File[], text: string): Promise<{ results: DiagnosisResult[] }> => {
  try {
    const formData = new FormData();
    formData.append("text", text);

    // Append all images
    imageFiles.forEach((file) => {
      formData.append("images", file); // key should match Flask backend: request.files.getlist("images")
    });

    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const apiData = await response.json() as ApiResponse;

    const results: DiagnosisResult[] = [];

    const predictedClassId = apiData.predicted_class;
    const predictedDisease = diseaseClasses[predictedClassId] || {
      name: `Unknown (Class ${predictedClassId})`,
      description: "No information available for this classification.",
    };

    results.push({
      disease: predictedDisease.name,
      probability: apiData.class_probabilities[predictedClassId],
      description: predictedDisease.description,
    });



    apiData.class_probabilities.forEach((probability, index) => {
      if (index !== predictedClassId && probability > 0.1) {
        const disease = diseaseClasses[index] || {
          name: `Unknown (Class ${index})`,
          description: "No information available for this classification.",
        };

        results.push({
          disease: disease.name,
          probability,
          description: disease.description,
        });
      }
    });

    results.sort((a, b) => b.probability - a.probability);

    return { results };
  } catch (error) {
    console.error("Error getting diagnosis:", error);
    throw error;
  }
};