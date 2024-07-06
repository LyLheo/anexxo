import React, { useState, useEffect } from 'react';
import './App.css';
import './styles.css'; // Importa el nuevo archivo CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import axios from 'axios';

const baseUrl = "https://localhost:44342/api/gestores";

function App() {
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [gestorSeleccionado, setGestorSeleccionado] = useState({
    id: '',
    nombre: '',
    lanzamiento: '',
    desarrollador: ''
  });

  const peticionGet = async () => {
    try {
      const response = await axios.get(baseUrl);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setGestorSeleccionado(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
    limpiarFormulario();
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  const seleccionarGestor = (gestor, caso) => {
    setGestorSeleccionado(gestor);
    (caso === "Editar") ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  const limpiarFormulario = () => {
    setGestorSeleccionado({
      id: '',
      nombre: '',
      lanzamiento: '',
      desarrollador: ''
    });
  };

  const peticionPost = async () => {
    try {
      const gestor = { ...gestorSeleccionado };
      delete gestor.id;
      gestor.lanzamiento = parseInt(gestor.lanzamiento);
      const response = await axios.post(baseUrl, gestor);
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    } catch (error) {
      console.error(error);
    }
  };

  const peticionPut = async () => {
    try {
      const gestor = { ...gestorSeleccionado };
      gestor.lanzamiento = parseInt(gestor.lanzamiento);
      const response = await axios.put(`${baseUrl}/${gestor.id}`, gestor);
      setData(data.map(item => (item.id === gestor.id ? response.data : item)));
      abrirCerrarModalEditar();
    } catch (error) {
      console.error(error);
    }
  };

  const peticionDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/${gestorSeleccionado.id}`);
      setData(data.filter(item => item.id !== gestorSeleccionado.id));
      abrirCerrarModalEliminar();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    peticionGet();
  }, []);

  return (
    <div className="App">
      <h1>Gestión de Gestores de Base de Datos</h1>
      <button className="btn btn-success" onClick={abrirCerrarModalInsertar}>Insertar Nuevo Gestor</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Lanzamiento</th>
            <th>Desarrollador</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(gestor => (
            <tr key={gestor.id}>
              <td>{gestor.id}</td>
              <td>{gestor.nombre}</td>
              <td>{gestor.lanzamiento}</td>
              <td>{gestor.desarrollador}</td>
              <td>
                <button className="btn btn-primary" onClick={() => seleccionarGestor(gestor, "Editar")}>Editar</button>
                <button className="btn btn-danger" onClick={() => seleccionarGestor(gestor, "Eliminar")}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para insertar */}
      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Gestor de Base de Datos</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre: </label>
            <br />
            <input type="text" className="form-control" name="nombre" onChange={handleChange} />
            <br />
            <label>Lanzamiento: </label>
            <br />
            <input type="text" className="form-control" name="lanzamiento" onChange={handleChange} />
            <br />
            <label>Desarrollador: </label>
            <br />
            <input type="text" className="form-control" name="desarrollador" onChange={handleChange} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={peticionPost}>Insertar</button>
          <button className="btn btn-danger" onClick={abrirCerrarModalInsertar}>Cancelar</button>
        </ModalFooter>
      </Modal>

      {/* Modal para editar */}
      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Gestor de Base de Datos</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre: </label>
            <br />
            <input type="text" className="form-control" name="nombre" onChange={handleChange} value={gestorSeleccionado.nombre} />
            <br />
            <label>Lanzamiento: </label>
            <br />
            <input type="text" className="form-control" name="lanzamiento" onChange={handleChange} value={gestorSeleccionado.lanzamiento} />
            <br />
            <label>Desarrollador: </label>
            <br />
            <input type="text" className="form-control" name="desarrollador" onChange={handleChange} value={gestorSeleccionado.desarrollador} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={peticionPut}>Guardar</button>
          <button className="btn btn-danger" onClick={abrirCerrarModalEditar}>Cancelar</button>
        </ModalFooter>
      </Modal>

      {/* Modal para eliminar */}
      <Modal isOpen={modalEliminar}>
        <ModalHeader>Eliminar Gestor de Base de Datos</ModalHeader>
        <ModalBody>
          ¿Estás seguro que deseas eliminar el gestor {gestorSeleccionado.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={peticionDelete}>Sí</button>
          <button className="btn btn-secondary" onClick={abrirCerrarModalEliminar}>No</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
