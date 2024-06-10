import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import React from "react";
import Main from "../apps/Main";
import Auth from "../apps/Auth";
import Login from "../pages/Login";
import ForgetPassword from "../pages/ForgetPassword";
import Accueil from '../pages/Accueil'
import Utilisateurs from '../pages/Utilisateurs/Utilisateurs';
import Utilisateur from "../pages/Utilisateurs/Utilisateur";
import Materiel from "../pages/Materiel";


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
