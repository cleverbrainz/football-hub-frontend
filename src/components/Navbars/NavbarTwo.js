import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Box from '@material-ui/core/Box';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import ExploreSharpIcon from '@material-ui/icons/ExploreSharp';
import MoreIcon from '@material-ui/icons/MoreVert';
import SportsSoccerSharpIcon from '@material-ui/icons/SportsSoccerSharp';
import auth from '../../lib/auth'
import MobileMenu from '../MobileMenu'
import { useEffect, useState } from 'react';
import { withRouter, useHistory, Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    zIndex: theme.zIndex.drawer + 1,
    height: 80

  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  icon: {
    margin: '0 10px'
  }
}));

function NavbarTwo({ history }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const [filterDetails, setFilterDetails] = useState({
    location: {
      longitude: false,
      latitude: false 
    },
    timing: {
      days: {
        monday: false ,
        tuesday: false ,
        wednesday: false ,
        thursday: false ,
        friday: false ,
        saturday: false ,
        sunday: false 
      },
      times: {
        morning: false ,
        afternoon: false ,
        evening: false 
      }
    },
    age: {
      7: false ,
      8: false ,
      9: false ,
      10: false ,
      11: false ,
      12: false ,
      13: false ,
      14: false ,
      15: false ,
      16: false ,
      17: false ,
      18: false ,
      adults: false
    }
  })

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const mobileMenuId = 'primary-search-account-menu-mobile';

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link style={{color: '#000000de'}} to={`/${auth.getUserId()}/profile`}>
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      </Link>

      <MenuItem onClick={handleMenuClose}>Account Settings</MenuItem>

      <MenuItem style={{color: 'red'}} onClick={async () => {
        await auth.logOut()
        history.push('/')
      }}>Log out</MenuItem>
    </Menu>
  );



  return (
    <div className={classes.grow}>
      {/* <> */}
      <AppBar id='navbar-noscroll' color="inherit" position="fixed">
        <Toolbar>

            <Typography component='div'>
              <Box fontSize={23} fontWeight="fontWeightRegular" m={1}>
                <SportsSoccerSharpIcon style={{ transform: 'translateY(4.5px)', marginRight: '5px' }} />
                BALLERS HUB
              </Box>
            </Typography>

          <div className={classes.grow} />



          {auth.isLoggedIn() ? (
            <div className={classes.sectionDesktop}>
              <Link to={{
                pathname: '/companies',
                state: filterDetails
                }}>
                <IconButton className={classes.icon}>
                  <ExploreSharpIcon style={{ color: '#3d3d3d' }} />
                </IconButton>
              </Link>

              <Link to={`/${auth.getUserId()}/messages`}>
                <IconButton className={classes.icon}
                  aria-label="show 4 new mails" >
                  {/* <Badge badgeContent={4} color="secondary"> */}
                    <MailIcon style={{ color: '#3d3d3d' }} />
                  {/* </Badge> */}
                </IconButton>
              </Link>

              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
              >
                <AccountCircle style={{ color: '#3d3d3d' }} />
              </IconButton>
            </div>
          ) : (
              <div id="navbarBasicExample" className="navbar-menu">
                <div className="navbar-end">
                  <div className="navbar-item">
                    <div className="navbar-start">
                    </div>
                    <div className="buttons">
                      <button style={{ backgroundColor: '#3d3d3d' }} className="button is-link">
                        <Link style={{ color: 'white', }} to='/register'> Sign up </Link>
                      </button>
                      <button component={Link} to='/login' className="button is-light">
                        <Link style={{ color: 'black' }} to='/login'> Login </Link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>


            )}




          <div className={classes.sectionMobile}>
            <IconButton
              className={classes.icon}
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
            >
              <MoreIcon />
            </IconButton>
          </div>


        </Toolbar>
      </AppBar>
      {
        <MobileMenu
          handleMobileMenuClose={handleMobileMenuClose}
          mobileMoreAnchorEl={mobileMoreAnchorEl}
          isMobileMenuOpen={isMobileMenuOpen}
          setAnchorEl={setAnchorEl}
          setMobileMoreAnchorEl={setMobileMoreAnchorEl}
          mobileMenuId={mobileMenuId}
        />
      }
      {renderMenu}
    </div >
  );
}

export default withRouter(NavbarTwo)