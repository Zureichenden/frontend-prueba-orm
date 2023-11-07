import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

interface UserType {
  id: number;
  firstname: string;
  lastname: string;
}

function App() {
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((result) => {
        setUsers(result);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lista de Usuarios</h1>
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id} className="user-item">
              <div className="user-id">ID: {user.id}</div>
              <div className="user-name">
                <div>
                  <span className="user-label">Apellido Paterno:</span>
                  {user.firstname}
                </div>
                <div>
                  <span className="user-label">Apellido Materno:</span>
                  {user.lastname}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
