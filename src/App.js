import React from "react";

import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import Utilisateurs from "./Components/Utilisateurs/Utilisateurs";
import Materiel from "./Components/Materiels/Materiel";
import Accueil from "./Components/Accueil/Accueil";
import Utilisateur from "./Components/Utilisateurs/Utilisateur";
import Router from "./router/Router";
function App() {
  return (
    <div className="App">
      
      <Router />
    </div>
  );
}

export default App;


//  <Navbar bg="primary" data-bs-theme="dark" expand="lg">
//           <Container>
//             <Navbar.Brand as={Link} to="/">GPI2K_ISET_RADES</Navbar.Brand>
//             <Navbar.Toggle aria-controls="basic-navbar-nav" />
//             <Navbar.Collapse id="basic-navbar-nav">
//               <Nav className="me-auto">
//                 <Nav.Link as={Link} to="/">Accueil</Nav.Link>
//                 <Nav.Link as={Link} to="/utilisateurs">Utilisateurs</Nav.Link>
//                 <Nav.Link as={Link} to="/materiel">Materiel</Nav.Link>
//                 <NavDropdown title="Profile" id="collapsible-nav-dropdown">
//                   <NavDropdown.Item href="#action/3.1">Mon Profile</NavDropdown.Item>
//                   <NavDropdown.Item href="#action/3.2"> Mon Materiels </NavDropdown.Item>
//                   <NavDropdown.Item href="#action/3.3">Se déconnecter</NavDropdown.Item>
//                   <NavDropdown.Divider />
//                   <NavDropdown.Item href="#action/3.4"> A Propos GPI </NavDropdown.Item>
//                 </NavDropdown>
//               </Nav>
//             </Navbar.Collapse>
//           </Container>
//         </Navbar> 