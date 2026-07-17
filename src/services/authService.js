import { supabase } from "./supabase";

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    const message = error.message?.toLowerCase() || "";

    if (message.includes("session") || message.includes("not authenticated")) {
      return;
    }

    throw error;
  }
}

export async function getCurrentSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}