import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Navigation, Sparkles } from 'lucide-react';
import { ValuationProgress } from '../components/ValuationProgress';
import { MapPicker } from '../components/MapPicker';

export const ValuationStep1: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Load existing valuation draft from sessionStorage or URL search query
  const existingDraft = (() => {
    try {
      const saved = sessionStorage.getItem('valyou_valuation_draft');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  })();

  const [address, setAddress] = useState(
    searchParams.get('search') || existingDraft.address || 'Banilad, Cebu City, Central Visayas, Philippines'
  );
  const [latitude, setLatitude] = useState<number>(existingDraft.latitude || 10.3157);
  const [longitude, setLongitude] = useState<number>(existingDraft.longitude || 123.8854);
  const [title, setTitle] = useState(existingDraft.title || '');
  const [noahRisk, setNoahRisk] = useState<any>(existingDraft.noahRisk || null);

  const handleLocationSelect = (loc: {
    address: string;
    latitude: number;
    longitude: number;
    noahRisk?: any;
  }) => {
    setAddress(loc.address);
    setLatitude(loc.latitude);
    setLongitude(loc.longitude);
    if (loc.noahRisk) {
      setNoahRisk(loc.noahRisk);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      alert('Please enter or select a property address.');
      return;
    }

    // Save step 1 data into sessionStorage draft
    const updatedDraft = {
      ...existingDraft,
      title: title.trim() || address.split(',')[0] || 'My Property',
      address,
      latitude,
      longitude,
      noahRisk,
    };
    sessionStorage.setItem('valyou_valuation_draft', JSON.stringify(updatedDraft));

    navigate('/valuation/step2');
  };

  return (
    <div className="min-h-[calc(100dvh-5rem)] pb-24 md:pb-12 bg-background-main">
      <ValuationProgress currentStep={1} totalSteps={3} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Top Header Card */}
        <div className="bg-white border-2 border-border-light rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <span className="text-xs font-bold px-3 py-1 bg-primary-pastel text-primary rounded-full">
              Step 1 of 3
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-text-primary mb-2">
            Property Location & Pin Drop
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Drop a pin on OpenStreetMap or search for the exact address to accurately map neighborhood sales and NOAH hazard zones.
          </p>
        </div>

        {/* Map & Form Body */}
        <form onSubmit={handleNext} className="space-y-6">
          
          {/* Interactive OpenStreetMap Pin Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
              Interactive Map Pin Dropper
            </label>
            <MapPicker
              initialLat={latitude}
              initialLng={longitude}
              onLocationSelect={handleLocationSelect}
            />
          </div>

          {/* Form Inputs */}
          <div className="bg-white border-2 border-border-light rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                Property Nickname / Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Banilad 2-Storey Residential House"
                className="w-full px-4 py-3 bg-background-main border border-border-light rounded-2xl text-sm text-text-primary focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                Confirmed Address *
              </label>
              <div className="relative flex items-center">
                <MapPin size={18} className="absolute left-3.5 text-accent-orange" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, Barangay, City, Province"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background-main border border-border-light rounded-2xl text-sm text-text-primary focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-background-main rounded-2xl border border-border-light text-xs">
              <div>
                <span className="text-[10px] text-text-muted uppercase font-bold block">Latitude</span>
                <span className="font-mono font-bold text-text-primary">{latitude.toFixed(6)}</span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted uppercase font-bold block">Longitude</span>
                <span className="font-mono font-bold text-text-primary">{longitude.toFixed(6)}</span>
              </div>
            </div>
          </div>

          {/* Step 1 Footer CTA */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="px-6 py-3 text-sm font-bold text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-gradient-to-r from-primary to-[#3d8fd9] text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg hover:from-primary-hover hover:to-primary active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Continue to Specs</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ValuationStep1;
