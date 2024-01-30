import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/hello')
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
