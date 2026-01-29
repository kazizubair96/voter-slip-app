
import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, MapPin, Search, Info } from 'lucide-react';
import VoterForm from './components/VoterForm';
import VoterSlip from './components/VoterSlip';
import VoterList from './components/VoterList';
import { findVoterByParams } from './services/supabase';
import { Voter, SearchParams } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setVoters([]);
    setSelectedVoter(null);

    try {
      const { data, error: apiError } = await findVoterByParams(params);
      if (apiError) {
        setError('সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      } else if (!data || data.length === 0) {
        setError('দুঃখিত, আপনার প্রদত্ত তথ্যের সাথে কোনো ভোটার রেকর্ড খুঁজে পাওয়া যায়নি।');
      } else {
        setVoters(data);
        setHasSearched(true);
      }
    } catch (err) {
      setError('নেটওয়ার্ক সমস্যা। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setVoters([]);
    setSelectedVoter(null);
    setError(null);
    setHasSearched(false);
  };

  /**
   * থিম লোগো (ব্যালট বক্স ও হাত)
   */
  const ElectionLogo = () => (
    <div className="w-20 h-20 md:w-32 md:h-32 mx-auto mb-4 md:mb-6 bg-white p-2 rounded-2xl shadow-xl flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M10 5 L45 35 L45 45 L35 45 L10 15 Z" fill="#006a4e" />
        <rect x="42" y="25" width="16" height="25" fill="white" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="30" y="45" width="40" height="8" rx="2" fill="#004d39" />
        <rect x="10" y="50" width="80" height="45" rx="8" fill="#006a4e" />
        <rect x="20" y="62" width="60" height="25" rx="4" fill="#dc2626" />
        <text x="50" y="80" textAnchor="middle" fill="white" className="font-bold text-[14px]" style={{ fontFamily: 'Hind Siliguri' }}>নির্বাচন</text>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-['Hind_Siliguri'] flex flex-col">
      <header className="bg-gradient-to-r from-[#006a4e] to-[#004d39] text-white pt-6 pb-16 md:pt-12 md:pb-24 px-4 shadow-2xl no-print relative overflow-hidden text-center">
        <div className="max-w-7xl mx-auto relative z-10">
          <ElectionLogo />
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-4">
            <span className="text-[10px] md:text-sm font-bold tracking-wider uppercase">ত্রয়োদশ জাতীয় সংসদ নির্বাচন ২০২৬</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-black mb-1 md:mb-4">ব্রাহ্মণবাড়িয়া-১</h1>
          <h2 className="text-lg md:text-3xl font-bold text-green-100 mb-4">নাসিরনগর (২৪৩) নির্বাচনী এলাকা</h2>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-4 -mt-8 md:-mt-16 pb-12 relative z-10 flex-grow">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          {!hasSearched && !selectedVoter && (
            <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 md:px-8 md:py-6 flex items-center gap-3">
              <div className="bg-[#006a4e] p-2 rounded-lg text-white"><Search size={18} /></div>
              <div>
                <h3 className="text-base md:text-xl font-bold text-slate-800">ভোটার তথ্য অনুসন্ধান</h3>
                <p className="text-slate-500 text-[9px] md:text-sm">নাম (ঐচ্ছিক), জন্ম তারিখ ও ওয়ার্ড দিয়ে খুঁজুন</p>
              </div>
            </div>
          )}

          <div className="p-4 md:p-12">
            {!hasSearched && !selectedVoter && <VoterForm onSearch={handleSearch} isLoading={isLoading} />}
            {error && !isLoading && (
              <div className="p-6 md:p-8 text-center no-print">
                <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-red-800 mb-2">দুঃখিত!</h4>
                <p className="text-sm text-red-600 mb-6">{error}</p>
                <button onClick={resetSearch} className="bg-red-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-md">আবার চেষ্টা করুন</button>
              </div>
            )}
            {hasSearched && !selectedVoter && voters.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 no-print">
                  <button onClick={resetSearch} className="flex items-center gap-1.5 text-slate-500 font-bold px-2 py-1.5 hover:bg-slate-50 rounded-lg text-xs md:text-sm">
                    <ArrowLeft size={16} /> নতুন সার্চ
                  </button>
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold text-[10px] md:text-xs">
                    {voters.length} টি ফলাফল
                  </span>
                </div>
                <VoterList voters={voters} onSelect={setSelectedVoter} />
              </div>
            )}
            {selectedVoter && (
              <div className="space-y-6">
                <button onClick={() => setSelectedVoter(null)} className="no-print flex items-center gap-1.5 text-slate-500 font-bold px-2 py-1.5 hover:bg-slate-50 rounded-lg text-xs md:text-sm">
                  <ArrowLeft size={16} /> তালিকায় ফিরে যান
                </button>
                <VoterSlip voter={selectedVoter} />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-8 bg-white border-t border-slate-200 text-center no-print px-4">
        <p className="text-slate-800 font-bold text-sm md:text-base">ব্রাহ্মণবাড়িয়া-১ (নাসিরনগর-২৪৩)</p>
        <p className="text-slate-400 text-[9px] md:text-xs mt-2">© ২০২৬ | ডিজিটাল নির্বাচনী প্রচার সেল, নাসিরনগর</p>
      </footer>
    </div>
  );
};

export default App;
