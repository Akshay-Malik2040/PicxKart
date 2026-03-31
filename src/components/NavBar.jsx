import React from 'react'
import { useCart } from '../context/CartContext'

const NavBar = ({ mediaType, setMediaType, onSearch, onOpenCart }) => {
  const { cart, globalResolution, setGlobalResolution } = useCart();

  return (
    <div className='glass sticky top-0 z-40 w-full shadow-sm/50 mb-8 transition-all duration-300'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className='flex justify-between items-center h-20'>
          
          <div 
            className='text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition'
            onClick={() => { onSearch(null); setMediaType('photos'); }}
          >
            PicxKart
          </div>
          
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
    </div>
  )
}

export default NavBar