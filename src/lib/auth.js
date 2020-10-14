import axios from 'axios'
const jwt = require('jsonwebtoken')


function setToken(token) {
  localStorage.setItem('token', token)
}

function isLoggedIn() {

  if (!localStorage.token) return false

  const decodedToken = jwt.decode(localStorage.token)

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('token')
  }
  return (localStorage.token)
}

function getToken() {
  return localStorage.getItem('token')
}

function logOut() {
  localStorage.removeItem('token')
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

export default {
  setToken,
  getToken,
  isLoggedIn,
  logOut,
  getUserId,
  // getUserInfo
}