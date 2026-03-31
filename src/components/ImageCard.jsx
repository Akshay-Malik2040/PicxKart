import React, { useState, useRef } from 'react';

const ImageCard = ({ item }) => {
  const [downloadingUrl, setDownloadingUrl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when picking an option
  const triggerDownload = async (url, resolutionKey) => {
    setShowDropdown(false);
    setDownloadingUrl(resolutionKey);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      const ext = item.type === 'video' ? 'mp4' : 'jpg';
      link.download = `picxkart-${resolutionKey}-${item.id}.${ext}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object after 100ms
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (err) {
      console.error("Failed to download file:", err);
      alert("Uh oh! Failed to download the file directly. You may need to click 'Open' to save it manually.");
    } finally {
      setDownloadingUrl(null);
    }
  };

  return (
    <div 
        className='relative group mb-6 rounded-2xl overflow-visible shadow-sm hover:shadow-xl transition-all duration-500 bg-slate-50 border border-slate-100'
        onMouseLeave={() => setShowDropdown(false)}
    >
      
      {/* Media Rendering */}
      {item.type === 'photo' ? (
        <img 
            src={item.thumbnail} 
            alt="Stock media"
            className='w-full h-auto object-cover rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity duration-300'
            loading="lazy"
        />
      ) : (
        <div className="relative w-full h-auto rounded-2xl overflow-hidden bg-black">
            <video 
                src={item.previewUrl} 
                poster={item.thumbnail}
                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                autoPlay 
                muted 
                loop 
                playsInline
            />
            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-xs text-white font-semibold flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v15.318a.75.75 0 01-.628.74C14.972 18.794 12.51 19 10 19s-4.973-.206-7.372-.601a.75.75 0 01-.628-.74V2.34a.75.75 0 01.628-.74zM10 3a10.957 10.957 0 00-6 1.704v10.592A10.957 10.957 0 0010 17c2.247 0 4.407-.582 6-1.704V4.704A10.957 10.957 0 0010 3zM8.5 7.5v5l4-2.5-4-2.5z"/></svg>
                Video
            </div>
        </div>
      )}

      {/* Glassmorphic Overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end justify-end p-4'>
            
            {/* Action Area */}
            <div className="relative">
                <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className='glass py-2 px-4 rounded-xl text-sm font-semibold text-slate-900 hover:bg-white transition flex items-center gap-2 shadow-lg'
                    disabled={downloadingUrl !== null}
                >
                    {downloadingUrl !== null ? (
                        <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    )}
                    {downloadingUrl !== null ? 'Buffering...' : 'Download'}
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                    <div ref={dropdownRef} className="absolute bottom-full right-0 mb-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl ring-1 ring-slate-900/10 overflow-hidden z-20 origin-bottom-right animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="py-1">
                            <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                Select Quality
                            </div>
                            {Object.entries(item.resolutions).map(([resType, url]) => (
                                <button
                                    key={resType}
                                    onClick={(e) => { e.stopPropagation(); triggerDownload(url, resType); }}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition flex items-center justify-between group/item"
                                >
                                    <span className="capitalize">{resType}</span>
                                    <svg className="w-4 h-4 text-blue-400 opacity-0 group-hover/item:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

      </div>

    </div>
  )
}

export default ImageCard;