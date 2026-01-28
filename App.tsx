
import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, Vote, MapPin, Search, Info } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-['Hind_Siliguri']">
      {/* Premium Header Section */}
      <header className="bg-gradient-to-r from-[#006a4e] to-[#004d39] text-white pt-12 pb-24 px-4 shadow-2xl no-print relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-600/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 mb-6 animate-pulse">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm font-bold tracking-wider">ত্রয়োদশ জাতীয় সংসদ নির্বাচন ২০২৬</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-lg">
            ব্রাহ্মণবাড়িয়া-১
          </h1>
          <h2 className="text-xl md:text-3xl font-bold text-green-100 mb-8">
            নাসিরনগর (২৪৩) নির্বাচনী এলাকা
          </h2>
          
          <div className="max-w-2xl mx-auto flex flex-wrap justify-center gap-4 text-white/90">
             <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg">
                <MapPin size={18} className="text-red-400" />
                <span>ব্রাহ্মণবাড়িয়া</span>
             </div>
             <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg">
                <Vote size={18} className="text-red-400" />
                <span>২৪৩ নাসিরনগর</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 -mt-16 pb-20 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          
          {/* Form Header */}
          {!hasSearched && !selectedVoter && (
            <div className="bg-slate-50 border-b border-slate-100 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#006a4e] p-3 rounded-2xl shadow-lg shadow-green-900/20">
                  <Search className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">ভোটার কেন্দ্র ও স্লিপ অনুসন্ধান</h3>
                  <p className="text-slate-500 text-sm">আপনার সঠিক তথ্য দিয়ে নিচে সার্চ করুন</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-8 md:p-12">
            {!hasSearched && !selectedVoter && (
              <VoterForm onSearch={handleSearch} isLoading={isLoading} />
            )}

            {error && !isLoading && (
              <div className="p-8 bg-red-50 border-2 border-dashed border-red-200 rounded-3xl text-center no-print">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={32} className="text-red-600" />
                </div>
                <h4 className="text-xl font-bold text-red-800 mb-2">দুঃখিত!</h4>
                <p className="text-red-600 mb-6">{error}</p>
                <button 
                  onClick={resetSearch} 
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
                >
                  আবার চেষ্টা করুন
                </button>
              </div>
            )}

            {hasSearched && !selectedVoter && voters.length > 0 && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 no-print">
                  <button
                    onClick={resetSearch}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold px-4 py-2 rounded-lg hover:bg-slate-100 w-fit"
                  >
                    <ArrowLeft size={18} />
                    সার্চ পেজে ফিরে যান
                  </button>
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-bold text-sm">
                    <Info size={16} />
                    তালিকায় {voters.length} টি তথ্য পাওয়া গেছে
                  </div>
                </div>
                <VoterList voters={voters} onSelect={setSelectedVoter} />
              </div>
            )}

            {selectedVoter && (
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedVoter(null)}
                  className="no-print flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold px-4 py-2 rounded-lg hover:bg-slate-100"
                >
                  <ArrowLeft size={18} />
                  তালিকায় ফিরে যান
                </button>
                <VoterSlip voter={selectedVoter} />
              </div>
            )}
          </div>
        </div>
        
        {/* Info Box Below Content */}
        {!hasSearched && !selectedVoter && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
               <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Info size={24}/></div>
               <div>
                  <h4 className="font-bold text-slate-800">সঠিক তথ্য দিন</h4>
                  <p className="text-sm text-slate-500">আপনার জন্ম তারিখ এনআইডি কার্ড অনুযায়ী হুবহু প্রদান করুন।</p>
               </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
               <div className="bg-amber-100 p-3 rounded-xl text-amber-600"><MapPin size={24}/></div>
               <div>
                  <h4 className="font-bold text-slate-800">সঠিক ওয়ার্ড নির্বাচন</h4>
                  <p className="text-sm text-slate-500">নাসিরনগর উপজেলার সঠিক ওয়ার্ড নম্বর নির্বাচন করতে ভুলবেন না।</p>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="py-12 bg-white border-t border-slate-200 text-center no-print mt-auto">
         <div className="max-w-7xl mx-auto px-4">
            <p className="text-slate-800 font-bold text-lg mb-2">ব্রাহ্মণবাড়িয়া-১ (নাসিরনগর-২৪৩)</p>
            <p className="text-slate-500 text-sm max-w-lg mx-auto mb-6">
               ত্রয়োদশ জাতীয় সংসদ নির্বাচন ২০২৬ উপলক্ষে নাসিরনগরবাসীর সুবিধার্থে এই ডিজিটাল ভোটার অনুসন্ধান পোর্টালটি তৈরি করা হয়েছে।
            </p>
            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full mb-6"></div>
            <p className="text-slate-400 text-xs">© ২০২৬ সকল অধিকার সংরক্ষিত | ডিজিটাল নির্বাচনী প্রচার সেল, নাসিরনগর</p>
         </div>
      </footer>
    </div>
  );
};

export default App;
