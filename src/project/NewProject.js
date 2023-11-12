import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../styles/NewProject.css';
import '../styles/Navbar.css';

class NovoProjeto extends Component {
  constructor() {
    super();
    this.state = {
      nome: '',
      dataInicio: '',
      gerente: '',
      previsaoTermino: '',
      dataRealTermino: '',
      orcamentoTotal: '',
      descricao: '',
      status: 'Em Análise',
      isGerenteValido: true,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'gerente') {
      const gerenteValue = value.trim();
      if (gerenteValue !== '' && isNaN(gerenteValue)) {
        return;
      }
    }

    if (name === 'orcamentoTotal' && !/^\d*$/.test(value)) {
      return;
    }

    this.setState({ [name]: value, isGerenteValido: true });
  };

  handleSalvarClick = async () => {
    const {
      nome,
      dataInicio,
      gerente,
      previsaoTermino,
      dataRealTermino,
      orcamentoTotal,
      status,
    } = this.state;

    if (!nome || !dataInicio || !gerente || !previsaoTermino || !dataRealTermino || !orcamentoTotal) {
      alert('Preencha todos os campos obrigatórios antes de salvar.');
      return;
    }

    const isGerenteValido = await this.verificarGerente();

    if (!isGerenteValido) {
      this.setState({ isGerenteValido: false });
      return;
    }

    const classificacaoRisco = this.getClassificacaoRisco(orcamentoTotal);

    try {
      const response = await fetch('http://localhost:8080/projetos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          dataInicio,
          gerente: { id: gerente },
          dataPrevisaoFim: previsaoTermino,
          dataFim: dataRealTermino,
          orcamento: orcamentoTotal,
          descricao: this.state.descricao,
          status, // Mantemos o status atual
          classificacaoRisco,
        }),
      });

      if (response.ok) {
        console.log('Projeto salvo com sucesso!');
        this.props.history.push('/project-list');
      } else {
        console.error('Erro ao salvar o projeto:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao salvar o projeto:', error.message);
    }
  };

  verificarGerente = async () => {
    const { gerente } = this.state;

    try {
      const response = await fetch(`http://localhost:8080/api/verificar-gerente/${gerente}`);
      const data = await response.json();
      return data.isGerenteValido;
    } catch (error) {
      console.error('Erro ao verificar o gerente:', error);
      return false;
    }
  };

  getClassificacaoRisco = (orcamento) => {
    const orcamentoNumero = parseInt(orcamento, 10);

    if (orcamentoNumero < 100000) {
      return 'Baixo Risco';
    } else if (orcamentoNumero < 500000) {
      return 'Médio Risco';
    } else {
      return 'Alto Risco';
    }
  };

  render() {
    const { isGerenteValido } = this.state;

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
            <h2>Novo Projeto</h2>
            <Form>
              <Form.Group controlId="formNome">
                <Form.Label>Nome do Projeto</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o nome do projeto"
                  name="nome"
                  value={this.state.nome}
                  onChange={this.handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formDataInicio">
                <Form.Label>Data de Início</Form.Label>
                <Form.Control
                  type="date"
                  name="dataInicio"
                  value={this.state.dataInicio}
                  onChange={this.handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formGerente">
                <Form.Label>ID do Gerente</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o ID do gerente"
                  name="gerente"
                  value={this.state.gerente}
                  onChange={this.handleInputChange}
                />
                {!isGerenteValido && (
                  <Form.Text className="text-danger">
                    O ID do gerente não é válido. Por favor, insira um ID válido.
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group controlId="formPrevisaoTermino">
                <Form.Label>Previsão de Término</Form.Label>
                <Form.Control
                  type="date"
                  name="previsaoTermino"
                  value={this.state.previsaoTermino}
                  onChange={this.handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formDataRealTermino">
                <Form.Label>Data Real de Término</Form.Label>
                <Form.Control
                  type="date"
                  name="dataRealTermino"
                  value={this.state.dataRealTermino}
                  onChange={this.handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formOrcamentoTotal">
                <Form.Label>Orçamento Total</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o orçamento total"
                  name="orcamentoTotal"
                  pattern="[0-9]*"
                  value={this.state.orcamentoTotal}
                  onChange={this.handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formDescricao">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Digite a descrição do projeto"
                  name="descricao"
                  value={this.state.descricao}
                  onChange={this.handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={this.state.status}
                  onChange={this.handleInputChange}
                  disabled
                >
                  <option>Em Análise</option>
                  <option>Análise Realizada</option>
                  <option>Análise Aprovada</option>
                  <option>Iniciado</option>
                  <option>Planejado</option>
                  <option>Em Andamento</option>
                  <option>Encerrado</option>
                  <option>Cancelado</option>
                </Form.Control>
              </Form.Group>

              <div className="mt-3">
                <Button variant="primary" onClick={this.handleSalvarClick}>
                  Salvar
                </Button>
                <span style={{ marginLeft: '10px' }}></span>
                <Link to="/project-list">
                  <Button variant="secondary" className="ml-2">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default NovoProjeto;
