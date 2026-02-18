import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

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
    {
      name: "name",
      type: "text",
      placeholder: "John Doe",
      label: "Full Name",
      icon: User,
    },
    {
      name: "email",
      type: "email",
      placeholder: "you@example.com",
      label: "Email Address",
      icon: Mail,
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "••••••••",
      label: "Password",
      icon: Lock,
      hasToggle: true,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-6 sm:py-8 md:py-12 overflow-hidden">
      {/* Background decorative blobs - Responsive sizes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          {
            color: "blue",
            position: "-top-20 -right-20 sm:-top-40 sm:-right-40",
            delay: "",
          },
          {
            color: "indigo",
            position: "-bottom-20 -left-20 sm:-bottom-40 sm:-left-40",
            delay: "animation-delay-2000",
          },
          {
            color: "purple",
            position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            delay: "animation-delay-4000",
          },
        ].map((blob, idx) => (
          <div
            key={idx}
            className={`absolute ${blob.position} w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-${blob.color}-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob ${blob.delay}`}
          />
        ))}
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        {/* Form Card - Responsive padding and radius */}
        <form
          onSubmit={submit}
          className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20"
        >
          {/* Success Message - Responsive padding and text */}
          {success && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl flex items-start gap-2 animate-in">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-green-800 text-xs sm:text-sm font-medium">
                {success}
              </p>
            </div>
          )}

          {/* Error Message - Responsive padding and text */}
          {error && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl flex items-start gap-2 animate-in">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-red-800 text-xs sm:text-sm font-medium">
                {error}
              </p>
            </div>
          )}
          {/* Header - */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 text-center">
            Create Account
          </h1>

          {/* Input Fields - Responsive spacing and sizes */}
          {inputFields.map(
            (
              { name, type, placeholder, label, icon: Icon, hasToggle },
              idx,
            ) => (
              <div
                key={name}
                className={
                  idx === inputFields.length - 1
                    ? "mb-4 sm:mb-5"
                    : "mb-3 sm:mb-4"
                }
              >
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-1.5">
                  {label}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type={type}
                    placeholder={placeholder}
                    required
                    value={form[name]}
                    onChange={handleInputChange(name)}
                    className={`w-full pl-9 sm:pl-10 ${hasToggle ? "pr-9 sm:pr-10" : "pr-3"} py-2 sm:py-2.5 md:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 bg-white text-xs sm:text-sm`}
                  />
                  {hasToggle && (
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex hover:cursor-pointer items-center hover:opacity-90 transition-opacity"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ),
          )}

          {/* Submit Button - Responsive padding and text */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-blue-600 to-indigo-500 text-white py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-xs sm:text-sm md:text-base"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </>
            )}
          </button>

          {/* Divider - Responsive margins */}
          <div className="relative my-3 sm:my-4 md:my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 sm:px-3 bg-white/80 text-gray-500 font-medium">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link - Responsive padding and text */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full py-2.5 sm:py-3 md:py-3.5 px-3 sm:px-4 border-2 border-gray-200 rounded-lg sm:rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
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
