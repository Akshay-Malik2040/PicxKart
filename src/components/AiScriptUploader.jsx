import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const GEMINI_MODEL = "gemini-2.5-flash";

async function extractKeywordsWithGemini(textToAnalyze, limit = 10) {
    if (!textToAnalyze) return [];

    const prompt = `
        Analyze the following script text for video content and extract the ${limit} most relevant, high-impact keywords.
        Focus on nouns, key actions, emotions, and relevant topics.
        The response MUST be ONLY a JSON array of strings. Do not include any other text,
        markdown formatting (like \`\`\`json), or explanations.

        Script Text: "${textToAnalyze}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "array",
                    items: {
                        type: "string",
                        description: "An extracted keyword, often a noun or concept."
                    }
                },
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error extracting keywords with Gemini API:", error);
        return [];
    }
}

const AiScriptUploader = ({ onSearch }) => {
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setText(e.target.value);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fileText = await file.text();
        setText(fileText);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text) return;

        setIsLoading(true);
        const kws = await extractKeywordsWithGemini(text); 
        setIsLoading(false);

        if (kws.length > 0) {
            onSearch(kws);
        }
    };

    return (
        <div className="p-4 rounded-xl bg-transparent w-full">
            <form className="flex flex-col space-y-3 w-full" onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={handleChange}
                    placeholder="Enter your scene description or script..."
                    rows={4}
                    className="w-full p-4 bg-white/50 backdrop-blur-md rounded-xl border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner text-slate-700 placeholder-slate-400 resize-none transition-all duration-300"
                    disabled={isLoading}
                />
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 group">
                        <input
                            type="file"
                            accept=".txt"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={isLoading}
                        />
                        <div className="flex items-center justify-center w-full py-3 px-4 bg-white border border-slate-200 border-dashed rounded-xl group-hover:bg-slate-50 group-hover:border-blue-300 transition-all text-sm font-medium text-slate-600">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-slate-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                           Upload .txt file
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium tracking-wide rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center cursor-pointer"
                        disabled={isLoading || !text}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Extracting...
                            </span>
                        ) : 'Find Footage ✨'}
                    </button>
                </div>
            </form>            
        </div>
    );
};

export default AiScriptUploader;