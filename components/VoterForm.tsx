
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
    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
        {/* Name Input */}
        <div className="group space-y-1 md:space-y-2">
          <label className="text-xs md:text-sm font-bold text-slate-700 flex items-center gap-2">
            <User size={14} /> নাম (ঐচ্ছিক)
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="নাম বাংলায় বা ইংরেজিতে"
              className="w-full bg-slate-50 border-2 border-slate-100 px-3.5 py-2.5 md:px-5 md:py-4 rounded-xl md:rounded-2xl focus:bg-white focus:border-[#006a4e] outline-none text-sm md:text-lg font-medium transition-all"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
        </div>

        {/* Date of Birth Input */}
        <div className="group space-y-1 md:space-y-2">
          <label className="text-xs md:text-sm font-bold text-slate-700 flex items-center gap-2">
            <Calendar size={14} /> জন্ম তারিখ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              placeholder="DD/MM/YYYY"
              className={`w-full bg-slate-50 border-2 px-3.5 py-2.5 md:px-5 md:py-4 rounded-xl md:rounded-2xl focus:bg-white outline-none text-sm md:text-lg font-medium transition-all ${errors.dob ? 'border-red-400' : 'border-slate-100 focus:border-[#006a4e]'}`}
              value={displayDob}
              onChange={handleDobChange}
            />
            {errors.dob && <p className="text-[9px] text-red-500 mt-0.5 font-bold">সঠিক তারিখ দিন</p>}
          </div>
        </div>

        {/* Ward Select */}
        <div className="group space-y-1 md:space-y-2">
          <label className="text-xs md:text-sm font-bold text-slate-700 flex items-center gap-2">
            <MapPin size={14} /> ওয়ার্ড <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              className={`w-full bg-slate-50 border-2 px-3.5 py-2.5 md:px-5 md:py-4 rounded-xl md:rounded-2xl focus:bg-white outline-none appearance-none cursor-pointer text-sm md:text-lg font-medium transition-all ${errors.ward ? 'border-red-400' : 'border-slate-100 focus:border-[#006a4e]'}`}
              value={formData.ward}
              onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
            >
              <option value="">সিলেক্ট করুন</option>
              {wardOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.ward && <p className="text-[9px] text-red-500 mt-0.5 font-bold">ওয়ার্ড নির্বাচন করুন</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-2 md:pt-8">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto bg-[#006a4e] hover:bg-[#004d39] text-white px-8 py-3 md:px-12 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-xl shadow-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Search size={20} />
          )}
          {isLoading ? 'অনুসন্ধান চলছে...' : 'ভোটার তথ্য দেখুন'}
        </button>
      </div>
    </form>
  );
};

export default VoterForm;
