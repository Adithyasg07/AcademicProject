import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiService } from "../api/apiService";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      setIsLoading(false);
      return;
    }

    if (mobile.length !== 10) {
      setMessage({ type: "error", text: "Mobile number must be exactly 10 digits." });
      setIsLoading(false);
      return;
    }

    const userData = {
      NAME: username,
      EMAIL: email,
      PASSWORD: password,
      MOBILENUMBER: mobile
    };

    try {
      await apiService.post("/Auth/register", userData);
      setMessage({ type: "success", text: "Account created! Welcome to Organic Tattva." });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Register error:", error);
      const errString = error.message || "";
      if (errString.includes("Email might already exist")) {
        setMessage({ type: "error", text: "This email is already registered." });
      } else {
        setMessage({ type: "error", text: "Internal server error. Please try again later." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7fdf9] px-4 py-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20 translate-x-1/4 translate-y-1/4"></div>

      <div className="w-full max-w-[460px] relative z-10 transition-all duration-500">
        
        {/* Register Card */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,40,0,0.06)] border border-green-50/50 backdrop-blur-sm bg-white/98">
          
          {/* Logo Section */}
          <div className="mb-6 text-center flex flex-col items-center">
            <Link to="/home" className="inline-block transition-transform hover:scale-105 active:scale-95 duration-300">
              <img 
                src="/logo.png" 
                alt="Organic Tattva Logo" 
                className="h-16 sm:h-20 w-auto drop-shadow-sm mb-2" 
              />
            </Link>
            <h1 className="text-xl sm:text-2xl font-extrabold text-green-900 tracking-tight">organic tattva</h1>
            <div className="h-0.5 w-10 bg-green-500 rounded-full mt-2 opacity-30"></div>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-6 text-center">Create your account</h2>

          {message.text && (
            <div className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-center justify-center animate-in fade-in slide-in-from-top-1 duration-300 ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            {/* Full Name */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-green-600 transition-colors">
                  <FaUser size={14} />
                </span>
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-transparent rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/5 outline-none transition-all duration-300 font-medium text-gray-700 placeholder:text-gray-300 text-sm"
                  placeholder="John Doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-green-600 transition-colors">
                  <FaEnvelope size={14} />
                </span>
                <input
                  type="email"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-transparent rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/5 outline-none transition-all duration-300 font-medium text-gray-700 placeholder:text-gray-300 text-sm"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-green-600 transition-colors">
                  <FaLock size={14} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-11 pr-10 py-3 bg-gray-50/50 border border-transparent rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/5 outline-none transition-all duration-300 font-medium text-gray-700 placeholder:text-gray-300 text-sm"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-700 transition"
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-green-600 transition-colors">
                  <FaLock size={14} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-transparent rounded-xl focus:bg-white focus:ring-4 outline-none transition-all duration-300 font-medium text-gray-700 placeholder:text-gray-300 text-sm ${
                    confirmPassword && confirmPassword !== password 
                    ? 'border-red-200 focus:border-red-500 focus:ring-red-500/5' 
                    : 'focus:border-green-500 focus:ring-green-500/5'
                  }`}
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-green-600 transition-colors">
                  <FaPhone size={14} />
                </span>
                <input
                  type="text" // Use text for custom numeric filtering
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-transparent rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/5 outline-none transition-all duration-300 font-medium text-gray-700 placeholder:text-gray-300 text-sm"
                  placeholder="10-digit number"
                  value={mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                    if (value.length <= 10) {
                      setMobile(value); // Limit to 10 digits
                    }
                  }}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 mt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl font-black text-sm sm:text-base shadow-[0_10px_20px_-5px_rgba(22,163,74,0.2)] hover:shadow-[0_15px_30px_-5px_rgba(22,163,74,0.3)] transform hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          {/* Footer Section */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col items-center gap-2">
            <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider text-center">Already a member?</p>
            <Link 
              to="/login" 
              className="w-full flex items-center justify-center py-3 bg-green-50 text-green-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-100 transition-all border border-green-100/50"
            >
              Sign In Instead
            </Link>
          </div>
        </div>

        {/* Bottom copyright/links */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
            © 2026 Organic Tattva
          </p>
        </div>
      </div>
    </div>
  );
}