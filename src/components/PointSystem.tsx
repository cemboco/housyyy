import React, { useState, useEffect } from 'react'
import { Award, Plus, Trash2 } from 'lucide-react'

interface Reward {
  id: number
  points: number
  description: string
}

const PointSystem: React.FC<{ users: any[] }> = ({ users }) => {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [newRewardPoints, setNewRewardPoints] = useState('')
  const [newRewardDescription, setNewRewardDescription] = useState('')

  useEffect(() => {
    const storedRewards = localStorage.getItem('rewards')
    if (storedRewards) {
      setRewards(JSON.parse(storedRewards))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('rewards', JSON.stringify(rewards))
  }, [rewards])

  const addReward = () => {
    if (newRewardPoints && newRewardDescription) {
      const newReward: Reward = {
        id: Date.now(),
        points: parseInt(newRewardPoints),
        description: newRewardDescription
      }
      setRewards([...rewards, newReward])
      setNewRewardPoints('')
      setNewRewardDescription('')
    }
  }

  const deleteReward = (id: number) => {
    setRewards(rewards.filter(reward => reward.id !== id))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Punktesystem</h2>
        <ul>
          {users.map(user => (
            <li key={user.id} className="flex items-center justify-between mb-2 bg-gray-100 p-2 rounded-full">
              <span>{user.name}</span>
              <div className="flex items-center">
                <Award className="text-yellow-500 mr-2" />
                <span>{user.points} Punkte</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Belohnung</h2>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Punkte"
            value={newRewardPoints}
            onChange={(e) => setNewRewardPoints(e.target.value)}
            className="border rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Beschreibung"
            value={newRewardDescription}
            onChange={(e) => setNewRewardDescription(e.target.value)}
            className="border rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addReward}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          >
