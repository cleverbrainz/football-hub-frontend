import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  navBar: {
    height: 80,
    position: 'fixed',
    width: '100%',
    backgroundColor: 'transparent',
    transition: '0.3s'
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
          <a style={styles.logo} className="navbar-item"> BALLERS HUB </a>
          <a onClick={handleBurgerMenu} role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span style={{ backgroundColor: 'black'}} aria-hidden="true"></span>
            <span style={{ backgroundColor: 'black'}} aria-hidden="true"></span>
            <span style={{ backgroundColor: 'black'}} aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">



          <div className="navbar-end">
            <div className="navbar-item">
              <div className="navbar-start">
                {/* <div className="navbar-item has-dropdown is-hoverable">
                  <a className="navbar-link"> Hub </a>

                  <div className="navbar-dropdown">
                    <a className="navbar-item"> Our mission </a>
                    <a className="navbar-item"> About us </a>
                  </div>
                </div> */}
              </div>
              <div className="buttons">
                <button style={{backgroundColor: '#3d3d3d'}} className="button is-link">
                  <Link style={{ color: 'white',  }} to='/register'> Sign up </Link>
                </button>
                <button component={Link} to='/login' className="button is-light">
                  <Link style={{ color: 'black' }} to='/login'> Login </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}


export default HomeNav
