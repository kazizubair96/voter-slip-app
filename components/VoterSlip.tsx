
import React, { useState } from 'react';
import { Voter } from '../types';
import { Printer as PrinterIcon, Download as DownloadIcon, Share2 as ShareIcon, MapPin as MapPinIcon, CheckCircle as CheckIcon, Loader2 as LoaderIcon, Calendar as CalendarIcon } from 'lucide-react';

interface VoterSlipProps {
  voter: Voter;
}

const VoterSlip: React.FC<VoterSlipProps> = ({ voter }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  /**
   * নির্বাচনি আইকন ড্রয়িং (ক্যানভাসের জন্য - ব্যালট বক্স ও হাত)
   */
  const drawElectionIcon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);

    const green = '#006a4e';
    const red = '#dc2626';
    const white = '#ffffff';

    // ১. হাত (সবুজ) - উপর থেকে আসছে
    ctx.fillStyle = green;
    ctx.beginPath();
    ctx.moveTo(size * 0.1, 0);
    ctx.lineTo(size * 0.42, size * 0.35);
    ctx.lineTo(size * 0.42, size * 0.45);
    ctx.lineTo(size * 0.32, size * 0.45);
    ctx.lineTo(size * 0.05, size * 0.15);
    ctx.closePath();
    ctx.fill();

    // ২. ব্যালট পেপার (সাদা)
    ctx.fillStyle = white;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.fillRect(size * 0.4, size * 0.2, size * 0.18, size * 0.3);
    ctx.strokeRect(size * 0.4, size * 0.2, size * 0.18, size * 0.3);

    // ৩. ব্যালট বক্স স্লট/মুখ
    ctx.fillStyle = '#004d39';
    ctx.beginPath();
    ctx.roundRect(size * 0.25, size * 0.45, size * 0.5, size * 0.1, 4);
    ctx.fill();

    // ৪. ব্যালট বক্স বডি (সবুজ)
    ctx.fillStyle = green;
    ctx.beginPath();
    ctx.roundRect(size * 0.05, size * 0.5, size * 0.9, size * 0.45, 12);
    ctx.fill();

    // ৫. লাল প্যানেল
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.roundRect(size * 0.15, size * 0.6, size * 0.7, size * 0.28, 6);
    ctx.fill();

    // ৬. "নির্বাচন" টেক্সট
    ctx.fillStyle = white;
    ctx.textAlign = 'center';
    ctx.font = `bold ${size * 0.16}px "Hind Siliguri"`;
    ctx.fillText('নির্বাচন', size * 0.5, size * 0.8);

    ctx.restore();
  };

  /**
   * ক্যানভাসে ক্যালেন্ডার আইকন ড্রয়িং
   */
  const drawCalendarIcon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, size * 0.2, size, size * 0.8);
    ctx.beginPath();
    ctx.moveTo(0, size * 0.45);
    ctx.lineTo(size, size * 0.45);
    ctx.moveTo(size * 0.3, 0);
    ctx.lineTo(size * 0.3, size * 0.2);
    ctx.moveTo(size * 0.7, 0);
    ctx.lineTo(size * 0.7, size * 0.2);
    ctx.stroke();
    ctx.restore();
  };

  const drawIcon = (ctx: CanvasRenderingContext2D, type: 'pin' | 'check', x: number, y: number, size: number, color: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.5;
    if (type === 'pin') {
      ctx.beginPath(); ctx.arc(size/2, size/3, size/3, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(size/2, size/3, size/8, 0, Math.PI * 2); ctx.fill();
      ctx.moveTo(size/2, size*0.66); ctx.lineTo(size/2, size); ctx.stroke();
    } else if (type === 'check') {
      ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(size*0.25, size*0.5); ctx.lineTo(size*0.45, size*0.7); ctx.lineTo(size*0.75, size*0.3); ctx.stroke();
    }
    ctx.restore();
  };

  const getCanvas = async () => {
    const width = 800;
    const height = 500;
    const scale = 4;
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.scale(scale, scale);
    await document.fonts.ready;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#f0fdf4';
    ctx.beginPath(); ctx.arc(width + 20, -20, 220, 0, Math.PI * 2); ctx.fill();

    // Top Bar
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, '#006a4e'); grad.addColorStop(1, '#dc2626');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, 8);

    // Election Icon
    drawElectionIcon(ctx, 40, 25, 90);

    // Header Text
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 38px "Hind Siliguri"';
    ctx.fillText('ডিজিটাল ভোটার স্লিপ', 145, 78);
    ctx.fillStyle = '#006a4e';
    ctx.font = 'bold 14px "Hind Siliguri"';
    ctx.fillText('নাসিরনগর (২৪৩) | ত্রয়োদশ জাতীয় সংসদ নির্বাচন ২০২৬', 145, 105);

    ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(40, 130); ctx.lineTo(width - 40, 130); ctx.stroke();

    // Main Info
    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 13px "Hind Siliguri"'; ctx.fillText('ভোটারের নাম', 40, 165);
    ctx.fillStyle = '#0f172a'; ctx.font = '900 36px "Hind Siliguri"'; ctx.fillText(voter.full_name, 40, 205);
    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 12px "Hind Siliguri"'; ctx.fillText('পিতা/স্বামী', 40, 255); ctx.fillText('মাতার নাম', 320, 255);
    ctx.fillStyle = '#475569'; ctx.font = '800 20px "Hind Siliguri"'; ctx.fillText(voter.father_name || '—', 40, 285); ctx.fillText(voter.mother_name || '—', 320, 285);
    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 12px "Hind Siliguri"'; ctx.fillText('ভোট কেন্দ্র', 40, 335);
    drawIcon(ctx, 'pin', 40, 355, 24, '#dc2626');
    ctx.fillStyle = '#1e293b'; ctx.font = '900 26px "Hind Siliguri"'; ctx.fillText(voter.center_name, 75, 375);

    // DOB Card
    ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.roundRect(width - 320, 150, 280, 75, 25); ctx.fill();
    drawCalendarIcon(ctx, width - 300, 172, 20, '#2563eb');
    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 11px "Hind Siliguri"'; ctx.fillText('জন্ম তারিখ', width - 270, 175);
    ctx.fillStyle = '#334155'; ctx.font = '900 24px sans-serif'; ctx.fillText(voter.date_of_birth, width - 270, 205);

    // Voter Number Card
    ctx.fillStyle = '#006a4e'; ctx.beginPath(); ctx.roundRect(width - 320, 245, 280, 175, 40); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 12px "Hind Siliguri"'; ctx.fillText('ভোটার নম্বর / সিরিয়াল', width - 290, 285);
    ctx.fillStyle = 'white'; ctx.font = `900 34px sans-serif`; ctx.fillText(voter.voter_number, width - 290, 330);
    ctx.font = 'bold 16px "Hind Siliguri"'; ctx.fillText(`ওয়ার্ড - ${voter.ward}`, width - 290, 390);
    drawIcon(ctx, 'check', width - 100, 370, 22, '#86efac');

    // Footer
    ctx.textAlign = 'left'; 
    ctx.fillStyle = '#cbd5e1'; 
    ctx.font = 'bold 12px "Hind Siliguri"'; 
    ctx.fillText('© ২০২৬ ডিজিটাল নির্বাচনী প্রচার সেল', 40, 475);

    // Bottom Right Text (Missing in previous version)
    ctx.textAlign = 'right';
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 12px "Hind Siliguri"';
    ctx.fillText('নাসিরনগর উপজেলার সকল ভোটারদের জন্য এটি একটি ডিজিটাল সার্ভিস।', width - 40, 475);
    
    // Reset alignment
    ctx.textAlign = 'left';

    return canvas;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const canvas = await getCanvas();
      if (canvas) {
        const link = document.createElement('a');
        link.download = `voter-slip-${voter.voter_number}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
      }
    } catch (e) { alert("সেভ করা সম্ভব হয়নি।"); } finally { setIsDownloading(false); }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const canvas = await getCanvas();
      if (canvas) {
        canvas.toBlob(async (blob) => {
          if (blob && navigator.share) {
            const file = new File([blob], `slip.png`, { type: 'image/png' });
            await navigator.share({ files: [file], title: 'ভোটার স্লিপ' });
          } else { alert("শেয়ার সাপোর্ট করছে না। ছবি সেভ করে শেয়ার করুন।"); }
        }, 'image/png');
      }
    } catch (e) {} finally { setIsSharing(false); }
  };

  const ElectionIconUI = ({ className }: { className?: string }) => (
    <div className={`${className} flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M10 5 L42 35 L42 45 L32 45 L5 15 Z" fill="#006a4e" />
        <rect x="40" y="20" width="18" height="28" fill="white" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="25" y="45" width="50" height="10" rx="2" fill="#004d39" />
        <rect x="5" y="50" width="90" height="45" rx="10" fill="#006a4e" />
        <rect x="15" y="62" width="70" height="25" rx="4" fill="#dc2626" />
        <text x="50" y="81" textAnchor="middle" fill="white" className="font-bold text-[15px]" style={{ fontFamily: 'Hind Siliguri' }}>নির্বাচন</text>
      </svg>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[850px] animate-in fade-in slide-in-from-bottom-6 duration-700 px-2">
        <div id="voter-slip-card" className="relative bg-white border border-slate-200 rounded-2xl md:rounded-[2.5rem] p-4 md:p-10 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-green-50 rounded-full -mr-16 -mt-16 md:-mr-32 md:-mt-32 opacity-60"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-start gap-3 md:gap-6 border-b border-slate-100 pb-3 md:pb-6 mb-4 md:mb-8">
            <div className="flex items-center gap-3 md:gap-5 text-center md:text-left">
              <ElectionIconUI className="w-16 h-16 md:w-28 md:h-28 shrink-0" />
              <div>
                <h2 className="text-base md:text-3xl font-black text-slate-800">ডিজিটাল ভোটার স্লিপ</h2>
                <p className="text-[8px] md:text-sm font-bold text-[#006a4e] uppercase tracking-widest">নাসিরনগর (২৪৩) | নির্বাচন ২০২৬</p>
              </div>
            </div>
            <div className="bg-red-600 text-white text-[7px] md:text-[10px] px-2 py-0.5 md:px-2.5 md:py-1 rounded-full font-black tracking-widest self-center md:self-start">CONFIDENTIAL</div>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 text-left">
            <div className="md:col-span-7 space-y-3 md:space-y-6">
              <div>
                <label className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase block">ভোটারের নাম</label>
                <p className="text-base md:text-2xl font-black text-slate-900 leading-tight">{voter.full_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase block">পিতা/স্বামী</label>
                  <p className="text-[10px] md:text-base font-bold text-slate-700 truncate">{voter.father_name || '—'}</p>
                </div>
                <div>
                  <label className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase block">মাতার নাম</label>
                  <p className="text-[10px] md:text-base font-bold text-slate-700 truncate">{voter.mother_name || '—'}</p>
                </div>
              </div>
              <div>
                <label className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase block">ভোট কেন্দ্র</label>
                <div className="flex items-start gap-1">
                  <MapPinIcon size={12} className="text-red-600 mt-0.5 shrink-0 md:w-5 md:h-5" />
                  <p className="text-[10px] md:text-xl font-black text-slate-800 leading-tight">{voter.center_name}</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-5 flex flex-col gap-3 md:gap-4">
              <div className="bg-slate-50 p-2 md:p-4 rounded-xl md:rounded-3xl border border-slate-100 flex items-center gap-2">
                <CalendarIcon size={14} className="text-blue-600 md:w-6 md:h-6" />
                <div>
                  <label className="text-[8px] md:text-[10px] font-bold text-slate-400 block uppercase">জন্ম তারিখ</label>
                  <span className="text-[10px] md:text-lg font-black text-slate-700">{voter.date_of_birth}</span>
                </div>
              </div>
              <div className="bg-[#006a4e] p-3 md:p-6 rounded-xl md:rounded-[2rem] text-white shadow-xl">
                <label className="text-[8px] md:text-[10px] font-bold text-green-100 uppercase block">ভোটার নম্বর / সিরিয়াল</label>
                <p className="text-base md:text-3xl font-black tracking-widest my-1">{voter.voter_number}</p>
                <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center text-[8px] md:text-sm font-bold uppercase">
                  <span>ওয়ার্ড - {voter.ward}</span>
                  <CheckIcon size={12} className="md:w-5 md:h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-10 flex flex-wrap justify-center gap-2 no-print px-4 w-full max-w-4xl">
        <button
          onClick={handleDownload}
          disabled={isDownloading || isSharing}
          className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-[#006a4e] hover:bg-[#004d39] text-white py-2 px-3 md:py-3 md:px-8 rounded-lg font-bold text-[10px] md:text-base active:scale-95 shadow-md transition-all"
        >
          {isDownloading ? <LoaderIcon className="animate-spin" size={12} /> : <DownloadIcon size={12} className="md:w-4 md:h-4" />}
          <span>{isDownloading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}</span>
        </button>
        <button
          onClick={handleShare}
          disabled={isDownloading || isSharing}
          className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 md:py-3 md:px-8 rounded-lg font-bold text-[10px] md:text-base active:scale-95 shadow-md transition-all"
        >
          {isSharing ? <LoaderIcon className="animate-spin" size={12} /> : <ShareIcon size={12} className="md:w-4 md:h-4" />}
          <span>শেয়ার</span>
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-black text-white py-2 px-3 md:py-3 md:px-8 rounded-lg font-bold text-[10px] md:text-base active:scale-95 shadow-md transition-all"
        >
          <PrinterIcon size={12} className="md:w-4 md:h-4" />
          <span>প্রিন্ট</span>
        </button>
      </div>
    </div>
  );
};

export default VoterSlip;
