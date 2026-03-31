import React, { useEffect, useState, useRef } from 'react';
import Masonry from 'react-masonry-css';
import ImageCard from './ImageCard';

const Body = ({ searchQuery, mediaType }) => {
  const pexelsKey = import.meta.env.VITE_PEXELS_API;
  const pixabayKey = import.meta.env.VITE_PIXABAY_API;

  const [mediaList, setMediaList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Mixed');
  const [error, setError] = useState(null);
  
  const loader = useRef(null);
  
  // Ref to track if we should fetch (to prevent double fetch on clear)
  const isInitialMount = useRef(true);

  // Function to load data
  const loadContent = async (currentPage, currentQuery, reset = false) => {
    if (!pexelsKey || !pixabayKey) {
        setError('Missing API keys for Pexels or Pixabay in .env file.');
        return;
    }

    setLoading(true);
    setError(null);

    const queries = Array.isArray(currentQuery) ? currentQuery : [];
    const requests = [];

    if (queries.length > 0) {
      queries.forEach(q => {
        if (mediaType === 'photos') {
            requests.push({
            query: q, source: 'pexels',
            promise: fetch(`https://api.pexels.com/v1/search?query=${q}&per_page=12&page=${currentPage}`, { headers: { Authorization: pexelsKey } })
            });
            requests.push({
            query: q, source: 'pixabay',
            promise: fetch(`https://pixabay.com/api/?key=${pixabayKey}&q=${q}&per_page=12&page=${currentPage}`)
            });
        } else {
            // Videos
            requests.push({
                query: q, source: 'pexels',
                promise: fetch(`https://api.pexels.com/videos/search?query=${q}&per_page=12&page=${currentPage}`, { headers: { Authorization: pexelsKey } })
            });
            requests.push({
                query: q, source: 'pixabay',
                promise: fetch(`https://pixabay.com/api/videos/?key=${pixabayKey}&q=${q}&per_page=12&page=${currentPage}`)
            });
        }
      });
    }

    // Default curated content
    if (mediaType === 'photos') {
        requests.push({
            query: 'curated', source: 'pexels',
            promise: fetch(`https://api.pexels.com/v1/curated?per_page=12&page=${currentPage}`, { headers: { Authorization: pexelsKey } })
        });
        requests.push({
            query: 'curated', source: 'pixabay',
            promise: fetch(`https://pixabay.com/api/?key=${pixabayKey}&per_page=12&page=${currentPage}`)
        });
    } else {
        requests.push({
            query: 'curated', source: 'pexels',
            promise: fetch(`https://api.pexels.com/videos/popular?per_page=12&page=${currentPage}`, { headers: { Authorization: pexelsKey } })
        });
        requests.push({
            query: 'curated', source: 'pixabay',
            promise: fetch(`https://pixabay.com/api/videos/?key=${pixabayKey}&order=popular&per_page=12&page=${currentPage}`)
        });
    }

    try {
        const responses = await Promise.all(requests.map(req => req.promise));
        const data = await Promise.all(responses.map(res => res.json()));

        const merged = [];

        data.forEach((d, index) => {
            const requestMeta = requests[index];
            const queryKeyword = requestMeta.query;

            if (mediaType === 'photos') {
                if (d.photos && requestMeta.source === 'pexels') {
                    const pexelsItems = d.photos.map(photo => ({
                        id: `pexels-${photo.id}`,
                        type: 'photo',
                        thumbnail: photo.src.medium, // for grid
                        resolutions: {
                            original: photo.src.original,
                            large: photo.src.large,
                            medium: photo.src.medium
                        },
                        keywords: queryKeyword === 'curated' ? [] : [queryKeyword]
                    }));
                    merged.push(...pexelsItems);
                }
                if (d.hits && requestMeta.source === 'pixabay') {
                    const pixabayItems = d.hits.map(photo => ({
                        id: `pixabay-${photo.id}`,
                        type: 'photo',
                        thumbnail: photo.webformatURL,
                        resolutions: {
                            original: photo.largeImageURL,
                            web: photo.webformatURL
                        },
                        keywords: queryKeyword === 'curated' ? [] : [queryKeyword]
                    }));
                    merged.push(...pixabayItems);
                }
            } else { // videos
                if (d.videos && requestMeta.source === 'pexels') {
                    const pexelsItems = d.videos.map(video => {
                        // Create a clean resolution map
                        const resMap = {};
                        video.video_files.forEach(file => {
                            if (file.quality && file.link) {
                                resMap[`${file.quality} (${file.width}x${file.height})`] = file.link;
                            }
                        });
                        return {
                            id: `pexels-vid-${video.id}`,
                            type: 'video',
                            thumbnail: video.image,
                            previewUrl: video.video_files.find(f => f.quality === 'sd' || f.quality === 'hd')?.link || video.video_files[0]?.link,
                            resolutions: resMap,
                            keywords: queryKeyword === 'curated' ? [] : [queryKeyword]
                        };
                    });
                    merged.push(...pexelsItems);
                }
                if (d.hits && requestMeta.source === 'pixabay') {
                    const pixabayItems = d.hits.map(video => {
                        const resMap = {};
                        if (video.videos) {
                            if (video.videos.large?.url) resMap['large'] = video.videos.large.url;
                            if (video.videos.medium?.url) resMap['medium'] = video.videos.medium.url;
                            if (video.videos.small?.url) resMap['small'] = video.videos.small.url;
                        }
                        
                        return {
                            id: `pixabay-vid-${video.id}`,
                            type: 'video',
                            thumbnail: `https://i.vimeocdn.com/video/${video.picture_id}_295x166.jpg`, // Pixabay uses vimeo mostly for previews
                            previewUrl: video.videos?.tiny?.url || video.videos?.small?.url,
                            resolutions: resMap,
                            keywords: queryKeyword === 'curated' ? [] : [queryKeyword]
                        };
                    });
                    merged.push(...pixabayItems);
                }
            }
        });

        // Filter duplicates and randomize a bit
        setMediaList(prev => {
            const list = reset ? [] : prev;
            const newItems = merged.filter(item => !list.some(p => p.id === item.id));
            if(reset) return newItems;
            return [...prev, ...newItems];
        });

    } catch (err) {
        console.error("API error:", err);
        setError("Failed to fetch data from APIs.");
    } finally {
        setLoading(false);
    }
  };

  // Coordinated reset and fetch on searchQuery OR mediaType change
  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        loadContent(1, searchQuery, true);
        return;
    }
    
    // When query or type changes, we reset everything
    setMediaList([]);
    setPage(1);
    setActiveTab('Mixed');
    loadContent(1, searchQuery, true);
    
    // eslint-disable-next-line
  }, [searchQuery, mediaType]);

  // Fetch when page changes (but only if it's not a reset to 1)
  useEffect(() => {
    if (page > 1) {
        loadContent(page, searchQuery, false);
    }
  }, [page]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0, rootMargin: '0px 0px 1000px 0px' } 
    );

    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loading]);

  const tabs = ['Mixed', ...(Array.isArray(searchQuery) ? searchQuery : [])];

  const filteredMedia =
    activeTab === 'Mixed'
      ? mediaList
      : mediaList.filter(item => item.keywords.includes(activeTab));

  return (
    <div className="w-full mt-8">
      
      {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200 text-center font-medium">
              {error}
          </div>
      )}

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-3 px-2 mb-8 pb-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-300 text-sm tracking-wide ${
              activeTab === tab 
              ? 'bg-slate-800 text-white shadow-md transform scale-[1.02]' 
              : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-sm ring-1 ring-slate-900/5'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {filteredMedia.length > 0 ? (
        <Masonry
          breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
          className="flex w-full gap-6 px-2"
          columnClassName="bg-clip-padding"
        >
          {filteredMedia.map((item, idx) => (
            <ImageCard item={item} key={`${item.id}-${idx}`} />
          ))}
        </Masonry>
      ) : (
        !loading && mediaList.length > 0 && activeTab !== 'Mixed' && (
            <div className="flex flex-col items-center justify-center p-16 text-slate-400">
                <p className="text-xl">No results found for keyword: {activeTab}</p>
            </div>
        )
      )}
      
      {/* Loader */}
      <div ref={loader} className="h-20 w-full flex justify-center items-center mt-8">
        {loading && (
            <div className="flex flex-col items-center gap-2 text-slate-400">
               <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               <span className="text-sm font-medium tracking-wide">Loading amazing {mediaType}...</span>
            </div>
        )}
      </div>
      
    </div>
  );
};

export default Body;