import React, { useState, useEffect } from 'react';
import './CatalogoMontos.css'; // Importa un archivo CSS para los estilos

interface MontoType {
  id: number;
  monto: number;
  cantidad_plazos: number;
}

function CatalogoMontos() {
  const [montos, setMontos] = useState<MontoType[]>([]);
  const [nuevoMonto, setNuevoMonto] = useState({ monto: 0, cantidad_plazos: 0 });
  const [montoId, setMontoId] = useState<number | null>(null); // Nuevo estado para el ID de monto consultado
  const [montoConsultado, setMontoConsultado] = useState<MontoType | null>(null); // Nuevo estado para mostrar el monto consultado

  useEffect(() => {
    // Realiza una solicitud para obtener la lista de catálogos de montos
    fetch("http://localhost:3000/catalogoMontos")
      .then((res) => res.json())
      .then((result: MontoType[]) => {
        setMontos(result);
      });
  }, []);

  const handleAgregarMonto = () => {
    // Realiza una solicitud para agregar un nuevo catálogo de montos
    fetch("http://localhost:3000/catalogoMontos", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoMonto),
    })
    .then((res) => res.json())
    .then((monto: MontoType) => {
      // Actualiza la lista de catálogos de montos con el nuevo catálogo
      setMontos([...montos, monto]);
      // Limpia el formulario
      setNuevoMonto({ monto: 0, cantidad_plazos: 0 });
    });
  };

  const handleConsultarMonto = (montoId: number) => {
    // Realiza una solicitud para consultar un catálogo de montos por su ID
    fetch(`http://localhost:3000/catalogoMontos/${montoId}`)
      .then((res) => res.json())
      .then((monto: MontoType) => {
        setMontoConsultado(monto);
      })
      .catch((error) => {
        console.error(error);
        setMontoConsultado(null);
      });
  };

  return (
    <div className="catalogo-montos">
      <h1>Catálogo de Montos</h1>

      <div className="monto-form">
  <div className="monto-input">
    <label htmlFor="monto">Monto:</label>
    <input
      type="number"
      id="monto"
      placeholder="Ingrese el monto"
      value={nuevoMonto.monto}
      onChange={(e) => setNuevoMonto({ ...nuevoMonto, monto: +e.target.value })}
    />
  </div>
  <div className="monto-input">
    <label htmlFor="plazos">Plazos:</label>
    <input
      type="number"
      id="plazos"
      placeholder="Ingrese la cantidad de plazos"
      value={nuevoMonto.cantidad_plazos}
      onChange={(e) => setNuevoMonto({ ...nuevoMonto, cantidad_plazos: +e.target.value })}
    />
  </div>
  <button onClick={handleAgregarMonto}>Agregar Catálogo</button>
</div>


    

      
      <ul>
        {montos.map((monto) => (
          <li key={monto.id} className="monto-item">
            <div className="monto-info">
              <span className="monto-label">Monto:</span> {monto.monto}
            </div>
            <div className="monto-info">
              <span className="monto-label">Cantidad de Plazos:</span> {monto.cantidad_plazos}
            </div>
            <button onClick={() => handleConsultarMonto(monto.id)}>Consultar</button>
          </li>
        ))}
      </ul>
     
      <h2>Consultar Monto por ID</h2>
      <div className="consulta-monto">
        <input
            type="number"
            placeholder="ID del Monto"
            value={montoId || ''}
            onChange={(e) => setMontoId(parseInt(e.target.value))}
        />
        <button onClick={() => montoId !== null && handleConsultarMonto(montoId)}>Consultar</button>
    </div>
      {montoConsultado && (
        <div className="monto-consultado">
          <h3>Monto Consultado</h3>
          <div className="monto-info">
            <span className="monto-label">Monto:</span> {montoConsultado.monto}
          </div>
          <div className="monto-info">
            <span className="monto-label">Cantidad de Plazos:</span> {montoConsultado.cantidad_plazos}
          </div>
        </div>
      )}
    </div>
  );
}

export default CatalogoMontos;
