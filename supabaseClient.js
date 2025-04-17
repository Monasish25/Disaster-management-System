// Import the createClient function from the Supabase client library
import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

// Initialize Supabase client
let supabaseUrl = "https://bufjafpzwkxgnurofbso.supabase.co" // Will be populated from .env
let supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1ZmphZnB6d2t4Z251cm9mYnNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDcyODgwNCwiZXhwIjoyMDYwMzA0ODA0fQ.SWwKnRK-RJAMkQqzZEeNcrpyDz-ffGeMhY_EMQAGW3k" // Will be populated from .env
let supabase = null

// Function to load environment variables from .env file
async function loadEnvVariables() {
  try {
    // const response = await fetch(".env")
    // const envText = await response.text()

    // Parse .env file content
    // const envVars = {}
    // envText.split("\n").forEach((line) => {
    //   const [key, value] = line.split("=")
    //   if (key && value) {
    //     envVars[key.trim()] = value.trim()
    //   }
    // })

    // Set Supabase credentials
    if (supabaseUrl && supabaseAnonKey) {
      // Initialize Supabase client
      supabase = supabaseCreateClient(supabaseUrl, supabaseAnonKey)
      console.log("Supabase client initialized successfully")
    } else {
      console.error("Supabase credentials not found in .env file")
    }
  } catch (error) {
    console.error("Error loading .env file:", error)
  }
}

// Function to sign up a user with Supabase
async function signUpUser(email, password, userData) {
  if (!supabase) {
    console.error("Supabase client not initialized")
    return { error: { message: "Authentication service not available" } }
  }

  try {
    // Sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          mobile: userData.mobile,
          aadhaar: userData.aadhaar,
        },
      },
    })

    if (error) throw error

    return { data }
  } catch (error) {
    console.error("Error signing up:", error)
    return { error }
  }
}

// Function to sign in a user with Supabase
async function signInUser(email, password) {
  if (!supabase) {
    console.error("Supabase client not initialized")
    return { error: { message: "Authentication service not available" } }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { data }
  } catch (error) {
    console.error("Error signing in:", error)
    return { error }
  }
}

// Function to get the current user session
async function getCurrentUser() {
  if (!supabase) {
    console.error("Supabase client not initialized")
    return null
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session) {
      return session.user
    }
    return null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Function to sign out the current user
async function signOutUser() {
  if (!supabase) {
    console.error("Supabase client not initialized")
    return { error: { message: "Authentication service not available" } }
  }

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error signing out:", error)
    return { error }
  }
}

// Load environment variables when the script is loaded
document.addEventListener("DOMContentLoaded", loadEnvVariables)