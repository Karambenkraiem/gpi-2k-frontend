import React, { useContext } from "react";
import { UserContext } from "./Router";
import { useNavigate } from "react-router-dom";

export default function PrivateRoute({roles, Component}) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  console.log(roles, Component);
  if (roles.includes(user.roleUtilisateur))
    return (
      <div>
        <Component />
      </div>
    );
  else {
    navigate("/");
  }
}
