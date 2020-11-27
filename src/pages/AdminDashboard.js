import React, { useState, useContext } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';

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
  Grid
} from '@material-ui/core';

import {
  Menu,
  ChevronLeft,
  ChevronRight,
  BubbleChartSharp,
  ForumSharp,
  EventNoteSharp,
  FormatListNumberedSharp,
  SupervisorAccountSharp,
  LocationOnSharp,
  DirectionsRunSharp,
  SportsSoccerSharp
} from '@material-ui/icons';

import auth from '../lib/auth'

import Summary from '../components/Dashboard/Summary'
import Messages from '../components/Dashboard/CompanyMessages'
import Listings from '../components/Dashboard/Listings'
import CoachPageBeta from '../pages/admin/CoachPageBeta'
import Calendar from '../components/Dashboard/Calendar'
import Locations from '../components/Dashboard/Locations'
import Players from '../components/Dashboard/Players'
import Sessions from '../components/Dashboard/Sessions'

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


export default function Profile() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('Listings');
  // const { getUserDetails } = useContext(AuthContext)

  const [drawerItems, setDrawerItems] = useState({
    Summary: BubbleChartSharp,
    Messages: ForumSharp,
    Calendar: EventNoteSharp,
    Listings: FormatListNumberedSharp,
    Coaches: SupervisorAccountSharp,
    Locations: LocationOnSharp,
    Players: DirectionsRunSharp,
    Sessions: SportsSoccerSharp
  })

  const dashboardComponents = {
    Summary,
    Coaches: CoachPageBeta,
    Listings,
    Calendar,
    Messages,
    Locations,
    Players,
    Sessions
  }

  const DisplayedComponent = dashboardComponents[selectedComponent]


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

          <Typography className={classes.greeting} align="right" variant="subtitle1" noWrap>
            Welcome back
          </Typography>
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

        <DisplayedComponent />

      </main>
    </div>
  );
}
