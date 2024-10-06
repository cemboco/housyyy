import React, { useMemo } from 'react'
import { Trophy, Calendar } from 'lucide-react'

interface Task {
  id: number
  text: string
  deadline?: string
  assignedTo: number
  completed: boolean
  completionDate?: string // New field for completion date
  timer?: number
  duration?: number
  startTime?: number
}

interface User {
  id: number
  name: string
  points: number
}

interface WeeklyLeaderboardProps {
  users: User[]
  tasks: Task[]
}

const WeeklyLeaderboard: React.FC<WeeklyLeaderboardProps> = ({ users, tasks }) => {
  const leaderboard = useMemo(() => {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const completedTasksThisWeek = tasks.filter(task => 
      task.completed && 
      task.completionDate && 
      new Date(task.completionDate) >= oneWeekAgo
    )

    const userCompletions = users.map(user => {
      const userTasks = completedTasksThisWeek.filter(task => task.assignedTo === user.id)
      return {
        ...user,
        completedTasks: userTasks.length,
        tasks: userTasks
      }
    }).sort((a, b) => b.completedTasks - a.completedTasks)

    return userCompletions
  }, [users, tasks])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Wöchentliche Bestenliste</h2>
      {leaderboard.map((user, index) => (
        <div key={user.id} className="bg-white shadow-md rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {index === 0 && <Trophy className="text-yellow-500 mr-2" size={24} />}
              <span className="text-lg font-semibold">{user.name}</span>
            </div>
            <span className="text-lg font-bold">{user.completedTasks} Aufgaben</span>
          </div>
          {user.tasks.length > 0 ? (
            <ul className="space-y-2">
              {user.tasks.map(task => (
                <li key={task.id} className="text-sm text-gray-600 flex items-center">
                  <Calendar size={16} className="mr-2 text-blue-500" />
                  <span>{task.text} - Erledigt am: {formatDate(task.completionDate!)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Keine abgeschlossenen Aufgaben diese Woche.</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default WeeklyLeaderboard
