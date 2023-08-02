import { createClient } from '@supabase/supabase-js'
import { supabaseURL, supabaseKey, supabaseBucket } from './keys'



export type Document = {
  id: string
  name?: string
  url: string
}


export const uploadToSubabase = async (file: any) => {
  // @ts-ignore
  const supabase = createClient(supabaseURL, supabaseKey);
    const { data, error } = await supabase
      .storage
      .from(supabaseBucket as string)
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