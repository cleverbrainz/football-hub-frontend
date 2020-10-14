import React, { useState, useEffect } from 'react'
import { withRouter, useLocation } from 'react-router-dom';
import HomeNav from './Navbars/HomeNav'
import NavTwo from './Navbars/NavbarTwo'

function Navbar() {

  const location = useLocation();
  const [pathName, setPathName] = useState('/')

  useEffect(() => setPathName(location.pathname), [location])

  return (
    <>
      {pathName === '/' ? (
        <HomeNav />
      ) : (
          <NavTwo />
        )}
    </>
  )
}

export default withRouter(Navbar)