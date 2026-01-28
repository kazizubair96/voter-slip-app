
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Voter, SearchParams } from '../types';

// Supabase Credentials
const SUPABASE_URL = 'https://ehebenlbzjaqcfwtmhvw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoZWJlbmxiemphcWNmd3RtaHZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDk1ODEsImV4cCI6MjA4NTE4NTU4MX0.1a6AlUn8jet7PO_RhegtYudo-NOxrzo2dhMfODSyZZg';

let supabase: SupabaseClient | null = null;

try {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
  console.error("Supabase initialization error:", error);
}

/**
 * ডাটাবেজ থেকে ভোটার তথ্য খোঁজার ফাংশন
 * এখন শুধুমাত্র জন্মতারিখ এবং ওয়ার্ড নম্বর দিয়ে সার্চ করা হবে।
 */
export const findVoterByParams = async (params: SearchParams): Promise<{ data: Voter[] | null; error: any }> => {
  if (!supabase) {
    return { data: null, error: new Error("Supabase is not initialized") };
  }

  // ওয়ার্ড নম্বর নরমাল করা (যেমন: '01' কে '1' বানানো)
  const normalizedWard = parseInt(params.ward, 10).toString();
  const originalWard = params.ward;

  // জন্মতারিখ এবং ওয়ার্ড দিয়ে সার্চ
  // আমরা .in() ব্যবহার করছি যাতে '01' অথবা '1' যেকোনোটি মিললেই ডাটা দেখায়
  const { data, error } = await supabase
    .from('voters')
    .select('*')
    .eq('date_of_birth', params.dob)
    .in('ward', [originalWard, normalizedWard]);

  // যদি ফলাফল পাওয়া যায়, তবে সেটি রিটার্ন করা
  if (data && data.length > 0) {
    // যদি একই সাথে একাধিক তথ্য আসে এবং ইউজার ভোটার নম্বর দিয়ে থাকে, তবে সেটি দিয়ে ফিল্টার করা
    if (params.voterNumber && params.voterNumber.trim()) {
      const filtered = data.filter(v => v.voter_number === params.voterNumber.trim());
      if (filtered.length > 0) return { data: filtered, error: null };
    }
    return { data, error: null };
  }

  return { data, error };
};
