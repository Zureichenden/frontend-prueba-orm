import React, { useState, useEffect } from 'react';
import './Prestamos.css';

interface ClienteType {
  id: number;
  nombre: string;
}

interface MontoType {
  id: number;
  monto: number;
  cantidad_plazos: number;
}

interface PrestamoType {
  id: number;
  cliente: ClienteType;
  monto: MontoType;
  fecha_inicio: string;
  interes: number;
}

interface AmortizacionType {
  id: number;
  prestamo_id: number;
  quincena: number;
  fecha_pago: string;
  monto_pago: number;
  interes_pago: number;
  abono: number;
  capital_pendiente: number;
}

function Prestamos() {
  const [prestamos, setPrestamos] = useState<PrestamoType[]>([]);
  const [nuevoPrestamo, setNuevoPrestamo] = useState({
    cliente_id: 0,
    monto_id: 0,
    fecha_inicio: '',
    interes: 0,
  });
  const [clientes, setClientes] = useState<ClienteType[]>([]);
  const [catalogoMontos, setCatalogoMontos] = useState<MontoType[]>([]);
  const [clienteNombre, setClienteNombre] = useState<string>('');
  const [prestamoId, setPrestamoId] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/prestamos")
      .then((res) => res.json())
      .then((result: PrestamoType[]) => {
        setPrestamos(result);
      });

    fetch("http://localhost:3000/clientes")
      .then((res) => res.json())
      .then((result: ClienteType[]) => {
        setClientes(result);
      });

    fetch("http://localhost:3000/catalogoMontos")
      .then((res) => res.json())
      .then((result: MontoType[]) => {
        setCatalogoMontos(result);
      });
  }, []);

  const handleAgregarPrestamo = () => {
    const { cliente_id, monto_id, fecha_inicio, interes } = nuevoPrestamo;

    fetch("http://localhost:3000/prestamos", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cliente_id, monto_id, fecha_inicio, interes }),
    })
      .then((res) => res.json())
      .then((prestamo: PrestamoType) => {
        setPrestamos([...prestamos, prestamo]);
        setNuevoPrestamo({
          cliente_id: 0,
          monto_id: 0,
          fecha_inicio: '',
          interes: 0,
        });
      });
  };

  const handleConsultarPrestamo = (prestamoId: number) => {
    fetch(`http://localhost:3000/prestamos/${prestamoId}`)
      .then((res) => res.json())
      .then((prestamo: PrestamoType) => {
        alert(`Cliente: ${prestamo.cliente.nombre}, Monto: $${prestamo.monto.monto}, Fecha de Inicio: ${prestamo.fecha_inicio}, Interés: ${prestamo.interes}%`);
      });
  };

  const handleBuscarPrestamo = () => {
    if (prestamoId) {
      handleConsultarPrestamo(prestamoId);
    }
  };

  
  const handleConsultarAmortizacionesByPrestamo = (prestamoId: number) => {
    fetch(`http://localhost:3000/amortizaciones/prestamo/${prestamoId}`)
      .then((res) => res.json())
      .then((data) => {
        const { prestamo, amortizaciones } = data;
  
        const cliente = prestamo.cliente;
        const monto = prestamo.monto;
        const fechaInicio = prestamo.fecha_inicio;
        const interes = prestamo.interes;
  
        const amortizacionesInfo = amortizaciones.map((amortizacion: AmortizacionType) => {
          return `Quincena: ${amortizacion.quincena}, Fecha de Pago: ${amortizacion.fecha_pago}, Monto de Pago: $${amortizacion.monto_pago}, Interés: $${amortizacion.interes_pago}, Abono: $${amortizacion.abono}, Capital Pendiente: $${amortizacion.capital_pendiente}`;
        });
  
        const message = `Cliente: ${cliente.nombre}, Monto: $${monto.monto}, Fecha de Inicio: ${fechaInicio}, Interés: ${interes}%\n\nAmortizaciones:\n${amortizacionesInfo.join('\n')}`;
  
        alert(message);
      });
  };
  
  

  const handleBuscarAmortizacionesByPrestamo = (prestamoId: number) => {
    if (prestamoId) {
      handleConsultarAmortizacionesByPrestamo(prestamoId);
    }
  };

  return (
    <div className="container">
      <h1>Préstamos</h1>

      <div className="prestamo-busqueda">
        <input
          type="number"
          placeholder="Buscar préstamo por ID"
          value={prestamoId || ''}
          onChange={(e) => setPrestamoId(+e.target.value)}
        />
        <button onClick={handleBuscarPrestamo}>Buscar</button>
      </div>

      <table className="prestamo-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Monto</th>
            <th>Fecha de Inicio</th>
            <th>Interés</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map((prestamo) => (
            <tr key={prestamo.id}>
              <td>{prestamo?.cliente?.nombre}</td>
              <td>${prestamo?.monto?.monto} (Plazos: {prestamo?.monto?.cantidad_plazos})</td>
              <td>{prestamo.fecha_inicio}</td>
              <td>{prestamo.interes}%</td>
              <td>
                <button onClick={() => handleConsultarPrestamo(prestamo.id)}>Consultar</button>
                <button onClick={() => handleBuscarAmortizacionesByPrestamo(prestamo.id)}>Ver Amortización</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="prestamo-form">
        <select
          value={nuevoPrestamo.cliente_id}
          onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, cliente_id: +e.target.value })}
        >
          <option value={0}>Selecciona un cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>
        <select
          value={nuevoPrestamo.monto_id}
          onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, monto_id: +e.target.value })}
        >
          <option value={0}>Selecciona un catálogo de montos</option>
          {catalogoMontos.map((monto) => (
            <option key={monto.id} value={monto.id}>
              ${monto.monto} (Plazos: {monto.cantidad_plazos})
            </option>
          ))}
        </select>
        <input
          type="date"
          placeholder="Fecha de Inicio"
          value={nuevoPrestamo.fecha_inicio}
          onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, fecha_inicio: e.target.value })}
        />
        <input
          type="number"
          placeholder="Interés (%)"
          value={nuevoPrestamo.interes}
          onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, interes: +e.target.value })}
        />
        <button onClick={handleAgregarPrestamo}>Agregar Préstamo</button>
      </div>
    </div>
  );
}

export default Prestamos;
