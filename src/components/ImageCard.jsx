import React from 'react'

const ImageCard = ({url}) => {
  return (
    <div>
        <img src={url} className='w-full mb-6 h-auto object-cover rounded-xl'></img>
    </div>
  )
}

export default ImageCard