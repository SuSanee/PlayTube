import searchIcon from "../../assets/icons/search_icon.svg";
import logoIcon from "../../assets/icons/logo_icon.svg";
import menuIcon from "../../assets/icons/hamburger_icon.svg";
import plusIcon from "../../assets/icons/plus_icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/slices/sidebarSlice";
import { useNavigate } from "react-router-dom";
import { openUploadModal } from "../../store/slices/videoSlice";
import UploadVideoModal from "../upload/UploadVideoModal";

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleUserProfile = () => {
    navigate(`/${currentUser?.username}`);
  };

  const handleCreate = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(openUploadModal());
  };

  return (
    <>
      <header className="h-16 flex items-center justify-between gap-4 px-5 py-3 text-white border-b border-neutral-800 shrink-0">
        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => dispatch(toggleSidebar())}
          >
            <img
              src={menuIcon}
              aria-label="Menu"
              className="w-10 h-10 cursor-pointer"
            />
          </button>
          <div className="flex items-center gap-1">
            <img src={logoIcon} aria-label="logo" className="h-10 w-8" />
            <span className="text-lg font-semibold tracking-tight">
              PlayTube
            </span>
          </div>
        </div>

        <div className="flex flex-1 max-w-125 items-center gap-2">
          <div className="flex flex-1 items-center gap-3 rounded-full bg-neutral-900 border border-neutral-800 px-4 py-2">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
            />
            <button type="button" aria-label="Search" className="shrink-0">
              <img src={searchIcon} alt="Search" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <button
            type="button"
            className="inline-flex rounded-full bg-white text-black px-2 py-1 text-md font-semibold hover:bg-neutral-200 transition-colors duration-200 cursor-pointer"
            onClick={handleCreate}
          >
            <div className="flex gap-1 items-center">
              <img src={plusIcon} aria-label="Plus" className="w-7 h-7" />
              <span>Create</span>
            </div>
          </button>
          {isAuthenticated && currentUser ? (
            <button
              type="button"
              className="h-10 w-10 rounded-full bg-linear-to-br from-neutral-700 to-neutral-500"
              onClick={handleUserProfile}
            >
              <img
                src={currentUser.avatar}
                aria-label="Profile"
                className="rounded-full cursor-pointer w-full h-full object-cover"
              />
            </button>
          ) : (
            <button
              type="button"
              className="rounded-2xl border border-white py-1 px-3 cursor-pointer hover:bg-[#2a2a2a]"
              onClick={handleSignIn}
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Upload Video Modal */}
      <UploadVideoModal />
    </>
  );
};

export default Header;
