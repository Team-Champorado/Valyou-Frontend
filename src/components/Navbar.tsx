import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Home, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Bell, 
  Menu, 
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user: currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/home', icon: Home },
    { name: 'Properties', path: '/properties', icon: Building2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border-light shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Valyou Logo" 
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain transform transition-transform group-hover:scale-105"
              />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-orange rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-2xl font-black valyou-gradient-text tracking-tight">Valyou</span>
              </div>
              <p className="text-[11px] text-text-secondary font-medium hidden md:block">
                Fairness in Every Square Meter
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (No duplicate Valuation or Demo) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-primary-pastel text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-main'
                  }`}
                >
                  <Icon size={17} className={active ? 'text-primary' : 'text-text-muted'} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Primary Valuation CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* The single, prominent New Valuation CTA */}
            <Link
              to="/valuation/step1"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-[#3d8fd9] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:from-primary-hover hover:to-primary active:scale-95 transition-all"
            >
              <PlusCircle size={18} />
              <span>New Valuation</span>
            </Link>

            {/* Notifications Button */}
            <button
              type="button"
              className="w-10 h-10 rounded-xl bg-background-main border border-border-light flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/40 active:scale-95 transition-all"
              title="Notifications"
            >
              <Bell size={18} />
            </button>

            {/* User Profile Avatar / Logout */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/account"
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-border-light bg-background-card hover:bg-background-main transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {currentUser.firstName ? currentUser.firstName[0] : (currentUser.name ? currentUser.name[0] : 'U')}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-text-primary leading-tight truncate max-w-[100px]">
                      {currentUser.name || currentUser.firstName || 'User'}
                    </p>
                    <p className="text-[10px] text-text-muted">Pro Agent</p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-xl bg-accent-orange-pastel border border-accent-orange/40 text-accent-orange flex items-center justify-center hover:bg-accent-orange hover:text-white transition-all active:scale-95"
                  title="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold shadow hover:bg-primary-hover transition-all"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-background-main border border-border-light flex items-center justify-center text-text-primary"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-light bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold ${
                  active ? 'bg-primary-pastel text-primary' : 'text-text-primary hover:bg-background-main'
                }`}
              >
                <Icon size={20} className={active ? 'text-primary' : 'text-text-muted'} />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 space-y-2">
            <Link
              to="/valuation/step1"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl font-bold text-base shadow"
            >
              <PlusCircle size={20} />
              Start New Valuation
            </Link>
            <div className="pt-2 border-t border-border-light flex items-center justify-between">
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-text-primary hover:text-primary flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
                  {currentUser?.firstName ? currentUser.firstName[0] : (currentUser?.name ? currentUser.name[0] : 'U')}
                </div>
                <span>{currentUser?.name || currentUser?.firstName || 'My Account'}</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-accent-orange bg-accent-orange-pastel border border-accent-orange/30 flex items-center gap-1.5"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
