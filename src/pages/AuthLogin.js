import React, { useContext } from "react";
import firebase from "firebase";
import { FirebaseAuth } from "react-firebaseui";
import { AuthContext } from "../lib/context";
import { Redirect } from "react-router-dom";


export default function SignIn() {
  //get the user state from the context
  const { user } = useContext(AuthContext);
  //this is our config for FirebaseAuth
  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccess: () => false,
    },
  };

//if user exists or signed in, we redirect the page to home, else display the sign in methods with FirebaseAuth
  return (
    <div>
      {!!user.user ? !!user.user.category ? (
        <Redirect to={{ pathname: "/accountSetUp" }} />
      ) : (
        user.category === 'company' ? <Redirect to={{ pathname: "/tester" }} /> : user.category === 'coach' ? <Redirect to={{ pathname: "/testercoach" }} /> : <Redirect to={{ pathname: "/home" }} />
      ) : (
        <div>
          <p>Please Sign In</p>
          <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      )}
    </div>
  );
}