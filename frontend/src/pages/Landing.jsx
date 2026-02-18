import { Link, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Upload, FileText, Image, Lock, Zap, Cloud, ArrowRight, Play, Sparkles } from "lucide-react";

export default function Landing() {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/app" replace />;
  }

  const features = [
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Drag & drop or click to upload files instantly"
    },
    {
      icon: Lock,
      title: "Secure Storage",
      description: "Your files are encrypted and protected"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Quick access to all your files anytime"
    },
    {
      icon: Cloud,
      title: "Cloud Sync",
      description: "Access your files from any device"
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-80 sm:h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="p-1.5 sm:p-2 bg-linear-to-br from-blue-600 to-indigo-500 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg">
            <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <span className="text-base sm:text-xl font-bold text-gray-900">FileManager</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-linear-to-r from-blue-600 to-indigo-500 text-white rounded-lg sm:rounded-xl font-semibold shadow-md sm:shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] transition-all duration-200 text-xs sm:text-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20 text-center">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight animate-slide-up">
          File Upload & Manager
          <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500 mt-1 sm:mt-2">
            Made Simple
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl sm:max-w-2xl mb-6 sm:mb-8 md:mb-10 leading-relaxed px-2 animate-slide-up animation-delay-200">
          Upload, manage, and download your files securely from anywhere.
          Images, PDFs, documents — all in one place with blazing fast performance.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-12 md:mb-16 w-full sm:w-auto px-4 sm:px-0 animate-slide-up animation-delay-400">
          <Link
            to="/register"
            className="group px-6 py-3 sm:px-8 sm:py-4 bg-linear-to-r from-blue-600 to-indigo-500 text-white rounded-xl font-semibold shadow-xl sm:shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/50 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/app"
            className="group px-6 py-3 sm:px-8 sm:py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-900 rounded-xl font-semibold hover:bg-white hover:border-gray-300 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-md sm:shadow-lg text-sm sm:text-base"
          >
            <Play className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span>View Demo</span>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 max-w-6xl w-full px-2 sm:px-4 animate-fade-in animation-delay-600">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group bg-white/80 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-blue-600 to-indigo-500 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg shadow-blue-500/30 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </main>

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
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        
        .animation-delay-200 { animation-delay: 0.2s; animation-fill-mode: both; }
        .animation-delay-400 { animation-delay: 0.4s; animation-fill-mode: both; }
        .animation-delay-600 { animation-delay: 0.6s; animation-fill-mode: both; }
        .animation-delay-800 { animation-delay: 0.8s; animation-fill-mode: both; }

        /* Extra small devices breakpoint */
        @media (min-width: 475px) {
          .xs\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}