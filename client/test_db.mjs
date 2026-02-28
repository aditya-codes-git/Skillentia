import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
    const { data, error } = await supabase.from('resume_sections').select('*');
    if (error) {
        console.error('Error:', error);
        return;
    }
    console.log('Total Rows:', data.length);
    if (data.length > 0) {
        console.log('Most recent record updated_at:', data[0].updated_at);
        console.log('Keys in content:', Object.keys(data[0].content));
    }
}
checkDb();
