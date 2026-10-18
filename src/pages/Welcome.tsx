import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Sparkles, TrendingUp, Shield, Layers, CheckCircle2 } from 'lucide-react';

export const Welcome: React.FC = () => {
  return (
    <div className="relative min-h-[calc(100dvh-5rem)] flex flex-col justify-center overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Memphis Background Accents */}
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full memphis-circle-blue pointer-events-none blur-2xl opacity-60" />
      <div className="absolute top-1/3 left-4 w-60 h-60 rounded-full memphis-circle-yellow pointer-events-none blur-2xl opacity-50" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full memphis-circle-orange pointer-events-none blur-3xl opacity-40" />

      <div className="relative max-w-5xl mx-auto w-full z-10 text-center">
        
        {/* Brand Hero Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-pastel/80 border border-primary/20 rounded-full mb-8 shadow-sm">
          <Sparkles size={16} className="text-primary animate-spin" />
          <span className="text-xs sm:text-sm font-bold text-primary">
            Next-Gen AI Property Valuation Engine
          </span>
        </div>

        {/* Logo and Big Title */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <img 
              src="/logo.png" 
              alt="Valyou Logo" 
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md transform transition-transform group-hover:scale-105"
            />
          </div>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black valyou-gradient-text tracking-tight mb-4 leading-none">
          Valyou
        </h1>

        <p className="text-xl sm:text-2xl font-bold text-text-primary mb-4 max-w-2xl mx-auto">
          Fairness in Every <span className="text-accent-orange">Square Meter</span>
        </p>

        <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          AI-powered property valuations, 3D structural analysis, and hyper-local analytics tailored for real estate professionals and property owners.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <Link
            to="/valuation/step1"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-[#3d8fd9] text-white rounded-2xl font-extrabold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:from-primary-hover hover:to-primary active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <span>Start Valuation</span>
            <ArrowRight size={20} />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-border-light text-text-primary rounded-2xl font-extrabold text-base hover:bg-background-main active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Agent Sign In</span>
          </Link>
        </div>

        {/* Memphis Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
          
          {/* Card 1: AI Scanner */}
          <div className="relative bg-gradient-to-br from-primary to-[#3d8fd9] p-6 rounded-3xl text-white shadow-md overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/15 rounded-full pointer-events-none" />
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Camera size={28} />
            </div>
            <h3 className="text-xl font-black mb-2">AI Scanner</h3>
            <p className="text-white/85 text-sm leading-relaxed mb-4">
              Automated structural condition analysis and photo-based appraisal.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-accent-yellow">
              <CheckCircle2 size={14} />
              <span>Multi-angle inspection</span>
            </div>
          </div>

          {/* Card 2: Instant Valuation */}
          <div className="relative bg-gradient-to-br from-accent-orange to-[#ffaa40] p-6 rounded-3xl text-white shadow-md overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/15 rounded-full pointer-events-none" />
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles size={28} />
            </div>
            <h3 className="text-xl font-black mb-2">Instant Valuation</h3>
            <p className="text-white/85 text-sm leading-relaxed mb-4">
              Real-time property appraisal calculated from comparable neighborhood sales and market trends.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <CheckCircle2 size={14} />
              <span>Confidence score included</span>
            </div>
          </div>

          {/* Card 3: Hyper-Local Analytics */}
          <div className="relative bg-white border-2 border-border-light p-6 rounded-3xl shadow-md overflow-hidden group hover:-translate-y-1 transition-transform md:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 bg-primary-pastel rounded-2xl flex items-center justify-center text-primary mb-4">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-xl font-black text-text-primary mb-2">Hyper-Local Map</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              OpenStreetMap integration with flood, landslide, and storm surge environmental hazard overlays.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <CheckCircle2 size={14} />
              <span>Project NOAH hazards</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Welcome;
