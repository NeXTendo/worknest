import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const COMPANY_ID = 'b51c5b81-76e3-462f-940a-9cc6d10acd5d'

async function createUser(email, password, first, last, role, dob, phone) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    console.error('Auth error:', error)
    return
  }

  await supabase.from('profiles').insert({
    id: data.user.id,
    company_id: COMPANY_ID,
    email,
    first_name: first,
    last_name: last,
    role,
    date_of_birth: dob,
    phone,
    must_change_password: true,
  })

  console.log(`✅ Created ${first} ${last}`)
}

async function run() {
  await createUser(
    `marjorie.mulanda${Math.floor(Math.random()*1000)}@test.com`,
    'm111976',
    'Marjorie',
    'Mulanda',
    'main_admin',
    '1976-11-11',
    '260977822554'
  )

  await createUser(
    `tebuho.mubiana${Math.floor(Math.random()*1000)}@test.com`,
    'm072000',
    'Tebuho Michael',
    'Mubiana',
    'hr_admin',
    '2000-07-31',
    '260977822554'
  )

  await createUser(
    `linda.chileshe${Math.floor(Math.random()*1000)}@test.com`,
    'm051990',
    'Linda',
    'Chileshe',
    'manager',
    '1990-05-12',
    '260977822111'
  )

  await createUser(
    `patrick.zulu${Math.floor(Math.random()*1000)}@test.com`,
    'm031985',
    'Patrick',
    'Zulu',
    'employee',
    '1985-03-22',
    '260977822222'
  )

  await createUser(
    `ruth.tembo${Math.floor(Math.random()*1000)}@test.com`,
    'm121995',
    'Ruth',
    'Tembo',
    'employee',
    '1995-12-09',
    '260977822333'
  )
}

run()
