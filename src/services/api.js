// API helper functions for database operations
import { supabase } from './supabaseClient'

// Auth functions
export const auth = {
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },
  
  supabase, // Export supabase for auth state changes
}

// User preferences functions
export const userPreferences = {
  save: async (userId, preferences) => {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString(),
      })
    return { data, error }
  },

  get: async (userId) => {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },
}

// Workout functions
export const workouts = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  getByTags: async (tags) => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .contains('tags', tags)
    return { data, error }
  },

  create: async (workout) => {
    const { data, error } = await supabase
      .from('workouts')
      .insert([workout])
      .select()
      .single()
    return { data, error }
  },
}

// Progress tracking functions
export const progress = {
  logWorkout: async (userId, workoutId) => {
    const { data, error } = await supabase
      .from('workout_progress')
      .insert({
        user_id: userId,
        workout_id: workoutId,
        completed_at: new Date().toISOString(),
      })
    return { data, error }
  },

  getUserProgress: async (userId) => {
    const { data, error } = await supabase
      .from('workout_progress')
      .select(`
        *,
        workouts (*)
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
    return { data, error }
  },

  getStats: async (userId) => {
    const { data, error } = await supabase
      .from('workout_progress')
      .select('*', { count: 'exact', head: false })
      .eq('user_id', userId)
    
    if (error) return { stats: null, error }
    
    const totalWorkouts = data?.length || 0
    const thisWeek = data?.filter(item => {
      const completedDate = new Date(item.completed_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return completedDate >= weekAgo
    }).length || 0

    return {
      stats: {
        totalWorkouts,
        thisWeek,
      },
      error: null,
    }
  },
}

