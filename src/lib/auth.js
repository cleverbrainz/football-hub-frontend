import axios from 'axios'
import { firebaseApp } from './firebase'
const jwt = require('jsonwebtoken')


function setToken(token) {
  localStorage.setItem('token', token)
}

function isLoggedIn() {

  if (!localStorage.token) return false
  // if (localStorage.token === null) return false
  console.log(localStorage.token)

  const decodedToken = jwt.decode(localStorage.token)

  if (decodedToken.exp * 1000 < Date.now()) {
    firebaseApp.auth().currentUser.getIdToken().then(token => {
      localStorage.setItem('token', token)
    })
    // localStorage.removeItem('token')
    // localStorage.removeItem('category')
  }
  return true
}

function getToken() {
  return localStorage.getItem('token')
}

function logOut() {
  localStorage.removeItem('token')
  localStorage.removeItem('category')
  return firebaseApp.auth().signOut()
}

function getUserId() {
  const token = getToken()
  if (!token) return false
  const parts = token.split('.')
  return JSON.parse(atob(parts[1])).sub
}

// function getUserInfo() { 
//   axios.get(`/users/${getUserId()}`)
//     .then(res => res.data[0])
// }


function dobToAge(age) {
  let dobArr
  try {
    dobArr = age.split('-').map(Number)
  } catch {
    return NaN
  }
  
  console.log(dobArr)
  const millisecondsDOB = new Date(age)
  console.log({dobArr, millisecondsDOB})
  const millisecondsNow = new Date()
  const ageInMilliseconds = millisecondsNow-millisecondsDOB;
//--We will leverage Date.parse and now method to calculate age in milliseconds refer here https://www.w3schools.com/jsref/jsref_parse.asp

  const second = 1000;
  const minute = second*60;
  const hour = minute*60;
  const day = hour*24;
  const year = day*365;

  //let the age conversion begin
  const years = Math.round(ageInMilliseconds/year);
  return years
}

export default {
  setToken,
  getToken,
  isLoggedIn,
  logOut,
  getUserId,
  dobToAge
  // getUserInfo
}