import homeActiveIcon from "../../assets/icons/home_filled_icon.svg";
import homeInactiveIcon from "../../assets/icons/home_outline_icon.svg";
import historyIcon from "../../assets/icons/history_icon.svg";
import settingIcon from "../../assets/icons/setting_icon.svg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";

const topNavigationInfo = [
  {
    label: "Home",
    to: "/",
    icons: {
      active: homeActiveIcon,
      inactive: homeInactiveIcon,
    },
  },
  {
    label: "History",
    to: "/history",
    icons: {
      active: historyIcon,
      inactive: historyIcon,
    },
  },
];

const Sidebar = () => {
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);
  const [currentTab, setCurrentTab] = useState("Home")
//   const location = useLocation();

//   useEffect(() => {
//   const activeTab = topNavigationInfo.find(item => item.to === location.pathname);
//   if (activeTab && currentTab !== activeTab.label) {
//     setCurrentTab(activeTab.label);
//   }
// }, [location.pathname, currentTab]);

  return (
    <>
      <div
        className={`h-full p-2 flex flex-col gap-5 text-white justify-between shrink-0 mr-2 ${
          isSidebarOpen ? "w-50" : "w-20"
        }`}
      >
        {/* top navigation */}
        <div
          className={`items-center flex flex-col gap-4 py-3`}
        >
          {topNavigationInfo.map((element) => {
            return (
              <Link key={element.label} to={element.to} className="block w-full">
                <div
                  className={`flex py-2 ${
                    isSidebarOpen ? "gap-5 px-4" : "flex-col gap-2 px-3"
                  } items-center ${currentTab === element.label ? 'bg-[var(--dark-grey-color)] rounded-lg' : ''}`}
                  onClick={() => setCurrentTab(element.label)}
                >
                  <img
                    src={currentTab === element.label ? element.icons.active : element.icons.inactive}
                    alt={element.label}
                    className="w-7 h-7"
                  />
                  <span
                    className={`${
                      isSidebarOpen ? "text-base font-medium" : "text-xs"
                    }`}
                  >
                    {element.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        {/* bottom navigation */}
        <div>
          <div
            className={`flex ${
              isSidebarOpen ? "gap-5 px-4" : "flex-col gap-2 px-3"
            } items-center`}
          >
            <img src={settingIcon} alt={"Settings"} className="w-7 h-7" />
            <span
              className={`${isSidebarOpen ? "text-base font-medium" : "text-xs"}`}
            >
              Settings
            </span>
          </div>
          {/* toggle button for light and dark */}
          <div className="w-2"></div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
