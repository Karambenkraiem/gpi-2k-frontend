import { BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";
import Main from "../apps/Main";
import Auth from "../apps/Auth";
import Login from "../pages/Login";
import ForgetPassword from "../pages/ForgetPassword";
import Accueil from '../pages/Accueil'
import Utilisateurs from '../pages/Utilisateurs/Utilisateurs';
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


export default function Router() {
  const user = true;
  return (
    <BrowserRouter>
      {user ? (
        <Routes>
          <Route element={<Main />} path="/">
            <Route index element={<Accueil />} />
            <Route path="/utilisateurs" element={<Utilisateurs />} />
            <Route path="/utilisateur/:idUtilisateur" element={<Utilisateur />} />
            <Route path="/materiel" element={<Materiel />} />
            <Route path="/detailMateriel/:numeroSerie" element={<DetailsMateriel />} />
            <Route path="/specialite" element={<Spécialité />} />
            <Route path="/departement" element={<Département />} />
            <Route path="/affectation" element={<Affectation />} />
            <Route path="/emprunt" element={< Emprunt/>} />
            <Route path="/stocks" element={< Stocks/>} />
            <Route path="/detailsStock/:refArt" element={<DetailsStock />} />
            <Route path="/logiciels" element={< Logiciels/>} />            
            <Route path="/alimentations" element={< Alimentations/>} />
            <Route path="/consommations" element={< Consommations/>} />
            <Route path="/societes" element={< Societe/>} />
            <Route path="/detailsLogiciel/:idLogiciel" element={< DetailsLogiciel/>} />
            <Route path="/detailsSociete/:idSociete" element={< DetailsSociete/>} />
            <Route path="/installations/encours" element={< Installations/>} />
            <Route path="/installations/archives" element={< InstallationsArchives/>} />



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
  );
}
