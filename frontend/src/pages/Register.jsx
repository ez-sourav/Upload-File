import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, CheckCircle, AlertCircle, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/register", form);
      setSuccess("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: "name", type: "text", placeholder: "John Doe", label: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "you@example.com", label: "Email Address", icon: Mail },
    { name: "password", type: showPassword ? "text" : "password", placeholder: "••••••••", label: "Password", icon: Lock, hasToggle: true }
  ];

  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { color: "blue", position: "-top-40 -right-40", delay: "" },
          { color: "indigo", position: "-bottom-40 -left-40", delay: "animation-delay-2000" },
          { color: "purple", position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", delay: "animation-delay-4000" }
        ].map((blob, idx) => (
          <div
            key={idx}
            className={`absolute ${blob.position} w-80 h-80 bg-${blob.color}-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob ${blob.delay}`}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create Account
        </h1>

        {/* Form Card */}
        <form
          onSubmit={submit}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/20"
        >
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2 animate-in">
              <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
              <p className="text-green-800 text-sm font-medium">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 animate-in">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Input Fields */}
          {inputFields.map(({ name, type, placeholder, label, icon: Icon, hasToggle }, idx) => (
            <div key={name} className={idx === inputFields.length - 1 ? "mb-5" : "mb-4"}>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {label}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={type}
                  placeholder={placeholder}
                  required
                  value={form[name]}
                  onChange={handleInputChange(name)}
                  className={`w-full pl-10 ${hasToggle ? 'pr-10' : 'pr-3'} py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 bg-white text-sm`}
                />
                {hasToggle && (
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex hover:cursor-pointer items-center hover:opacity-90 transition-opacity"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-blue-600 to-indigo-500 text-white py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-gray-50 text-gray-500 font-medium">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            Sign in instead
          </button>
        </form>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}