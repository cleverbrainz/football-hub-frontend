import { zhCN } from 'date-fns/esm/locale'
import React, { useEffect, useState, createContext, useMemo } from 'react'
import auth from './auth'
import { firebaseApp } from './firebase'


export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    'user': null,
    'checked': false
  })
  const [userData, setUserData] = useState({})

  console.log(user)
  
  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(function(user){
      console.log('authchange!!!')
      console.log(user)
      console.log(firebaseApp.auth().currentUser)
      if(user !== null){
        user.getIdToken().then(token => {
          console.log(token)
          auth.setToken(token)
          setUser({
            'user': user,
            'userId': user.uid,
            'checked': true
          });
        });
      }else{
        setUser({
          'user': null,
          'checked': true
        });
      }
    });
  }, [])

  return (
    <AuthContext.Provider value={{user, userData, setUserData}}>{children}</AuthContext.Provider>
  )
}