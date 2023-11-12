import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/PersonList.css';

const PersonList = () => {
    const [people, setPeople] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/pessoas', {
                    params: {
                        page: currentPage,
                        size: 10,
                    },
                });
                setPeople(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Erro ao buscar lista de pessoas:', error);
            }
        };

        fetchData();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
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
                <div className="container mt-4" >
                    <h2 className="mb-4">Lista de Pessoas</h2>
                    <table className="table table-dark text-light">
                        <thead>
                            <tr>
                                <th scope="col">Nome</th>
                                <th scope="col">Data de Nascimento</th>
                                <th scope="col">CPF</th>
                                <th scope="col">Funcionário</th>
                                <th scope="col">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {people.map((person) => (
                                <tr key={person.id}>
                                    <td>{person.nome}</td>
                                    <td>{person.dataNascimento}</td>
                                    <td>{person.cpf}</td>
                                    <td>{person.funcionario ? 'Sim' : 'Não'}</td>
                                    <td>
                                        <Link to={`/edit-person/${person.id}`} className="btn btn-primary btn-sm">
                                            Editar
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="d-flex justify-content-left">
                        <button
                            className="btn btn-primary mr-2"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            Anterior
                        </button>
                        <span style={{ marginLeft: '10px', marginRight: '1px' }}></span>
                        <button
                            className="btn btn-primary ml-2"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                        >
                            Próxima
                        </button>
                    </div>
                    <div className="d-flex justify-content-left" style={{ marginTop: '10px' }}>
                        <Link to="/add-person" className="btn btn-primary mr-2">
                            Adicionar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonList;
