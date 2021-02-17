import React, { useState, useEffect, useContext } from 'react'
import { withRouter, useLocation } from 'react-router-dom';
import { AuthContext } from '../lib/context';
import HomeNav from './Navbars/HomeNav'
import NavTwo from './Navbars/NavbarTwo'

function Navbar() {

  const location = useLocation();
  const [pathName, setPathName] = useState('/')
  const [loggedIn, setLoggedIn] = useState(false)
  const authUser = useContext(AuthContext)
  console.log(authUser)

  useEffect(() => {
    setPathName(location.pathname)
    console.log((authUser.user))
    if (!authUser.user.checked) return
    console.log('checked Nav')
    setLoggedIn(authUser.user !== null ? authUser.user.user !== null ? true : false : false)
  }, [location.pathname, authUser.user])

  console.log('nav', loggedIn)
  if (!authUser.user.checked) return null
  return (
    <>
      {pathName === '/' ? (
        <HomeNav loggedIn={loggedIn}/>
      ) : (
          <NavTwo loggedIn={loggedIn}/>
        )}
    </>
  )
}

export default withRouter(Navbar)