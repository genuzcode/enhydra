import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://xiebkquglelzmgytiler.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'sb_publishable_G83HUzai_bvyOLt6x8CC_Q_Shumq067';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);