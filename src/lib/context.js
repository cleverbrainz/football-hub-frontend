import React, { useEffect, useState, createContext, useMemo } from 'react'
import auth from './auth'
import { firebaseApp } from './firebase'
import * as firebase from "firebase";


export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    'user': null,
    'checked': false
  })
  const [userData, setUserData] = useState({})

  const appAuth = firebaseApp.auth()
  const phoneAuthProvider = new firebase.auth.PhoneAuthProvider(appAuth);
  const recaptchaVerifier = (container, params) => {
    return new firebase.auth.RecaptchaVerifier(container, params, firebaseApp)
  }

  console.log(user)
  
  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(function(user){
      // console.log('authchange!!!')
      // console.log(user)
      // console.log(firebaseApp.auth().currentUser)
      // if (user !== null) {
      if (user !== null && user.emailVerified) {
        user.getIdToken().then(token => {
          // console.log(token)
          auth.setToken(token)
          setUser({
            'user': user,
            'userId': user.uid,
            'checked': true
          });
        });
    } else {
      // console.log('no user')
      setUser({
        'user': null,
        'checked': true
      });
      setUserData({})
    }
    });
  }, [])

  return (
    <AuthContext.Provider value={{user, userData, setUserData, appAuth, phoneAuthProvider, recaptchaVerifier}}>{children}</AuthContext.Provider>
  )
}