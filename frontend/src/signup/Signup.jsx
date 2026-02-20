import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../utility/apiRequest";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!avatar) {
      setError("Avatar is required");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);

    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      setLoading(true);

      await apiRequest("/auth/register", {
        method: "POST",
        body: formData,
      });

      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-8 bg-(--theme-color)">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center tracking-tight text-(--theme-color)">
          Create Your Account
        </h2>

        {error && (
          <div className="bg-red-500 text-white p-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name and Username Row */}
          <div className="grid grid-cols-2 gap-3">
            <input
              id="fullName"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-full bg-white text-black border border-gray-300 focus:border-gray-400 focus:outline-none placeholder:text-gray-400 text-sm"
            />
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-full bg-white text-black border border-gray-300 focus:border-gray-400 focus:outline-none placeholder:text-gray-400 text-sm"
            />
          </div>

          {/* Email & Password Row */}
          <div className="grid grid-cols-2 gap-3">
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-full bg-white text-black border border-gray-300 focus:border-gray-400 focus:outline-none placeholder:text-gray-400 text-sm"
            />
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-full bg-white text-black border border-gray-300 focus:border-gray-400 focus:outline-none placeholder:text-gray-400 text-sm"
            />
          </div>

          {/* File Uploads Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Avatar <span className="text-red-500">*</span>
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                required
                className="w-full text-xs px-2 py-2 rounded-lg bg-white text-black border border-gray-300 focus:border-gray-400 focus:outline-none file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Cover Image
              </label>
              <input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="w-full text-xs px-2 py-2 rounded-lg bg-white text-black border border-gray-300 focus:border-gray-400 focus:outline-none file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-white rounded-full font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 bg-(--theme-color) text-sm mt-4"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-600 text-xs">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold hover:underline transition text-(--theme-color)"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
