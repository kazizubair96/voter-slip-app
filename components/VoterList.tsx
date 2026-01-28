
import React from 'react';
import { Voter } from '../types';
import { UserCheck, MapPin, Calendar, Hash } from 'lucide-react';

interface VoterListProps {
  voters: Voter[];
  onSelect: (voter: Voter) => void;
}

const VoterList: React.FC<VoterListProps> = ({ voters, onSelect }) => {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center gap-2">
        <div className="bg-[#006a4e] w-1.5 h-6 rounded-full"></div>
        <h3 className="text-lg font-bold text-slate-800">
          সার্চ রেজাল্ট ({voters.length})
        </h3>
      </div>
      
      {/* Desktop Table View (Hidden on Mobile) */}
      <div className="hidden md:block overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ক্রমিক</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">কেন্দ্র নাম</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ভোটার নাম</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">জন্ম তারিখ</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {voters.map((voter) => (
              <tr key={voter.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                  {voter.voter_number.slice(-4)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                  {voter.center_name}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">
                  {voter.full_name}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {voter.date_of_birth}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onSelect(voter)}
                    className="inline-flex items-center gap-2 bg-[#006a4e] hover:bg-[#004d39] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95 shadow-sm"
                  >
                    <UserCheck size={14} />
                    স্লিপ দেখুন
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (Hidden on Desktop) */}
      <div className="md:hidden space-y-4">
        {voters.map((voter) => (
          <div 
            key={voter.id} 
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#006a4e] transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg">
                <Hash size={14} className="text-slate-500" />
                <span className="text-xs font-mono font-bold text-slate-700">{voter.voter_number}</span>
              </div>
              <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded uppercase">ওয়ার্ড-{voter.ward}</span>
            </div>
            
            <h4 className="text-lg font-black text-slate-900 mb-3">{voter.full_name}</h4>
            
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin size={16} className="text-[#006a4e] shrink-0" />
                <p className="text-sm font-medium line-clamp-1">{voter.center_name}</p>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar size={16} className="text-blue-500 shrink-0" />
                <p className="text-sm font-medium">{voter.date_of_birth}</p>
              </div>
            </div>

            <button
              onClick={() => onSelect(voter)}
              className="w-full flex items-center justify-center gap-2 bg-[#006a4e] hover:bg-[#004d39] text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95"
            >
              <UserCheck size={18} />
              ভোটার স্লিপ দেখুন
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoterList;
