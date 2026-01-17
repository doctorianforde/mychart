'use server'

import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function getPatientRecords(firebaseUid: string) {
  if (!firebaseUid) {
    throw new Error("Unauthorized: No User ID provided");
  }

  // Example fetch - we will customize this based on your features
  const { data, error } = await supabaseAdmin
    .from('medical_records')
    .select('*')
    .eq('user_id', firebaseUid);

  if (error) {
    console.error('Supabase Error:', error);
    return { success: false, error: 'Failed to fetch records' };
  }

  return { success: true, data };
}