import React, { useState } from 'react'
import { User, Shield } from 'lucide-react'

interface UserProfileProps {
  currentUser: any
  updateUser: (user: any) => void
  setCurrentUser: React.Dispatch<React.SetStateAction<any>>
  users: any[]
}

const UserProfile: React.FC<UserProfileProps> = ({ currentUser, updateUser, setCurrentUser, users }) => {
  const [name, setName] = useState(currentUser.name)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedUser = { ...currentUser, name }
    updateUser(updatedUser)
  }

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = users.find(user => user.id === Number(e.target.value))
    if (selectedUser) {
      setCurrentUser(selectedUser)
      setName(selectedUser.name)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Benutzerprofil</h2>
      <div className="mb-4">
        <label htmlFor="userSelect" className="block mb-2">Aktiver Benutzer:</label>
        <select
          id="userSelect"
          value={currentUser.id}
          onChange={handleUserChange}
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-center mb-2">
          <User className="mr-2" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Namen aktualisieren
        </button>
      </form>
      <div className="flex items-center">
        <Shield className="text-blue-500 mr-2" />
        <span>Joker verfügbar:</span>
        <ul className="ml-4">
          <li>Verlängern: {currentUser.jokers.extend}</li>
          <li>Verschieben: {currentUser.jokers.postpone}</li>
          <li>Tauschen: {currentUser.jokers.transfer}</li>
        </ul>
      </div>
    </div>
  )
}

export default UserProfile
