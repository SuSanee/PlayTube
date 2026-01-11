import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../../utility/apiRequest";

const ChannelProfile = () => {
  const { username } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiRequest(`/users/${username}`);
        setProfile(response.data);
      } catch {
        console.error("Failed to fetch Profile");
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  const isOwnProfile = currentUser?.username === profile?.username;
  const handleChannelCustomization = () => {
    navigate("/profile/edit")
  }

  return (
    <>
      {!profile ? (
        <h1 className="text-white">Loading....</h1>
      ) : (
        <div className="flex flex-col text-white w-full px-7 py-3">
          <div className="flex flex-col gap-4">
            {profile.coverImage && (
              <img src={profile.coverImage} className={`h-50 rounded-lg object-cover`} />
            )}
            <div className="flex gap-5 items-center">
              <img src={profile.avatar} className="w-40 h-40 rounded-full" />
              <div className="flex flex-col gap-2">
                <span className="text-3xl font-medium">{profile.fullName}</span>
                <div className="flex gap-1 items-center text-(--grey-color) text-sm">
                  <span className="text-base text-(--white-color) font-medium">
                    {profile.username}
                  </span>
                  {"•"}
                  <span>{profile.subscribersCount} Subscribers</span>
                  {"•"}
                  <span>{profile.subscribedToCount} Subscribed</span>
                </div>
                {isOwnProfile ? (
                  <button className="w-50 bg-(--dark-grey-color) py-2 rounded-4xl hover:cursor-pointer" onClick={handleChannelCustomization}>
                    Customise Channel
                  </button>
                ) : (
                  <button
                    className={`w-30 ${
                      profile.isSubscribed
                        ? "bg-(--dark-grey-color)"
                        : "bg-(--theme-color)"
                    } py-2 rounded-4xl`}
                  >
                    {profile.isSubscribed ? "Subscribed" : "Subscribe"}
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* <div className="px-7 py-6 flex gap-7 flex-wrap">
          <div className="flex flex-col pb-3 gap-2">
            <img src={coverImage} className="w-72 h-50 rounded-lg" />
            <div className="flex flex-col gap-0.5">
              <span>React Rodemap</span>
              <span>chai aur code</span>
            </div>
          </div>
          <div className="flex flex-col pb-3 gap-2">
            <img src={coverImage} className="w-72 h-50 rounded-lg" />
            <div className="flex flex-col gap-0.5">
              <span>React Rodemap</span>
              <span>chai aur code</span>
            </div>
          </div>
          <div className="flex flex-col pb-3 gap-2">
            <img src={coverImage} className="w-72 h-50 rounded-lg" />
            <div className="flex flex-col gap-0.5">
              <span>React Rodemap</span>
              <span>chai aur code</span>
            </div>
          </div>
          <div className="flex flex-col pb-3 gap-2">
            <img src={coverImage} className="w-72 h-50 rounded-lg" />
            <div className="flex flex-col gap-0.5">
              <span>React Rodemap</span>
              <span>chai aur code</span>
            </div>
          </div>
          <div className="flex flex-col pb-3 gap-2">
            <img src={coverImage} className="w-72 h-50 rounded-lg" />
            <div className="flex flex-col gap-0.5">
              <span>React Rodemap</span>
              <span>chai aur code</span>
            </div>
          </div>
          <div className="flex flex-col pb-3 gap-2">
            <img src={coverImage} className="w-72 h-50 rounded-lg" />
            <div className="flex flex-col gap-0.5">
              <span>React Rodemap</span>
              <span>chai aur code</span>
            </div>
          </div>
          <div className="flex flex-col pb-3 gap-2">
            <img src={coverImage} className="w-72 h-50 rounded-lg" />
            <div className="flex flex-col gap-0.5">
              <span>React Rodemap</span>
              <span>chai aur code</span>
            </div>
          </div>
          <div className="flex flex-col pb-3 gap-2">
            <img src={coverImage} className="w-72 h-50 rounded-lg" />
            <div className="flex flex-col gap-0.5">
              <span>React Rodemap</span>
              <span>chai aur code</span>
            </div>
          </div>
        </div> */}
        </div>
      )}
    </>
  );
};

export default ChannelProfile;
