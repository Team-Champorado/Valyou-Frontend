import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Shield, ChevronRight, LogOut, CheckCircle, Edit3 } from 'lucide-react';

export const Account: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '+63 917 123 4567');
  const [locationStr, setLocationStr] = useState('Cebu City, Philippines');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of Valyou?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary">
          My Account
        </h1>
        <p className="text-sm text-text-secondary">
          Manage your appraiser profile and credentials
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border-2 border-border-light rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-primary to-[#3d8fd9] text-white flex items-center justify-center font-black text-3xl shadow-md">
            {user?.firstName ? user.firstName[0] : (user?.name ? user.name[0] : 'U')}
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-black text-text-primary">
              {user?.name || user?.firstName || 'Licensed Appraiser'}
            </h2>
            <span className="inline-block px-2.5 py-0.5 bg-primary-pastel text-primary font-bold text-xs rounded-full">
              Verified Valuer
            </span>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            {user?.email || 'demo@valyou.com'}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <CheckCircle size={14} className="text-emerald-500" />
            </span>
            <span>•</span>
            <span>ID: {user?.id || 'VAL-8821'}</span>
          </div>
        </div>
      </div>

      {/* Details List */}
      <div className="bg-white border-2 border-border-light rounded-3xl p-6 shadow-sm divide-y divide-border-light">

        {/* Email */}
        <div className="py-4 flex items-center justify-between first:pt-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-pastel text-primary flex items-center justify-center">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs text-text-muted font-bold uppercase">Email Address</p>
              <p className="text-sm font-bold text-text-primary">{user?.email || 'demo@valyou.com'}</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-text-muted">Primary</span>
        </div>

        {/* Phone */}
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-orange-pastel text-accent-orange flex items-center justify-center">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-xs text-text-muted font-bold uppercase">Phone Number</p>
              <p className="text-sm font-bold text-text-primary">{phoneNumber}</p>
            </div>
          </div>
          <button
            onClick={() => {
              const newPhone = prompt('Enter new phone number:', phoneNumber);
              if (newPhone) setPhoneNumber(newPhone);
            }}
            className="text-xs font-bold text-primary hover:underline"
          >
            Edit
          </button>
        </div>

        {/* Location */}
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-yellow-pastel text-accent-orange flex items-center justify-center">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-xs text-text-muted font-bold uppercase">Operating Region</p>
              <p className="text-sm font-bold text-text-primary">{locationStr}</p>
            </div>
          </div>
          <button
            onClick={() => {
              const newLoc = prompt('Enter new region:', locationStr);
              if (newLoc) setLocationStr(newLoc);
            }}
            className="text-xs font-bold text-primary hover:underline"
          >
            Edit
          </button>
        </div>

      </div>

      {/* Logout Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-4 px-6 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <LogOut size={18} />
          <span>Sign Out of Account</span>
        </button>
      </div>

    </div>
  );
};

export default Account;
