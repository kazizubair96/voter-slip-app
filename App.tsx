
import React, { useState } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
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
        setError('দুঃখিত, কোনো তথ্য পাওয়া যায়নি।');
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section (Hero) */}
      <header className="relative w-full bg-[#f4f4f4] overflow-hidden no-print" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Candidate Image Placeholder */}
          <div className="flex-1 flex justify-center md:justify-start order-2 md:order-1">
            <div className="relative">
               {/* Note: In a real app, use the actual image URL from the reference */}
               <img 
                 src="https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.png" 
                 alt="Candidate" 
                 className="w-64 h-auto md:w-80 mix-blend-multiply opacity-90"
               />
               <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden -translate-x-1/2">
                  <img src="https://images.unsplash.com/photo-1589118949245-7d38baf380d6?w=200&h=200&fit=crop" alt="Leader" />
               </div>
            </div>
          </div>

          {/* Central Text */}
          <div className="flex-[1.5] text-center space-y-2 order-1 md:order-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">স্মার্ট ঢাকা -১৬ বিনির্মাণে</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-red-600">৭ জানুয়ারি ২০২৪, রবিবার</h3>
            <h4 className="text-xl md:text-2xl font-bold text-gray-800">আসন্ন দ্বাদশ জাতীয় সংসদ নির্বাচনে</h4>
            <div className="text-2xl md:text-3xl font-bold">
              <span className="text-green-700">ঢাকা -১৬</span> <span className="text-gray-800">আসনে</span>
            </div>
            <p className="text-red-600 font-bold text-lg">দেশরত্ন জননেত্রী শেখ হাসিনা মনোনীত</p>
            <p className="text-green-700 font-bold">বাংলাদেশ আওয়ামী লীগের সংসদ সদস্য পদপ্রার্থী</p>
            <h1 className="text-4xl md:text-5xl font-black text-blue-700 mt-4">মোঃ ইলিয়াস উদ্দিন মোল্লাহ-কে</h1>
          </div>

          {/* Symbol Image Placeholder */}
          <div className="flex-1 flex justify-center md:justify-end order-3">
             <div className="text-center">
                <div className="bg-red-600 text-white px-4 py-1 font-bold inline-block rounded mb-2">জয় বাংলা জয় বঙ্গবন্ধু</div>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Election_Symbol_Boat.svg/200px-Election_Symbol_Boat.svg.png" 
                  alt="Nouka Symbol" 
                  className="w-32 md:w-48 mx-auto"
                />
                <div className="text-3xl md:text-5xl font-black text-blue-700 mt-2">নৌকায় ভোট দিন</div>
             </div>
          </div>
        </div>
      </header>

      {/* Search Bar (Blue Section) */}
      <section className="bg-[#0072bc] py-10 px-4 no-print shadow-inner">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-3xl font-bold text-white">আপনার ভোট কেন্দ্রের নাম জানতে আপনার তথ্য বাংলায় প্রদান করুন</h2>
            <p className="text-white/80 text-sm mt-2">অনুসন্ধানের জন্য <span className="text-yellow-400 font-bold">জন্ম তারিখ</span> এবং <span className="text-yellow-400 font-bold">ওয়ার্ড</span> পূরণ করা বাধ্যতামূলক</p>
          </div>
          
          <VoterForm onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </section>

      {/* Content Area (Results) */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in no-print">
              <AlertCircle size={24} />
              <span className="font-bold">{error}</span>
            </div>
          )}

          {hasSearched && !selectedVoter && (
            <div className="space-y-6">
              <button
                onClick={resetSearch}
                className="no-print flex items-center gap-2 text-[#0072bc] hover:underline font-bold mb-4"
              >
                <ArrowLeft size={18} />
                আবার খুঁজুন
              </button>
              <VoterList voters={voters} onSelect={setSelectedVoter} />
            </div>
          )}

          {selectedVoter && (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedVoter(null)}
                className="no-print flex items-center gap-2 text-[#0072bc] hover:underline font-bold mb-4"
              >
                <ArrowLeft size={18} />
                তালিকা পাতায় ফিরে যান
              </button>
              <VoterSlip voter={selectedVoter} />
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto py-6 bg-slate-900 text-white text-center text-sm no-print">
         <p>Crafted by ❤️ Webapp Team | © ২০২৪ সকল অধিকার সংরক্ষিত</p>
      </footer>
    </div>
  );
};

export default App;
