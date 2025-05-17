
import { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import TextInput from "../components/TextInput";
import ResultsDisplay from "../components/ResultsDisplay";
import type { DiagnosisResult } from "../lib/types.ts";
import { useToast } from "../components/toast";
import { getDiagnosis } from "../services/apiService";

const Index = () => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [medicalText, setMedicalText] = useState("");
  const [results, setResults] = useState<DiagnosisResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
if (imageFiles.length === 0 && !medicalText.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide at least an image or symptom description for analysis.",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);
    
    try {
        const diagnosisData = await getDiagnosis(imageFiles, medicalText);
      
      setResults(diagnosisData.results);
      
      toast({
        title: "Analysis complete",
        description: "The diagnostic predictions are ready for review.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error in diagnosis:", error);
      toast({
        title: "Error",
        description: "There was a problem analyzing your data. Please try again.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setImageFiles([]);
    setMedicalText("");
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-blue-900 text-center">Multimodal Disease Detection</h1>
          <p className="text-center text-gray-600 mt-1">
            AI-powered disease classification using image and text analysis
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Submit for Analysis</h2>
            <p className="text-gray-600 mb-6">
              Provide an image and description of your symptoms for AI classification
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Upload Image <span className="text-xs text-gray-500">(Max size: 5MB)</span></h3>
                  <ImageUpload onImageSelected={setImageFiles} />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Symptom Description</h3>
                <TextInput value={medicalText} onChange={setMedicalText} />
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  className={`px-4 py-2 rounded-md border border-gray-300 bg-white text-sm ${(isLoading || (!imageFiles && !medicalText)) ? 'disabled' : ''}`}
                  onClick={resetForm}
                    disabled={isLoading || (imageFiles.length === 0 && !medicalText.trim())}
                >
                  Reset
                </button>
                <button 
                  className={`px-8 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white ${(isLoading || (!imageFiles && !medicalText.trim())) ? 'disabled' : ''}`}
                  onClick={handleSubmit}
                    disabled={isLoading || (imageFiles.length === 0 && !medicalText.trim())}
                >
                  {isLoading ? "Analyzing..." : "Analyze Symptoms"}
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm min-h-[400px] flex items-center justify-center">
            {isLoading || results ? (
              <ResultsDisplay results={results} isLoading={isLoading} />
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-gray-400">?</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Analysis Yet</h3>
                <p className="text-gray-500">
                  Complete the form and submit for analysis to see results here.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This application is for research and educational purposes only. 
            Always consult with qualified healthcare professionals for medical advice.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
