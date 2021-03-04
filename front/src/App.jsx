import React, {useState, useEffect} from 'react'
import {LoginForm} from "./App/LoginForm";
import { apiFetch} from "./utils/Api";
import {Site} from "./App/Site";

export default function App() {

    const [user, setUser] = useState(null)
    useEffect(function(){
            apiFetch('/me')
                .then(setUser)
                .catch(() =>setUser(false))
    }, [])

    if (user === null){
        return null
    }

  return (
    user ? <Site/> : <LoginForm  onConnect={setUser}/>
  );
}


