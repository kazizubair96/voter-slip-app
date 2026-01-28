
import React, { useRef } from 'react';
import { Voter } from '../types';
import { Printer, Download, CheckCircle, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface VoterSlipProps {
  voter: Voter;
}

const VoterSlip: React.FC<VoterSlipProps> = ({ voter }) => {
  const slipRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!slipRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(slipRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });
      
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `voter-slip-${voter.voter_number}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error("Download failed", err);
      alert("ডাউনলোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div 
        ref={slipRef}
        id="voter-slip-card"
        className="relative bg-white border-2 border-slate-200 rounded-xl p-8 shadow-xl max-w-lg mx-auto overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] rotate-[-35deg] select-none">
          <span className="text-6xl font-bold text-slate-800 border-4 border-slate-800 p-4">
            DEMO COPY
          </span>
        </div>

        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">ভোটার স্লিপ (ডেমো)</h2>
            <p className="text-sm text-slate-500">নির্বাচন কমিশন বাংলাদেশ - ডেমো কপি</p>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-2 rounded-full">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="space-y-4 text-slate-700">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-slate-500 font-medium text-sm">পুরো নাম:</span>
            <span className="col-span-2 font-bold text-slate-900">{voter.full_name}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-slate-500 font-medium text-sm">পিতার নাম:</span>
            <span className="col-span-2 font-semibold">{voter.father_name || '—'}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-slate-500 font-medium text-sm">মাতার নাম:</span>
            <span className="col-span-2 font-semibold">{voter.mother_name || '—'}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-slate-500 font-medium text-sm">জন্ম তারিখ:</span>
            <span className="col-span-2 font-semibold">{voter.date_of_birth}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-slate-500 font-medium text-sm">ওয়ার্ড:</span>
            <span className="col-span-2 font-semibold">{voter.ward}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-slate-500 font-medium text-sm">ভোট কেন্দ্র:</span>
            <span className="col-span-2 font-semibold text-slate-800">{voter.center_name}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-slate-500 font-medium text-sm">ভোটার নম্বর:</span>
            <span className="col-span-2 font-mono font-bold text-lg text-indigo-600">{voter.voter_number}</span>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-dashed border-slate-200">
          <p className="text-[10px] text-center text-slate-400 italic">
            স্লিপ আইডি: {voter.id.toUpperCase()} <br/>
            দ্রষ্টব্য: এটি শুধুমাত্র একটি ডেমো স্লিপ। এটি কোনো অফিসিয়াল কাজে ব্যবহারযোগ্য নয়।
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex-1 max-w-[200px]"
        >
          <Printer size={20} />
          প্রিন্ট করুন
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex-1 max-w-[200px]"
        >
          {isDownloading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Download size={20} />
          )}
          {isDownloading ? 'প্রসেস হচ্ছে...' : 'ডাউনলোড (ইমেজ)'}
        </button>
      </div>
    </div>
  );
};

export default VoterSlip;
