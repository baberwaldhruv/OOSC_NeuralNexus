import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './App.css';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Methodology from './components/Methodology';
import UseCases from './components/UseCases';
import WhyChooseUs from './components/WhyChooseUs';
import FAQ from './components/FAQ';
import Dashboard from './components/Dashboard';

// Initialize Gemini with the Vite Env Variable
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function App() {
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("Initializing AI...");

  // AI "Thinking" messages
  const processingSteps = [
    "Uploading document...",
    "Extracting textual data...",
    "Identifying legal parties...",
    "Analyzing liability clauses...",
    "Running risk detection models...",
    "Generating plain-English summaries..."
  ];

  /**
   * Helper: Convert PDF file to Base64 format for the Gemini API
   */
  const fileToGenerativePart = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({
        inlineData: {
          data: reader.result.split(',')[1],
          mimeType: file.type
        },
      });
      reader.readAsDataURL(file);
    });
  };

  /**
   * analyzeWithGemini
   * Sends the PDF to Gemini 1.5 Flash and requests a JSON response
   */
  const analyzeWithGemini = async (file) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are a legal expert AI. Analyze the attached contract and provide a response in STRICT JSON format:
        {
          "summary": "Short 2-sentence overview",
          "risks": [
            {"clause": "The exact text from document", "risk": "Why it is dangerous", "severity": "High/Medium"}
          ],
          "plainEnglish": [
            {"original": "Legalese text", "simple": "Simple explanation"}
          ]
        }
        Do not include any markdown formatting like \`\`\`json. Return only the raw JSON.
      `;

      const docPart = await fileToGenerativePart(file);
      const result = await model.generateContent([prompt, docPart]);
      const response = await result.response;
      const text = response.text();
      
      // Safety: Strip markdown if the AI includes it
      const cleanJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("Analysis failed.");
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setIsProcessing(true);
    
    // Cycle through messages while AI works
    let step = 0;
    const interval = setInterval(() => {
      if (step < processingSteps.length) {
        setLoadingMessage(processingSteps[step]);
        step++;
      }
    }, 600);

    try {
      const results = await analyzeWithGemini(file);
      setAnalysisData(results);
      
      const url = URL.createObjectURL(file);
      setFileUrl(url);

      clearInterval(interval);
      setIsAnalyzed(true);
      window.scrollTo(0, 0);
    } catch (err) {
      clearInterval(interval);
      alert("Analysis failed. Check your API key or internet connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetToLanding = () => {
    setIsAnalyzed(false);
    setFileUrl(null);
    setAnalysisData(null);
  };

  // --- INTERNAL LOADING SCREEN COMPONENT ---
  const LoadingScreen = () => (
    <div className="loading-overlay">
      <div className="loading-box">
        <div className="spinner"></div>
        <h2 className="serif">AI Analysis in Progress</h2>
        <p className="loading-status">{loadingMessage}</p>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <Navbar onLogoClick={resetToLanding} />
      </header>

      <main className="landing-content">
        {isProcessing && <LoadingScreen />}

        {!isAnalyzed && !isProcessing && (
          <>
            <Hero onUpload={handleFileUpload} />
            <div id="usecases"><UseCases /></div>
            <div id="methodology"><Methodology /></div>
            <div id="why-us"><WhyChooseUs /></div>
            <div id="faq"><FAQ /></div>
            
            <footer className="app-footer">
              <div className="footer-content">
                <h2 className="serif">Contractify</h2>
                <p className="footer-subtext">AI-Powered Legal Clarity</p>
                <div className="footer-divider"></div>
                <p className="footer-copyright">© 2026 Contractify — MUJ</p>
              </div>
            </footer>
          </>
        )}

        {isAnalyzed && !isProcessing && (
          <Dashboard fileUrl={fileUrl} data={analysisData} />
        )}
      </main>
    </div>
  );
}

export default App;