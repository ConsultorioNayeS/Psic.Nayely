import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gjffyyntdcwbjwvbluok.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZmZ5eW50ZGN3Ymp3dmJsdW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MzYzNjAsImV4cCI6MjEwNTQxMjM2MH0.NF0y4sBqoH3lgC720dx7oJkZSs8LkuxH4RcV_VMtXGg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);