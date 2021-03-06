import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Badge from '@material-ui/core/Badge'
import auth from '../../lib/auth'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import axios from 'axios'
import EditSharpIcon from '@material-ui/icons/EditSharp'
import moment from 'moment'

import jwt from 'jsonwebtoken'
import { AdbOutlined } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  root: {
    height: window.innerHeight - 80,
    [theme.breakpoints.up('sm')]: {
      height: window.innerHeight - 80,
    },
    width: '100%',
    // backgroundColor: 'pink',
    // display: 'flex',
    justifyContent: 'center',
    padding: '25px 0',
    position: 'relative',
  },
  progress: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    // transform: 'translate(-50%, -50%)'
  },
  subContainer: {
    width: '95%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-around',
    },
    [theme.breakpoints.up('md')]: {
      width: '75%',
    },
    // backgroundColor: 'lightblue',
  },
  leftContainer: {
    [theme.breakpoints.up('sm')]: {
      width: '40%',
    },
    height: '100%',
    width: '100%',
    // backgroundColor: 'lightblue',
    padding: '0 15px',
  },
  avatar: {
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(38),
      height: theme.spacing(38),
    },
    width: theme.spacing(30),
    height: theme.spacing(30),
    margin: '0 auto',
    '&:hover': {
      cursor: 'pointer',
      filter: 'grayscale(50%)',
    },
    // boxShadow: '1px 1px 2px 2px grey'
  },
  card: {
    maxHeight: 345,
    width: 200
    
  },
  rightContainer: {
    [theme.breakpoints.up('sm')]: {
      width: '55%',
    },
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  name: {
    margin: '20px 0',
  },
}))

const Requests = ({ match, setPanel, refreshRequests }) => {
  const profileId = match.params.id
  const [user, setUser] = useState()
  const [requests, setRequests] = useState([])
  // const input = useRef()
  // const [imageUpload, setImageUpload] = useState(false)
  // const [requestSent, setRequestSent] = useState()
  async function getData() {
    let companies = []
    let user
    const response = await axios.get(`/users/${auth.getUserId()}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
    // axios.get(`/users/${auth.getUserId()}`)
    //   .then(res => {
    //     user = res.data[0]
    //     if (user.requests) {
    //       for (const request of user.requests) {
    //         const response = await axios.get(`/users/${request}`)
    //         const data = await response.data[0]
    //         console.log('data', data)
    //         companies.push(data)
    //       } 
    //     }
    //   })
    const data = await response.data[0]
    user = data
    if (data.requests) {
      for (const request of data.requests) {
        const response = await axios.get(`/users/${request}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
        const data = await response.data[0]
        companies.push(data)
      } 
    }
    setUser(user)
    setRequests(companies)
  }

  useEffect(() => {
    getData()
}, [])


  const handleRequest = (event, id, email, decision) => {
    event.preventDefault()
    const userId = auth.getUserId()
    axios.put(`/user/${userId}/requests`, { userId, coachName: user.name, companyId: id, bool: decision, companyEmail: email })
      .then(res => {
        refreshRequests()
        .then(() => {
          setPanel(0)
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  const classes = useStyles()
  
  if (requests) return (
    <div className={classes.root}>
      <Typography variant='h5'>
        Requests
      </Typography>
      
      {requests.map((request, index) => {
        return (
          <Card key={`card-${index}`} className={classes.card}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="/static/images/cards/contemplative-reptile.jpg"
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {request.name}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button id={`accept-${request.userId}`} onClick={(event) => handleRequest(event, request.userId, request.email, true)} size="small" color="primary">
              Accept
            </Button>
            <Button id={`decline-${request.userId}`} onClick={(event) => handleRequest(event, request.userId, request.email, false)} size="small" color="primary">
              Decline
            </Button>
          </CardActions>
        </Card>
        )
      })
    }
    </div>
  )
}

export default withRouter(Requests)
