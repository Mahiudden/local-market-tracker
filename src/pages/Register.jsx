import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { syncUser } from "../utils/api";

const Register = () => {
  const { register, googleSignIn } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", photo: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const newUser = await register(form.name, form.email, form.password, form.photo);
      if (newUser) {
        await syncUser({
          uid: newUser.uid,
          email: newUser.email,
          name: newUser.displayName || form.name,
          photo: newUser.photoURL || form.photo,
          role: "user"
        });
        console.log("User synced to backend");
      } else {
        console.error("No user returned from register");
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const user = await googleSignIn();
      if (user) {
        await syncUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
          role: "user"
        });
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 py-8">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5">
        <h2 className="text-2xl font-extrabold text-blue-700 text-center mb-2">Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="input input-bordered w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input input-bordered w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="photo"
          placeholder="Photo URL"
          className="input input-bordered w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={form.photo}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input input-bordered w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="btn w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-2 rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="w-full max-w-md mx-auto mt-4 text-center">
        <span className="text-gray-600">Already have an account?</span>
        <button className="text-blue-600 hover:underline ml-2" onClick={() => navigate('/login')}>Login</button>
      </div>
        <div className="max-w-md w-full mx-auto mt-4 flex flex-col gap-2 items-center">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 w-full bg-white border border-blue-200 text-blue-700 font-semibold py-2 rounded-lg shadow hover:bg-blue-50 transition"
          disabled={loading}
        >
          <svg width="22" height="22" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 29.9 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.5 20-21 0-1.3-.1-2.7-.5-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 17.1 19.2 14 24 14c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3 15.3 3 7.7 8.6 6.3 14.7z"/><path fill="#FBBC05" d="M24 44c5.8 0 10.7-1.9 14.3-5.1l-6.6-5.4C29.8 35.7 27 36.5 24 36.5c-5.8 0-10.7-3.9-12.4-9.2l-7 5.4C7.7 39.4 15.3 44 24 44z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.7 7.5-11.7 7.5-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.5 20-21 0-1.3-.1-2.7-.5-4z"/></g></svg>
          Continue with Google
        </button>
      </div>
      </form>
      
    </div>
  );
};

export default Register;