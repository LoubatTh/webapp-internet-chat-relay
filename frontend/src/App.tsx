import { useState, useEffect } from "react";
import io from "socket.io-client";

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/ping')
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  })

  return (
    <>
      <h1 className=" text-red-900">React App</h1>
      <p>{message}</p>
    </>
  )
}

export default App
