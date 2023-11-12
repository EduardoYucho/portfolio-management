import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory, Link } from 'react-router-dom';

const EditPerson = () => {
    const { id } = useParams();
    const [person, setPerson] = useState(null);
    const history = useHistory();

    const [editedPerson, setEditedPerson] = useState({
        nome: '',
        dataNascimento: '',
        cpf: '',
        funcionario: false,
    });

    useEffect(() => {
        axios.get(`http://localhost:8080/pessoas/${id}`)
            .then((response) => {
                setPerson(response.data);
                setEditedPerson({
                    nome: response.data.nome,
                    dataNascimento: response.data.dataNascimento,
                    cpf: response.data.cpf,
                    funcionario: response.data.funcionario,
                });
            })
            .catch((error) => {
                console.error('Erro ao buscar detalhes da pessoa:', error);
            });
    }, [id]);

    if (!person) {
        return <p>Carregando...</p>;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPerson((prevPerson) => ({
            ...prevPerson,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setEditedPerson((prevPerson) => ({
            ...prevPerson,
            [name]: checked,
        }));
    };

    const handleCancel = () => {
        history.push('/person-list');
    };

    const handleSave = () => {
        axios.put(`http://localhost:8080/pessoas/${id}`, editedPerson)
            .then((response) => {
                console.log('Pessoa atualizada com sucesso:', response.data);
                history.push('/person-list');
            })
            .catch((error) => {
                console.error('Erro ao atualizar pessoa:', error);
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
                    <h2>Editar Pessoa</h2>
                    <p>ID: {person.id}</p>
                    <div className="mb-3">
                        <label htmlFor="nome" className="form-label">Nome:</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={editedPerson.nome}
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
                            value={editedPerson.dataNascimento}
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
                            value={editedPerson.cpf}
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
                                checked={editedPerson.funcionario}
                                onChange={handleCheckboxChange}
                                className="form-check-input"
                            />
                            <label htmlFor="funcionario" className="form-check-label">Funcionário</label>
                        </div>
                    </div>
                    <div>
                        <button onClick={handleSave} className="btn btn-primary">
                            Salvar
                        </button>
                        <span style={{ marginLeft: '5px', marginRight: '1px' }}></span>
                        <button onClick={handleCancel} className="btn btn-secondary ml-2">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPerson;
