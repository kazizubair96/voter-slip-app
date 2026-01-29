
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
 * নাম এখন অপশনাল ফিল্টার হিসেবে কাজ করবে।
 */
export const findVoterByParams = async (params: SearchParams): Promise<{ data: Voter[] | null; error: any }> => {
  if (!supabase) {
    return { data: null, error: new Error("Supabase is not initialized") };
  }

  // ওয়ার্ড নম্বর নরমাল করা
  const normalizedWard = parseInt(params.ward, 10).toString();
  const originalWard = params.ward;

  // বেসিক কুয়েরি তৈরি (জন্মতারিখ এবং ওয়ার্ড বাধ্যতামূলক)
  let query = supabase
    .from('voters')
    .select('*')
    .eq('date_of_birth', params.dob)
    .in('ward', [originalWard, normalizedWard]);

  // যদি নাম প্রদান করা হয়, তবে নামের আংশিক মিল খোঁজা হবে (Case-insensitive)
  if (params.fullName && params.fullName.trim()) {
    query = query.ilike('full_name', `%${params.fullName.trim()}%`);
  }

  const { data, error } = await query;

  // যদি ফলাফল পাওয়া যায় এবং ভোটার নম্বর থাকে, তবে অতিরিক্ত ফিল্টার
  if (data && data.length > 0) {
    if (params.voterNumber && params.voterNumber.trim()) {
      const filtered = data.filter(v => v.voter_number === params.voterNumber.trim());
      if (filtered.length > 0) return { data: filtered, error: null };
    }
    return { data, error: null };
  }

  return { data, error };
};
