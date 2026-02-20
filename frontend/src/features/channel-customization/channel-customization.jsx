import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../../store/slices/userSlice";
import { apiRequest } from "../../utility/apiRequest";
import { useNavigate } from "react-router-dom";

const ChannelCustomization = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [fullName, setFullName] = useState(currentUser?.fullName ?? "");
  const [username, setUsername] = useState(currentUser?.username ?? "");
  const navigate = useNavigate();

  const isDisabled =
    !currentUser ||
    (fullName === currentUser.fullName && username === currentUser.username);
  const dispatch = useDispatch();

  const handlePublish = async () => {
    try {
      const response = await apiRequest("/users/update_user", {
        method: "PATCH",
        body: JSON.stringify({
          fullName: fullName.trim(),
          username: username.trim(),
        }),
      });
      dispatch(updateUserData(response.data));
      navigate(`/${username}`);
    } catch (error) {
      console.error("Failed to update user details:", error);
    }
  };

  // const handleChangeCoverImage = async () => {
  //   try{
  //     const response = await apiRequest("/users/update_coverImage", {
  //       method: "PATCH",

  //     })
  //   }
  // }

  if (!currentUser) {
    return <div className="p-6 text-white">Loading profile...</div>;
  }

  return (
    <div className="p-6 bg-[#1f1f1f] flex flex-col">
      <div className="sticky top-0 flex flex-col ml-6 mt-1">
        <div className="flex justify-between items-center">
          <span className="text-white font-bold text-xl">
            Channel Customization
          </span>
          <div className="flex gap-4 ml-6 items-center">
            <button className="px-6 py-2 bg-[var(--dark-grey-color)] text-white rounded-3xl hover:bg-[#4f4f4f] transition">
              Cancel
            </button>
            <button
              className={`px-6 py-2 rounded-3xl hover:bg-[#4f4f4f] transition ${isDisabled
                  ? "bg-[var(--dark-grey-color)] text-white"
                  : "bg-white text-black font-semibold"
                }`}
              disabled={isDisabled}
              onClick={handlePublish}
            >
              Publish
            </button>
          </div>
        </div>
        <div className="w-full bg-[var(--dark-grey-color)] h-0.5 mt-5 mb-2" />
      </div>
      <div className="p-6">
        <h2 className="text-white text-lg font-semibold mb-3">Cover image</h2>
        <div className="flex items-center">
          <div className="w-90 h-50 bg-[#151515] flex items-center justify-center">
            <img src={currentUser.coverImage} className="w-80 h-40"></img>
          </div>
          <div className="flex gap-4 ml-6">
            <button className="px-6 py-2 bg-[var(--dark-grey-color)] text-white rounded-3xl hover:bg-[#4f4f4f] transition">
              Change
            </button>
            <button className="px-6 py-2 bg-[var(--dark-grey-color)] text-white rounded-3xl hover:bg-[#4f4f4f] transition">
              Remove
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-white text-lg font-semibold mb-3">Avatar</h2>
        <div className="flex items-center">
          <div className="w-90 h-50 bg-[#151515] flex items-center justify-center">
            <img
              src={currentUser.avatar}
              className="w-40 h-40 rounded-full"
            ></img>
          </div>
          <div className="flex gap-4 ml-6 justify-end">
            <button className="px-6 py-2 bg-[var(--dark-grey-color)] text-white rounded-3xl hover:bg-[#4f4f4f] transition">
              Change
            </button>
            <button className="px-6 py-2 bg-[var(--dark-grey-color)] text-white rounded-3xl hover:bg-[#4f4f4f] transition">
              Remove
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-white text-lg font-semibold mb-3">Name</h2>
        <input
          value={fullName}
          className="text-white rounded-lg border-1 border-[color:var(--dark-grey-color)] bg-[#151515] px-3 py-2 w-180"
          onChange={(e) => setFullName(e.target.value)}
        ></input>
      </div>
      <div className="p-6">
        <h2 className="text-white text-lg font-semibold mb-3">Username</h2>
        <input
          value={username}
          className="text-white rounded-lg border-1 border-[color:var(--dark-grey-color)] bg-[#151515] px-3 py-2 w-180"
          onChange={(e) => setUsername(e.target.value)}
        ></input>
      </div>
    </div>
  );
};

export default ChannelCustomization;
