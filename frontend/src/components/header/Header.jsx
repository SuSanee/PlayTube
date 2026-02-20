import searchIcon from "../../assets/icons/search_icon.svg";
import logoIcon from "../../assets/icons/logo_icon.svg";
import menuIcon from "../../assets/icons/hamburger_icon.svg";
import plusIcon from "../../assets/icons/plus_icon.svg";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/slices/sidebarSlice";
import { useNavigate } from "react-router-dom";
import { openUploadModal } from "../../store/slices/videoSlice";
import { logout } from "../../store/slices/authSlice";
import { clearUserData } from "../../store/slices/userSlice";
import UploadVideoModal from "../upload/UploadVideoModal";

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleCreate = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(openUploadModal());
  };

  const handleViewChannel = () => {
    setShowProfileMenu(false);
    navigate(`/${currentUser?.username}`);
  };

  const handleSignOut = async () => {
    setShowProfileMenu(false);
    await dispatch(logout());
    dispatch(clearUserData());
    navigate("/");
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
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                className="h-10 w-10 rounded-full bg-linear-to-br from-neutral-700 to-neutral-500"
                onClick={() => setShowProfileMenu((prev) => !prev)}
              >
                <img
                  src={currentUser.avatar}
                  aria-label="Profile"
                  className="rounded-full cursor-pointer w-full h-full object-cover"
                />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-12 w-72 bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700 overflow-hidden z-50 animate-[fadeIn_0.15s_ease-out]">
                  {/* User Info Section */}
                  <div className="flex items-center gap-3 px-4 py-4 border-b border-neutral-700">
                    <img
                      src={currentUser.avatar}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="overflow-hidden">
                      <p className="text-white text-sm font-semibold truncate">
                        {currentUser.fullName}
                      </p>
                      <p className="text-neutral-400 text-xs truncate">
                        @{currentUser.username}
                      </p>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="py-1">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-neutral-700 transition-colors duration-150 cursor-pointer"
                      onClick={handleViewChannel}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-neutral-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                      <span>View your channel</span>
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-neutral-700 transition-colors duration-150 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-neutral-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                        />
                      </svg>
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
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

