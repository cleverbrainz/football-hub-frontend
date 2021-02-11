import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box } from '@material-ui/core'
import SportsSoccerSharpIcon from '@material-ui/icons/SportsSoccerSharp';

const styles = {
  navBar: {
    zIndex: 100,
    height: 80,
    position: 'fixed',
    width: '100%',
    backgroundColor: 'transparent',
    transition: '0.3s',
    padding: window.innerWidth > 600 ? '0 40px' : 0
  },
  subContainer: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',

  },
  logo: {
    fontSize: '20px',
    color: 'black',
    letterSpacing: '2px'
  },
  menu: {
    backgroundColor: 'red'
  }
}



function HomeNav() {

  const [scrollPosition, setScrollPosition] = useState()

  useEffect(() => {
    const nav = document.querySelector('nav')

    window.addEventListener('scroll', () => {
      setScrollPosition(window.pageYOffset)

      if (scrollPosition > 340) {
        nav.style.backgroundColor = 'white'
        nav.style.boxShadow = '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.1), 0px 1px 10px 0px rgba(0,0,0,0.12)'
      } else {
        nav.style.backgroundColor = 'transparent'
        nav.style.boxShadow = ''
      }
    })
  })

  const handleBurgerMenu = () => {

    const burger = document.querySelector('.burger')
    const navItems = document.querySelector(`#${burger.dataset.target}`)

    burger.classList.toggle('is-active')
    navItems.classList.toggle('is-active')
  }


  return (
    <>
      <nav style={styles.navBar} className="navbar" role="navigation" aria-label="main navigation">
        <div style={styles.subContainer} className="navbar-brand">
          <Typography component='div'>
            <Box fontSize={23} fontWeight="fontWeightRegular" m={1}>
              <SportsSoccerSharpIcon style={{ transform: 'translateY(4.5px)', marginRight: '5px' }} />
              FT BALLER
              </Box>
          </Typography>

          <a onClick={handleBurgerMenu} role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span style={{ backgroundColor: 'black' }} aria-hidden="true"></span>
            <span style={{ backgroundColor: 'black' }} aria-hidden="true"></span>
            <span style={{ backgroundColor: 'black' }} aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">



          <div className="navbar-end">
            <div className="navbar-item">
              <div className="navbar-start">
              </div>

              {localStorage.version === 'United Kingdom' && <div className="buttons">
                <button style={{ backgroundColor: '#3d0F3d' }} className="button is-link">
                  <Link style={{ color: 'white', }} to='/register/player'>Register Player</Link>
                </button>
                <button style={{ backgroundColor: '#3d3d3d' }} className="button is-link">
                  <Link style={{ color: 'white', }} to='/register/trainer'>Register Company/Coach</Link>
                </button>
                <button component={Link} to='/login' className="button is-light">
                  <Link style={{ color: 'black' }} to='/login'> Login </Link>
                </button>
              </div>}

            </div>
          </div>
        </div>
      </nav>
    </>
  );
}


export default HomeNav
