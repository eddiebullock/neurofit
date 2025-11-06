import { useState, useMemo } from 'react'
import WorkoutCard from './WorkoutCard'
import { filterWorkoutsByPreferences } from '../utils/helpers'

function WorkoutList({ workouts, userPreferences, onWorkoutComplete }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set()
    workouts.forEach(workout => {
      if (workout.tags && Array.isArray(workout.tags)) {
        workout.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags)
  }, [workouts])

  // Filter workouts
  const filteredWorkouts = useMemo(() => {
    let filtered = filterWorkoutsByPreferences(workouts, userPreferences)

    if (searchTerm) {
      filtered = filtered.filter(workout =>
        workout.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedTag) {
      filtered = filtered.filter(workout =>
        workout.tags && workout.tags.includes(selectedTag)
      )
    }

    return filtered
  }, [workouts, userPreferences, searchTerm, selectedTag])

  if (!workouts || workouts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-calm-200 p-8 text-center">
        <p className="text-calm-700">No workouts available yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <div>
      {/* Search and Filter */}
      <div className="mb-6 space-y-4 sm:flex sm:space-y-0 sm:gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-calm-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            aria-label="Search workouts"
          />
        </div>
        {allTags.length > 0 && (
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 rounded-lg border border-calm-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            aria-label="Filter by tag"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        )}
      </div>

      {/* Workout Grid */}
      {filteredWorkouts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-calm-200 p-8 text-center">
          <p className="text-calm-700">No workouts match your filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map(workout => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onComplete={onWorkoutComplete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkoutList

