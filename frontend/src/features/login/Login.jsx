import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, clearError, googleLogin, restoreSession } from "../../store/slices/authSlice";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    try {
      await dispatch(login({ email, password })).unwrap();
      await dispatch(restoreSession()).unwrap();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const loginWithGoogle = async (credentialResponse) => {
    try {
      await dispatch(googleLogin(credentialResponse.credential)).unwrap();
      await dispatch(restoreSession()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-(--theme-color)">
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center tracking-tight text-(--theme-color)">
          Sign In to PlayTube
        </h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-full bg-white text-black border border-gray-300 focus:border-gray-400 focus:outline-none placeholder:text-gray-400"
            />
          </div>

          <div>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-full bg-white text-black border border-gray-300 focus:border-gray-400 focus:outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center justify-between text-sm pt-2">
            <label className="flex items-center text-gray-700 cursor-pointer">
              <input type="checkbox" className="mr-2 cursor-pointer" />
              Remember me
            </label>
            <Link
              to="#"
              className="hover:underline transition text-(--theme-color)"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white rounded-full font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 bg-(--theme-color)"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold hover:underline transition text-(--theme-color)"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <div className="mt-4">
            <GoogleLogin
              onSuccess={loginWithGoogle}
              onError={() => {
                console.error("Google Login Failed");
              }}
              width="100%"
              size="large"
              text="signin_with"
              shape="pill"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
