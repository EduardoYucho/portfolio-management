import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class EditProject extends Component {
  constructor() {
    super();
    this.state = {
      projectDetails: {
        nome: '',
        dataInicio: '',
        dataFim: '',
        status: '',
        descricao: '',
        orcamento: 0,
        risco: '',
        idGerente: 0,
        idMembro: '',
        isMembroAdicionado: false,
        isErroAoAdicionarMembro: false,
        pesquisarPessoas: '',
      },
      suggestions: [],
      membrosVinculados: [],
      isProjectClosed: false,
      redirectToList: false,
    };
  }

  componentDidMount() {
    const projectId = this.props.match.params.id;
    this.fetchMembrosVinculados(projectId);
    axios.get(`http://localhost:8080/projetos/detalhes/${projectId}`)
      .then((response) => {
        const projectDetails = response.data;
        const { status, descricao, orcamento, classificacaoRisco, gerente } = projectDetails;

        this.setState({
          projectDetails: {
            ...projectDetails,
            status: status || '',
            descricao: descricao || '',
            orcamento: orcamento || 0,
            risco: classificacaoRisco || '',
            idGerente: gerente ? gerente.id : 0,
          },
          isProjectClosed: projectDetails.status === 'Encerrado',
        });
      })
      .catch((error) => {
        console.error('Erro ao buscar projeto para edição', error);
      });
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      projectDetails: {
        ...prevState.projectDetails,
        [name]: value,
      },
    }));

    if (name === 'gerente') {
      const idGerente = value.id;
      this.setState((prevState) => ({
        projectDetails: {
          ...prevState.projectDetails,
          idGerente: idGerente,
        },
      }));
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.updateProjectOnServer();
  };

  updateProjectOnServer = () => {
    const projectId = this.props.match.params.id;
    let { projectDetails } = this.state;

    projectDetails = {
      ...projectDetails,
      dataInicio: new Date(projectDetails.dataInicio).toISOString().split('T')[0],
      dataFim: new Date(projectDetails.dataFim).toISOString().split('T')[0],
    };

    axios.put(`http://localhost:8080/projetos/atualizar-projeto/${projectId}`, projectDetails)
      .then((response) => {
        console.log('Projeto atualizado com sucesso:', response.data);
        this.setState({ redirectToList: true });
      })
      .catch((error) => {
        console.error('Erro ao atualizar o projeto:', error);
      });
  };

  handleSearchPeople = () => {
    const { projectDetails } = this.state;

    if (projectDetails.pesquisarPessoas) {
      const projectId = this.props.match.params.id;

      axios.post('http://localhost:8080/membros/adicionarMembro/', {
        idPessoa: parseInt(projectDetails.pesquisarPessoas),
        idProjeto: parseInt(projectId),
      })
        .then((response) => {
          console.log('Membro adicionado com sucesso:', response.data);
          this.setState({ isMembroAdicionado: true });
          setTimeout(this.resetMembroAdicionado, 3000); // 3000 milissegundos = 3 segundos
          this.fetchMembrosVinculados(projectId);
        })
        .catch((error) => {
          console.error('Erro ao adicionar membro:', error);
          this.setState({ isErroAoAdicionarMembro: true });
          setTimeout(this.resetMembroAdicionado, 10000);
          setTimeout(() => {
            this.setState({ isErroAoAdicionarMembro: false });
          }, 10000); // 10000 milissegundos = 10 segundos
        });
    }
  };

  resetMembroAdicionado = () => {
    this.setState({
      isMembroAdicionado: false,
      isErroAoAdicionarMembro: false,
      projectDetails: { ...this.state.projectDetails, pesquisarPessoas: '' },
    });
  };

  fetchMembrosVinculados = (projectId) => {
    if (!isNaN(projectId)) {
      axios.get(`http://localhost:8080/membros/membros-projeto/${projectId}`)
        .then((response) => {
          console.log('Resposta do backend:', response.data);
          this.setState({ membrosVinculados: response.data });
        })
        .catch((error) => {
          console.error('Erro ao buscar membros vinculados ao projeto:', error);
        });
    } else {
      console.error('O projectId não é um valor numérico válido:', projectId);
    }
  };

  handleRemoverMembro = (idPessoa, idProjeto) => {
    axios
      .delete(`http://localhost:8080/membros/remover-membro/${idPessoa}/${idProjeto}`)
      .then((response) => {
        console.log(response.data);
        this.fetchMembrosVinculados(this.props.match.params.id);
      })
      .catch((error) => {
        console.error('Erro ao remover membro:', error);
      });
  };

  render() {
    const { projectDetails, isProjectClosed, redirectToList, isMembroAdicionado, isErroAoAdicionarMembro, membrosVinculados } = this.state;

    if (redirectToList) {
      return <Redirect to="/project-list" />;
    }

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
          <div className="container mt-4">
            <h2>Editar Projeto</h2>
            {isProjectClosed && (
              <div className="alert alert-danger" role="alert">
                Este projeto está encerrado. As alterações não são permitidas.
              </div>
            )}

            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome do Projeto:</label>
                <input
                  type="text"
                  className="form-control"
                  id="nome"
                  name="nome"
                  value={projectDetails.nome || ''}
                  onChange={this.handleInputChange}
                  required
                  disabled={isProjectClosed}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dataInicio">Data de Início:</label>
                <input
                  type="date"
                  className="form-control"
                  id="dataInicio"
                  name="dataInicio"
                  value={projectDetails.dataInicio || ''}
                  onChange={this.handleInputChange}
                  required
                  disabled={isProjectClosed}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dataFim">Data de Término:</label>
                <input
                  type="date"
                  className="form-control"
                  id="dataFim"
                  name="dataFim"
                  value={projectDetails.dataFim || ''}
                  onChange={this.handleInputChange}
                  required
                  disabled={isProjectClosed}
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status:</label>
                <select
                  className="form-control"
                  id="status"
                  name="status"
                  value={projectDetails.status || ''}
                  onChange={this.handleInputChange}
                  required
                  disabled={isProjectClosed}
                >
                  <option value="Em Análise">Em Análise</option>
                  <option value="Análise Realizada">Análise Realizada</option>
                  <option value="Análise Aprovada">Análise Aprovada</option>
                  <option value="Iniciado">Iniciado</option>
                  <option value="Planejado">Planejado</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Encerrado">Encerrado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="descricao">Descrição:</label>
                <textarea
                  className="form-control"
                  id="descricao"
                  name="descricao"
                  value={projectDetails.descricao || ''}
                  onChange={this.handleInputChange}
                  required
                  disabled={isProjectClosed}
                />
              </div>

              <div className="form-group">
                <label htmlFor="orcamento">Orçamento:</label>
                <input
                  type="number"
                  className="form-control"
                  id="orcamento"
                  name="orcamento"
                  value={projectDetails.orcamento || 0}
                  onChange={this.handleInputChange}
                  required
                  disabled={isProjectClosed}
                />
              </div>

              <div className="form-group">
                <label htmlFor="risco">Risco:</label>
                <input
                  type="text"
                  className="form-control"
                  id="risco"
                  name="risco"
                  value={projectDetails.risco || ''}
                  onChange={this.handleInputChange}
                  readOnly
                  required
                  disabled={isProjectClosed}
                />
              </div>

              <div className="form-group">
                <label htmlFor="pesquisarPessoas">Pesquisar Pessoas:</label>
                <input
                  type="number"
                  className="form-control"
                  id="pesquisarPessoas"
                  name="pesquisarPessoas"
                  value={projectDetails.pesquisarPessoas || ''}
                  onChange={this.handleInputChange}
                  placeholder="Digite o nome para pesquisar"
                  disabled={isProjectClosed}
                />
              </div>

              <div className="form-group" style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={this.handleSearchPeople}
                  disabled={isProjectClosed || !projectDetails.pesquisarPessoas}
                >
                  Pesquisar Membros
                </button>
              </div>

              {isMembroAdicionado && (
                <div className="alert alert-success" role="alert" style={{ marginTop: '10px' }}>
                  Membro adicionado com sucesso!
                </div>
              )}

              {isErroAoAdicionarMembro && (
                <div className="alert alert-danger" role="alert" style={{ marginTop: '10px' }}>
                  Erro ao adicionar membro. Verifique se essa pessoa está cadastrada como funcionário ou se já está vinculado ao projeto.
                </div>
              )}

              {membrosVinculados.length > 0 && (
                <div>
                  <h4>Membros Vinculados ao Projeto:</h4>
                  {membrosVinculados.map((membro) => (
                    <div key={membro.idPessoa}>
                      {`ID: ${membro.idPessoa}, Nome: ${membro.nomePessoa}`}
                      <span style={{ marginLeft: '5px', marginRight: '1px' }}></span>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm ml-2" style={{ marginTop: '5px' }}
                        onClick={() => this.handleRemoverMembro(membro.idPessoa, membro.idProjeto)}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="form-group" style={{ marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary mr-3" disabled={isProjectClosed}>
                  Salvar Alterações
                </button>
                <span style={{ marginLeft: '3px', marginRight: '1px' }}></span>
                <Link to="/project-list" className="btn btn-secondary">Cancelar</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default EditProject;
