import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import axios from 'axios'

import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Button
} from '@material-ui/core';

import {
  Menu,
  ChevronLeft,
  ChevronRight,
  BubbleChartSharp,
  ForumSharp,
  EventNoteSharp,
  FormatListNumberedSharp,
  SupervisorAccountSharp
} from '@material-ui/icons';

import auth from '../lib/auth'
// import { AuthContext } from '../lib/context'

// import {
//   Summary,
//   Coaches,
//   Listings,
//   Sessions,
//   Messages
// } from '../components/Dashboard'

import Summary from '../components/Dashboard/Summary'
import Messages from '../components/Dashboard/CompanyMessages'
import Listings from '../components/Dashboard/Listings'
// import Coaches from '../components/Dashboard/Coaches'
// import Coaches from '../pages/admin/Coaches'
import CoachPageBeta from '../pages/admin/CoachPageBeta'
import Sessions from '../components/Dashboard/Sessions'
import Requests from '../pages/Requests'
import Profile from './Profile'
import CompanyPageBeta from './admin/CompanyPageBeta';
import CoachSessions from '../components/Dashboard/CoachSessions';
import CompanyAddCoach from './CompanyAddCoach';

const drawerWidth = 240;


const useStyles = makeStyles((theme) => ({
  root: {
    // display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: 0,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    height: 80
  },
  content: {
    flexGrow: 1,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: `${100 - ((73 / window.innerWidth) * 100)}%`,
      float: 'right'
    },

  },
  contentLayout: {
    display: 'flex',
    justifyContent: 'space-between',
    height: 80
  },
  greeting: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
}));


export default function CoachProfile({ history }) {
  const profileId = auth.getUserId()
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null)
  const [selectedComponent, setSelectedComponent] = useState('Summary');
  const [componentTabValue, setComponentTabValue] = useState(0)

  const [drawerItems, setDrawerItems] = useState({
    Summary: BubbleChartSharp,
    Messages: ForumSharp,
    Sessions: EventNoteSharp,
    Companies: SupervisorAccountSharp,
  })

  const dashboardComponents = {
    Summary: Profile,
    Companies: CompanyPageBeta,
    Sessions: CoachSessions,
    Messages,
    Edit: CompanyAddCoach
  }

  const handleComponentChange = async (selectedComponent, tabValue) => {

    setComponentTabValue(tabValue)

    setSelectedComponent(selectedComponent)
  }


  useEffect(() => {
    axios.get(`/users/${profileId}`)
      .then(res => {
        const { requests, companies } = res.data[0]
        console.log(res.data)
        setUser(res.data[0])
        // if (requests) setRequestSent(requests.some(id => id === auth.getUserId()))
        // if (companies) setIsAlreadyCoach(companies.some(id => id === auth.getUserId()))
      })
  }, [])

  const DisplayedComponent = dashboardComponents[selectedComponent]

  if (!user) return null
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        color="inherit"
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >


        <Toolbar className={classes.contentLayout}>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(true)}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap>
              BALLERS HUB
          </Typography>

          </div>

          <Button variant='contained' color='secondary' onClick={() => {
            auth.logOut()
            history.push('/')
          }}> Log out </Button>
        </Toolbar>
      </AppBar>


      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >

        <div className={classes.toolbar}>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </div>

        <Divider />
        <List>
          {Object.keys(drawerItems).map((text, index) => {
            const Icon = drawerItems[text]
            return (
              <ListItem onClick={() => setSelectedComponent(text)} style={{ paddingLeft: '24px', marginTop: '25px' }} button key={text}>
                <ListItemIcon> <Icon /> </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            )
          })}
        </List>

      </Drawer>
      <main className={classes.content}>
        {/* <div className={classes.toolbar} /> */}

        <DisplayedComponent 
        handleComponentChange={(component, tab) => handleComponentChange(component, tab)}
        componentTabValue={componentTabValue}
        info={user}
        />

      </main>
    </div>
  );
}
