import React from 'react';
import { MapPin, FileText, Camera, Check } from 'lucide-react';

interface ValuationProgressProps {
  currentStep: number;
  totalSteps?: number;
}

export const ValuationProgress: React.FC<ValuationProgressProps> = ({
  currentStep,
  totalSteps = 3,
}) => {
  const steps = [
    { number: 1, title: 'Location', desc: 'Map & Address', icon: MapPin },
    { number: 2, title: 'Details', desc: 'Specs & Lot Size', icon: FileText },
    { number: 3, title: 'AI Media', desc: 'Photos & Scan', icon: Camera },
  ];

  const percentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="w-full bg-white border-b border-border-light py-4 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-3 text-xs sm:text-sm font-bold text-text-secondary">
          <span className="text-primary uppercase tracking-wider">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-text-muted">{percentage}% Completed</span>
        </div>

        {/* Continuous Progress Bar with Gradient */}
        <div className="relative w-full h-2.5 bg-background-main rounded-full overflow-hidden mb-6 border border-border-light">
          <div
            className="h-full bg-gradient-to-r from-primary via-[#3d8fd9] to-accent-orange transition-all duration-500 ease-out rounded-full"
            style={{ width: `${((currentStep) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Nodes */}
        <div className="grid grid-cols-3 gap-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;

            return (
              <div
                key={step.number}
                className={`flex items-center gap-2 sm:gap-3 p-2 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-primary-pastel/60 text-primary font-bold'
                    : isCompleted
                    ? 'text-text-primary'
                    : 'text-text-muted opacity-60'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                    isCompleted
                      ? 'bg-accent-orange text-white shadow-sm'
                      : isCurrent
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-background-main border border-border-light text-text-muted'
                  }`}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : <Icon size={15} />}
                </div>
                <div className="hidden sm:block text-left truncate">
                  <p className="text-xs font-bold leading-tight truncate">{step.title}</p>
                  <p className="text-[10px] text-text-muted truncate">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ValuationProgress;
