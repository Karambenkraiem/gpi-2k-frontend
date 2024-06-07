import React, {useState, useEffect} from 'react';
import {Table, Button, Form, Modal} from 'react-bootstrap';
import axios from 'axios';
import {Outlet} from 'react-router-dom';
import {ip} from '../../constants/ip';

const roleOptions = [
  {value: 'ADMINISTRATEUR', label: 'Admin'},
  {value: 'DIRECTEUR', label: 'Directeur'},
  {value: 'TECHNICIEN', label: 'Technicien'},
  {value: 'EMPLOYE', label: 'Employé'},
  {value: 'RMQ', label: 'Responsable Qualité'},
];

const etatOptions = [
  {value: 'actif', label: 'Actif'},
  {value: 'desactif', label: 'Inactif'},
];

const Utilisateurs = () => {
  const [users, setUsers] = useState ([]);
  const [show, setShow] = useState (false);
  const [currentUser, setCurrentUser] = useState ({
    idUtilisateur: 0,
    password: '',
    fullName: '',
    email: '',
    roleUtilisateur: 'EMPLOYE',
    etatUtilisateur: 'actif',
    telFix: '',
    telMobile: '',
    idSpecialite: '',
  });
  const [isEditing, setIsEditing] = useState (false);

  useEffect (() => {
    fetchUsers ();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get ('http://localhost:3000/utilisateur');
      setUsers (response.data);
    } catch (error) {
      console.error (
        'Erreur lors de la récupération des utilisateurs :',
        error
      );
    }
  };

  const handleClose = () => setShow (false);
  const handleShow = () => {
    setCurrentUser ({
      idUtilisateur: 0,
      password: '',
      fullName: '',
      email: '',
      roleUtilisateur: 'EMPLOYE',
      etatUtilisateur: 'actif',
      telFix: '',
      telMobile: '',
      idSpecialite: '',
    });
    setIsEditing (false);
    setShow (true);
  };

  const handleChange = e => {
    const {name, value} = e.target;
    setCurrentUser ({
      ...currentUser,
      [name]: name === 'idUtilisateur' ? parseInt (value, 10) : value,
    });
  };

  const handleAddUser = async () => {
    console.log (currentUser);
    try {
      const response = await axios.post (
        'http://localhost:3000/utilisateur',
        currentUser
      );
      setUsers ([...users, response.data]);
      handleClose ();
    } catch (error) {
      console.error ("Erreur lors de l'ajout de l'utilisateur :", error);
    }
  };

  const handleEditUser = async () => {
    try {
      await axios.patch (
        `http://localhost:3000/utilisateur/${currentUser.idUtilisateur}`,
        currentUser
      );
      setUsers (
        users.map (
          utilisateur =>
            utilisateur.idUtilisateur === currentUser.idUtilisateur
              ? currentUser
              : utilisateur
        )
      );
      handleClose ();
    } catch (error) {
      console.error (
        "Erreur lors de la modification de l'utilisateur :",
        error.response.data
      );
    }
  };

  const handleDelete = async id => {
    try {
      await axios.delete (`${ip}/utilisateur/${id}`);
      fetchUsers ();
    } catch (error) {
      console.error ('Error deleting utilisateur:', error);
    }
  };

  const handleEditButtonClick = utilisateur => {
    setCurrentUser (utilisateur);
    setIsEditing (true);
    setShow (true);
  };

  return (
    <div>
      <h2>Gestion des utilisateurs</h2>
      <Button variant="primary" onClick={handleShow}>
        Ajouter un utilisateur
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>

            <th>Spécialité</th>
            <th>Role</th>
            <th>Etat</th>

            <th />
          </tr>
        </thead>
        <tbody>
          {users.map (utilisateur => (
            <tr key={utilisateur.idUtilisateur}>
              <td>{utilisateur.idUtilisateur}</td>
              <td>{utilisateur.fullName}</td>
              <td>{utilisateur.email}</td>

              <td>{utilisateur.idSpecialite}</td>
              <td>{utilisateur.roleUtilisateur}</td>
              <td>{utilisateur.etatUtilisateur}</td>

              <td align="center">
                <Button
                  variant="warning"
                  className="mr-2"
                  onClick={() => handleEditButtonClick (utilisateur)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-pen"
                    viewBox="0 0 16 16"
                  >
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                  </svg>
                </Button>

                </td>
                <td align='center'>
                

                <Button
                  variant="danger"
                  onClick={() => handleDelete (utilisateur.idUtilisateur)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-trash"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Modifier' : 'Ajouter'} un utilisateur
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUserId">
              <Form.Label>Matricule</Form.Label>
              <Form.Control
                type="number"
                placeholder="Entrez le matricule"
                name="idUtilisateur"
                value={currentUser.idUtilisateur}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrez le mot de passe"
                name="password"
                value={currentUser.password}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formUserName">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le nom"
                name="fullName"
                value={currentUser.fullName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formUserEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrez l'email"
                name="email"
                value={currentUser.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formRole">
              <Form.Label>Rôle</Form.Label>
              <Form.Control
                as="select"
                name="roleUtilisateur"
                value={currentUser.roleUtilisateur}
                onChange={handleChange}
              >
                {roleOptions.map (role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formEtat">
              <Form.Label>État</Form.Label>
              <Form.Control
                as="select"
                name="etatUtilisateur"
                value={currentUser.etatUtilisateur}
                onChange={handleChange}
              >
                {etatOptions.map (etat => (
                  <option key={etat.value} value={etat.value}>
                    {etat.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formTelFixe">
              <Form.Label>Tel Fixe</Form.Label>
              <Form.Control
                type="text"
                placeholder="Telephone fixe"
                name="telFix"
                value={currentUser.telFix}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formTelMobile">
              <Form.Label>Tel Mobile</Form.Label>
              <Form.Control
                type="text"
                placeholder="Telephone Mobile"
                name="telMobile"
                value={currentUser.telMobile}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formSpecialite">
              <Form.Label>Spécialité</Form.Label>
              <Form.Control
                type="text"
                placeholder="Spécialité"
                name="idSpecialite"
                value={currentUser.idSpecialite}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={isEditing ? handleEditUser : handleAddUser}
          >
            {isEditing ? 'Modifier' : 'Ajouter'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Utilisateurs;
