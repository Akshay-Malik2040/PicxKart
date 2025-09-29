// src/components/ScriptUploader.jsx
import React, { useState } from "react";
import { removeStopwords } from "stopword"; // npm install stopword

const stopwords = [
  // General English stopwords
  "a","an","the","and","or","but","if","then","else","when","while","of","in","on","at","by","for","with","about","above","after",
  "again","against","all","am","are","aren't","as","be","because","been","before","being","below","between","both","can","cannot",
  "could","couldn't","did","didn't","do","does","doesn't","doing","don't","down","during","each","few","from","further","had",
  "hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","hers","herself","him","himself","his",
  "i","i'd","i'll","i'm","i've","is","isn't","it","it's","its","itself","me","my","myself","no","nor","not","of","off","on","once",
  "only","other","ought","our","ours","ourselves","out","over","own","she","she'd","she'll","she's","should","shouldn't","so","some",
  "such","than","that","that's","the","their","theirs","them","themselves","then","there","these","they","they'd","they'll","they're",
  "they've","this","those","through","to","too","under","until","up","very","was","wasn't","we","we'd","we'll","we're","we've","were",
  "weren't","what","when","where","which","who","whom","why","with","won't","would","wouldn't","you","you'd","you'll","you're","you've",
  "your","yours","yourself","yourselves","also","just","like","get","got","one","two","new","now","use","used","using",

  // Stock-footage neutral / script-specific words
  "video","footage","clip","scene","shot","camera","take","frame","frames","pan","tilt","zoom","fade","cut","transition","sequence",
  "intro","outro","story","storyline","dialogue","character","characters","actor","actors","actress","location","setting",
  "props","costume","lighting","visual","effect","effects","recording","recorded","timeline","project","production","team","crew",
  "director","producer","editor","screen","image","images","audio","sound","music","track","tracks","title","titles","text","caption",
  "captions","subtitle","subtitles","graphic","graphics","animation","motion","background","ambient","noise","sfx","VO","voice-over",
  "line","lines","monologue","narration","action","actions","focus","subject","subjects","color","grading","filter","filters","FX"
];

const ScriptUploader = ({ onSearch }) => {
  const [text, setText] = useState("");
  const [keywords, setKeywords] = useState([]);

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

  // Extract keywords
  function extractKeywords(text, limit = 10) {
    if (!text) return [];
    const words = text.toLowerCase().match(/\b(\w{3,})\b/g) || [];
    const freq = {};
    words.forEach(word => {
      if (!stopwords.includes(word)) {
        freq[word] = (freq[word] || 0) + 1;
      }
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(item => item[0]);
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const kws = extractKeywords(text);
    setKeywords(kws);
    if (kws.length > 0) {
      onSearch(kws.join(" "));
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
        />
        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          Generate Keywords & Search
        </button>
      </form>
    </div>
  );
};

export default ScriptUploader;
