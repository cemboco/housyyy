import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

interface Chore {
  id: number
  task: string
  assignee: string
  day: string
}

const ChoreSchedule: React.FC = () => {
  const [chores, setChores] = useState<Chore[]>([])
  const [newChore, setNewChore] = useState('')
  const [newAssignee, setNewAssignee] = useState('')
  const [newDay, setNewDay] = useState('Monday')

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const addChore = () => {
    if (newChore.trim() !== '' && newAssignee.trim() !== '') {
      setChores([...chores, { id: Date.now(), task: newChore, assignee: newAssignee, day: newDay }])
      setNewChore('')
      setNewAssignee('')
      setNewDay('Monday')
    }
  }

  const deleteChore = (id: number) => {
    setChores(chores.filter(chore => chore.id !== id))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Chore Schedule</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Chore"
          value={newChore}
          onChange={(e) => setNewChore(e.target.value)}
        />
        <input
          type="text"
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Assignee"
          value={newAssignee}
          onChange={(e) => setNewAssignee(e.target.value)}
        />
        <select
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newDay}
          onChange={(e) => setNewDay(e.target.value)}
        >
          {days.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={addChore}
        >
          <Plus size={20} className="inline mr-2" /> Add Chore
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map(day => (
          <div key={day} className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">{day}</h3>
            <ul>
              {chores.filter(chore => chore.day === day).map(chore => (
                <li key={chore.id} className="flex items-center justify-between mb-2">
                  <span>
                    <strong>{chore.task}</strong> - {chore.assignee}
                  </span>
                  <button
                    onClick={() => deleteChore(chore.id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChoreSchedule
