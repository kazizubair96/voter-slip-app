
import React from 'react';
import { Voter } from '../types';
import { UserCheck } from 'lucide-react';

interface VoterListProps {
  voters: Voter[];
  onSelect: (voter: Voter) => void;
}

const VoterList: React.FC<VoterListProps> = ({ voters, onSelect }) => {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-4 flex items-center gap-2">
        <div className="bg-indigo-600 w-2 h-6 rounded-full"></div>
        <h3 className="text-lg font-bold text-slate-800">
          {voters.length} টি ভোটার তথ্য পাওয়া গেছে
        </h3>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-4 text-sm font-semibold text-slate-600">ক্রমিক</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-600">কেন্দ্র নাম</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-600">নাম</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-600 hidden md:table-cell">মাতার নাম</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-600 hidden md:table-cell">পিতা/স্বামী</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-600">জন্ম তারিখ</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-600 text-center">স্লিপ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {voters.map((voter, index) => (
              <tr key={voter.id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="px-4 py-4 text-sm text-slate-500 font-mono">
                  {voter.voter_number.slice(-4)}
                </td>
                <td className="px-4 py-4 text-sm text-slate-700 max-w-[200px] truncate">
                  {voter.center_name}
                </td>
                <td className="px-4 py-4 text-sm font-bold text-slate-900">
                  {voter.full_name}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600 hidden md:table-cell">
                  {voter.mother_name || '—'}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600 hidden md:table-cell">
                  {voter.father_name || '—'}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {voter.date_of_birth}
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => onSelect(voter)}
                    className="inline-flex items-center gap-1 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold px-3 py-2 rounded transition-all active:scale-95 whitespace-nowrap"
                  >
                    <UserCheck size={14} />
                    ভোটার তথ্য
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VoterList;
