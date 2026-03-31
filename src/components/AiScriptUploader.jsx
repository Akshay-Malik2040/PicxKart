import React, { useState } from "react";
// Remove: import { removeStopwords } from "stopword";
// Remove: const stopwords = [...]

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 


// Import the Gemini SDK
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client (see security note above)
// This assumes GEMINI_API_KEY is available in the environment (e.g., using Vite's env variables)
// In a real app, you might pass the API key from a secure serverless function.
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const GEMINI_MODEL = "gemini-2.5-flash"; // Fast and capable for text analysis

// ----------------------------------------------------------------------
// NEW GEMINI-BASED KEYWORD EXTRACTION FUNCTION
// ----------------------------------------------------------------------

/**
 * Extracts a list of keywords from a given text using the Gemini API.
 * The model is instructed to return a clean JSON array of strings.
 *
 * @param {string} textToAnalyze The input script/text.
 * @param {number} limit The maximum number of keywords to return.
 * @returns {Promise<string[]>} A promise that resolves to an array of keywords.
 */
async function extractKeywordsWithGemini(textToAnalyze, limit = 10) {
    if (!textToAnalyze) return [];

    // The prompt is crucial: it sets the task and mandates the output format.
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
                // Set the response format to JSON
                responseMimeType: "application/json",
                // Force the output structure to be a list of strings
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
        // Safely parse the JSON string into a JavaScript array
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error extracting keywords with Gemini API:", error);
        // Inform the user or return an empty array on failure
        return [];
    }
}

// ----------------------------------------------------------------------
// UPDATED REACT COMPONENT
// ----------------------------------------------------------------------

const AiScriptUploader = ({ onSearch }) => {
    const [text, setText] = useState("");
    const [keywords, setKeywords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Handle textarea change
    const handleChange = (e) => {
        setText(e.target.value);
    };

    // Handle .txt file upload
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fileText = await file.text();
        setText(fileText);
    };

    // Handle form submit (now async)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text) return;

        setIsLoading(true);
        // Call the new Gemini-based extraction function
        const kws = await extractKeywordsWithGemini(text); 
        setIsLoading(false);

        setKeywords(kws);
        if (kws.length > 0) {
            onSearch(kws);
        }
    };

    return (
        <div className="mx-auto p-6 bg-white rounded-xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                Upload Script or Paste Text
            </h2>
            <form className="flex flex-col space-y-4 w-200" onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={handleChange}
                    placeholder="Paste your script here..."
                    rows={8}
                    className="h-20 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                    disabled={isLoading}
                />
                <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:bg-gray-400"
                    disabled={isLoading || !text}
                >
                    {isLoading ? 'Generating Keywords...' : 'Generate Keywords & Search'}
                </button>
            </form>            
        </div>
    );
};

export default AiScriptUploader;