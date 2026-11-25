import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://xiebkquglelzmgytiler.supabase.co';
const SUPABASE_KEY = 'sb_publishable_G83HUzai_bvyOLt6x8CC_Q_Shumq067';

export const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
export const urlDaPagina = (arquivo) => new URL(arquivo, location.href).href;
