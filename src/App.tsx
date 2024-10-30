import React, { useState, useEffect } from 'react'
import { List, MessageSquare, Award, User, UserPlus, TrendingUp } from 'lucide-react'
import TaskList from './components/TaskList'
import Messages from './components/Messages'
import PointSystem from './components/PointSystem'
import UserProfile from './components/UserProfile'
import AddUser from './components/AddUser'
import WeeklyLeaderboard from './components/WeeklyLeaderboard´

interface Task {
  id: number
  text: string
  deadline: string
  assignedTo: number
  completed: boolean
  timer: number
  duration: number
  startTime: number
}

interface AppUser {
  id: number
  name: string
  points: number
  jokers: {
    extend: number
    postpone: number
    transfer: number
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('tasks')
  const [users, setUsers] = useState<AppUser[]>([
    { id: 1, name: 'Benutzer 1', points: 0, jokers: { extend: 1, postpone: 1, transfer: 1 } },
    { id: 2, name: 'Benutzer 2', points: 0, jokers: { extend: 1, postpone: 1, transfer: 1 } }
  ])
  const [currentUser, setCurrentUser] = useState<AppUser>(users[0])
  const [tasks, setTasks] = useState<Task[]>([])
  const [messages, setMessages] = useState<{ id: number, sender: number, text: string }[]>([])

  useEffect(() => {
    const storedUsers = localStorage.getItem('users')
    const storedTasks = localStorage.getItem('tasks')
    const storedMessages = localStorage.getItem('messages')
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers)
      setUsers(parsedUsers)
      setCurrentUser(parsedUsers[0])
    }
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages))
  }, [messages])

  const updateUser = (updatedUser: AppUser) => {
    const updatedUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    )
    setUsers(updatedUsers)
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser)
    }
  }

  const addUser = (name: string) => {
    const newUser: AppUser = {
      id: users.length + 1,
      name,
      points: 0,
      jokers: { extend: 1, postpone: 1, transfer: 1 }
    }
    setUsers([...users, newUser])
  }

  const resetApp = () => {
    const resetUsers = users.map(user => ({
      ...user,
      points: 0,
      jokers: { extend: 1, postpone: 1, transfer: 1 }
    }))
    setUsers(resetUsers)
    setCurrentUser(resetUsers[0])
    setTasks([])
    setMessages([])
    localStorage.removeItem('tasks')
    localStorage.removeItem('messages')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">Housyy</h1>
          <p className="text-xs md:text-sm mt-2 italic">Housyy verwandelt Haushaltsaufgaben in ein unterhaltsames, spielerisches Erlebnis und macht Putzen und Organisieren für alle angenehm.</p>
          <p className="text-xs md:text-sm mt-2">Aktueller Benutzer: {currentUser.name}</p>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-2 md:p-4">
        <div className="bg-white rounded-lg shadow-lg p-3 md:p-6">
          <div className="flex flex-wrap mb-4 gap-2 justify-center">
            {[
              { tab: 'tasks', icon: List, label: 'Aufgaben' },
              { tab: 'messages', icon: MessageSquare, label: 'Messages' },
              { tab: 'points', icon: Award, label: 'Punkte' },
              { tab: 'leaderboard', icon: TrendingUp, label: 'Bestenliste' },
              { tab: 'profile', icon: User, label: 'Profil' },
              { tab: 'addUser', icon: UserPlus, label: 'Benutzer hinzufügen' }
            ].map(({ tab, icon: Icon, label }) => (
              <button
                key={tab}
                className={`flex items-center px-3 py-1 text-xs md:text-sm rounded-full transition-colors duration-200 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <Icon className="mr-1 md:mr-2" size={16} />
                {label}
              </button>
            ))}
          </div>
          <div className="mt-4">
            {activeTab === 'tasks' && <TaskList users={users} currentUser={currentUser} updateUser={updateUser} tasks={tasks} setTasks={setTasks} />}
            {activeTab === 'messages' && <Messages users={users} currentUser={currentUser} messages={messages} setMessages={setMessages} />}
            {activeTab === 'points' && <PointSystem users={users} />}
            {activeTab === 'leaderboard' && <WeeklyLeaderboard users={users} tasks={tasks} />}
            {activeTab === 'profile' && <UserProfile currentUser={currentUser} updateUser={updateUser} setCurrentUser={setCurrentUser} users={users} />}
            {activeTab === 'addUser' && <AddUser addUser={addUser} />}
          </div>
          <button
            className="mt-6 bg-red-500 text-white px-4 py-2 text-sm rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200"
            onClick={resetApp}
          >
            App zurücksetzen
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
