
import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, Vote } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header Section */}
      <header className="bg-[#001d3d] text-white py-12 px-4 shadow-lg no-print">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
              <Vote size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">ভোটার স্লিপ অনুসন্ধান</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            আপনার সঠিক জন্ম তারিখ এবং ওয়ার্ড নম্বর ব্যবহার করে আপনার ভোট কেন্দ্রের তথ্য এবং ভোটার স্লিপ সংগ্রহ করুন।
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 -mt-10 pb-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-slate-100">
          
          {!hasSearched && !selectedVoter && (
            <div className="space-y-8">
              <div className="border-b border-slate-100 pb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#001d3d] rounded-full"></span>
                  অনুসন্ধান করুন
                </h2>
              </div>
              <VoterForm onSearch={handleSearch} isLoading={isLoading} />
            </div>
          )}

          {error && !isLoading && (
            <div className="mt-8 p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center gap-4 animate-in fade-in slide-in-from-top-2 no-print">
              <AlertCircle size={32} className="shrink-0" />
              <div>
                <p className="font-bold text-lg">তথ্য পাওয়া যায়নি</p>
                <p>{error}</p>
                <button onClick={resetSearch} className="mt-2 text-sm underline font-medium">আবার চেষ্টা করুন</button>
              </div>
            </div>
          )}

          {hasSearched && !selectedVoter && voters.length > 0 && (
            <div className="space-y-6 pt-4">
              <button
                onClick={resetSearch}
                className="no-print flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-bold mb-4"
              >
                <ArrowLeft size={18} />
                নতুন করে খুঁজুন
              </button>
              <VoterList voters={voters} onSelect={setSelectedVoter} />
            </div>
          )}

          {selectedVoter && (
            <div className="space-y-6 pt-4">
              <button
                onClick={() => setSelectedVoter(null)}
                className="no-print flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-bold mb-4"
              >
                <ArrowLeft size={18} />
                তালিকায় ফিরে যান
              </button>
              <VoterSlip voter={selectedVoter} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-slate-400 text-center text-sm no-print">
         <p>© ২০২৪ সকল অধিকার সংরক্ষিত | মোঃ ইলিয়াস উদ্দিন মোল্লাহ নির্বাচনী প্রচার সেল</p>
      </footer>
    </div>
  );
};

export default App;
