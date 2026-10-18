import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  Maximize, 
  Calendar, 
  Car, 
  FileText, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  Waves, 
  Mountain, 
  Wind,
  Plus,
  AlertTriangle,
  Layers,
  DollarSign
} from 'lucide-react';
import { getFullImageUrl } from '../services/api';
import { NoahMap } from '../components/NoahMap';

export const ValuationResult: React.FC = () => {
  const navigate = useNavigate();

  // Load result from sessionStorage
  const result = (() => {
    try {
      const saved = sessionStorage.getItem('valyou_latest_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })() || {
    title: 'Modern Residential Property',
    address: 'Banilad, Cebu City, Central Visayas, Philippines',
    lotSize: 150,
    yearBuilt: 2021,
    propertyType: 'Single-family',
    parkingSpaces: 2,
    titleType: 'Clean Title',
    estimatedValue: 8500000,
    finalValuation: 8500000,
    confidenceScore: 94.2,
    riskLevel: 'LOW',
    riskScore: 2.1,
    riskDetails: {
      floodRisk: 'Low Hazard (Zone 1 - Safe)',
      landslideRisk: 'Safe (Low Slope angle)',
      stormSurgeRisk: 'None (Elevated terrain)',
    },
    nearbyHotspots: [
      { name: 'Commercial Center', distance: '450m' },
      { name: 'International School', distance: '850m' },
      { name: 'Tertiary Hospital', distance: '1.4km' },
    ],
    structuralInsights: [
      'High structural integrity verified through elevation and orientation mapping',
      'Modern perimeter fencing and adequate setbacks confirmed',
      'Roofing materials show minimal weathering degradation',
    ],
    photos: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=60',
    ],
  };

  const finalValue = result.finalValuation || result.estimatedValue || 8500000;
  const lotSizeNum = parseFloat(result.lotSize) || 120;

  const formattedPrice = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(finalValue);

  const pricePerSqm = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(Math.round(finalValue / lotSizeNum));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const breakdown = result.valuationBreakdown;

  return (
    <div className="min-h-[calc(100dvh-5rem)] pb-24 md:pb-12 bg-background-main py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Back Action Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/home"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-border-light rounded-xl text-xs font-bold text-text-primary hover:bg-background-main active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <Download size={14} />
            <span>Print Report</span>
          </button>
        </div>

        {/* Hero Valuation Outcome Card */}
        <div className="relative bg-gradient-to-br from-primary via-[#1e78df] to-[#3d8fd9] text-white rounded-3xl p-6 sm:p-10 shadow-lg overflow-hidden">
          {/* Memphis Decorative Orbs */}
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/15 rounded-full pointer-events-none" />
          <div className="absolute -bottom-8 left-12 w-32 h-32 bg-accent-orange/30 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-white">
                Valyou AI Appraisal
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-accent-yellow bg-black/20 px-3 py-1 rounded-full">
                <Sparkles size={14} />
                <span>{result.confidenceScore || 94}% Confidence Level</span>
              </div>
            </div>

            <p className="text-white/80 text-sm font-medium mb-1">
              Estimated Fair Market Value (Dealer Buying Price)
            </p>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4">
              {formattedPrice}
            </h1>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/20 text-xs sm:text-sm text-white/90 font-semibold">
              <span className="bg-white/15 px-3 py-1.5 rounded-xl">
                Rate: <b>{pricePerSqm} / sqm</b>
              </span>
              <span className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
                <ShieldCheck size={16} />
                <span>{result.riskLevel || 'LOW'} Risk Profile</span>
              </span>
              {result.isBackendGenerated && (
                <span className="bg-accent-orange px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
                  <CheckCircle2 size={16} />
                  <span>Cloud Run Synced</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Property Specs Pill Card */}
        <div className="bg-white border-2 border-border-light rounded-3xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-text-primary mb-1">
                {result.title}
              </h2>
              <p className="flex items-center gap-1.5 text-xs sm:text-sm text-text-secondary">
                <MapPin size={16} className="text-accent-orange shrink-0" />
                <span>{result.address}</span>
              </p>
            </div>
            <span className="px-3 py-1 bg-primary-pastel text-primary rounded-xl text-xs font-black shrink-0">
              {result.propertyType}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border-light">
            <div className="p-3 bg-background-main rounded-2xl">
              <span className="text-[10px] text-text-muted font-bold uppercase block mb-1">Lot Size</span>
              <span className="text-sm font-black text-text-primary">{result.lotSize} sqm</span>
            </div>
            <div className="p-3 bg-background-main rounded-2xl">
              <span className="text-[10px] text-text-muted font-bold uppercase block mb-1">Year Built</span>
              <span className="text-sm font-black text-text-primary">{result.yearBuilt}</span>
            </div>
            <div className="p-3 bg-background-main rounded-2xl">
              <span className="text-[10px] text-text-muted font-bold uppercase block mb-1">Parking</span>
              <span className="text-sm font-black text-text-primary">{result.parkingSpaces} slots</span>
            </div>
            <div className="p-3 bg-background-main rounded-2xl">
              <span className="text-[10px] text-text-muted font-bold uppercase block mb-1">Title Type</span>
              <span className="text-sm font-black text-text-primary">{result.titleType}</span>
            </div>
          </div>
        </div>

        {/* Valuation Breakdown (If available from AI Engine) */}
        {breakdown && (
          <div className="bg-white border-2 border-border-light rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-pastel text-primary flex items-center justify-center font-bold">
                <DollarSign size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-text-primary">
                  Appraisal Calculation Breakdown
                </h3>
                <p className="text-xs text-text-secondary">
                  Computed by Valyou conservative dealer valuation model
                </p>
              </div>
            </div>

            <div className="divide-y divide-border-light text-xs sm:text-sm">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-text-secondary font-medium">Base Asking Anchor:</span>
                <span className="font-bold text-text-primary">{formatCurrency(breakdown.baseValue || finalValue)}</span>
              </div>
              {breakdown.structuralDeductions > 0 && (
                <div className="py-2.5 flex items-center justify-between text-red-600">
                  <span className="font-medium">Structural & Repair Deductions:</span>
                  <span className="font-bold">- {formatCurrency(breakdown.structuralDeductions)}</span>
                </div>
              )}
              {breakdown.featurePremiums > 0 && (
                <div className="py-2.5 flex items-center justify-between text-emerald-600">
                  <span className="font-medium">Feature & Location Premiums:</span>
                  <span className="font-bold">+ {formatCurrency(breakdown.featurePremiums)}</span>
                </div>
              )}
              {breakdown.riskAdjustmentValue > 0 && (
                <div className="py-2.5 flex items-center justify-between text-amber-600">
                  <span className="font-medium">Environmental Risk Penalty:</span>
                  <span className="font-bold">- {formatCurrency(breakdown.riskAdjustmentValue)}</span>
                </div>
              )}
              <div className="py-3 flex items-center justify-between text-base font-black text-primary border-t-2 border-primary/20">
                <span>Final Appraised Value:</span>
                <span className="text-lg">{formatCurrency(breakdown.updatedValue || finalValue)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Project NOAH Hazard Map Overlay */}
        <div className="bg-white border-2 border-border-light rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-pastel text-primary flex items-center justify-center font-bold">
                <Layers size={22} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-text-primary">
                  Project NOAH Hazard & Environmental Map
                </h3>
                <p className="text-xs text-text-secondary">
                  Interactive DOST-NOAH satellite heatmaps for flood, landslide, and storm surge
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-bold text-text-secondary">Assessed Zone:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                result.riskLevel === 'HIGH'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : result.riskLevel === 'MEDIUM'
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              }`}>
                {result.riskLevel || 'LOW'} Risk
              </span>
            </div>
          </div>

          <NoahMap
            latitude={parseFloat(result.latitude) || 10.3157}
            longitude={parseFloat(result.longitude) || 123.8854}
            title={result.title || result.address}
            initialLayer="flood"
            heightClass="h-[320px] sm:h-[420px]"
          />
        </div>

        {/* Hazard & Environmental Risk Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Environmental Hazards */}
          <div className="bg-white border-2 border-border-light rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-pastel text-primary flex items-center justify-center font-bold">
                <Waves size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-text-primary">Hazard Risk Analysis</h3>
                <p className="text-xs text-text-secondary">Project NOAH Environmental Overlays</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-background-main rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Waves size={16} className="text-primary" />
                  <span className="font-bold text-text-primary">Flood Hazard</span>
                </div>
                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {result.riskDetails?.floodRisk || 'Low Hazard'}
                </span>
              </div>

              <div className="p-3 bg-background-main rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mountain size={16} className="text-accent-orange" />
                  <span className="font-bold text-text-primary">Landslide Hazard</span>
                </div>
                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {result.riskDetails?.landslideRisk || 'Low Risk'}
                </span>
              </div>

              <div className="p-3 bg-background-main rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind size={16} className="text-accent-yellow" />
                  <span className="font-bold text-text-primary">Storm Surge</span>
                </div>
                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {result.riskDetails?.stormSurgeRisk || 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Structural Insights */}
          <div className="bg-white border-2 border-border-light rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-orange-pastel text-accent-orange flex items-center justify-center font-bold">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-text-primary">AI Structural Findings</h3>
                <p className="text-xs text-text-secondary">Automated Condition Evaluation</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {(result.structuralInsights || []).map((insight: any, idx: number) => {
                const isObject = typeof insight === 'object' && insight !== null;
                const title = isObject ? (insight.title || insight.area) : insight;
                const desc = isObject ? insight.description : null;
                const cost = isObject && insight.cost ? formatCurrency(Math.abs(insight.cost)) : null;

                return (
                  <div key={idx} className="p-3 bg-background-main rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-text-primary">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={15} className="text-primary shrink-0" />
                        <span>{title}</span>
                      </div>
                      {cost && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${insight.type === 'negative' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {insight.type === 'negative' ? '-' : '+'} {cost}
                        </span>
                      )}
                    </div>
                    {desc && (
                      <p className="text-[11px] text-text-secondary pl-6 leading-relaxed">
                        {desc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Uploaded Photos Gallery (if available) */}
        {result.photos && result.photos.length > 0 && (
          <div className="bg-white border-2 border-border-light rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-base text-text-primary mb-3">
              Appraised Property Photos
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {result.photos.map((photoUrl: string, idx: number) => (
                <div key={idx} className="h-28 rounded-2xl overflow-hidden border border-border-light bg-gray-100">
                  <img
                    src={getFullImageUrl(photoUrl)}
                    alt={`Property inspection ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            to="/properties"
            className="w-full sm:w-auto px-6 py-3.5 bg-white border-2 border-border-light text-text-primary rounded-2xl font-bold text-sm text-center hover:bg-background-main transition-all"
          >
            View in Saved Properties
          </Link>
          <Link
            to="/valuation/step1"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-primary to-[#3d8fd9] text-white rounded-2xl font-bold text-sm shadow hover:from-primary-hover hover:to-primary active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            <span>Valuate Another Property</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ValuationResult;
