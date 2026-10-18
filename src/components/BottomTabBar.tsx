import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, Plus, User, Settings } from 'lucide-react';

export const BottomTabBar: React.FC = () => {
  const location = useLocation();

  const isCurrent = (path: string) => {
    if (path === '/valuation/step1') {
      return location.pathname.startsWith('/valuation');
    }
    return location.pathname === path;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border-light px-3 py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home */}
        <Link
          to="/home"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isCurrent('/home') ? 'text-primary' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <Home size={22} className={isCurrent('/home') ? 'stroke-[2.5]' : ''} />
          <span className="text-[11px] font-semibold">Home</span>
        </Link>

        {/* Properties */}
        <Link
          to="/properties"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isCurrent('/properties') ? 'text-primary' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <Building2 size={22} className={isCurrent('/properties') ? 'stroke-[2.5]' : ''} />
          <span className="text-[11px] font-semibold">Properties</span>
        </Link>

        {/* Center Floating Plus Action Button */}
        <Link
          to="/valuation/step1"
          className="relative -top-4 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-accent-orange to-[#ffaa40] text-white shadow-lg shadow-accent-orange/30 border-4 border-white active:scale-95 transition-transform"
          title="New Valuation"
        >
          <Plus size={28} strokeWidth={3} />
        </Link>

        {/* Account */}
        <Link
          to="/account"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isCurrent('/account') ? 'text-primary' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <User size={22} className={isCurrent('/account') ? 'stroke-[2.5]' : ''} />
          <span className="text-[11px] font-semibold">Account</span>
        </Link>

        {/* Settings */}
        <Link
          to="/settings"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isCurrent('/settings') ? 'text-primary' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          <Settings size={22} className={isCurrent('/settings') ? 'stroke-[2.5]' : ''} />
          <span className="text-[11px] font-semibold">Settings</span>
        </Link>

      </div>
    </nav>
  );
};

export default BottomTabBar;
