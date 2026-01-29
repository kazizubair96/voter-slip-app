
import React, { useState } from 'react';
import { Voter } from '../types';
import { Printer, Download, CheckCircle, Loader2, MapPin, User, Share2 } from 'lucide-react';

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
   * ম্যানুয়ালি আইকন ড্র করার ফাংশন
   */
  const drawIcon = (ctx: CanvasRenderingContext2D, type: 'voter' | 'pin' | 'check', x: number, y: number, size: number, color: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (type === 'voter') {
      ctx.beginPath();
      ctx.arc(size/2, size/3, size/4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(size*0.1, size*0.9);
      ctx.quadraticCurveTo(size/2, size*0.4, size*0.9, size*0.9);
      ctx.stroke();
    } else if (type === 'pin') {
      ctx.beginPath();
      ctx.arc(size/2, size/3, size/3, 0, Math.PI * 2);
      ctx.moveTo(size/2, size*0.66);
      ctx.lineTo(size/2, size);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(size/2, size/3, size/8, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'check') {
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(size*0.25, size*0.5);
      ctx.lineTo(size*0.45, size*0.7);
      ctx.lineTo(size*0.75, size*0.3);
      ctx.stroke();
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

    // ব্যাকগ্রাউন্ড
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // ডেকোরেশন
    ctx.fillStyle = '#f0fdf4';
    ctx.beginPath(); ctx.arc(width + 20, -20, 220, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fef2f2';
    ctx.beginPath(); ctx.arc(-40, height + 40, 180, 0, Math.PI * 2); ctx.fill();

    // টপ বার
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, '#006a4e'); grad.addColorStop(1, '#dc2626');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, 8);

    // হেডার সবুজ বক্স ও আইকন
    ctx.fillStyle = '#006a4e';
    ctx.beginPath(); ctx.roundRect(40, 40, 70, 70, 18); ctx.fill();
    drawIcon(ctx, 'voter', 57, 57, 36, '#ffffff');

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 38px "Hind Siliguri"';
    ctx.fillText('ডিজিটাল ভোটার স্লিপ', 125, 78);
    ctx.fillStyle = '#006a4e';
    ctx.font = 'bold 15px "Hind Siliguri"';
    ctx.fillText('নাসিরনগর (২৪৩) | নির্বাচন ২০২৬', 125, 105);

    // কনফিডেন্সিয়াল ব্যাজ
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.roundRect(width - 190, 55, 150, 36, 18); ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = '900 12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('CONFIDENTIAL', width - 115, 78);
    ctx.textAlign = 'left';

    ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(40, 130); ctx.lineTo(width - 40, 130); ctx.stroke();

    // ভোটার তথ্য (বাম পাশ)
    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 13px "Hind Siliguri"';
    ctx.fillText('ভোটারের নাম', 40, 165);
    ctx.fillStyle = '#0f172a'; ctx.font = '900 36px "Hind Siliguri"';
    ctx.fillText(voter.full_name, 40, 205);

    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 12px "Hind Siliguri"';
    ctx.fillText('পিতা/স্বামী', 40, 255); ctx.fillText('মাতার নাম', 320, 255);
    ctx.fillStyle = '#475569'; ctx.font = '800 20px "Hind Siliguri"';
    ctx.fillText(voter.father_name || '—', 40, 285);
    ctx.fillText(voter.mother_name || '—', 320, 285);

    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 12px "Hind Siliguri"';
    ctx.fillText('ভোট কেন্দ্র', 40, 335);
    drawIcon(ctx, 'pin', 40, 355, 24, '#dc2626');
    ctx.fillStyle = '#1e293b'; ctx.font = '900 26px "Hind Siliguri"';
    const centerName = voter.center_name;
    if(centerName.length > 25) {
      ctx.fillText(centerName.substring(0, 25), 75, 375);
      ctx.fillText(centerName.substring(25), 75, 410);
    } else { ctx.fillText(centerName, 75, 375); }

    // জন্ম তারিখ কার্ড (ডান পাশ)
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath(); ctx.roundRect(width - 320, 150, 280, 75, 25); ctx.fill();
    ctx.strokeStyle = '#f1f5f9'; ctx.stroke();
    drawIcon(ctx, 'voter', width - 300, 172, 28, '#2563eb');
    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 11px "Hind Siliguri"';
    ctx.fillText('জন্ম তারিখ', width - 260, 175);
    ctx.fillStyle = '#334155'; ctx.font = '900 24px sans-serif';
    ctx.fillText(voter.date_of_birth, width - 260, 205);

    // ভোটার নম্বর কার্ড (সবুজ)
    ctx.fillStyle = '#006a4e';
    ctx.beginPath(); ctx.roundRect(width - 320, 245, 280, 175, 40); ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'bold 12px "Hind Siliguri"';
    ctx.fillText('ভোটার নম্বর / সিরিয়াল', width - 290, 285);

    const vNum = voter.voter_number;
    const fontSize = vNum.length > 12 ? 24 : vNum.length > 10 ? 28 : 32;
    ctx.fillStyle = 'white';
    ctx.font = `900 ${fontSize}px sans-serif`;
    ctx.fillText(vNum, width - 290, 330);

    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath(); ctx.moveTo(width - 290, 355); ctx.lineTo(width - 70, 355); ctx.stroke();

    ctx.font = 'bold 16px "Hind Siliguri"';
    ctx.fillText(`ওয়ার্ড - ${voter.ward}`, width - 290, 390);
    drawIcon(ctx, 'check', width - 100, 370, 22, '#86efac');

    // ফুটার ডিভাইডার
    ctx.strokeStyle = '#cbd5e1'; ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(40, 440); ctx.lineTo(width - 40, 440); ctx.stroke(); ctx.setLineDash([]);
    
    // ফুটার এলাইনমেন্ট: বাম এবং ডান (একই লাইনে)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#cbd5e1'; ctx.font = 'bold 12px "Hind Siliguri"';
    ctx.fillText('© ২০২৬ ডিজিটাল নির্বাচনী প্রচার সেল', 40, 475);
    
    ctx.textAlign = 'right';
    ctx.fillStyle = '#94a3b8'; ctx.font = 'italic 12px "Hind Siliguri"';
    ctx.fillText('এটি একটি ডিজিটাল স্লিপ। ভোট প্রদানের সুবিধার্থে এই তথ্যটি সাথে রাখুন।', width - 40, 475);

    return canvas;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const canvas = await getCanvas();
      if (!canvas) return;
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `voter-slip-${voter.voter_number}.png`;
      link.href = dataUrl; link.click();
    } catch (e) {
      console.error(e); alert("সেভ করা সম্ভব হয়নি।");
    } finally { setIsDownloading(false); }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const canvas = await getCanvas();
      if (!canvas) return;
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `voter-slip-${voter.voter_number}.png`, { type: 'image/png' });
        
        if (navigator.share) {
          try {
            await navigator.share({
              files: [file],
              title: 'ডিজিটাল ভোটার স্লিপ',
              text: `${voter.full_name} এর ভোটার স্লিপ`,
            });
          } catch (err) {
            console.error("Sharing failed", err);
          }
        } else {
          alert("আপনার ব্রাউজারে শেয়ার অপশনটি সাপোর্ট করছে না। ছবি সেভ করে শেয়ার করুন।");
        }
      }, 'image/png');
    } catch (e) {
      console.error(e);
    } finally { setIsSharing(false); }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[850px] animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div id="voter-slip-card" className="relative bg-white border border-slate-200 rounded-3xl md:rounded-[2.5rem] p-4 md:p-10 shadow-xl overflow-hidden">
          {/* Background shapes scaled down for mobile */}
          <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-green-50 rounded-full -mr-24 -mt-24 md:-mr-32 md:-mt-32 opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-red-50 rounded-full -ml-16 -mb-16 md:-ml-24 md:-mb-24 opacity-40"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-start gap-4 md:gap-6 border-b border-slate-100 pb-4 md:pb-6 mb-4 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4 text-center md:text-left">
              <div className="bg-[#006a4e] p-2 md:p-3 rounded-xl md:rounded-2xl text-white shadow-lg">
                <User size={24} className="md:w-8 md:h-8" />
              </div>
              <div>
                <h2 className="text-lg md:text-3xl font-black text-slate-800">ডিজিটাল ভোটার স্লিপ</h2>
                <p className="text-[10px] md:text-sm font-bold text-[#006a4e] uppercase tracking-widest">নাসিরনগর (২৪৩) | ২০২৬</p>
              </div>
            </div>
            <div className="bg-red-600 text-white text-[8px] md:text-[10px] px-3 py-1 md:px-4 md:py-1.5 rounded-full font-black tracking-widest">CONFIDENTIAL</div>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 text-left">
            <div className="md:col-span-7 space-y-4 md:space-y-6">
              <div>
                <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">ভোটারের নাম</label>
                <p className="text-lg md:text-2xl font-black text-slate-900 leading-tight">{voter.full_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">পিতা/স্বামী</label>
                  <p className="text-xs md:text-base font-bold text-slate-700 truncate">{voter.father_name || '—'}</p>
                </div>
                <div>
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">মাতার নাম</label>
                  <p className="text-xs md:text-base font-bold text-slate-700 truncate">{voter.mother_name || '—'}</p>
                </div>
              </div>
              <div className="pt-1 md:pt-2">
                <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">ভোট কেন্দ্র</label>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-red-600 mt-1 shrink-0 md:w-[22px] md:h-[22px]" />
                  <p className="text-sm md:text-xl font-black text-slate-800 leading-tight">{voter.center_name}</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-5 flex flex-col gap-3 md:gap-4">
              <div className="bg-slate-50 p-3 md:p-4 rounded-2xl md:rounded-3xl border border-slate-100 flex items-center gap-3">
                <div className="text-blue-600"><User size={18} className="md:w-6 md:h-6" /></div>
                <div>
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 block uppercase">জন্ম তারিখ</label>
                  <span className="text-sm md:text-lg font-black text-slate-700">{voter.date_of_birth}</span>
                </div>
              </div>
              <div className="bg-[#006a4e] p-4 md:p-6 rounded-2xl md:rounded-[2rem] text-white shadow-xl flex flex-col justify-center">
                <label className="text-[9px] md:text-[10px] font-bold text-green-100 uppercase block mb-0.5">ভোটার নম্বর / সিরিয়াল</label>
                <p className="text-xl md:text-3xl font-black tracking-widest my-1 md:my-2 break-all">{voter.voter_number}</p>
                <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-white/10 flex justify-between items-center text-[10px] md:text-sm font-bold uppercase tracking-widest">
                  <span>ওয়ার্ড - {voter.ward}</span>
                  <CheckCircle size={16} className="md:w-[22px] md:h-[22px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Smaller as requested */}
      <div className="mt-6 md:mt-10 flex flex-wrap justify-center gap-3 no-print px-4 w-full max-w-4xl">
        <button
          onClick={handleDownload}
          disabled={isDownloading || isSharing}
          className="flex-1 md:flex-none min-w-[120px] flex items-center justify-center gap-2 bg-[#006a4e] hover:bg-[#004d39] disabled:bg-green-300 text-white py-3 px-6 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm md:text-base"
        >
          {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
          <span>{isDownloading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}</span>
        </button>

        <button
          onClick={handleShare}
          disabled={isDownloading || isSharing}
          className="flex-1 md:flex-none min-w-[120px] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 px-6 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm md:text-base"
        >
          {isSharing ? <Loader2 className="animate-spin" size={20} /> : <Share2 size={20} />}
          <span>শেয়ার করুন</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-3 px-6 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm md:text-base"
        >
          <Printer size={20} />
          প্রিন্ট
        </button>
      </div>
    </div>
  );
};

export default VoterSlip;
