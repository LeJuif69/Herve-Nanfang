import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = 'https://aqivpxuckcuktwyorjhf.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxaXZweHVja2N1a3R3eW9yamhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMjk5NzYsImV4cCI6MjEwNjkwNTk3Nn0.-oKJ9FmgL0Vnxom6KgXODaUJJk8-wrqTgMxzO1sRZdA'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function testConnection() {
  console.log('Connecting to Supabase:', SUPABASE_URL)
  
  // 1. Test publications table
  const { data: pubData, error: pubErr } = await supabase.from('publications').select('*')
  if (pubErr) {
    console.error('Error querying publications:', pubErr)
  } else {
    console.log(`✓ Publications table accessible. Current records: ${pubData.length}`)
  }

  // 2. Test articles table
  const { data: artData, error: artErr } = await supabase.from('articles').select('slug, title')
  if (artErr) {
    console.error('Error querying articles:', artErr)
  } else {
    console.log(`✓ Articles table accessible. Current records: ${artData.length}`)
  }

  // 3. Test projects table
  const { data: prjData, error: prjErr } = await supabase.from('projects').select('slug, title')
  if (prjErr) {
    console.error('Error querying projects:', prjErr)
  } else {
    console.log(`✓ Projects table accessible. Current records: ${prjData.length}`)
  }
}

testConnection()
