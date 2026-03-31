import React from 'react'

const NavBar = ({ mediaType, setMediaType, onSearch }) => {
  return (
    <div className='glass sticky top-0 z-50 w-full shadow-sm/50 mb-8 transition-all duration-300'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className='flex justify-between items-center h-20'>
          
          <div 
            className='text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition'
            onClick={() => { onSearch(null); setMediaType('photos'); }}
          >
            PicxKart
          </div>
          
          <div className='hidden md:block'>
            <ul className='flex gap-8 font-semibold text-slate-600'>
              <li 
                onClick={() => setMediaType('photos')}
                className={`cursor-pointer tracking-wide transition relative py-2 ${
                  mediaType === 'photos' ? 'text-blue-600' : 'hover:text-blue-500'
                }`}
              >
                Photos
                {mediaType === 'photos' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full animate-in fade-in zoom-in duration-300"></span>
                )}
              </li>
              <li 
                onClick={() => setMediaType('videos')}
                className={`cursor-pointer tracking-wide transition relative py-2 ${
                  mediaType === 'videos' ? 'text-blue-600' : 'hover:text-blue-500'
                }`}
              >
                Videos
                {mediaType === 'videos' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full animate-in fade-in zoom-in duration-300"></span>
                )}
              </li>
              <li className='cursor-pointer tracking-wide hover:text-blue-500 transition py-2'>About Us</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}

export default NavBar