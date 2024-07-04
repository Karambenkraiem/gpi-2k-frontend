import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { createContext, useEffect, useState } from "react";
import Main from "../apps/Main";
import Auth from "../apps/Auth";
import Login from "../pages/Login";
import ForgetPassword from "../pages/ForgetPassword";
import Accueil from "../pages/Accueil";
import Utilisateurs from "../pages/Utilisateurs/Utilisateurs";
import Utilisateur from "../pages/Utilisateurs/Utilisateur";
import Materiel from "../pages/Materiel";
import Spécialité from "../pages/Spécialité";
import Département from "../pages/Département";
// @ts-ignore
import DetailsMateriel from "../pages/DetailsMateriel";
import Affectation from "../pages/Affectation";
import Emprunt from "../pages/Emprunt";
import Stocks from "pages/Stocks";
import Logiciels from "pages/Logiciels";
import DetailsStock from "pages/DetailsStock";
import Alimentations from "pages/Alimentations";
import Consommations from "pages/Consommations";
import Societe from "pages/Societe";
import DetailsLogiciel from "pages/DetailsLogiciel";
import DetailsSociete from "pages/DetailsSociete";
import Installations from "pages/Installations";
import InstallationsArchives from "pages/InstallationsArchives";
import IncidentUtilisateur from "pages/IncidentUtilisateur";
import IncidentAdmin from "pages/IncidentAdmin";
import Contrat from "pages/Contrat";
import Signature from "pages/Signature";
import DetailsContrat from "pages/DetailsContrat";
import { getWithHeaders } from "helpers/axiosWithHeaders";
import { Spinner } from "react-bootstrap";
import PrivateRoute from "./PrivateRoute";
export const UserContext = createContext(null);
export default function Router() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token)
      getWithHeaders("/auth/my-info").then((res) => {
        setUser(res?.data);
        setLoading(false);
      });
    else {
      setLoading(false);
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {loading ? (
        <div className="position-fixed d-flex align-items-center justify-content-center w-100 h-100">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <BrowserRouter>
          {user ? (
            <Routes>
              <Route element={<Main />} path="/">
                <Route index element={<Accueil />} />
                <Route
                  path="/utilisateurs"
                  element={
                    <PrivateRoute
                      roles={["ADMINISTRATEUR","TECHNICIEN"]}
                      Component={Utilisateurs}
                    />
                  }
                />
                <Route
                  path="/utilisateur/:idUtilisateur"
                  element={<Utilisateur />}
                />
                <Route path="/materiel" element={<Materiel />} />
                <Route
                  path="/detailMateriel/:numeroSerie"
                  element={<DetailsMateriel />}
                />
                <Route path="/specialite" element={<Spécialité />} />
                <Route path="/departement" element={<Département />} />
                <Route path="/affectation" element={<Affectation />} />
                <Route path="/emprunt" element={<Emprunt />} />
                <Route path="/stocks" element={<Stocks />} />
                <Route
                  path="/detailsStock/:refArt"
                  element={<DetailsStock />}
                />
                <Route path="/logiciels" element={<Logiciels />} />
                <Route path="/alimentations" element={<Alimentations />} />
                <Route path="/consommations" element={<Consommations />} />
                <Route path="/societes" element={<Societe />} />
                <Route
                  path="/detailsLogiciel/:idLogiciel"
                  element={<DetailsLogiciel />}
                />
                <Route
                  path="/detailsSociete/:idSociete"
                  element={<DetailsSociete />}
                />
                <Route
                  path="/installations/encours"
                  element={<Installations />}
                />
                <Route
                  path="/installations/archives"
                  element={<InstallationsArchives />}
                />
                <Route
                  path="/incidents/utilisateur"
                  element={<IncidentUtilisateur />}
                />
                <Route
                  path="/incidents/administrateur"
                  element={<IncidentAdmin />}
                />
                <Route path="/contrats" element={<Contrat />} />
                <Route
                  path="/detailsContrat/:idContrat"
                  element={<DetailsContrat />}
                />

                <Route path="/signature" element={<Signature />} />
              </Route>
              <Route path="*" element={<div>404</div>} />
            </Routes>
          ) : (
            <Routes>
              <Route element={<Auth />} path="/">
                <Route index element={<Login />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
              </Route>
            </Routes>
          )}
        </BrowserRouter>
      )}
    </UserContext.Provider>
  );
}
