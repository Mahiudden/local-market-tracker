import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { syncUser } from "../utils/api";

const Login = () => {
  const { login, googleSignIn, resetPassword } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await login(form.email, form.password);
      const user = userCredential.user || userCredential;
      // Sync user to backend
      await syncUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
        role: "user"
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const userCredential = await googleSignIn();
      const user = userCredential?.user || userCredential;
      // Sync user to backend
      await syncUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
        role: "user"
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetMsg("");
    try {
      await resetPassword(resetEmail);
      setResetMsg("A password reset link has been sent to your email!");
    } catch (err) {
      setResetMsg("There was a problem resetting: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 py-8">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5">
        <h2 className="text-2xl font-extrabold text-blue-700 text-center mb-2">Login</h2>
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
          type="password"
          name="password"
          placeholder="Password"
          className="input input-bordered w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={form.password}
          onChange={handleChange}
          required
        />
        <div className="text-right text-sm mb-2">
          <button type="button" className="text-blue-500 hover:underline" onClick={() => setShowReset(true)}>
            Forgot Password?
          </button>
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="btn w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-2 rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="w-full max-w-md mx-auto mt-4 text-center">
        <span className="text-gray-600">Don't have an account?</span>
        <button className="text-blue-600 hover:underline ml-2" onClick={() => navigate('/register')}>Register</button>
      </div>
        <button
          type="button"
          className="btn w-full bg-white border border-blue-200 text-blue-700 font-semibold py-2 rounded-lg shadow hover:bg-blue-50 transition mt-2 flex items-center justify-center gap-2"
          onClick={handleGoogle}
          disabled={loading}
        >
          <span className="fab fa-google"></span>
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </form>
      
      {showReset && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow p-6 w-full max-w-sm relative">
            <button className="absolute top-2 right-2 text-gray-400 text-xl" onClick={() => setShowReset(false)}>×</button>
            <h3 className="text-lg font-bold mb-4 text-blue-700">Forgot Password?</h3>
            <form onSubmit={handleReset} className="space-y-3">
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                required
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Send Reset Link</button>
              {resetMsg && <div className="text-center text-sm mt-2 text-blue-600">{resetMsg}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;