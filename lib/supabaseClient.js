
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://opaqqvnadyneigyvvnsl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wYXFxdm5hZHluZWlneXZ2bnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTIwNzEsImV4cCI6MjA3NDA4ODA3MX0.DDvA3D0r83ZfVunkGXcYTnx59pazpJDUL5gEY4di4VE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
