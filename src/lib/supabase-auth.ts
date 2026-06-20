import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export async function signUpWithEmail(email: string, password: string, name: string, phone?: string) {
  const { data, error } = await supabaseAuth.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        phone,
        role: 'STUDENT',
        school_year: 1,
        is_verified: false
      },
      emailRedirectTo: `${window.location.origin}/verify-email`
    }
  })
  
  return { data, error }
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password
  })
  
  return { data, error }
}

export async function signOut() {
  const { error } = await supabaseAuth.auth.signOut()
  return { error }
}

export async function resetPassword(email: string) {
  const { data, error } = await supabaseAuth.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  
  return { data, error }
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabaseAuth.auth.updateUser({
    password: newPassword
  })
  
  return { data, error }
}

export async function getCurrentUser() {
  const { data } = await supabaseAuth.auth.getUser()
  return data.user
}

export async function getSession() {
  const { data } = await supabaseAuth.auth.getSession()
  return data.session
}

export async function sendVerificationEmail(email: string) {
  const { data, error } = await supabaseAuth.auth.resend({
    type: 'signup',
    email
  })
  
  return { data, error }
}
