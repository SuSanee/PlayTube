import { createBrowserRouter } from "react-router";
import Layout from "../layout/Layout";
import Home from "../features/home/Home";
import Login from "../features/login/Login";
import Signup from "../signup/Signup";
import ChannelProfile from "../features/channel-profile/channel-profile.jsx";
import ChannelCustomization from "../features/channel-customization/channel-customization.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: ":username",
                element: <ChannelProfile />,
            },
            {
                path: "profile/edit",
                element: <ChannelCustomization />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
]);

export default router;
