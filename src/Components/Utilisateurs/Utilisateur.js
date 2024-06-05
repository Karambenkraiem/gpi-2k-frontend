import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

const roleOptions = [
    { value: 'ADMINISTRATEUR', label: 'Admin' },
    { value: 'DIRECTEUR', label: 'Directeur' },
    { value: 'TECHNICIEN', label: 'Technicien' },
    { value: 'EMPLOYE', label: 'Employé' },
    { value: 'RMQ', label: 'Responsable Qualité' },
];

const etatOptions = [
    { value: 'actif', label: 'Actif' },
    { value: 'desactif', label: 'Inactif' },
];

const Utilisateurs = () => {
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [currentUser, setCurrentUser] = useState({
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
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/utilisateur');
            setUsers(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
        }
    };

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setCurrentUser({
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
        setIsEditing(false);
        setShow(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser({ ...currentUser, [name]: name === 'idUtilisateur' ? parseInt(value, 10) : value });
    };

    const handleAddUser = async () => {
        console.log(currentUser);
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
            await axios.patch(`http://localhost:3000/utilisateur/${currentUser.idUtilisateur}`, currentUser);
            setUsers(users.map(utilisateur => utilisateur.idUtilisateur === currentUser.idUtilisateur ? currentUser : utilisateur));
            handleClose();
        } catch (error) {
            console.error("Erreur lors de la modification de l'utilisateur :", error.response.data);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/utilisateur/${id}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting utilisateur:', error);
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
                        <th>Spécialité</th>
                        <th>Role</th>
                        <th>Etat</th>
                        <th>Crée à</th>
                        <th>Dernière connexion</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((utilisateur) => (
                        <tr key={utilisateur.idUtilisateur}>
                            <td >{utilisateur.idUtilisateur}</td>
                            <td >{utilisateur.fullName}</td>
                            <td >{utilisateur.email}</td>
                            <td >{utilisateur.telFix}</td>
                            <td >{utilisateur.telMobile}</td>
                            <td >{utilisateur.idSpecialite}</td>
                            <td >{utilisateur.roleUtilisateur}</td>
                            <td >{utilisateur.etatUtilisateur}</td>
                            <td >{utilisateur.createdAt}</td>
                            <td >{utilisateur.lastLogin}</td>
                            <td >
                                <Button variant="warning" className="mr-2" onClick={() => handleEditButtonClick(utilisateur)}>Modifier</Button>
                            </td>
                            <td text-align="center">
                                <Button variant="danger" onClick={() => handleDelete(utilisateur.idUtilisateur)}>Supprimer</Button>
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
                                {roleOptions.map((role) => (
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
                                {etatOptions.map((etat) => (
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
                    <Button variant="primary" onClick={isEditing ? handleEditUser : handleAddUser}>
                        {isEditing ? 'Modifier' : 'Ajouter'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Utilisateurs;
