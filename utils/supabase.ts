import { createClient } from '@supabase/supabase-js'



export type Document = {
  id: string
  name?: string
  url: string
}
export const supabaseClient = () => {
  // @ts-ignore
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  return supabase
}
export const uploadToSubabase = async (file: any, supabaseBucket: string) => {
  // @ts-ignore
  const supabase = supabaseClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const { data, error } = await supabase
      .storage
      .from(supabaseBucket)
      .upload(`${Date.now()}.pdf`, file, {
        cacheControl: '3600',
        upsert: false
      })
    if (error) {
      console.log(error)
      return
    }
    return data
  }