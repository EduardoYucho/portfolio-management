import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AddPerson = () => {
    const [newPerson, setNewPerson] = useState({
        nome: '',
        dataNascimento: '',
        cpf: '',
        funcionario: false,
    });

    const history = useHistory();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPerson((prevPerson) => ({
            ...prevPerson,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setNewPerson((prevPerson) => ({
            ...prevPerson,
            [name]: checked,
        }));
    };

    const handleCancel = () => {
        history.push('/person-list');
    };

    const handleSave = () => {
        axios.post('http://localhost:8080/pessoas', newPerson)
            .then((response) => {
                console.log('Pessoa adicionada com sucesso:', response.data);
                history.push('/person-list');
            })
            .catch((error) => {
                console.error('Erro ao adicionar pessoa:', error);
            });
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark">
                <span style={{ marginLeft: '10px', marginRight: '1px' }}></span>
                <Link className="navbar-brand" to="/">
                    Início
                </Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/project-list">
                                Projetos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/person-list">
                                Pessoas
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="person-list-container bg-dark text-light">
                <div className="container mt-4">
                    <h2>Adicionar Pessoa</h2>
                    <div className="mb-3">
                        <label htmlFor="nome" className="form-label">Nome:</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={newPerson.nome}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="dataNascimento" className="form-label">Data de Nascimento:</label>
                        <input
                            type="date"
                            id="dataNascimento"
                            name="dataNascimento"
                            value={newPerson.dataNascimento}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cpf" className="form-label">CPF:</label>
                        <input
                            type="text"
                            id="cpf"
                            name="cpf"
                            value={newPerson.cpf}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                id="funcionario"
                                name="funcionario"
                                checked={newPerson.funcionario}
                                onChange={handleCheckboxChange}
                                className="form-check-input"
                            />
                            <label htmlFor="funcionario" className="form-check-label">Funcionário</label>
                        </div>
                    </div>
                    <div>
                        <button onClick={handleSave} className="btn btn-primary btn-sm">
                            Salvar
                        </button>
                        <span style={{ marginLeft: '5px', marginRight: '1px' }}></span>
                        <button onClick={handleCancel} className="btn btn-secondary btn-sm ml-2">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPerson;
