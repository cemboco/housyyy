import React, { useState } from 'react'
import { UserPlus } from 'lucide-react'

interface AddUserProps {
  addUser: (name: string) => void
}

const AddUser: React.FC<AddUserProps> = ({ addUser }) => {
  const [newUserName, setNewUserName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newUserName.trim() !== '') {
      addUser(newUserName.trim())
      setNewUserName('')
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Benutzer hinzufügen</h2>
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          className="flex-grow border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Neuer Benutzername"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <UserPlus size={20} />
        </button>
      </form>
    </div>
  )
}

export default AddUser
