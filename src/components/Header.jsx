import React from 'react';
import AiScriptUploader from './AiScriptUploader';

const Header = ({ onSearch }) => {
  return (
    <header className="w-full mb-12 flex flex-col items-center text-center pt-8 pb-12 rounded-3xl relative overflow-hidden">
      
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="relative z-10 space-y-4 max-w-3xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
          Discover the Perfect <br/> 
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent pb-3 inline-block">Stock Footage</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Upload your script, and let our AI extract the perfect keywords to instantly find high-quality photos and videos for your next big project.
        </p>
        
        <div className="w-full max-w-xl mx-auto backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white/70 p-1">
          <AiScriptUploader onSearch={onSearch}/>
        </div>
      </div>
    </header>
  );
};

export default Header;
