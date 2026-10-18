import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  Sparkles,
  TrendingUp,
  Search,
  MapPin,
  ChevronRight,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, getFullImageUrl } from '../services/api';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [addressQuery, setAddressQuery] = useState('');
  const [recentValuations, setRecentValuations] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);

  const fetchRecent = async () => {
    try {
      setLoadingListings(true);
      const res = await api.get('/listing');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setRecentValuations(res.data.slice(0, 3));
      } else {
        // Showcase properties
        setRecentValuations([
          {
            id: 'val_1',
            title: 'Modern 2-Story House',
            address: 'Banilad, Cebu City, Cebu',
            estimatedValue: '₱8,500,000',
            lotSize: '180 sqm',
            yearBuilt: 2021,
            riskLevel: 'LOW',
            thumbnail: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=60',
          },
          {
            id: 'val_2',
            title: 'Corner Lot Townhouse',
            address: 'Mandaue City, Central Visayas',
            estimatedValue: '₱5,200,000',
            lotSize: '120 sqm',
            yearBuilt: 2018,
            riskLevel: 'LOW',
            thumbnail: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=60',
          },
          {
            id: 'val_3',
            title: 'Coastal Villa',
            address: 'Punta Engaño, Lapu-Lapu City',
            estimatedValue: '₱14,800,000',
            lotSize: '350 sqm',
            yearBuilt: 2023,
            riskLevel: 'MEDIUM',
            thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60',
          },
        ]);
      }
    } catch (err) {
      console.warn('Could not load recent valuations from backend:', err);
    } finally {
      setLoadingListings(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressQuery.trim()) {
      navigate(`/valuation/step1?search=${encodeURIComponent(addressQuery.trim())}`);
    } else {
      navigate('/valuation/step1');
    }
  };

  const handleOpenListing = (item: any) => {
    const valuation = item.valuations?.[0];
    const valValue = valuation?.finalValuation || valuation?.estimatedValue || item.price || 5000000;

    const payload = {
      listingId: item.id,
      title: item.title,
      address: item.address,
      lotSize: item.lotSize || 150,
      yearBuilt: item.yearBuilt || 2020,
      propertyType: item.propertyType || 'Residential',
      estimatedValue: valValue,
      finalValuation: valValue,
      confidenceScore: valuation?.structuralInsights?.confidence || 94,
      riskLevel: valuation?.riskLevel || item.riskLevel || 'LOW',
      riskScore: valuation?.riskScore || 2.4,
      riskDetails: valuation?.riskDetails || {
        floodRisk: 'Low Hazard',
        landslideRisk: 'Safe',
        stormSurgeRisk: 'None',
      },
      nearbyHotspots: valuation?.nearbyHotspots || [],
      structuralInsights: valuation?.structuralInsights?.insights || [
        'Appraisal synced from Cloud Run backend',
      ],
      valuationBreakdown: valuation?.valuationBreakdown || null,
      photos: (item.images || []).map((img: any) => getFullImageUrl(img.url)),
      isBackendGenerated: Boolean(valuation),
    };

    sessionStorage.setItem('valyou_latest_result', JSON.stringify(payload));
    navigate('/valuation/result');
  };

  const formatPrice = (item: any) => {
    if (item.estimatedValue && typeof item.estimatedValue === 'string') return item.estimatedValue;
    const valuation = item.valuations?.[0];
    const val = valuation?.finalValuation || valuation?.estimatedValue || item.price || 0;
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(typeof val === 'number' ? val : parseFloat(val) || 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">

      {/* Hero Welcome Header Banner with Memphis Styling */}
      <div className="relative bg-gradient-to-br from-white via-primary-soft/40 to-primary-pastel/60 border-2 border-border-light rounded-3xl p-6 sm:p-10 shadow-sm overflow-hidden">
        {/* Decorative Memphis Circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary-pastel rounded-full opacity-60 pointer-events-none" />
        <div className="absolute bottom-2 right-1/3 w-28 h-28 bg-accent-yellow-pastel rounded-full opacity-60 pointer-events-none" />
        <div className="absolute -bottom-6 left-12 w-32 h-32 bg-accent-orange-pastel rounded-full opacity-40 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-primary/20 rounded-full text-xs font-bold text-primary mb-4 shadow-xs">
            <Sparkles size={14} className="text-accent-orange" />
            <span>Welcome back, {currentUser?.firstName || currentUser?.name || 'Valuer'}!</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight mb-3">
            Real Estate Valuation <br className="hidden sm:inline" />
            <span className="valyou-gradient-text">Engineered for Fairness</span>
          </h1>

          <p className="text-sm sm:text-base text-text-secondary mb-6 leading-relaxed">
            AI-driven Cebu property appraisals, automated structural analysis, and Project NOAH environmental hazard checks.
          </p>

          {/* Quick Address Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="flex-1 relative flex items-center">
              <Search size={18} className="absolute left-4 text-text-muted" />
              <input
                type="text"
                value={addressQuery}
                onChange={(e) => setAddressQuery(e.target.value)}
                placeholder="Enter street, barangay, or municipality..."
                className="w-full pl-11 pr-4 py-3 bg-white border-2 border-border-light rounded-2xl text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-2xl shadow hover:bg-primary-hover active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Valuate</span>
              <ChevronRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* 3 Memphis Quick-Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Action 1: AI Scanner */}
        <Link
          to="/valuation/step1"
          className="group relative bg-gradient-to-br from-primary to-[#3d8fd9] text-white p-6 rounded-3xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/15 rounded-full group-hover:scale-125 transition-transform" />
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <Camera size={26} />
          </div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-bold">AI Scanner</h3>
            <ArrowUpRight size={20} className="opacity-75 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </div>
          <p className="text-white/85 text-xs sm:text-sm">
            Scan property with automated image analysis and condition assessment.
          </p>
        </Link>

        {/* Action 2: Instant Valuation */}
        <Link
          to="/valuation/step1"
          className="group relative bg-gradient-to-br from-accent-orange to-[#ffaa40] text-white p-6 rounded-3xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/15 rounded-full group-hover:scale-125 transition-transform" />
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <Sparkles size={26} />
          </div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-bold">Instant Estimate</h3>
            <ArrowUpRight size={20} className="opacity-75 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </div>
          <p className="text-white/85 text-xs sm:text-sm">
            Get comparable neighborhood pricing and risk-adjusted dealer market value.
          </p>
        </Link>

        {/* Action 3: Hazard Risk Map */}
        <Link
          to="/valuation/step1"
          className="group relative bg-white border-2 border-border-light p-6 rounded-3xl shadow-sm hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all sm:col-span-2 lg:col-span-1"
        >
          <div className="w-14 h-14 bg-primary-pastel text-primary rounded-2xl flex items-center justify-center mb-4">
            <TrendingUp size={26} />
          </div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-bold text-text-primary">Hazard Analytics</h3>
            <ArrowUpRight size={20} className="text-text-muted group-hover:text-primary transition-colors" />
          </div>
          <p className="text-text-secondary text-xs sm:text-sm">
            Real-time Project NOAH environmental hazard layers for flood and landslide.
          </p>
        </Link>

      </div>

      {/* Recent Valuations Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary">
              Recent Valuations
            </h2>
          </div>
          <Link
            to="/properties"
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-primary hover:underline"
          >
            <span>View All</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Valuation Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentValuations.map((item) => {
            const valuation = item.valuations?.[0];
            const risk = valuation?.riskLevel || item.riskLevel || 'LOW';
            const imgUrl = item.images && item.images.length > 0
              ? getFullImageUrl(item.images[0].url)
              : (item.thumbnail || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=60');

            return (
              <div
                key={item.id}
                onClick={() => handleOpenListing(item)}
                className="bg-white border-2 border-border-light rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Image Header with Price Badge */}
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-gray-100">
                    <img
                      src={imgUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black text-primary shadow">
                      {formatPrice(item)}
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow">
                      {risk} Risk
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <h3 className="font-bold text-base text-text-primary mb-1 truncate">
                      {item.title}
                    </h3>
                    <p className="flex items-center gap-1.5 text-xs text-text-secondary mb-4 truncate">
                      <MapPin size={14} className="text-accent-orange shrink-0" />
                      <span>{item.address}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-2 p-3 bg-background-main rounded-2xl text-xs">
                      <div>
                        <span className="text-[10px] text-text-muted uppercase font-bold block">Lot Size</span>
                        <span className="font-bold text-text-primary">{item.lotSize ? `${item.lotSize} sqm` : '150 sqm'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-muted uppercase font-bold block">Year Built</span>
                        <span className="font-bold text-text-primary">{item.yearBuilt || '2021'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="px-5 pb-5 pt-0">
                  <button
                    type="button"
                    className="w-full py-2.5 px-4 bg-background-main hover:bg-primary-pastel/60 text-primary border border-border-light rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <span>View Appraisal Report</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Home;
