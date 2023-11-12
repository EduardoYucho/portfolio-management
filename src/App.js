import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ProjectList from './project/ProjectList';
import NewProject from './project/NewProject';
import './styles/App.css';
import PersonList from './person/PersonList';
import AddPerson from './person/AddPerson';

function App() {
  return (
    <Router>
      <div>
        <Navbar variant="dark" style={{ backgroundColor: '#708090', alignItems: 'flex-start' }}>
          <span style={{ marginLeft: '10px', marginRight: '1px' }}></span>
          <Navbar.Brand href="/">Portfólio de Projetos</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/project-list">Projetos</Nav.Link>
            <Nav.Link href="/person-list">Pessoas</Nav.Link>
          </Nav>
        </Navbar>

        <Route exact path="/" component={Home} />
        <Route path="/project-list" component={ProjectList} />
        <Route path="/new-project" component={NewProject} />
        <Route path="/person-list" component={PersonList} />
        <Route path="/add-person" component={AddPerson} />
      </div>
    </Router>
  );
}

function Home() {
  const Animation = {
    animation: 'fade 2s ease-out infinite',
  };

  return (
    <div className="background">
      <div className="container text-center">
        <div style={Animation}>
          <h1 className="text-home">Bem-vindo ao Portfólio de Projetos!</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
