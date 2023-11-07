import React, { useState, useEffect } from 'react';

interface ClienteType {
  id: number;
  nombre: string;
}

function Amortizaciones() {
  const [clientes, setClientes] = useState<ClienteType[]>([]);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '' });

  useEffect(() => {
    // Realiza una solicitud para obtener la lista de clientes
    fetch("http://localhost:3000/clientes")
      .then((res) => res.json())
      .then((result: ClienteType[]) => {
        setClientes(result);
      });
  }, []);

  const handleAgregarCliente = () => {
    // Realiza una solicitud para agregar un nuevo cliente
    fetch("http://localhost:3000/clientes", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoCliente),
    })
    .then((res) => res.json())
    .then((cliente: ClienteType) => {
      // Actualiza la lista de clientes con el nuevo cliente
      setClientes([...clientes, cliente]);
      // Limpia el formulario
      setNuevoCliente({ nombre: '' });
    });
  };

  return (
    <div>
      <h1>Amortizaciones</h1>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>{cliente.nombre}</li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={nuevoCliente.nombre}
          onChange={(e) => setNuevoCliente({ nombre: e.target.value })}
        />
        <button onClick={handleAgregarCliente}>Agregar Cliente</button>
      </div>
    </div>
  );
}

export default Amortizaciones;
