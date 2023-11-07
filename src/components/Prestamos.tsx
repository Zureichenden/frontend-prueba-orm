import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

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

interface PrestamoDetalleType {
  prestamo: PrestamoType;
  amortizaciones: AmortizacionType[];
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
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const [modalContent, setModalContent] = useState<PrestamoDetalleType | null>(null);


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
    fetch(`http://localhost:3000/detalleID/${prestamoId}`)
      .then((res) => res.json())
      .then((result: PrestamoType[]) => {
        setPrestamos(result);
      });

  };

  const handleBuscarPrestamo = () => {
    if (prestamoId) {
      handleConsultarPrestamo(prestamoId);
    }
  };

  // Agregar función para buscar préstamos por nombre de cliente
  const handleBuscarPorNombre = () => {
    fetch(`http://localhost:3000/buscarNombre?clienteNombre=${clienteNombre}`)
      .then((res) => res.json())
      .then((result: PrestamoType[]) => {
        setPrestamos(result);
      });
  };


  const handleConsultarAmortizacionesByPrestamo = (prestamoId: number) => {
    fetch(`http://localhost:3000/amortizaciones/prestamo/${prestamoId}`)
      .then((res) => {
        if (!res.ok) {
          // Si la respuesta no es exitosa, muestra un mensaje de error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al consultar las amortizaciones del préstamo.',
          });
          throw new Error('Error en la solicitud');
        }
        return res.json();
      })
      .then((data) => {
        const { prestamo, amortizaciones } = data;

        // Crea un objeto que incluye tanto prestamo como amortizaciones
        const prestamoDetalle: PrestamoDetalleType = {
          prestamo,
          amortizaciones,
        };

        // Almacena el contenido del modal
        setModalContent(prestamoDetalle);

        // Muestra el modal
        handleShowModal();
      })
      .catch((error) => {
        console.error(error); // Puedes registrar el error en la consola para fines de depuración
      });
  };





  const handleBuscarAmortizacionesByPrestamo = (prestamoId: number) => {
    if (prestamoId) {
      handleConsultarAmortizacionesByPrestamo(prestamoId);
    }
  };

  return (
    <>
      <div className="container">
        <h1>Préstamos</h1>

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

        <div className="search-container">
          <div className="prestamo-busqueda-id">
            <input
              type="number"
              placeholder="Buscar préstamo por ID"
              value={prestamoId || ''}
              onChange={(e) => setPrestamoId(+e.target.value)}
            />
            <button onClick={handleBuscarPrestamo}>Buscar</button>
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




      </div>

      <Modal centered show={showModal} size="sm" backdrop="static" animation={true}
        contentClassName="transparentBgClass"
        dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Préstamo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-info">
            <div className="modal-info-row">
              <span>Cliente:</span>
              <p>{modalContent?.prestamo.cliente.nombre}</p>
            </div>
            <div className="modal-info-row">
              <span>Monto:</span>
              <p>${modalContent?.prestamo.monto.monto} (Plazos: {modalContent?.prestamo.monto.cantidad_plazos})</p>
            </div>
            <div className="modal-info-row">
              <span>Fecha de Inicio:</span>
              <p>{modalContent?.prestamo.fecha_inicio}</p>
            </div>
            <div className="modal-info-row">
              <span>Interés:</span>
              <p>{modalContent?.prestamo.interes}%</p>
            </div>
          </div>


          <h3>Amortizaciones:</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Quincena</th>
                <th>Fecha de Pago</th>
                <th>Préstamo</th>
                <th>Interés</th>
                <th>Abono</th>
                <th>Capital Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {modalContent?.amortizaciones.map((amortizacion, index) => (
                <tr key={amortizacion.id}>
                  <td>{amortizacion.quincena}</td>
                  <td>{amortizacion.fecha_pago}</td>
                  <td>$ {amortizacion.monto_pago}</td>
                  <td>$ {amortizacion.interes_pago}</td>
                  <td>$ {amortizacion.abono}</td>
                  <td>$ {amortizacion.capital_pendiente}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Totales:</td>
                <td>
                  $ {(modalContent?.amortizaciones.reduce((total, amortizacion) => total + (typeof amortizacion.monto_pago === 'string' ? parseFloat(amortizacion.monto_pago) : amortizacion.monto_pago), 0) || 0).toFixed(2)}
                </td>
                <td>
                  $ {(modalContent?.amortizaciones.reduce((total, amortizacion) => total + (typeof amortizacion.interes_pago === 'string' ? parseFloat(amortizacion.interes_pago) : amortizacion.interes_pago), 0) || 0).toFixed(2)}
                </td>
                <td>
                  $ {(modalContent?.amortizaciones.reduce((total, amortizacion) => total + (typeof amortizacion.abono === 'string' ? parseFloat(amortizacion.abono) : amortizacion.abono), 0) || 0).toFixed(2)}
                </td>
                <td></td> {/* Deja esta columna vacía */}
              </tr>
            </tfoot>
          </table>


        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

    </>



  );



}

export default Prestamos;
