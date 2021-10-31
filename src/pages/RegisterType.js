import React, { useState, useEffect, useContext } from 'react'
import { Link, Redirect, useHistory } from 'react-router-dom'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import VisibilityOffSharpIcon from '@material-ui/icons/VisibilityOffSharp';
import VisibilitySharpIcon from '@material-ui/icons/VisibilitySharp';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import auth from '../lib/auth'
import { AuthContext } from "../lib/context";
import { firebaseApp } from '../lib/firebase';
import * as firebase from "firebase";
import {
    Grid,
  MenuItem,
  Select
} from '@material-ui/core'

export default function RegisterType({ history, location }) {
 
  const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: location.pathname === '/admin/login' ? 'center' : 'space-evenly',
      height: `${window.innerHeight - 80}px`,
    },
    form: {
      width: '30%',
      minWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
      height: '40%',
      justifyContent: 'space-evenly'
    },
    button: {
      position: 'relative'
    },
    progress: {
      position: 'absolute'
    },
    circle: {
      display: 'flex',
      width: '100px',
      height: '100px',
      backgroundColor: 'transparent',
      borderRadius: '50%',
      borderStyle: 'solid',
      borderColor: '#00000',
      borderWidth: '2px',
      margin: 'auto' 
    },
    text: {
      margin: 'auto',
      color: 'black'
    },
    title: {
        textAlign: 'center',
        marginTop: '10px'
    },
    header: {
        textAlign: 'center',
        fontWeight: 'bold', 
        fontSize: '20pt',
        marginTop: '20px',
        marginBottom: '50px'
    }
  }));
  const classes = useStyles();
  const userTypes = [
    {type: 'Player', title: 'To search and book courses, to get development and feedback'},
    {type: 'Coach', title: 'To search for courses and be assigned to a company'},
    {type: 'Company', title: 'To advertise courses and services, manage players and coaches'}
  ]

  const selectUserType = (category) =>{
    if (category === 'Player') {
        history.push('/register/player');
    } else {
        localStorage.setItem('category', category.toLowerCase())
        history.push('/register/trainer')
    } 
  }

  return (  
    <div>
      <Typography className={classes.header}>Sign Up</Typography>
      <Grid container spacing={3} className={classes.gridContainer}>        
        {userTypes.map((item, index) => {
          return (
            <Grid item xs={4}>
              <Button className={classes.circle}
                  onClick={() => selectUserType(item.type)}>
                  <p className = {classes.text}>{item.type}</p>
              </Button>
              <Typography className={classes.title}>{item.title}</Typography>
            </Grid>
          )
          })            
        }
      </Grid>
    </div>    
  )
}