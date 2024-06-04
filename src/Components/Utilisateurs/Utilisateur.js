// src/components/Utilisateurs.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

const Utilisateurs = () => {
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [currentUser, setCurrentUser] = useState({ idUtilisateur: '', fullName: '', email: '', createdAt: '', lastLogin: '', telFix: '', telMobile: '', idSpecialite: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/utilisateur'); // Remplacez l'URL par celle de votre API
            setUsers(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
        }
    };

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setCurrentUser({ idUtilisateur: '', fullName: '', email: '', createdAt: '', lastLogin: '', telFix: '', telMobile: '', idSpecialite: '' });
        setIsEditing(false);
        setShow(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser({ ...currentUser, [name]: value });
    };

    const handleAddUser = async () => {
        try {
            const response = await axios.post('http://localhost:3000/utilisateur', currentUser);
            setUsers([...users, response.data]);
            handleClose();
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'utilisateur :", error);
        }
    };

    const handleEditUser = async () => {
        try {
            await axios.put(`http://localhost:3000/utilisateur/${currentUser.idUtilisateur}`, currentUser);
            setUsers(users.map(utilisateur => Utilisateurs.idUtilisateur === currentUser.idUtilisateur ? currentUser : utilisateur));
            handleClose();
        } catch (error) {
            console.error("Erreur lors de la modification de l'utilisateur :", error);
        }
    };



    const handleDeleteUser = async (idUtilisateur) => {
        console.log("ID Utilisateur à supprimer :", idUtilisateur);  
        if (!idUtilisateur) {
            console.error("ID Utilisateur est indéfini ou invalide");
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/utilisateur/${idUtilisateur}`);
            setUsers((Utilisateurs) => Utilisateurs.filter(utilisateur => utilisateur.idUtilisateur !== idUtilisateur));
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur demandé :", error);
        }
    };




    const handleEditButtonClick = (utilisateur) => {
        setCurrentUser(utilisateur);
        setIsEditing(true);
        setShow(true);
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

                        <th>Tel Fixe</th>
                        <th>Tel Mobile</th>
                        <th>Specialité</th>
                        <th>Crée à </th>
                        <th>Derniere connexion</th>

                    </tr>
                </thead>
                <tbody>
                    {users.map((utilisateur) => (
                        <tr key={utilisateur.idUtilisateur}>
                            <td>{utilisateur.idUtilisateur}</td>
                            <td>{utilisateur.name}</td>
                            <td>{utilisateur.email}</td>
                            <td>{utilisateur.telFix}</td>
                            <td>{utilisateur.telMobile}</td>
                            <td>{utilisateur.idSpecialite}</td>
                            <td>{utilisateur.createdAt}</td>
                            <td>{utilisateur.lastLogin}</td>



                            <td align='center'>
                                <Button variant="warning" className="mr" onClick={() => handleEditButtonClick(utilisateur)}>Modifier</Button>
                            </td>
                            <td align='center'>
                                <Button variant="danger" onClick={() => handleDeleteUser(utilisateur.idUtilisateur)}>Supprimer</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Modifier' : 'Ajouter'} un utilisateur</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formUserName">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le nom"
                                name="name"
                                value={currentUser.name}
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
                        <Form.Group controlId="formCreatedAt">
                            <Form.Label>Crée à </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Date de création"
                                name="dateCreation"
                                value={currentUser.createdAt}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formLastLogin">
                            <Form.Label>Dernière connexion</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Dernière connexion"
                                name="dateConnexion"
                                value={currentUser.lastLogin}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formTelFixe">
                            <Form.Label>Tel Fixe </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Telephone fixe"
                                name="telFixe"
                                value={currentUser.telFix}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formTelMobile">
                            <Form.Label>Tel Mobile </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Telephone Mobile"
                                name="telMobile"
                                value={currentUser.telMobile}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formSpecielite">
                            <Form.Label>Specialité </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Spécialité"
                                name="specialite"
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
                    <Button variant="primary" onClick={isEditing ? handleEditUser : handleAddUser}>
                        {isEditing ? 'Modifier' : 'Ajouter'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Utilisateurs;
