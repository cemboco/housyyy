import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Clock, ArrowRight, Calendar, UserPlus, CheckCircle } from 'lucide-react'

interface Task {
  id: number
  text: string
  deadline?: string
  assignedTo: number
  completed: boolean
  timer?: number
  duration?: number
  startTime?: number
  completionDate?: string
}

interface User {
  id: number
  name: string
  points: number
  jokers: {
    extend: number
    postpone: number
    transfer: number
  }
}

interface TaskListProps {
  users: User[]
  currentUser: User
  updateUser: (user: User) => void
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

const TaskList: React.FC<TaskListProps> = ({ users, currentUser, updateUser, tasks, setTasks }) => {
  const [newTask, setNewTask] = useState('')
  const [assignedTo, setAssignedTo] = useState(users[0].id)
  const [deadline, setDeadline] = useState('')
  const [duration, setDuration] = useState('')
  const [activeJoker, setActiveJoker] = useState<{ type: string; taskId: number } | null>(null)
  const [extendTime, setExtendTime] = useState('')
  const [postponeDate, setPostponeDate] = useState('')
  const [transferTo, setTransferTo] = useState(users[0].id)

  useEffect(() => {
    const timer = setInterval(() => {
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.timer && task.timer > 0 && !task.completed) {
            return { ...task, timer: task.timer - 1 }
          }
          return task
        })
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [setTasks])

  const addTask = () => {
    if (newTask.trim() !== '') {
      const task: Task = {
        id: Date.now(),
        text: newTask,
        assignedTo,
        completed: false,
        deadline: deadline || undefined,
        timer: duration ? parseInt(duration) * 60 : undefined,
        duration: duration ? parseInt(duration) * 60 : undefined,
        startTime: Date.now()
      }
      setTasks([...tasks, task])
      setNewTask('')
      setDeadline('')
      setDuration('')
    }
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const completeTask = (id: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const completed = true
        const completionDate = new Date().toISOString()
        const pointEarned = task.timer ? task.timer > 0 : new Date() <= new Date(task.deadline!)
        if (pointEarned) {
          const assignedUser = users.find(user => user.id === task.assignedTo)
          if (assignedUser) {
            const updatedUser = { ...assignedUser, points: assignedUser.points + 1 }
            updateUser(updatedUser)
          }
        }
        return { ...task, completed, completionDate }
      }
      return task
    })
    setTasks(updatedTasks)
  }

  const useJoker = (taskId: number, jokerType: 'extend' | 'postpone' | 'transfer') => {
    if (currentUser.jokers[jokerType] > 0) {
      setActiveJoker({ type: jokerType, taskId })
    } else {
      alert(`You don't have any ${jokerType} jokers left!`)
    }
  }

  const applyJoker = () => {
    if (!activeJoker) return

    const updatedUser = {
      ...currentUser,
      jokers: {
        ...currentUser.jokers,
        [activeJoker.type]: currentUser.jokers[activeJoker.type as keyof typeof currentUser.jokers] - 1
      }
    }
    updateUser(updatedUser)

    const updatedTasks = tasks.map(task => {
      if (task.id === activeJoker.taskId) {
        switch (activeJoker.type) {
          case 'extend':
            return { ...task, timer: (task.timer || 0) + parseInt(extendTime) * 60 }
          case 'postpone':
            return { ...task, deadline: postponeDate }
          case 'transfer':
            return { ...task, assignedTo: transferTo }
          default:
            return task
        }
      }
      return task
    })
    setTasks(updatedTasks)
    setActiveJoker(null)
    setExtendTime('')
    setPostponeDate('')
    setTransferTo(users[0].id)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div>
      <h2 className="text-lg md:text-xl font-semibold mb-4">Aufgabenliste</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4">
        <input
          type="text"
          className="border rounded-full px-3 py-1 md:px-4 md:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Neue Aufgabe"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <select
          className="border rounded-full px-3 py-1 md:px-4 md:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={assignedTo}
          onChange={(e) => setAssignedTo(Number(e.target.value))}
        >
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        <input
          type="datetime-local"
          className="border rounded-full px-3 py-1 md:px-4 md:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <div className="flex">
          <input
            type="number"
            className="border rounded-l-full px-3 py-1 md:px-4 md:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
            placeholder="Dauer (Minuten)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-r-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
      <ul className="space-y-2 md:space-y-4">
        {tasks.map(task => (
          <li key={task.id} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-100 p-3 rounded-lg">
            <div className="mb-2 md:mb-0 flex-grow">
              <span className={`font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.text}
              </span>
              <span className="ml-2 text-xs md:text-sm text-gray-600">
                Zugewiesen an: {users.find(user => user.id === task.assignedTo)?.name}
              </span>
              {task.timer !== undefined && task.timer > 0 && !task.completed && (
                <span className="ml-2 text-xs md:text-sm text-blue-600">
                  <Clock className="inline mr-1" size={14} />
                  {formatTime(task.timer)}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
              {task.deadline && (
                <span className="text-xs md:text-sm text-gray-600">
                  <Clock className="inline mr-1" size={14} />
                  {new Date(task.deadline).toLocaleString()}
                </span>
              )}
              {!task.completed && (
                <>
                  <button
                    onClick={() => useJoker(task.id, 'extend')}
                    className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <ArrowRight size={14} className="inline mr-1" />
                    Verlängern
                  </button>
                  <button
                    onClick={() => useJoker(task.id, 'postpone')}
                    className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <Calendar size={14} className="inline mr-1" />
                    Verschieben
                  </button>
                  <button
                    onClick={() => useJoker(task.id, 'transfer')}
                    className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <UserPlus size={14} className="inline mr-1" />
                    Tauschen
                  </button>
                </>
              )}
              <button
                onClick={() => completeTask(task.id)}
                className={`px-2 py-1 rounded-full text-xs focus:outline-none focus:ring-2 ${
                  task.completed
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
                }`}
                disabled={task.completed}
              >
                <CheckCircle size={14} className="inline mr-1" />
                {task.completed ? 'Erledigt' : 'Als erledigt markieren'}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {activeJoker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            {activeJoker.type === 'extend' && (
              <>
                <h3 className="text-lg font-semibold mb-2">Aufgabe verlängern</h3>
                <input
                  type="number"
                  className="border rounded px-2 py-1 mb-2"
                  placeholder="Zusätzliche Minuten"
                  value={extendTime}
                  onChange={(e) => setExtendTime(e.target.value)}
                />
              </>
            )}
            {activeJoker.type === 'postpone' && (
              <>
                <h3 className="text-lg font-semibold mb-2">Aufgabe verschieben</h3>
                <input
                  type="date"
                  className="border rounded px-2 py-1 mb-2"
                  value={postponeDate}
                  onChange={(e) => setPostponeDate(e.target.value)}
                />
              </>
            )}
            {activeJoker.type === 'transfer' && (
              <>
                <h3 className="text-lg font-semibold mb-2">Aufgabe übertragen</h3>
                <select
                  className="border rounded px-2 py-1 mb-2"
                  value={transferTo}
                  onChange={(e) => setTransferTo(Number(e.target.value))}
                >
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActiveJoker(null)}
                className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
              >
                Abbrechen
              </button>
              <button
                onClick={applyJoker}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Anwenden
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskList
