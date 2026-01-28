
import React, { useRef } from 'react';
import { Voter } from '../types';
import { Printer, Download, CheckCircle, Loader2, Share2, MapPin, Hash } from 'lucide-react';
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
      link.download = `voter-slip-nasirnagar-243.png`;
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
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 w-full max-w-full overflow-hidden">
      <div 
        ref={slipRef}
        id="voter-slip-card"
        className="relative bg-white border border-slate-200 rounded-2xl md:rounded-[2.5rem] p-5 md:p-12 shadow-xl max-w-2xl mx-auto overflow-hidden"
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-green-50 rounded-full -mr-12 -mt-12 md:-mr-16 md:-mt-16"></div>
        
        {/* Watermark - Adjusted for mobile visibility */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-25deg] select-none">
          <div className="text-center">
            <p className="text-6xl md:text-9xl font-black">২০২৬</p>
            <p className="text-2xl md:text-4xl font-bold">নাসিরনগর - ২৪৩</p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 md:mb-10 border-b border-slate-100 pb-6 md:pb-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-1 md:mb-2">
                <span className="bg-red-600 text-white text-[8px] md:text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-tighter">২০২৬ নির্বাচন</span>
                <h2 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">ভোটার স্লিপ</h2>
              </div>
              <p className="text-[10px] md:text-sm font-bold text-[#006a4e]">ত্রয়োদশ জাতীয় সংসদ নির্বাচন (২৪৩ নাসিরনগর)</p>
            </div>
            <div className="bg-green-100 text-[#006a4e] p-2 md:p-4 rounded-full md:rounded-3xl shadow-inner animate-in zoom-in duration-500 delay-200">
              <CheckCircle size={24} className="md:w-10 md:h-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 md:gap-y-6 text-slate-700">
            <div className="space-y-0.5">
              <span className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">পুরো নাম</span>
              <p className="font-black text-lg md:text-xl text-slate-900 border-l-4 border-[#006a4e] pl-3">{voter.full_name}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">পিতা/স্বামীর নাম</span>
              <p className="font-bold text-md md:text-lg text-slate-800 border-l-4 border-slate-200 pl-3">{voter.father_name || '—'}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">মাতার নাম</span>
              <p className="font-bold text-md md:text-lg text-slate-800 border-l-4 border-slate-200 pl-3">{voter.mother_name || '—'}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">জন্ম তারিখ</span>
              <p className="font-bold text-md md:text-lg text-slate-800 border-l-4 border-slate-200 pl-3">{voter.date_of_birth}</p>
            </div>
            
            <div className="space-y-1 md:col-span-2 bg-slate-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <MapPin size={14} className="text-red-600 md:w-4 md:h-4" />
                <span className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">আপনার ভোট কেন্দ্র</span>
              </div>
              <p className="font-black text-lg md:text-2xl text-slate-900 leading-tight">{voter.center_name}</p>
              <p className="text-[10px] md:text-sm text-[#006a4e] font-bold mt-0.5">নাসিরনগর উপজেলা, ব্রাহ্মণবাড়িয়া-১</p>
            </div>

            <div className="flex items-center gap-3 md:gap-4 bg-[#006a4e] p-4 md:p-6 rounded-xl md:rounded-2xl md:col-span-2 shadow-lg shadow-green-900/10">
              <div className="bg-white/20 p-2 md:p-3 rounded-lg md:rounded-xl text-white">
                <Hash size={18} className="md:w-6 md:h-6" />
              </div>
              <div className="flex-1">
                <span className="text-[8px] md:text-[10px] font-bold text-green-100 uppercase tracking-widest block">সিরিয়াল / ভোটার নম্বর</span>
                <p className="text-xl md:text-3xl font-black text-white leading-none">{voter.voter_number}</p>
              </div>
              <div className="bg-white/10 px-2 py-1 rounded-lg">
                <span className="text-[10px] md:text-xs font-bold text-white">ওয়ার্ড-{voter.ward}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 md:gap-3">
               <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 text-[8px] md:text-xs">ID</div>
               <div>
                  <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase">ভেরিফিকেশন আইডি</p>
                  <p className="text-[9px] md:text-[10px] font-mono text-slate-500 break-all">{voter.id.toUpperCase()}</p>
               </div>
            </div>
            <p className="text-[8px] md:text-[10px] text-center md:text-right text-slate-400 font-bold max-w-[180px] md:max-w-[200px]">
              দ্রষ্টব্য: এটি একটি ডিজিটাল স্লিপ। ভোট প্রদানের সুবিধার্থে এই তথ্যটি সাথে রাখুন।
            </p>
          </div>
        </div>
      </div>

      {/* Modern Control Buttons - Responsive Layout */}
      <div className="mt-6 md:mt-10 grid grid-cols-2 md:flex md:flex-wrap justify-center gap-3 md:gap-4 no-print px-2">
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white p-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-black transition-all shadow-xl active:scale-95 text-sm md:text-lg"
        >
          <Printer size={18} className="md:w-[22px] md:h-[22px]" />
          প্রিন্ট
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 bg-[#006a4e] hover:bg-[#004d39] disabled:bg-green-300 text-white p-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-black transition-all shadow-xl active:scale-95 text-sm md:text-lg shadow-green-900/20"
        >
          {isDownloading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Download size={18} className="md:w-[22px] md:h-[22px]" />
          )}
          <span>{isDownloading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}</span>
        </button>
        
        <button
          className="col-span-2 md:col-auto flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 p-3 md:px-8 md:py-5 rounded-xl md:rounded-2xl font-black transition-all shadow-md active:scale-95 text-sm md:text-lg"
        >
          <Share2 size={18} className="md:w-[22px] md:h-[22px]" />
          স্লিপ শেয়ার করুন
        </button>
      </div>
    </div>
  );
};

export default VoterSlip;
