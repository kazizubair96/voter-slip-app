
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
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div 
        ref={slipRef}
        id="voter-slip-card"
        className="relative bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 md:p-14 shadow-2xl max-w-2xl mx-auto overflow-hidden"
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-50 rounded-full -ml-12 -mb-12"></div>
        
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-25deg] select-none">
          <div className="text-center">
            <p className="text-9xl font-black">২০২৬</p>
            <p className="text-4xl font-bold">নাসিরনগর - ২৪৩</p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 border-b border-slate-100 pb-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-tighter">২০২৬ নির্বাচন</span>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">ভোটার স্লিপ</h2>
              </div>
              <p className="text-sm font-bold text-[#006a4e]">ত্রয়োদশ জাতীয় সংসদ নির্বাচন (২৪৩ নাসিরনগর)</p>
            </div>
            <div className="bg-green-100 text-[#006a4e] p-4 rounded-3xl shadow-inner animate-in zoom-in duration-500 delay-200">
              <CheckCircle size={40} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-slate-700">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">পুরো নাম</span>
              <p className="font-black text-xl text-slate-900 border-l-4 border-[#006a4e] pl-3">{voter.full_name}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">পিতা/স্বামীর নাম</span>
              <p className="font-bold text-lg text-slate-800 border-l-4 border-slate-200 pl-3">{voter.father_name || '—'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">মাতার নাম</span>
              <p className="font-bold text-lg text-slate-800 border-l-4 border-slate-200 pl-3">{voter.mother_name || '—'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">জন্ম তারিখ</span>
              <p className="font-bold text-lg text-slate-800 border-l-4 border-slate-200 pl-3">{voter.date_of_birth}</p>
            </div>
            
            <div className="space-y-1 md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-red-600" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">আপনার ভোট কেন্দ্র</span>
              </div>
              <p className="font-black text-2xl text-slate-900 leading-tight">{voter.center_name}</p>
              <p className="text-sm text-[#006a4e] font-bold mt-1">নাসিরনগর উপজেলা, ব্রাহ্মণবাড়িয়া-১</p>
            </div>

            <div className="flex items-center gap-4 bg-[#006a4e] p-6 rounded-2xl md:col-span-2 shadow-lg shadow-green-900/10">
              <div className="bg-white/20 p-3 rounded-xl text-white">
                <Hash size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-green-100 uppercase tracking-widest">সিরিয়াল / ভোটার নম্বর</span>
                <p className="text-3xl font-black text-white leading-none">{voter.voter_number}</p>
              </div>
              <div className="ml-auto flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
                <span className="text-xs font-bold text-white">ওয়ার্ড-{voter.ward}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 text-xs">ID</div>
               <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">ভেরিফিকেশন আইডি</p>
                  <p className="text-[10px] font-mono text-slate-500">{voter.id.toUpperCase()}</p>
               </div>
            </div>
            <p className="text-[10px] text-center md:text-right text-slate-400 font-bold max-w-[200px]">
              দ্রষ্টব্য: এটি একটি ডিজিটাল স্লিপ। ভোট প্রদানের সুবিধার্থে এই তথ্যটি সাথে রাখুন।
            </p>
          </div>
        </div>
      </div>

      {/* Modern Control Buttons */}
      <div className="mt-10 flex flex-wrap justify-center gap-4 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-2xl font-black transition-all shadow-xl active:scale-95 text-lg"
        >
          <Printer size={22} />
          প্রিন্ট করুন
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center justify-center gap-3 bg-[#006a4e] hover:bg-[#004d39] disabled:bg-green-300 text-white px-10 py-5 rounded-2xl font-black transition-all shadow-xl active:scale-95 text-lg shadow-green-900/20"
        >
          {isDownloading ? (
            <Loader2 className="animate-spin" size={22} />
          ) : (
            <Download size={22} />
          )}
          {isDownloading ? 'সেভ হচ্ছে...' : 'সেভ (ছবি)'}
        </button>
        
        <button
          className="flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-5 rounded-2xl font-black transition-all shadow-md active:scale-95 text-lg"
        >
          <Share2 size={22} />
          শেয়ার
        </button>
      </div>
    </div>
  );
};

export default VoterSlip;
