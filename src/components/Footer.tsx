import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-border-light mt-auto pt-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Branding & Navigation */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black valyou-gradient-text tracking-tight">
                Valyou
              </span>
              <span className="text-[10px] font-bold text-text-muted">
                Fairness in Every Square Meter
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-text-muted">
            <Link to="/home" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
            <span>•</span>
            <Link to="/properties" className="hover:text-primary transition-colors">
              Properties
            </Link>
            <span>•</span>
            <Link to="/valuation/step1" className="hover:text-primary transition-colors">
              New Valuation
            </Link>
            <span>•</span>
            <Link to="/account" className="hover:text-primary transition-colors">
              Account
            </Link>
          </div>
        </div>

        {/* Fine-print Disclaimer */}
        <div className="pt-3 border-t border-border-light/60 text-[11px] text-text-muted leading-relaxed space-y-1.5">
          <p>
            <span className="font-semibold text-text-secondary">Disclaimer:</span> Valuations, condition deductions, and disaster hazard overlays provided on Valyou are generated using automated models and public Project NOAH datasets for preliminary informational and decision-support purposes only. They should not be taken as a primary source of truth, certified legal appraisal, or definitive financial advice. Always make sure to double-check and verify with licensed real estate appraisers, structural engineers, and other official sources before entering into any transaction or contract.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-border-light/60 text-[11px] text-text-muted">
          <div>
            <span>© Valyou 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Data powered by DOST Project NOAH & OpenStreetMap</span>
            <span>•</span>
            <span>Cebu, Philippines</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
