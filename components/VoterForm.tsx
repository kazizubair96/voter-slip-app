
import React, { useState } from 'react';
import { SearchParams } from '../types';
import { Loader2 } from 'lucide-react';

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
    // ইউজার কি ডিলিট করছেন নাকি নতুন লিখছেন তা চেক করা
    const isDeleting = val.length < displayDob.length;
    
    // শুধুমাত্র সংখ্যাগুলো আলাদা করা (সর্বোচ্চ ৮টি)
    const rawVal = val.replace(/\D/g, '').slice(0, 8);
    
    let formatted = "";
    
    if (rawVal.length > 0) {
      // প্রথম অংশ (দিন)
      formatted = rawVal.slice(0, 2);
      
      if (rawVal.length > 2) {
        formatted += '/';
        // দ্বিতীয় অংশ (মাস)
        formatted += rawVal.slice(2, 4);
        
        if (rawVal.length > 4) {
          formatted += '/';
          // তৃতীয় অংশ (বছর)
          formatted += rawVal.slice(4, 8);
        } else if (rawVal.length === 4 && !isDeleting) {
          // ৪টি সংখ্যা হলে অটো স্ল্যাশ কিন্তু ডিলিট করার সময় নয়
          formatted += '/';
        }
      } else if (rawVal.length === 2 && !isDeleting) {
        // ২টি সংখ্যা হলে অটো স্ল্যাশ কিন্তু ডিলিট করার সময় নয়
        formatted += '/';
      }
    }
    
    setDisplayDob(formatted);

    // যখন ৮টি ডিজিট পূর্ণ হবে তখনই ডাটাবেজের জন্য YYYY-MM-DD ফরম্যাটে সেভ করা
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
    
    // ভ্যালিডেশন চেক
    const digitsOnly = displayDob.replace(/\D/g, '');
    if (digitsOnly.length < 8) newErrors.dob = 'true';
    if (!formData.ward) newErrors.ward = 'true';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSearch(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end justify-center gap-4 max-w-6xl mx-auto">
      {/* Name Input */}
      <div className="w-full md:flex-1 space-y-1">
        <label className="text-white text-xs md:text-sm font-medium ml-1">নাম</label>
        <input
          type="text"
          placeholder="নাম"
          className="w-full bg-white px-4 py-2.5 rounded border-0 outline-none text-gray-800 placeholder:text-gray-400 shadow-sm"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />
      </div>

      {/* Date of Birth Input */}
      <div className="w-full md:flex-1 space-y-1">
        <label className="text-white text-xs md:text-sm font-medium ml-1">জন্ম তারিখ <span className="text-red-400 font-bold">*</span></label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="০১/০১/১৯৯০"
          className={`w-full bg-white px-4 py-2.5 rounded border-0 outline-none text-gray-800 placeholder:text-gray-400 shadow-sm ${errors.dob ? 'ring-2 ring-red-400' : ''}`}
          value={displayDob}
          onChange={handleDobChange}
        />
      </div>

      {/* Ward Select */}
      <div className="w-full md:flex-1 space-y-1">
        <label className="text-white text-xs md:text-sm font-medium ml-1">ওয়ার্ড <span className="text-red-400 font-bold">*</span></label>
        <select
          className={`w-full bg-white px-4 py-2.5 rounded border-0 outline-none text-gray-800 shadow-sm appearance-none cursor-pointer ${errors.ward ? 'ring-2 ring-red-400' : ''}`}
          value={formData.ward}
          onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
        >
          <option value="">নির্বাচন করুন</option>
          {wardOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <div className="w-full md:w-auto">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-48 bg-[#001d3d] hover:bg-black text-white font-bold py-2.5 rounded shadow-lg transition-all active:scale-[0.98] uppercase tracking-wider flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'অনুসন্ধান'}
        </button>
      </div>
    </form>
  );
};

export default VoterForm;
