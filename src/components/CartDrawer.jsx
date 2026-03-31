import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, clearCart, resolveGlobalUrl, globalResolution } = useCart();
    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    if (!isOpen) return null;

    const handleDownloadAll = async () => {
        if (cart.length === 0) return;
        setDownloading(true);
        setProgress({ current: 0, total: cart.length });

        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            const targetUrl = resolveGlobalUrl(item);

            if (!targetUrl) continue;

            try {
                const response = await fetch(targetUrl);
                if (!response.ok) throw new Error("Network response was not ok");
                
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = blobUrl;
                const ext = item.type === 'video' ? 'mp4' : 'jpg';
                link.download = `picxkart-${globalResolution.toLowerCase()}-${item.id}.${ext}`;
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
            } catch (err) {
                console.error(`Failed to download item ${item.id}:`, err);
            }

            setProgress({ current: i + 1, total: cart.length });
            // Add a small delay between downloads to prevent browser freezing/blocking
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        setDownloading(false);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
                onClick={!downloading ? onClose : undefined}
            />

            {/* Slide-over Panel */}
            <div className={`absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out`}>
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Your Cart</h2>
                        <p className="text-sm text-slate-500 mt-1">{cart.length} {cart.length === 1 ? 'item' : 'items'} selected</p>
                    </div>
                    <button 
                        onClick={onClose}
                        disabled={downloading}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition disabled:opacity-50 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Body / List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                            <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 bg-white rounded-xl border border-slate-100 shadow-sm items-center hover:border-slate-200 transition">
                                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 relative">
                                    <img src={item.thumbnail} className="w-full h-full object-cover" alt="thumbnail" />
                                    {item.type === 'video' && (
                                        <div className="absolute top-1 left-1 bg-black/60 p-0.5 rounded text-white inline-block">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v15.318a.75.75 0 01-.628.74C14.972 18.794 12.51 19 10 19s-4.973-.206-7.372-.601a.75.75 0 01-.628-.74V2.34a.75.75 0 01.628-.74zM10 3a10.957 10.957 0 00-6 1.704v10.592A10.957 10.957 0 0010 17c2.247 0 4.407-.582 6-1.704V4.704A10.957 10.957 0 0010 3zM8.5 7.5v5l4-2.5-4-2.5z"/></svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{item.id.split('-').slice(0, 2).join('-')}</p>
                                    <p className="text-xs text-slate-500 capitalize mt-0.5">{item.type} • {globalResolution} Res</p>
                                </div>
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    disabled={downloading}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition flex-shrink-0 disabled:opacity-50 cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Actions */}
                {cart.length > 0 && (
                    <div className="p-6 border-t border-slate-100 bg-white space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-slate-600">Download Quality:</span>
                            <span className="font-bold text-slate-900">{globalResolution}</span>
                        </div>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={clearCart}
                                disabled={downloading}
                                className="px-4 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition disabled:opacity-50 cursor-pointer"
                            >
                                Clear
                            </button>
                            <button 
                                onClick={handleDownloadAll}
                                disabled={downloading}
                                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition transform active:scale-[0.98] disabled:opacity-75 disabled:active:scale-100 flex justify-center items-center gap-2 cursor-pointer"
                            >
                                {downloading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Saving {progress.current} / {progress.total}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        Download All
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
