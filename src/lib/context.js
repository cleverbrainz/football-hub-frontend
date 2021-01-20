import React, { useEffect, useState, createContext, useMemo } from 'react'
import auth from './auth'
import { firebaseApp } from './firebase'


export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState({})
  
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


  const value = useMemo(() => ({
    user,
    userData,
    setUserData,
  }), [user, userData])

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}