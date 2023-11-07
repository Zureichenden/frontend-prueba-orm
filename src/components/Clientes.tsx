import React, { useState, useEffect, useRef } from 'react';
import './Clientes.css';

interface ClienteType {
  id: number;
  nombre: string;
}

function Clientes() {
  const [clientes, setClientes] = useState<ClienteType[]>([]);
  const [nombre, setNombre] = useState('');
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [clienteConsultado, setClienteConsultado] = useState<ClienteType | null>(null);
  const nombreInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/clientes")
      .then((res) => res.json())
      .then((result) => {
        setClientes(result);
      });
  }, []);

  const handleNombreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(event.target.value);
  };

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClienteId(parseInt(event.target.value));
  };

  const handleSubmit = () => {
    if (nombre) {
      fetch("http://localhost:3000/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientes([...clientes, data]);
          setNombre('');
          nombreInputRef.current?.focus();
        })
        .catch((error) => console.error(error));
    }
  };

  const handleConsultarCliente = () => {
    if (clienteId) {
      fetch(`http://localhost:3000/clientes/${clienteId}`)
        .then((res) => res.json())
        .then((data) => {
          setClienteConsultado(data);
        })
        .catch((error) => {
          console.error(error);
          setClienteConsultado(null);
        });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lista de Clientes</h1>
        <table className="cliente-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Agregar Cliente</h2>
        <form>
          <input
            type="text"
            placeholder="Nombre del Cliente"
            value={nombre}
            onChange={handleNombreChange}
            ref={nombreInputRef}
          />
          <button type="button" onClick={handleSubmit}>
            Agregar
          </button>
        </form>
        <h2>Consultar Cliente por ID</h2>
        <form>
          <input
            type="number"
            placeholder="ID del Cliente"
            value={clienteId || ''}
            onChange={handleIdChange}
          />
          <button type="button" onClick={handleConsultarCliente}>
            Consultar
          </button>
        </form>
        {clienteConsultado && (
          <div className="cliente-consultado">
            <h3>Cliente Consultado</h3>
            <table className="cliente-table">
              <tbody>
                <tr>
                  <td>ID:</td>
                  <td>{clienteConsultado.id}</td>
                </tr>
                <tr>
                  <td>Nombre:</td>
                  <td>{clienteConsultado.nombre}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </header>
    </div>
  );
}

export default Clientes;
