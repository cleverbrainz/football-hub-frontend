import React, { useState, useEffect } from 'react'
import { Link, withRouter, useHistory } from 'react-router-dom';
import HomeNav from './Navbars/HomeNav'
import NavTwo from './Navbars/NavbarTwo'


function Navbar() {

  const history = useHistory()
  const [pathName, setPathName] = useState('/')

  useEffect(() => {
    return history.listen((location) => {
      setPathName(location.pathname)
    })
  }, [history])

  



  return (
    <>
    
        <NavTwo />
 

    </>
  )
}

export default withRouter(Navbar)