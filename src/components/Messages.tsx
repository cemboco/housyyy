import React, { useState } from 'react'
import { Send } from 'lucide-react'

interface MessagesProps {
  users: any[]
  currentUser: any
  messages: { id: number; sender: number; text: string }[]
  setMessages: React.Dispatch<React.SetStateAction<{ id: number; sender: number; text: string }[]>>
}

const Messages: React.FC<MessagesProps> = ({ users, currentUser, messages, setMessages }) => {
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const message = {
        id: Date.now(),
        sender: currentUser.id,
        text: newMessage.trim()
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  return (
    <div className="h-[60vh] flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Messages</h2>
      <div className="flex-grow overflow-y-auto mb-4 bg-gray-100 p-4 rounded">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 p-2 rounded ${
              message.sender === currentUser.id ? 'bg-blue-200 ml-auto' : 'bg-green-200'
            }`}
            style={{ maxWidth: '70%' }}
          >
            <p className="font-semibold">{users.find(user => user.id === message.sender)?.name}:</p>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-grow border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}

export default Messages
