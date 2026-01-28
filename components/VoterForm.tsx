
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

  const wardOptions = Array.from({ length: 20 }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return { value: num, label: `Ward-${num}` };
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1">
            <User size={14} /> নাম
          </label>
          <input
            type="text"
            placeholder="পুরো নাম লিখুন (ঐচ্ছিক)"
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>

        {/* Date of Birth Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1">
            <Calendar size={14} /> জন্ম তারিখ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="DD/MM/YYYY"
            className={`w-full bg-slate-50 border px-4 py-3 rounded-xl focus:ring-2 transition-all outline-none ${errors.dob ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:ring-indigo-500'}`}
            value={displayDob}
            onChange={handleDobChange}
          />
          {errors.dob && <p className="text-[10px] text-red-500 ml-1 italic">সঠিক তারিখ প্রদান করুন (উদাঃ ০১/০১/১৯৯০)</p>}
        </div>

        {/* Ward Select */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1">
            <MapPin size={14} /> ওয়ার্ড <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full bg-slate-50 border px-4 py-3 rounded-xl focus:ring-2 transition-all outline-none appearance-none cursor-pointer ${errors.ward ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:ring-indigo-500'}`}
            value={formData.ward}
            onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
          >
            <option value="">নির্বাচন করুন</option>
            {wardOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.ward && <p className="text-[10px] text-red-500 ml-1 italic">ওয়ার্ড নম্বর নির্বাচন করুন</p>}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#001d3d] hover:bg-black text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-3"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <Search size={24} />
          )}
          {isLoading ? 'অনুসন্ধান করা হচ্ছে...' : 'অনুসন্ধান করুন'}
        </button>
      </div>
    </form>
  );
};

export default VoterForm;
