// Importa la biblioteca 'socket.io-client' para establecer una conexión con el servidor de Socket.IO
import io from 'socket.io-client'

// Importa el Hook 'useState' de React para manejar el estado local
import { useState, useEffect } from 'react'


//para boton para entrar ala sesion
import { useNavigate } from 'react-router-dom'


// Crea una conexión con el servidor de Socket.IO en 'http://localhost:3000'
const socket = io("http://localhost:3000")

function Chat() {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')


    const navigate = useNavigate()
    const handleSesionClick = () => {
      navigate('/sesion') // Redirige al usuario a la página de sesión
    }

    const handleIrAPrincipal = () => {
      navigate('/principal') // Redirige al usuario a la página de sesión
    }



    const handleSubmit = (e) => {
      e.preventDefault();
      const message = {
        body: newMessage, 
        from: 'Me'
      }
      setMessages([...messages, message])
      socket.emit('message', message)
      setNewMessage('')
    }

    useEffect(() => {




      const receiveMessage = (message) => {
        if (message.from !== socket.id) {
          setMessages(messages => [...messages, message]);
        }
      }
      socket.on('message', receiveMessage);
      return () => {
        socket.off('message', receiveMessage);
      }
    }, [])

    return (
      <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
          <h1 className='text-2xl font-bold my-2 '>Chat React</h1>
          <input className='text-black border-2 border-zinc-500 p-2 w-full' type="text" placeholder="Write your message..." 
          value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
          <ul>
            {messages.map((message, index) => (
              <li
                className={`my-2 p-2 table text-sm rounded-md ${
                  message.from === 'Me' ? 'bg-sky-700' : 'bg-black'
                }`}
                key={index}
              >
                {message.from}: {message.body}
              </li>
            ))}
          </ul>
        </form>
        <div>
            {/* El resto de tu código de Chat.jsx */}
            <button onClick={handleSesionClick}>Entrar a la sesión</button>
            <button onClick={handleIrAPrincipal}>Ir a Principal</button>

        </div>
      </div>
    )
}

export default Chat;