import React, { useEffect, useState } from 'react';
import { Link, withRouter, useLocation } from 'react-router-dom';
import { buttons, profile } from '../../korean/LanguageSkeleton'
import { Typography, Box, Button } from '@material-ui/core'
import auth from '../../lib/auth';

let styles = {
  navBar: {
    zIndex: 100,
    height: 80,
    position: 'fixed',
    width: '100%',
    transition: '0.3s',
    padding: window.innerWidth > 600 ? '0 30px' : 0,
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.1), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    backgroundColor: 'white'
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
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    // display: 'none'
  },
  roundedContainer: {
    width: '33%',
    // display: 'none'
  },
  rounded: {
    borderTop: '3px solid rgb(49, 1, 247)',
    borderRadius: '5px',
    width: '100%',
    margin: '15px 0 15px 0',
    
  },
  button: {
    fontSize: '12px',
    letterSpacing: '2px',
    padding: '.5rem 1rem'
  }
}



function NavBarKorea({ history, locale, user }) {

  const location = useLocation()
  const [scrollPosition, setScrollPosition] = useState()
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  // console.log(user)
  // console.log(location)
  
  
  

  useEffect(() => {
    // window.addEventListener('resize', () => {
    //   setScreenWidth(window.innerWidth)
    // })

    // if (screenWidth < 1023) {
    //   styles = { ...styles, buttonContainer: { ...styles.buttonContainer, display: 'flex'} }
    // } else {
    //   styles = { ...styles, buttonContainer: { ...styles.buttonContainer, display: 'none'} }
    // }
  })

  const handleBurgerMenu = ({ user }) => {


    const burger = document.querySelector('.burger')
    const navItems = document.querySelector(`#${burger.dataset.target}`)

    burger.classList.toggle('is-active')
    navItems.classList.toggle('is-active')
  }

  const mobileLogOut = () => {

    const burger = document.querySelector('.burger')
    const navItems = document.querySelector(`#${burger.dataset.target}`)

    burger.classList.toggle('is-active')
    navItems.classList.toggle('is-active')

    auth.logOut()
  }

  const mobileRedirect = (destination) => {

    const burger = document.querySelector('.burger')
    const navItems = document.querySelector(`#${burger.dataset.target}`)

    burger.classList.toggle('is-active')
    navItems.classList.toggle('is-active')
    
    history.push(destination)
    

  }


  return (
    <>
      <nav style={styles.navBar} className="navbar" role="navigation" aria-label="main navigation">
        <div style={styles.subContainer} className="navbar-brand">
          <Typography component='div'>
            <Box fontSize={23} fontWeight="fontWeightRegular" m={1.2}>
              <svg width="160" height="30" viewBox="0 0 2529 557" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2493.52 492.636C2512.76 492.636 2528.35 477.043 2528.35 457.809V457.809C2528.35 438.574 2512.76 422.981 2493.52 422.981V422.981C2474.29 422.981 2458.7 438.574 2458.7 457.809V457.809C2458.7 477.043 2474.29 492.636 2493.52 492.636V492.636Z" fill="#3101F7" />
                <path d="M836.169 492.636V283.464H870.299V222.029H836.169V213.74C836.169 191.311 846.408 185.948 867.374 185.948H870.299V125H859.085C772.783 125 755.23 165.957 755.23 210.814V222.029H725V283.464H755.23V492.636H836.169Z" fill="black" />
                <path d="M1027.03 492.636V283.464H1066.04V222.029H1027.03V131.826H946.095V222.029H906.114V283.464H946.095V492.636H1027.03Z" fill="black" />
                <path d="M1183.35 492.636V463.869H1184.32C1196.51 486.785 1229.18 501.9 1261.85 501.9C1345.22 501.9 1398.37 439.002 1398.37 355.626C1398.37 265.423 1334.01 212.765 1263.8 212.765C1235.52 212.765 1208.21 220.566 1186.76 243.482V131.826H1105.82V492.636H1183.35ZM1249.66 426.325C1212.11 426.325 1183.83 396.583 1183.83 356.601C1183.83 319.057 1213.09 288.34 1250.63 288.34C1289.64 288.34 1317.43 321.008 1317.43 357.089C1317.43 396.095 1287.69 426.325 1249.66 426.325Z" fill="black" />
                <path d="M1713.52 492.636V222.029H1632.58V250.796H1631.61C1616.01 225.929 1585.29 212.765 1552.13 212.765C1474.61 212.765 1416.58 277.125 1416.58 357.089C1416.58 439.002 1472.17 501.9 1552.13 501.9C1587.73 501.9 1619.91 487.273 1631.61 463.381H1632.58V492.636H1713.52ZM1564.81 426.325C1527.27 426.325 1497.52 395.608 1497.52 358.064C1497.52 319.057 1526.78 288.34 1563.83 288.34C1601.87 288.34 1632.58 319.057 1632.58 357.089C1632.58 396.095 1602.84 426.325 1564.81 426.325Z" fill="black" />
                <path d="M1841.26 492.636V131.826H1760.32V492.636H1841.26Z" fill="black" />
                <path d="M1966.15 492.636V131.826H1885.21V492.636H1966.15Z" fill="black" />
                <path d="M2278.26 381.955C2279.73 374.642 2280.21 368.303 2280.21 360.502C2280.21 276.638 2218.29 212.765 2137.35 212.765C2057.88 212.765 1995.47 280.051 1995.47 358.064C1995.47 438.515 2060.8 501.413 2138.81 501.413C2195.86 501.413 2245.11 466.795 2270.95 407.797H2188.06C2174.9 424.863 2160.76 433.151 2138.81 433.151C2105.66 433.151 2079.82 412.673 2075.43 381.955H2278.26ZM2076.4 327.346C2082.74 298.579 2108.1 281.026 2137.35 281.026C2168.56 281.026 2192.94 299.554 2199.27 327.346H2076.4Z" fill="black" />
                <path d="M2391.13 492.636V343.436C2391.13 312.719 2406.73 294.678 2455 294.191V212.765C2423.8 212.765 2401.37 222.029 2387.23 250.796H2386.25V222.029H2310.19V492.636H2391.13Z" fill="black" />
                <path d="M369.699 17.034C369.987 17.034 370.275 17.3227 370.275 17.3227C413.785 32.3357 459.6 60.9181 476.312 106.246C481.211 119.527 482.94 134.54 479.194 148.398C477.177 156.77 472.855 164.854 465.939 169.762C461.041 173.227 455.278 174.959 449.515 175.825C386.7 184.487 349.529 106.823 314.952 67.5585C283.256 31.7583 240.611 5.48552 191.338 14.1469C219.288 5.77423 247.526 0 276.629 0C308.613 0.288712 339.732 6.64037 369.699 17.034Z" fill="#3101F7" />
                <path d="M168.281 556.925C198.358 556.925 222.741 532.495 222.741 502.359C222.741 472.223 198.358 447.792 168.281 447.792C138.204 447.792 113.822 472.223 113.822 502.359C113.822 532.495 138.204 556.925 168.281 556.925Z" fill="#3101F7" />
                <path d="M465.07 553.46C426.747 564.432 386.983 547.975 353.558 530.364C317.54 511.309 284.404 484.458 254.437 457.031C253.861 456.453 253.284 455.876 252.708 455.299C235.996 439.997 219.86 423.54 201.995 409.393C184.13 395.247 163.96 383.409 141.772 377.924C121.891 373.304 99.9916 375.037 84.72 390.05C68.5839 405.929 63.3973 429.603 66.855 451.545C66.855 451.545 29.3963 410.26 27.6674 358.869C26.803 331.441 36.3118 304.014 54.4648 283.804C71.4653 265.038 95.3813 252.912 120.45 250.313C153.298 246.849 186.435 259.841 213.232 279.184C246.945 303.436 272.014 337.216 297.658 369.263C321.574 399 346.355 427.582 372.576 455.299C395.627 480.128 423.865 508.71 458.155 516.217C480.342 520.836 496.478 517.949 508.58 511.309C508.58 511.309 496.19 544.51 465.07 553.46Z" fill="#3101F7" />
                <path d="M48.7044 103.647C70.8915 88.0561 97.977 79.3948 125.639 76.219C148.402 73.6206 171.454 75.0641 193.641 80.8383C232.828 90.9433 267.694 113.463 298.813 139.447C331.374 166.874 359.324 199.499 391.884 226.638C415.224 245.981 455.564 274.853 486.107 254.931C523.278 230.391 516.65 169.184 516.65 169.184C533.651 205.85 546.329 246.27 544.888 286.978C543.736 319.603 531.634 358.868 499.65 373.303C498.497 373.881 497.633 374.169 496.48 374.747C476.31 382.253 453.835 377.056 433.953 368.395C391.308 349.918 356.154 317.871 321.865 286.401C294.491 261.572 267.694 235.876 238.303 213.357C208.624 190.26 176.352 170.339 140.046 159.657C119.588 153.594 97.6889 150.707 76.3662 153.016C61.6708 154.46 47.5518 158.502 34.009 164.853C21.0425 170.628 10.0931 180.155 0.00802981 189.971C-0.280114 170.05 7.21163 150.418 18.4492 134.25C26.8054 121.835 37.1786 111.73 48.7044 103.647Z" fill="#3101F7" />
              </svg>
            </Box>
          </Typography>

          { (location.pathname !== '/authentication') &&

          <a onClick={handleBurgerMenu} role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span style={{ backgroundColor: 'black' }} aria-hidden="true"></span>
            <span style={{ backgroundColor: 'black' }} aria-hidden="true"></span>
            <span style={{ backgroundColor: 'black' }} aria-hidden="true"></span>
          </a>
        }
        </div>

        <div id="navbarBasicExample" className="navbar-menu">



          <div className="navbar-end">
            <div className="navbar-item">
              <div className="navbar-start">
              </div>

              {
                location.pathname === '/' ?  
                <div style={styles.buttonContainer} className='buttonContainer'><Button
                onClick={() => mobileRedirect('/authentication')} variant="outlined" style={styles.button} 
                > {buttons['4'][locale]} </Button></div> :
                location.pathname === '/dashboard' ?
                <Button variant="outlined" style={styles.button} color='secondary' onClick={() => mobileLogOut()}>{profile['2d'][locale]}</Button>
                :
                

                location.pathname !== '/authentication' ?
                <div style={styles.buttonContainer} className='buttonContainer'>
                <Button variant="outlined" style={styles.button} onClick={() => mobileRedirect(location.pathname + '/two-factor')}>{profile['2b'][locale]}</Button>
                <div style={styles.roundedContainer} className='roundedContainer'>
                <hr style={styles.rounded}/>
                </div>
                <Button  variant="outlined"  style={styles.button} color='secondary' onClick={() => mobileLogOut()}>
                  {profile['2d'][locale]}
                </Button>
                </div>
                :
                
                null
                }
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}


export default withRouter(NavBarKorea)
