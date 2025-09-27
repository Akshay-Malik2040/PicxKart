import React, { useEffect, useState } from 'react'


const Body = () => {
    const [imageList,setImageList]=useState([]);
    const apiKey = import.meta.env.VITE_PEXELS_KEY
    useEffect(()=>{
        fetchData();
    },[])

    const fetchData= async()=>{
        const data=await fetch('https://api.pexels.com/v1/curated?per_page=12', {
        headers: {
          Authorization: apiKey,
        },
      })
      const ImgList=await data.json();
      setImageList(ImgList.photos);
      console.log(ImgList);
    }
  return (
    <div className='w-auto mt-7'>
        <h1 className='font-bold text-4xl mx-2 mb-6 px-2'>Free Stock Footage</h1>
        <div className='w-full columns-4 gap-8 p-4'>
            {
                imageList.map(photo=>(<img src={photo.src.large} className='w-full mb-8 h-auto object-cover break-inside-avoid rounded-xl'></img>))
            }
        </div>
    </div>
  )
}

export default Body