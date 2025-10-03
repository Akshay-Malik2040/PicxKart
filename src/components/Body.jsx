import React, { useEffect, useState, useRef } from 'react';
import Masonry from 'react-masonry-css';
import ImageCard from './ImageCard';

const Body = ({ searchQuery }) => {
  const pexelsKey = import.meta.env.VITE_PEXELS_API;
  const pixabayKey = import.meta.env.VITE_PIXABAY_API;

  const [imageList, setImageList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Mixed');
  const loader = useRef(null);

  const fetchData = async () => {
    if (!pexelsKey || !pixabayKey) return;

    setLoading(true);

    const queries = Array.isArray(searchQuery) ? searchQuery : [];
    
    // --- Step 1: Prepare all requests with their metadata (query, source) ---
    const requests = [];

    if (queries.length > 0) {
      queries.forEach(q => {
        // Pexels Search Request
        requests.push({
          query: q,
          source: 'pexels',
          promise: fetch(`https://api.pexels.com/v1/search?query=${q}&per_page=12&page=${page}`, {
            headers: { Authorization: pexelsKey }
          })
        });
        // Pixabay Search Request
        requests.push({
          query: q,
          source: 'pixabay',
          promise: fetch(`https://pixabay.com/api/?key=${pixabayKey}&q=${q}&per_page=12&page=${page}`)
        });
      });
    }

    // Always include curated/popular content as a fallback, assigning a special keyword
    requests.push({
      query: 'curated',
      source: 'pexels',
      promise: fetch(`https://api.pexels.com/v1/curated?per_page=12&page=${page}`, {
        headers: { Authorization: pexelsKey }
      })
    });
    requests.push({
      query: 'curated',
      source: 'pixabay',
      promise: fetch(`https://pixabay.com/api/?key=${pixabayKey}&per_page=12&page=${page}`)
    });

    // --- Step 2: Execute all promises ---
    const responses = await Promise.all(requests.map(req => req.promise));
    const data = await Promise.all(responses.map(res => res.json()));

      console.log(data)
    const merged = [];

    // --- Step 3: Process data, using request metadata to assign correct keywords ---
    data.forEach((d, index) => {
      const requestMeta = requests[index];
      const queryKeyword = requestMeta.query;

      // Pexels Mapping
      if (d.photos && requestMeta.source === 'pexels') {
        const pexelsFootageList = d.photos.map(photo => ({
          id: `pexels-${photo.id}`,
          url: photo.src.original,
          // Only assign the query keyword if it's not the internal 'curated' tag
          keywords: queryKeyword === 'curated' ? [] : [queryKeyword]
        }));
        merged.push(...pexelsFootageList);
      }

      // Pixabay Mapping
      if (d.hits && requestMeta.source === 'pixabay') {
        const pixabayFootageList = d.hits.map(photo => ({
          id: `pixabay-${photo.id}`,
          url: photo.largeImageURL,
          // Only assign the query keyword if it's not the internal 'curated' tag
          keywords: queryKeyword === 'curated' ? [] : [queryKeyword]
        }));
        merged.push(...pixabayFootageList);
      }
    });

    setImageList(prev => {
      const newPhotos = merged.filter(photo => !prev.some(p => p.id === photo.id));
      return [...prev, ...newPhotos];
    });

    setLoading(false);
  };

  // Fetch data on page or searchQuery change
  useEffect(() => {
    fetchData();
  }, [page, searchQuery]); // pexelsKey and pixabayKey should also be dependencies if they can change

  // Reset when searchQuery changes
  useEffect(() => {
    setImageList([]);
    setPage(1);
    setActiveTab('Mixed'); // Reset active tab on new search
  }, [searchQuery]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          setPage(prev => prev + 1);
        }
      },
      // Increase rootMargin to trigger earlier loading
      { threshold: 0, rootMargin: '0px 0px 5000px 0px' } 
    );

    if (loader.current) observer.observe(loader.current);
    // Cleanup function
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loading]);

  // Tabs: Mixed + queries
  const tabs = ['Mixed', ...(Array.isArray(searchQuery) ? searchQuery : [])];

  // Filter images based on active tab
  const filteredImages =
    activeTab === 'Mixed'
      ? imageList
      // Check if the photo's keywords array includes the active tab string
      : imageList.filter(photo => photo.keywords.includes(activeTab));

  return (
    <div className="w-auto mt-7">
      <h1 className="font-bold text-4xl mx-2 px-2">Free Stock Footage</h1>

      {/* Horizontal Tabs */}
      <div className="flex overflow-x-auto gap-4 px-2 mt-4 mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap ${
              activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      {/* Show grid only if there are images, otherwise display a message */}
      {filteredImages.length > 0 ? (
        <Masonry
          breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
          className="flex w-full gap-6 p-4"
          columnClassName="bg-clip-padding"
        >
          {filteredImages.map(photo => (
            <ImageCard url={photo?.url} key={photo?.id} />
          ))}
        </Masonry>
      ) : (
        !loading && imageList.length > 0 && activeTab !== 'Mixed' && (
            <p className="text-center text-gray-500 p-8">No images found for the query: {activeTab}</p>
        )
      )}
      
      {/* Loader for Infinite Scroll */}
      <div ref={loader} className="h-10 w-full flex justify-center items-center">
        {loading && <p className='text-gray-500'>Loading more images...</p>}
      </div>
      
      {/* Display a message if no images are loaded at all */}
      {!loading && imageList.length === 0 && (
          <p className="text-center text-gray-500 p-8">Start typing in the search bar to find images!</p>
      )}

    </div>
  );
};

export default Body;