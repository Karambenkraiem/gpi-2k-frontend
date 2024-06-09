import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Utilisateur() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [state, setState] = useState(); // => x=[state,setState] => x[0]=state x[1]=setState state=x[0]
  // distraction
  useEffect(() => {
    axios.get("http://localhost:3000/utilisateur/" + id).then((res) => {
      setUser(res.data);
    });
  }, [user]); // exucution automatique des instructions (did mount) (will update)
  return(
     <div>
      {user?.fullName}
     </div>
    );
}
