import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://yxnzglmuezrphssmysbu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bnpnbG11ZXpycGhzc215c2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTA1NTMsImV4cCI6MjA5NjU4NjU1M30.phq8N9DEfrC_z1ccSGfMgXtAOC4CCgwZw1t3h41wicQ'

export const supabase = createClient(supabaseUrl, supabaseKey)

