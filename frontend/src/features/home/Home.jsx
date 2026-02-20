import { useEffect, useState } from "react";
import { apiRequest } from "../../utility/apiRequest";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await apiRequest("/video/all");
        setVideos(response.data.videos);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="py-6 px-4 flex gap-7 flex-wrap">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="w-72 h-50 rounded-lg bg-neutral-800" />
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-neutral-800 shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="h-4 w-48 rounded bg-neutral-800" />
                <div className="h-3 w-28 rounded bg-neutral-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 mb-4 text-neutral-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
        <p className="text-lg font-medium">No videos yet</p>
        <p className="text-sm text-neutral-600 mt-1">
          Be the first to upload a video!
        </p>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 flex gap-7 flex-wrap text-white">
      {videos.map((video) => (
        <div key={video._id} className="flex flex-col gap-2 w-72 max-h-70">
          <div className="w-72 h-50 overflow-hidden rounded-xl">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-3">
            <img
              src={video.owner?.avatar}
              alt={video.owner?.username}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm font-medium leading-snug line-clamp-2">
                {video.title}
              </span>
              <span className="text-xs text-neutral-400">
                {video.owner?.username}
              </span>
              <span className="text-xs text-neutral-500">
                {video.views} views
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
