
export const openAIapiKey = process.env.OPENAI_API_KEY;
export  const pineconeApiKey = process.env.PINECONE_API_KEY || "23e48064-f588-4271-9ce2-632ade12ebcd";
export const pineconeEnvironment = process.env.PINECONE_ENVIRONMENT || "asia-southeast1-gcp-free"
export  const pineconeIndexName = process.env.PINECONE_INDEX_NAME || "langchainchatbot"
 
export const supabaseKey = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoaGtmaXdzeWl3cWFxZGNuZ2N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAzOTYwMTUsImV4cCI6MjAwNTk3MjAxNX0.hjLAtbHmdc3E9SBu3T_K1JR0WOJ3t8c9wNfrQhCRFAs"
export const supabaseURL = process.env.SUPABASE_URL || "https://zhhkfiwsyiwqaqdcngcx.supabase.co"
export const supabaseBucket = process.env.SUPABASE_BUCKET || "docs"
export const supabaseDirectUrl = process.env.DIRECT_URL
export const supabaseDatabaseUrl = process.env.DATABASE_URL || "postgresql://postgres:Subhbuis1@a@db.zhhkfiwsyiwqaqdcngcx.supabase.co:5432/postgres"