// @ts-ignore
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { RxDividerVertical } from "react-icons/rx";
import UtilisateurModal from "../components/UtilisateurModal";
import { ip } from "constants/ip";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import NoAccountsOutlinedIcon from "@mui/icons-material/NoAccountsOutlined";
import LockPersonOutlinedIcon from "@mui/icons-material/LockPersonOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { UserContext } from "router/Router";
import { patchWithHeaders } from "helpers/axiosWithHeaders";

const Monprofile = () => {
  const { idUtilisateur } = useParams();

  const [users, setUsers] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const { user, setUser } = useContext(UserContext);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    validate(name, value);
  };

  const handleBlockUser = () => {
    if (!user) {
      console.error("Données Introuvable !!!");
      return;
    }

    let newStatus;
    switch (user.etatUtilisateur) {
      case "actif":
      case "inactif":
        newStatus = "suspendu";
        break;
      case "suspendu":
        break;
      default:
        newStatus = "actif";
    }

    const updatedUser = {
      ...user,
      // @ts-ignore
      etatUtilisateur: newStatus,
    };
  };
  const handleEdit = () => {
    setCurrentUser(user);
    setModalOpen(true);
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
      console.error("Veuillez remplir tous les champs obligatoires!");
      return;
    }
    // @ts-ignore
    const { Specialite, ...rest } = userToSave;
    patchWithHeaders("/auth/update-info", rest)
      .then((response) => {
        localStorage.setItem("token", response.data);
        window.location.href = "/monprofile";
      })
      .catch((error) => {
        console.error("Problème modification Utilisateur", error);
      });
  };

  const formattedDateCreated = new Date(user.createdAt).toLocaleDateString(
    "fr-FR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  const formattedDateLogin = user.lastLogin
    ? new Date(user.lastLogin).toLocaleDateString("fr-FR")
    : "-";

  if (!user) {
    return <div>User not found.</div>;
  }
  return (
    <div>
      <h1>Profile Utilisateur</h1>

      <section style={{ backgroundColor: "#eee" }}>
        <Container className="py-4">
          <Button
            onClick={() => navigate(-1)}
            variant="contained"
            color="primary"
            startIcon={<ReplyAllIcon />}
            style={{
              marginBottom: 16,
              backgroundColor: "#3B71CA",
              color: "white",
            }}
          >
            <ReplyAllIcon /> Back
          </Button>
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
                  <Button
                    title="Modifier Utilisateur"
                    onClick={handleEdit}
                    disabled={user.etatUtilisateur === "suspendu"}
                  >
                    <EditNoteIcon />
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
                          formattedDateCreated
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
                        {
                          // @ts-ignore
                          formattedDateLogin
                        }
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <UtilisateurModal
          isProfile={true}
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

export default Monprofile;
