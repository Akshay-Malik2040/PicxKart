import React, { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'

const NavBar = ({ mediaType, setMediaType, onSearch, onOpenCart }) => {
  const { cart, globalResolution, setGlobalResolution } = useCart();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If we scroll down and are past 100px, completely hide the navbar
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
        setIsMobileMenuOpen(false); // Close mobile menu on scroll
      } else {
        // If we scroll UP, show it immediately
        setShowNavbar(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Placeholder to prevent layout shift since the actual navbar is now strictly fixed */}
      <div className="h-28 w-full block"></div>

      <div 
        className={`glass fixed top-0 left-0 right-0 z-40 shadow-sm/50 transition-transform duration-300 ease-in-out ${
            showNavbar ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className='flex justify-between items-center h-20'>
            
            <div 
              className='text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition'
              onClick={() => { onSearch(null); setMediaType('photos'); }}
            >
              PicxKart
            </div>

            {/* Mobile Actions: Cart & Menu Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <button 
                  onClick={onOpenCart}
                  className="relative p-2 text-slate-600 hover:text-blue-600 transition hover:bg-slate-100 rounded-full cursor-pointer"
              >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  {cart.length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full shadow border-2 border-white">
                          {cart.length}
                      </span>
                  )}
              </button>
              <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-slate-600 hover:text-blue-600 transition rounded-md ml-1"
                  aria-label="Toggle Menu"
              >
                 {isMobileMenuOpen ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                 )}
              </button>
            </div>
            
            {/* Desktop Menu */}
            <div className='hidden md:flex items-center gap-8'>
              <ul className='flex gap-8 font-semibold text-slate-600'>
                <li 
                  onClick={() => setMediaType('photos')}
                  className={`cursor-pointer tracking-wide transition relative py-2 ${
                    mediaType === 'photos' ? 'text-blue-600' : 'hover:text-blue-500'
                  }`}
                >
                  Photos
                  {mediaType === 'photos' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full animate-in fade-in zoom-in duration-300"></span>}
                </li>
                <li 
                  onClick={() => setMediaType('videos')}
                  className={`cursor-pointer tracking-wide transition relative py-2 ${
                    mediaType === 'videos' ? 'text-blue-600' : 'hover:text-blue-500'
                  }`}
                >
                  Videos
                  {mediaType === 'videos' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full animate-in fade-in zoom-in duration-300"></span>}
                </li>
              </ul>

              <div className="h-6 w-px bg-slate-300 mx-2"></div>
              
              {/* Global Settings & Cart */}
              <div className="flex items-center gap-6">
                  
                  {/* Resolution Selector */}
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer">
                      <span className="text-slate-500 hidden lg:inline-block">Global Res:</span>
                      <select 
                          className="bg-slate-100 border border-slate-200 text-slate-800 rounded-lg focus:ring-blue-500 py-1.5 px-3 focus:border-blue-500 block shadow-sm outline-none transition cursor-pointer hover:bg-slate-200"
                          value={globalResolution}
                          onChange={(e) => setGlobalResolution(e.target.value)}
                      >
                          <option value="High">High / Original</option>
                          <option value="Medium">Medium / Web</option>
                          <option value="Low">Low / Small</option>
                      </select>
                  </div>

                  {/* Cart Icon */}
                  <button 
                      onClick={onOpenCart}
                      className="relative p-2 text-slate-600 hover:text-blue-600 transition hover:bg-slate-100 rounded-full cursor-pointer"
                  >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                      {cart.length > 0 && (
                          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full shadow border-2 border-white">
                              {cart.length}
                          </span>
                      )}
                  </button>

              </div>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-4 space-y-4 shadow-xl absolute w-full left-0 animate-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col gap-2 font-semibold text-slate-600">
                    <button 
                        onClick={() => { setMediaType('photos'); setIsMobileMenuOpen(false); }}
                        className={`text-left px-4 py-3 rounded-xl transition ${mediaType === 'photos' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50'}`}
                    >
                        Photos
                    </button>
                    <button 
                        onClick={() => { setMediaType('videos'); setIsMobileMenuOpen(false); }}
                        className={`text-left px-4 py-3 rounded-xl transition ${mediaType === 'videos' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50'}`}
                    >
                        Videos
                    </button>
                </div>
                
                <div className="h-px w-full bg-slate-200 my-1"></div>
                
                <div className="flex flex-col gap-2 px-4 pb-2">
                    <label className="text-sm font-semibold text-slate-600">Global Resolution</label>
                    <select 
                        className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:ring-blue-500 py-3 px-4 focus:border-blue-500 shadow-sm outline-none transition w-full appearance-none"
                        value={globalResolution}
                        onChange={(e) => { setGlobalResolution(e.target.value); setIsMobileMenuOpen(false); }}
                    >
                        <option value="High">High / Original</option>
                        <option value="Medium">Medium / Web</option>
                        <option value="Low">Low / Small</option>
                    </select>
                </div>
            </div>
        )}
      </div>
    </>
  )
}

export default NavBar