import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Maximize, Calendar, Home, Car, FileText, Wrench } from 'lucide-react';
import { ValuationProgress } from '../components/ValuationProgress';

export const ValuationStep2: React.FC = () => {
  const navigate = useNavigate();

  // Load existing draft from sessionStorage
  const existingDraft = (() => {
    try {
      const saved = sessionStorage.getItem('valyou_valuation_draft');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  })();

  const [lotSize, setLotSize] = useState<string>(existingDraft.lotSize?.toString() || '150');
  const [yearBuilt, setYearBuilt] = useState<string>(existingDraft.yearBuilt?.toString() || '2020');
  const [propertyType, setPropertyType] = useState<string>(existingDraft.propertyType || 'Single-family');
  const [parkingSpaces, setParkingSpaces] = useState<string>(existingDraft.parkingSpaces?.toString() || '1');
  const [titleType, setTitleType] = useState<string>(existingDraft.titleType || 'Clean Title');
  const [isRenovated, setIsRenovated] = useState<boolean>(existingDraft.isRenovated || false);
  const [renovationDetails, setRenovationDetails] = useState<string>(existingDraft.renovationDetails || '');

  const propertyTypes = ['Single-family', 'Townhouse', 'Condo Unit', 'Duplex', 'Apartment', 'Commercial'];
  const titleTypes = ['Clean Title', 'Tax Declaration Only', 'Other'];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lotSize || !yearBuilt || !propertyType || !titleType) {
      alert('Please fill out all required property specification fields.');
      return;
    }

    const updatedDraft = {
      ...existingDraft,
      lotSize: parseFloat(lotSize) || 120,
      yearBuilt: parseInt(yearBuilt, 10) || 2020,
      propertyType,
      parkingSpaces: parseInt(parkingSpaces, 10) || 0,
      titleType,
      isRenovated,
      renovationDetails: isRenovated ? renovationDetails : '',
    };

    sessionStorage.setItem('valyou_valuation_draft', JSON.stringify(updatedDraft));
    navigate('/valuation/step3');
  };

  return (
    <div className="min-h-[calc(100dvh-5rem)] pb-24 md:pb-12 bg-background-main">
      <ValuationProgress currentStep={2} totalSteps={3} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header Card */}
        <div className="bg-white border-2 border-border-light rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigate('/valuation/step1')}
              className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Location</span>
            </button>
            <span className="text-xs font-bold px-3 py-1 bg-primary-pastel text-primary rounded-full">
              Step 2 of 3
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-text-primary mb-2">
            Property Specifications
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Provide the structural dimensions and title information to calculate accurate price-per-square-meter appraisals.
          </p>
        </div>

        {/* Specifications Form */}
        <form onSubmit={handleNext} className="space-y-6">
          
          <div className="bg-white border-2 border-border-light rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Lot Size & Year Built in 2 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                  <Maximize size={16} className="text-primary" />
                  <span>Lot Size (sqm) *</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={lotSize}
                  onChange={(e) => setLotSize(e.target.value)}
                  placeholder="e.g. 150"
                  required
                  className="w-full px-4 py-3 bg-background-main border border-border-light rounded-2xl text-sm text-text-primary focus:outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                  <Calendar size={16} className="text-primary" />
                  <span>Year Built *</span>
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 2}
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(e.target.value)}
                  placeholder="e.g. 2021"
                  required
                  className="w-full px-4 py-3 bg-background-main border border-border-light rounded-2xl text-sm text-text-primary focus:outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                />
              </div>
            </div>

            {/* Property Type Radio Pills */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
                <Home size={16} className="text-primary" />
                <span>Property Type *</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {propertyTypes.map((type) => {
                  const selected = propertyType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPropertyType(type)}
                      className={`py-3 px-3.5 rounded-2xl text-xs sm:text-sm font-bold border-2 transition-all ${
                        selected
                          ? 'bg-primary-pastel/80 border-primary text-primary shadow-sm'
                          : 'bg-background-main border-border-light text-text-secondary hover:border-primary/40'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parking Spaces & Title Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                  <Car size={16} className="text-primary" />
                  <span>Parking Spaces</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={parkingSpaces}
                  onChange={(e) => setParkingSpaces(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-background-main border border-border-light rounded-2xl text-sm text-text-primary focus:outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                  <FileText size={16} className="text-primary" />
                  <span>Title Type *</span>
                </label>
                <select
                  value={titleType}
                  onChange={(e) => setTitleType(e.target.value)}
                  className="w-full px-4 py-3 bg-background-main border border-border-light rounded-2xl text-sm text-text-primary focus:outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                >
                  {titleTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Renovation Details Toggle */}
            <div className="pt-4 border-t border-border-light space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-orange-pastel text-accent-orange flex items-center justify-center">
                    <Wrench size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">Has Been Renovated?</h4>
                    <p className="text-xs text-text-secondary">Major remodeling adds premium value</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRenovated}
                    onChange={(e) => setIsRenovated(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-border-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {isRenovated && (
                <div className="animate-in fade-in duration-200">
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                    Renovation Details & Year
                  </label>
                  <textarea
                    rows={3}
                    value={renovationDetails}
                    onChange={(e) => setRenovationDetails(e.target.value)}
                    placeholder="e.g. Complete kitchen and roof renovation in 2022 with premium tiles"
                    className="w-full p-4 bg-background-main border border-border-light rounded-2xl text-sm text-text-primary focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate('/valuation/step1')}
              className="px-6 py-3 text-sm font-bold text-text-secondary hover:text-text-primary"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-gradient-to-r from-primary to-[#3d8fd9] text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg hover:from-primary-hover hover:to-primary active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Continue to AI Media</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ValuationStep2;
