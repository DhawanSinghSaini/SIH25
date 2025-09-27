import React, { useState } from "react";
import Tesseract from "tesseract.js";

// The isAnalyzing prop is passed down to disable the input during parent processing
function OCRComponent({ onOcrComplete, isAnalyzing }) {
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImage(file);
    setIsProcessing(true);

    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file, "ben+eng");
      
      const parsedJson = parseOcrText(text);

      // Pass both the raw text and the parsed JSON to the parent component
      if (onOcrComplete) {
        onOcrComplete(text, parsedJson);
      }
    } catch (err) {
      console.error("Error during OCR:", err);
      // Optionally, pass the error up
      // if (onOcrComplete) onOcrComplete("Error during OCR: " + err.message, null);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseOcrText = (rawText) => {
    const lines = rawText.split('\n');
    const result = {
      "Claimant Information": {},
      "Nature Of Claim On Land": {},
      "Schemes Eligibility": {
        "Jal Jeevan Mission": {},
        "Pm Kisan": {},
        "Mgnrega": {}
      }
    };
    let currentSection = null;
    let currentScheme = null;
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      if (trimmedLine.match(/Claimant Information/i)) { currentSection = "Claimant Information"; currentScheme = null; return; }
      if (trimmedLine.match(/Nature Of Claim On Land/i)) { currentSection = "Nature Of Claim On Land"; currentScheme = null; return; }
      if (trimmedLine.match(/Schemes Eligibility/i)) { currentSection = "Schemes Eligibility"; currentScheme = null; return; }
      switch (currentSection) {
        case "Claimant Information":
        case "Nature Of Claim On Land":
          const parts = trimmedLine.split(/:\s*/);
          if (parts.length === 2) result[currentSection][parts[0].trim()] = parts[1].trim();
          break;
        case "Schemes Eligibility":
          if (trimmedLine.match(/Jal Jeevan Mission/i)) { currentScheme = "Jal Jeevan Mission"; return; }
          if (trimmedLine.match(/Pm Kisan/i)) { currentScheme = "Pm Kisan"; return; }
          if (trimmedLine.match(/Mgnrega/i)) { currentScheme = "Mgnrega"; return; }
          if (currentScheme) {
            const qualifiesMatch = trimmedLine.match(/Qualifies:\s*(.*)/i);
            if (qualifiesMatch) result[currentSection][currentScheme]["Qualifies"] = qualifiesMatch[1].trim();
          }
          break;
        default: break;
      }
    });
    return result;
  };

  return (
    <div>
      <h3 className="text-md font-semibold text-gray-800 mb-2">Upload Claim Form</h3>
      <input 
        type="file" 
        onChange={handleImageUpload} 
        accept="image/*" 
        disabled={isProcessing || isAnalyzing}
        className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {image && !isProcessing && <p className="text-sm mt-2">Selected: <strong>{image.name}</strong></p>}

      {isProcessing && (
        <p className="text-sm font-semibold text-blue-700 mt-2">Please wait, extracting text...</p>
      )}
    </div>
  );
}

export default OCRComponent;