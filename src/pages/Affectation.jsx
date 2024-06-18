// @ts-ignore
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Breadcrumb, Button, Card, Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { VscActivateBreakpoints } from "react-icons/vsc";
import { LuClipboardEdit } from "react-icons/lu";
import { RxDividerVertical } from "react-icons/rx";


const Affectation = () => {
  const { idUtilisateur } = useParams();
  const [user, setUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const validate = (name, value) => {
    let errorMsg = "";
    if (name === "idUtilisateur" && !value) {
      errorMsg = "Matricule est obligatoire !!!";
    } else if (name === "fullName" && !value) {
      errorMsg = "Nom & Prénom est obligatoire";
    } else if (name === "password" && !value) {
      errorMsg = "Mot de Passe est obligatoire";
    } else if (name === "email" && (!value || !/\S+@\S+\.\S+/.test(value))) {
      errorMsg = "Email n'est pas valide";
    } else if (name === "idSpecialite" && !value) {
      errorMsg = "Specialité est obligatoire";
    } else if (name === "roleUtilisateur" && !value) {
      errorMsg = "Role est obligatoire";
    } else if (name === "etatUtilisateur" && !value) {
      errorMsg = "Etat est obligatoire";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };
  //Code pour switch activer désactiver compte fonctionnel
  // const [checkedSwitch, setCheckedSwitch] = React.useState(true);

  // const handleChangeSwitch = (event) => {
  //   setCheckedSwitch(event.target.checked);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    validate(name, value);
  };

  const fetchUser = () => {
    axios
      .get(`http://localhost:3000/utilisateur/${idUtilisateur}`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur recupération données !!!", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUser();
  }, [idUtilisateur]);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:3000/utilisateur/${idUtilisateur}`)
      .then(() => {
        navigate(`/utilisateur`);
      })
      .catch((error) => {
        console.error("Erreur suppression Utilisateur", error);
      });
  };
  const handleEdit = () => {
    setCurrentUser(user);
    setModalOpen(true);
  };

  const toggleStatus = () => {
    if (!user) {
      console.error("Données Introuvable !!!");
      return;
    }
    const updatedUser = {
      ...user,
      // @ts-ignore
      etatUtilisateur: user.etatUtilisateur === "actif" ? "inactif" : "actif",
    };
    axios
      .patch(`http://localhost:3000/utilisateur/${idUtilisateur}`, updatedUser)
      .then(() => {
        fetchUser();
      })
      .catch((error) => {
        console.error("Erreur Mise à jours etat utilisateur !!!", error);
      });
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSave = () => {
    const userToSave = {
      ...currentUser,
      // @ts-ignore
      idUtilisateur: parseInt(currentUser.idUtilisateur, 10),
    };
    const hasErrors = Object.values(errors).some((errorMsg) => errorMsg);
    if (hasErrors) {
      console.error(
        "Il y  a des champs obligatoire veuillez les remplir SVP !!!"
      );
      return;
    }
    // @ts-ignore
    const { Specialite, ...rest } = userToSave;
    axios
      .patch(
        `http://localhost:3000/utilisateur/${userToSave.idUtilisateur}`,
        rest
      )
      .then((response) => {
        setUsers(
          users.map((user) =>
            user.idUtilisateur === userToSave.idUtilisateur
              ? response.data
              : user
          )
        );
        handleModalClose();
        fetchUser();
      })
      .catch((error) => {
        console.error("Problème modification Utilisateur", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <div>User not found.</div>;
  }
  return (
    <div>
      <h1>Profile Utilisateur</h1>

      <section style={{ backgroundColor: "#eee" }}>
        <Container className="py-4">
          <Row>
            <Col>
              <Breadcrumb className="bg-body-tertiary rounded-3 p-3 mb-4">
                <Breadcrumb.Item href="/">Accueil</Breadcrumb.Item>
                <Breadcrumb.Item href="/utilisateurs">
                  Utilisateurs
                </Breadcrumb.Item>
                <Breadcrumb.Item active aria-current="page">
                  Profile Utilisateur
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <Card className="mb-6">
                <Card.Body className="text-left">
                  <h4 className="my-3">
                    <b>
                      {
                        // @ts-ignore
                        user?.fullName
                      }
                    </b>
                  </h4>
                  <h5 className="my-3">
                    Matricule:{" "}
                    {
                      // @ts-ignore
                      user?.idUtilisateur
                    }
                  </h5>
                  <p className="text-muted mb-1">
                    <b>Email:</b>{" "}
                    {
                      // @ts-ignore
                      user?.email
                    }
                  </p>
                  <p className="text-muted mb-1">
                    <b>Specialilté:</b>{" "}
                    {
                      // @ts-ignore
                      user?.Specialite?.nom
                    }
                  </p>
                  <p className="text-muted mb-1">
                    <b>Departement:</b>{" "}
                    {
                      // @ts-ignore
                      user?.Specialite?.Departement?.nom
                    }
                  </p>
                  <p className="text-muted mb-1">
                    <b>Role:</b>{" "}
                    {
                      // @ts-ignore
                      user?.roleUtilisateur
                    }
                  </p>
                  <p className="text-muted mb-1">
                    <b>Etat: </b>
                    {
                      // @ts-ignore
                      user?.etatUtilisateur
                    }
                  </p>
                  <p className="text-muted mb-0">
                    <b>Tel Fix:</b>{" "}
                    {
                      // @ts-ignore
                      user?.telFix
                    }
                  </p>
                  <p className="text-muted mb-0">
                    <b>Tel Mobile:</b>{" "}
                    {
                      // @ts-ignore
                      user?.telMobile
                    }
                  </p>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="text-center">
                  <Button onClick={handleEdit}>
                    <LuClipboardEdit />
                  </Button>
                  <RxDividerVertical />
                  {/* <Switch
                    checked={checkedSwitch}
                    onChange={handleChangeSwitch}
                    onClick={toggleStatus}
                    inputProps={{ "aria-label": "controlled" }}
                  /> */}
                  <Button onClick={toggleStatus}>
                    <VscActivateBreakpoints />
                  </Button>
                  <RxDividerVertical />
                  <Button onClick={handleDelete} className="btn btn-danger">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                    </svg>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="mb-4">
                <Card.Body>
                  <Row>
                    <Col sm={3}>
                      <p className="mb-0">Crée à</p>
                    </Col>
                    <Col sm={9}>
                      <p className="text-muted mb-0">
                        {
                          // @ts-ignore
                          user.createdAt
                        }
                      </p>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm={3}>
                      <p className="mb-0">Dernière connexion</p>
                    </Col>
                    <Col sm={9}>
                      <p className="text-muted mb-0">
                        {// @ts-ignore
                        user.lastLogin || "N/A"}
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <UtilisateurModal
          open={modalOpen}
          handleClose={handleModalClose}
          isEditing={true}
          currentUser={currentUser}
          handleChange={handleChange}
          handleSave={handleSave}
          errors={errors}
        />
      </section>
    </div>
  );
};

export default Affectation;