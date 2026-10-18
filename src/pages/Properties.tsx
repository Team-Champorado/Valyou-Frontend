import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  Trash2, 
  Loader2, 
  Sparkles,
  Calendar,
  Maximize
} from 'lucide-react';
import { api, getFullImageUrl } from '../services/api';

interface PropertyItem {
  id: string;
  title: string;
  address: string;
  price: number | string;
  lotSize: number | string;
  yearBuilt: number | string;
  propertyType: string;
  valuationStatus?: string;
  valuations?: any[];
  images?: { url: string }[];
  thumbnail?: string;
  riskLevel?: string;
}

export const Properties: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/listing');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setProperties(res.data);
      } else {
        // Fallback showcase items if no properties saved in backend yet
        setProperties([]);
      }
    } catch (err) {
      console.warn('Could not fetch user listings from Cloud Run backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this property appraisal?')) return;

    try {
      setDeletingId(id);
      await api.delete(`/listing/${id}`);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete listing:', err);
      alert('Could not delete listing. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSelectProperty = (prop: PropertyItem) => {
    const latestValuation = prop.valuations?.[0];
    const valValue = latestValuation?.finalValuation || latestValuation?.estimatedValue || prop.price || 5000000;

    const payload = {
      listingId: prop.id,
      title: prop.title,
      address: prop.address,
      lotSize: prop.lotSize,
      yearBuilt: prop.yearBuilt,
      propertyType: prop.propertyType,
      estimatedValue: valValue,
      finalValuation: valValue,
      confidenceScore: latestValuation?.structuralInsights?.confidence || 94,
      riskLevel: latestValuation?.riskLevel || 'LOW',
      riskScore: latestValuation?.riskScore || 2.5,
      riskDetails: latestValuation?.riskDetails || {
        floodRisk: 'Low Hazard',
        landslideRisk: 'Safe',
        stormSurgeRisk: 'None',
      },
      nearbyHotspots: latestValuation?.nearbyHotspots || [],
      structuralInsights: latestValuation?.structuralInsights?.insights || [
        'Appraisal synced from Valyou Cloud Run backend',
      ],
      valuationBreakdown: latestValuation?.valuationBreakdown || null,
      photos: (prop.images || []).map((img) => getFullImageUrl(img.url)),
      isBackendGenerated: Boolean(latestValuation),
    };

    sessionStorage.setItem('valyou_latest_result', JSON.stringify(payload));
    navigate('/valuation/result');
  };

  const formatPrice = (val: any) => {
    const num = typeof val === 'number' ? val : parseFloat(val) || 0;
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary">
            My Valued Properties
          </h1>
          <p className="text-sm text-text-secondary">
            Synchronized directly with Valyou Cloud Run & PostgreSQL
          </p>
        </div>

        <Link
          to="/valuation/step1"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-[#3d8fd9] text-white rounded-2xl font-bold text-sm shadow hover:from-primary-hover hover:to-primary active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={18} />
          <span>New Valuation</span>
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 size={36} className="text-primary animate-spin" />
          <p className="text-sm font-semibold text-text-muted">
            Loading properties from Cloud Run backend...
          </p>
        </div>
      ) : properties.length === 0 ? (
        /* Empty State */
        <div className="bg-white border-2 border-border-light rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-pastel text-primary flex items-center justify-center mx-auto">
            <Building2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-text-primary">
            No Properties Appraised Yet
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Start a new appraisal to scan property photos, evaluate environmental hazards, and calculate property value.
          </p>
          <Link
            to="/valuation/step1"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl font-bold text-sm shadow hover:bg-primary-hover active:scale-95 transition-all"
          >
            <Plus size={18} />
            <span>Create First Valuation</span>
          </Link>
        </div>
      ) : (
        /* Properties Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => {
            const valuation = prop.valuations?.[0];
            const displayPrice = valuation?.finalValuation || valuation?.estimatedValue || prop.price;
            const risk = valuation?.riskLevel || 'LOW';
            const imgUrl = prop.images && prop.images.length > 0 
              ? getFullImageUrl(prop.images[0].url) 
              : (prop.thumbnail || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=60');

            return (
              <div
                key={prop.id}
                onClick={() => handleSelectProperty(prop)}
                className="bg-white border-2 border-border-light rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={imgUrl}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black text-primary shadow">
                      {formatPrice(displayPrice)}
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow">
                      {risk} Risk
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-base text-text-primary truncate">
                        {prop.title}
                      </h3>
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-primary-pastel text-primary rounded-md shrink-0">
                        {prop.propertyType}
                      </span>
                    </div>
                    <p className="flex items-center gap-1.5 text-xs text-text-secondary mb-4 truncate">
                      <MapPin size={14} className="text-accent-orange shrink-0" />
                      <span>{prop.address}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-2 p-3 bg-background-main rounded-2xl text-xs">
                      <div>
                        <span className="text-[10px] text-text-muted uppercase font-bold block">Lot Size</span>
                        <span className="font-bold text-text-primary">{prop.lotSize} sqm</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-muted uppercase font-bold block">Year Built</span>
                        <span className="font-bold text-text-primary">{prop.yearBuilt}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    className="flex-1 py-2.5 px-4 bg-background-main hover:bg-primary-pastel/60 text-primary border border-border-light rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <span>View Appraisal Report</span>
                    <ChevronRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(prop.id, e)}
                    disabled={deletingId === prop.id}
                    title="Delete listing"
                    className="p-2.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-all cursor-pointer"
                  >
                    {deletingId === prop.id ? (
                      <Loader2 size={16} className="animate-spin text-red-600" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Properties;
