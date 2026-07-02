import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [serverData, setServerData] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8080/api/data')
      .then(response => response.json())
      .then(data => setServerData(data))
      .catch(error => console.error("Error fetching data:", error))
  }, [])

  return (
    <div className="app-container">
      <header className="header">
        <h1>System Dashboard</h1>
      </header>

      <main className="content">
        {serverData ? (
          <div className="status-card">
            <h2>{serverData.status}</h2>
            <p>{serverData.message}</p>
          </div>
        ) : (
          <p className="loading">Establishing connection...</p>
        )}
      </main>
    </div>
  )
}

export default App