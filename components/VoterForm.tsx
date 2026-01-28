
import React, { useState } from 'react';
import { SearchParams } from '../types';
import { Loader2, Search, Calendar, MapPin, User } from 'lucide-react';

interface VoterFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

const VoterForm: React.FC<VoterFormProps> = ({ onSearch, isLoading }) => {
  const [formData, setFormData] = useState<SearchParams>({
    fullName: '',
    dob: '', 
    ward: '',
    voterNumber: ''
  });

  const [displayDob, setDisplayDob] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const wardOptions = Array.from({ length: 13 }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return { value: num, label: `ওয়ার্ড - ${num}` };
  });

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const isDeleting = val.length < displayDob.length;
    const rawVal = val.replace(/\D/g, '').slice(0, 8);
    
    let formatted = "";
    if (rawVal.length > 0) {
      formatted = rawVal.slice(0, 2);
      if (rawVal.length > 2) {
        formatted += '/';
        formatted += rawVal.slice(2, 4);
        if (rawVal.length > 4) {
          formatted += '/';
          formatted += rawVal.slice(4, 8);
        } else if (rawVal.length === 4 && !isDeleting) {
          formatted += '/';
        }
      } else if (rawVal.length === 2 && !isDeleting) {
        formatted += '/';
      }
    }
    
    setDisplayDob(formatted);

    if (rawVal.length === 8) {
      const day = rawVal.substring(0, 2);
      const month = rawVal.substring(2, 4);
      const year = rawVal.substring(4, 8);
      setFormData(prev => ({ ...prev, dob: `${year}-${month}-${day}` }));
      setErrors(prev => { const { dob, ...rest } = prev; return rest; });
    } else {
      setFormData(prev => ({ ...prev, dob: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    const digitsOnly = displayDob.replace(/\D/g, '');
    if (digitsOnly.length < 8) newErrors.dob = 'true';
    if (!formData.ward) newErrors.ward = 'true';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSearch(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Name Input */}
        <div className="group space-y-3">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2 transition-colors group-focus-within:text-[#006a4e]">
            <User size={18} /> ভোটার নাম (ঐচ্ছিক)
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="নাম বাংলায় বা ইংরেজিতে"
              className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-lg font-medium"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
        </div>

        {/* Date of Birth Input */}
        <div className="group space-y-3">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2 transition-colors group-focus-within:text-[#006a4e]">
            <Calendar size={18} /> জন্ম তারিখ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              placeholder="DD/MM/YYYY"
              className={`w-full bg-slate-50 border-2 px-5 py-4 rounded-2xl focus:bg-white focus:ring-4 transition-all outline-none text-lg font-medium ${errors.dob ? 'border-red-400 focus:ring-red-500/10' : 'border-slate-100 focus:border-[#006a4e] focus:ring-green-500/10'}`}
              value={displayDob}
              onChange={handleDobChange}
            />
            {errors.dob && <p className="text-xs text-red-500 mt-1.5 font-bold animate-bounce">সঠিক তারিখ প্রদান করুন</p>}
          </div>
        </div>

        {/* Ward Select */}
        <div className="group space-y-3">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2 transition-colors group-focus-within:text-[#006a4e]">
            <MapPin size={18} /> ওয়ার্ড <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              className={`w-full bg-slate-50 border-2 px-5 py-4 rounded-2xl focus:bg-white focus:ring-4 transition-all outline-none appearance-none cursor-pointer text-lg font-medium ${errors.ward ? 'border-red-400 focus:ring-red-500/10' : 'border-slate-100 focus:border-[#006a4e] focus:ring-green-500/10'}`}
              value={formData.ward}
              onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
            >
              <option value="">সিলেক্ট করুন</option>
              {wardOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
               <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
            {errors.ward && <p className="text-xs text-red-500 mt-1.5 font-bold animate-bounce">ওয়ার্ড নির্বাচন করুন</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-[#006a4e] to-[#004d39] hover:from-[#004d39] hover:to-[#003628] text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl shadow-green-900/20 hover:shadow-2xl hover:shadow-green-900/40 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-4 group"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={28} />
          ) : (
            <Search size={28} className="group-hover:scale-110 transition-transform" />
          )}
          {isLoading ? 'অনুসন্ধান চলছে...' : 'ভোটার তথ্য দেখুন'}
        </button>
      </div>
    </form>
  );
};

export default VoterForm;
