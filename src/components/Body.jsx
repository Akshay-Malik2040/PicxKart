import React, { useEffect, useState, useRef } from 'react'
import Masonry from 'react-masonry-css';
import ImageCard from './ImageCard';


const Body = ({searchQuery}) => {
  const pexelsKey = import.meta.env.VITE_PEXELS_API;
  const pixabayKey = import.meta.env.VITE_PIXABAY_API;

  const [imageList, setImageList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null)

  // console.log(apiKey)

  const fetchData = async () => {
    if (!pexelsKey || !pixabayKey) return;
    setLoading(true);
    const urls = !searchQuery
        ? [
            fetch(
              `https://api.pexels.com/v1/curated?per_page=12&page=${page}`,
              { headers: { Authorization: pexelsKey } }
            ),
            fetch(
              `https://pixabay.com/api/?key=${pixabayKey}&per_page=12&page=${page}`
            ),
          ]
        : [
            fetch(
              `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=12&page=${page}`,
              { headers: { Authorization: pexelsKey } }
            ),
            fetch(
              `https://pixabay.com/api/?key=${pixabayKey}&q=${searchQuery}&per_page=12&page=${page}`
            ),
          ];

      const [pexelsData, pixabayData] = await Promise.all(urls);


    const pexelsList = await pexelsData.json();
    const pixabayList = await pixabayData.json();

    const pexelsFootageList = pexelsList?.photos?.map(photo => ({
      id: `pexels-${photo.id}`,
      url: photo.src.original
    }))

    const pixabayFootageList = pixabayList?.hits?.map(photo => ({
      id: `pixabay-${photo.id}`,
      url: photo.largeImageURL
    }))

    // console.log(pexelsFootageList)
    // console.log(pixabayList)

    const merged = [...pexelsFootageList, ...pixabayFootageList]

    setImageList(prev => {
      const newPhotos = merged.filter(
        photo => !prev.some(p => p.id === photo.id)
      );
      return [...prev, ...newPhotos];
    });

    //  setImageList(prev => {
    //     const newPhotos = ImgList?.photos?.filter(
    //       photo => !prev.some(p => p.id === photo.id)
    //     );
    //     return [...prev, ...newPhotos];
    //   });
    //   console.log(ImgList);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [page,searchQuery])

  useEffect(()=>{
    setImageList([]);
    setPage[1];
  },[searchQuery])

  //Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0,
        rootMargin: "0px 0px 5000px 0px"
       }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loading]);


  return (
    <div className='w-auto mt-7'>
      <h1 className='font-bold text-4xl mx-2 auto-rows-fr px-2'>Free Stock Footage</h1>
      <Masonry breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
        className="flex w-full gap-6 p-4"
        columnClassName="bg-clip-padding">
        {
          imageList?.map(photo => (<ImageCard url={photo?.url} key={photo?.id}></ImageCard>))
        }
      </Masonry>
      <div ref={loader} className="h-10 w-full flex justify-center items-center">
        {loading && <p>Loading more images...</p>}
      </div>
    </div>
  )
}

export default Body