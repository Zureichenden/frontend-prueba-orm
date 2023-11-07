import React, { useState, useEffect } from 'react';
import './Amortizacion.css'; // Importa un archivo CSS para los estilos

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

// Define el tipo de datos para amortizaciones
interface AmortizacionType {
  id: number;
  prestamo_id: number;
  quincena: number;
  fecha_pago: string;
  monto_pago: number;
  interes_pago: number;
  abono: number;
  capital_pendiente: number;
  prestamo: PrestamoType;
}

function Amortizaciones() {
  const [amortizaciones, setAmortizaciones] = useState<AmortizacionType[]>([]);
  const [prestamoId, setPrestamoId] = useState<number | null>(null);
  const [prestamos, setPrestamos] = useState<PrestamoType[]>([]);
  const [clienteNombre, setClienteNombre] = useState<string>('');



  useEffect(() => {
    // Realiza una solicitud para obtener los datos de amortizaciones
    fetch("http://localhost:3000/amortizaciones")
      .then((res) => res.json())
      .then((result: AmortizacionType[]) => {
        setAmortizaciones(result);
      });
  }, []);

  const handleConsultarAmortizacionesByPrestamo = (prestamoId: number) => {
    fetch(`http://localhost:3000/amortizaciones/prestamo/${prestamoId}`)
      .then((res) => res.json())
      .then((data) => {
        const { prestamo, amortizaciones } = data;

        const cliente = prestamo.cliente;
        const monto = prestamo.monto;

        alert(`Cliente: ${cliente.nombre}, Monto: $${monto.monto}, Fecha de Inicio: ${prestamo.fecha_inicio}, Interés: ${prestamo.interes}%`);
      });
  };


  const handleBuscarAmortizacionesByPrestamo = () => {
    if (prestamoId) {
      handleConsultarAmortizacionesByPrestamo(prestamoId);
    }
  };

// Agregar función para buscar préstamos por nombre de cliente
const handleBuscarPorNombre = () => {
  if (clienteNombre) {
    // Si el nombre no es nulo o vacío, realizar una búsqueda específica
    fetch(`http://localhost:3000/amortizaciones/cliente/${clienteNombre}`)
      .then((res) => res.json())
      .then((result: AmortizacionType[]) => {
        setAmortizaciones(result);
      });
  } else {
    // Si el nombre es nulo o vacío, realizar una búsqueda genérica
    fetch("http://localhost:3000/amortizaciones")
      .then((res) => res.json())
      .then((result: AmortizacionType[]) => {
        setAmortizaciones(result);
      });
  }
};


  return (
    <div className="amortizaciones-container">
      <h1>Amortizaciones</h1>

      <div className="prestamo-busqueda">
        <input
          type="number"
          placeholder="Buscar préstamo por ID"
          value={prestamoId || ''}
          onChange={(e) => setPrestamoId(+e.target.value)}
        />
        <button onClick={handleBuscarAmortizacionesByPrestamo}>Buscar</button>
      </div>

      <div className="prestamo-busqueda-nombre">
            <input
              type="text"
              placeholder="Buscar préstamo por nombre de cliente"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
            />
            <button onClick={handleBuscarPorNombre}>Buscar por Nombre</button>
        </div>

      <table className="amortizaciones-table">
        <thead>
          <tr>
            <th scope="col">ID Del Préstamo</th>
            <th scope="col">ID Amortización</th>
            <th scope="col">NO. Pago</th>
            <th scope="col">Fecha</th>
            <th scope="col">Préstamo</th>
            <th scope="col">Interés</th>
            <th scope="col">Abono</th>
          </tr>
        </thead>
        <tbody>
          {amortizaciones.length > 0 ? (
            amortizaciones.map((row) => (
              <tr key={row.id}>
                <td>{row?.prestamo?.id}</td>
                <td>{row.id}</td>
                <td>{row.quincena}</td>
                <td>{new Date(row.fecha_pago).toLocaleDateString()}</td>
                <td>${typeof row.monto_pago === 'number' ? row.monto_pago.toFixed(2) : row.monto_pago}</td>
                <td>${typeof row.interes_pago === 'number' ? row.interes_pago.toFixed(2) : row.interes_pago}</td>
                <td>${typeof row.abono === 'number' ? row.abono.toFixed(2) : row.abono}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center">
                No hay registros de amortizaciones disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Amortizaciones;
