import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProjectList.css';

class ProjectList extends Component {
  constructor() {
    super();
    this.state = {
      projects: [],
      currentPage: 1,
      projectsPerPage: 10,
    };
  }

  componentDidMount() {
    this.fetchProjects();
  }

  fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:8080/projetos');
      const sortedProjects = response.data.sort((a, b) => b.id - a.id);
      this.setState({ projects: sortedProjects });
    } catch (error) {
      console.error('Erro ao buscar projetos', error);
    }
  };

  handleExcluirClick = async (projectId) => {
    try {

      await axios.delete(`http://localhost:8080/projetos/${projectId}`);

      this.fetchProjects();
    } catch (error) {
      console.error('Erro ao excluir projeto', error);
    }
  };

  handleEditarClick = (projectId) => {
    this.props.history.push(`/edit-project/${projectId}`);
  };

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { projects, currentPage, projectsPerPage } = this.state;

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

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

        <div className="project-list-container bg-dark text-light">
          <h2>Lista de Projetos</h2>
          <table className="table table-dark text-light">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Data de Início</th>
                <th>Data de Término</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentProjects.map((project) => (
                <tr key={project.id}>
                  <td>{project.nome}</td>
                  <td>{project.dataInicio}</td>
                  <td>{project.dataFim}</td>
                  <td>{project.status}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => this.handleExcluirClick(project.id)}
                      disabled={
                        project.status === 'Iniciado' || project.status === 'Em Andamento' || project.status === 'Encerrado'
                      }
                    >
                      Excluir
                    </Button>
                    <span style={{ marginLeft: '3px', marginRight: '1px' }}></span>
                    <Button
                      variant="info"
                      onClick={() => this.handleEditarClick(project.id)}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <nav>
            <ul className="pagination">
              {Array.from({ length: Math.ceil(projects.length / projectsPerPage) }, (_, index) => index + 1).map((number) => (
                <li key={number} className={number === currentPage ? 'page-item active' : 'page-item'}>
                  <button className="page-link" onClick={() => this.paginate(number)}>
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <Link to="/new-project">
            <Button variant="primary">Novo Projeto</Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default ProjectList;
