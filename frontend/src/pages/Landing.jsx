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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-linear-to-br from-blue-600 to-indigo-500 rounded-xl shadow-lg">
            <Upload className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">FileManager</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] transition-all duration-200 text-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-16 pb-20 text-center">
        

        {/* Main Headline */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up">
          File Upload & Manager
          <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500 mt-2">
            Made Simple
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-gray-600 max-w-2xl mb-10 leading-relaxed animate-slide-up animation-delay-200">
          Upload, manage, and download your files securely from anywhere.
          Images, PDFs, documents — all in one place with blazing fast performance.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-slide-up animation-delay-400">
          <Link
            to="/register"
            className="group px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-500 text-white rounded-xl font-semibold shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/50 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/app"
            className="group px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-900 rounded-xl font-semibold hover:bg-white hover:border-gray-300 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
          >
            <Play className="h-5 w-5 text-blue-600" />
            <span>View Demo</span>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full animate-fade-in animation-delay-600">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/30 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
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
      `}</style>
    </div>
  );
}