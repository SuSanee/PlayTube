import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router";
import router from "./routes";
import { restoreSession } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // Optional: Show loading state while checking session
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}

export default App;
