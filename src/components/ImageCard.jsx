import React from 'react'
import downloadIcon from '../assets/download.png'

const ImageCard = ({url}) => {
  // console.log(url)
  return (
    <div className='relative group'>
        <img src={url} className='w-full mb-6 h-auto object-cover rounded-lg'></img>
        <a className='absolute bottom-4 right-4 hidden group-hover:block' href={url} download><img className='h-8 w-8' src={downloadIcon} alt="⬇️" /></a>
    </div>
  )
}

export default ImageCard