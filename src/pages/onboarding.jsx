import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, userPreferences } from '../services/api'
import Header from '../components/Header'

function Onboarding() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    sensory_level: '',
    energy_level: '',
    environment: '',
    workout_time: '',
    equipment: '',
    special_considerations: '',
  })

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const user = await auth.getCurrentUser()
      if (!user) {
        navigate('/auth')
      }
    }
    checkUser()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = await auth.getCurrentUser()
      if (!user) {
        setError('Please log in first')
        navigate('/auth')
        return
      }

      const { error: prefError } = await userPreferences.save(user.id, formData)
      
      if (prefError) {
        setError('Failed to save preferences. Please try again.')
        console.error(prefError)
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-calm-900 mb-2">
          Welcome to NeuroFit
        </h1>
        <p className="text-lg text-calm-700 mb-8">
          Let's customize your fitness experience. This will help us recommend workouts that work for you.
        </p>

        {error && (
          <div 
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            role="alert"
          >
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sensory Level */}
          <div>
            <label 
              htmlFor="sensory_level"
              className="block text-sm font-medium text-calm-700 mb-2"
            >
              Sensory Sensitivity Level
            </label>
            <select
              id="sensory_level"
              name="sensory_level"
              value={formData.sensory_level}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-calm-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">Select...</option>
              <option value="low">Low - Comfortable with various stimuli</option>
              <option value="medium">Medium - Some sensitivity to noise/brightness</option>
              <option value="high">High - Need quiet, calm environments</option>
            </select>
          </div>

          {/* Energy Level */}
          <div>
            <label 
              htmlFor="energy_level"
              className="block text-sm font-medium text-calm-700 mb-2"
            >
              Typical Energy Level
            </label>
            <select
              id="energy_level"
              name="energy_level"
              value={formData.energy_level}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-calm-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">Select...</option>
              <option value="high">High - Can handle intense workouts</option>
              <option value="medium">Medium - Moderate intensity preferred</option>
              <option value="low">Low - Gentle, low-intensity preferred</option>
            </select>
          </div>

          {/* Environment */}
          <div>
            <label 
              htmlFor="environment"
              className="block text-sm font-medium text-calm-700 mb-2"
            >
              Preferred Workout Environment
            </label>
            <select
              id="environment"
              name="environment"
              value={formData.environment}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-calm-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">Select...</option>
              <option value="home">Home - Private, controlled space</option>
              <option value="outdoor">Outdoor - Nature, fresh air</option>
              <option value="gym">Gym - Structured facility</option>
              <option value="flexible">Flexible - Anywhere works</option>
            </select>
          </div>

          {/* Workout Time */}
          <div>
            <label 
              htmlFor="workout_time"
              className="block text-sm font-medium text-calm-700 mb-2"
            >
              Preferred Workout Duration
            </label>
            <select
              id="workout_time"
              name="workout_time"
              value={formData.workout_time}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-calm-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">Select...</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60+ minutes</option>
            </select>
          </div>

          {/* Equipment */}
          <div>
            <label 
              htmlFor="equipment"
              className="block text-sm font-medium text-calm-700 mb-2"
            >
              Available Equipment
            </label>
            <select
              id="equipment"
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-calm-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">Select...</option>
              <option value="none">None - Bodyweight only</option>
              <option value="basic">Basic - Resistance bands, dumbbells</option>
              <option value="moderate">Moderate - Some gym equipment</option>
              <option value="full">Full - Access to full gym</option>
            </select>
          </div>

          {/* Special Considerations */}
          <div>
            <label 
              htmlFor="special_considerations"
              className="block text-sm font-medium text-calm-700 mb-2"
            >
              Special Considerations (Optional)
            </label>
            <textarea
              id="special_considerations"
              name="special_considerations"
              value={formData.special_considerations}
              onChange={handleChange}
              rows={4}
              placeholder="Any specific needs, limitations, or preferences we should know about?"
              className="w-full px-4 py-3 rounded-lg border border-calm-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-lg border border-calm-300 text-calm-700 hover:bg-calm-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Skip for Now
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Onboarding

