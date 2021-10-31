import React from 'react'
import { Link } from 'react-router-dom'
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import auth from '../lib/auth';


const MobileMenu = ({ handleMobileMenuClose, mobileMoreAnchorEl,
  isMobileMenuOpen, setAnchorEl, setMobileMoreAnchorEl, mobileMenuId }) => {

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };


  return (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >

      {!auth.isLoggedIn() ? (
        <div>
          <MenuItem>
            <button style={{ backgroundColor: '#3d3d3d' }} className="button is-link">
              <Link style={{ color: 'white', }} to='/registerType'> Sign up </Link>
            </button>
          </MenuItem>
          <MenuItem>
            <button style={{width: '100%'}} component={Link} to='/login' className="button is-light">
              <Link style={{ color: 'black' }} to='/loginregister'> Login </Link>
            </button>
          </MenuItem>
        </div>
      ) : (
          <div>
            <MenuItem>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton>
              <p>Messages</p>
            </MenuItem>
            <MenuItem>
              <IconButton color="inherit">
                <Badge badgeContent={1} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
              <IconButton
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <p>Profile</p>
            </MenuItem>
          </div>
        )}
    </Menu>
  )
}


export default MobileMenu
