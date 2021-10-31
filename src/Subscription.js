import React, { useState, useEffect, useContext} from 'react'
import axios from 'axios'
import auth from './lib/auth'
import { useStripe } from '@stripe/react-stripe-js'
import { Container, Button, Card, CardContent, CardActionArea, CardMedia, Typography, CardActions, Grid, Paper} from '@material-ui/core'
import { firebaseFunctions } from './lib/firebase'
import { AuthContext } from "./lib/context";
import firebase from 'firebase'
import { isEmpty } from 'lodash'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({  
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
  headerBox: {
    paddingBottom: '20px'
  }
}));

const Subscription = () => {
  const classes = useStyles()
  const stripe = useStripe()
  const authUser = useContext(AuthContext);
  const { user, userData, setUserData } = authUser
  // console.log('auth', authUser)
  const [userId, setUserId] = useState(null) 
  const [plans, setPlans] = useState([])
  // const [userData, setUserData] = useState({})
  const [hasSubs, setHasSubs] = useState(false)
  const [accountStatus, setAccountStatus] = useState('')

  useEffect(() => {
    async function getData() {
      if (!user.user) return
      // console.log(authUser)
      // const plans = await axios.get('/plans')      
      axios.get('/plans', { headers: { Authorization: `Bearer ${auth.getToken()}` }})
        .then(res => {          
          if (isEmpty(res.data)) {
            console.log('Plan is Empty')
          } else {
            setPlans(res.data)
          }          
        })
        .catch(err => console.log(err))
      // const planData = plans.data
      // console.log(user.user.uid)
      // const userCall = await axios.get(`/users/${user.user.uid}`)

      axios.get(`/users/${user.user.uid}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
        .then(res => {          
          if (isEmpty(res.data)) {
            console.log('Userdata is Empty')
          } else {
            let subs
            let status = ''
            const { subscriptions, stripe_account } = { ...res.data[0] }
            if (subscriptions) {
              // for (const subscription of Object.keys(subscriptions)) {
              //   if (subscriptions[subscription].status === 'active') setHasSubs(true)
              // }
              // for (const subscription of Object.keys(subscriptions)) {
                if (subscriptions.status === 'active') subs = true
              // }
            }
            if (stripe_account) {
              // for (const account of Object.keys(stripe_account)) {
              //   if (stripe_account[account].requirements.currently_due.length > 0 || stripe_account[account].requirements.past_due.length > 0 || stripe_account[account].requirements.disabled_reason) {
              //     //Need to find out how to check if error with documents/pending not just unverified
              //     setAccountStatus('unverified')
              //   } else {
              //     setAccountStatus('verified')
              //   }
              // }
              // for (const account of Object.keys(stripe_account)) {
                if (stripe_account.requirements.currently_due.length > 0 || stripe_account.requirements.past_due.length > 0 || stripe_account.requirements.disabled_reason) {
                  //Need to find out how to check if error with documents/pending not just unverified
                  status = 'unverified'
                } else {
                  status = 'verified'
                }
              // }
            }
            setUserId(user.user.uid)
            setUserData(res.data[0])
            setHasSubs(subs)
            setAccountStatus(status)
          }          
        })
        .catch(err => console.log(err))      
    }
    getData()
  },[!user.user])

  // console.log('hasSubs', hasSubs)
  // console.log('accountStatus', accountStatus)

  const sendToPortal = () => {
    // axios.get('/subscriptions/portal')
    //   .then(res => {
    //     const { data } = res
    //     window.location.assign(data.url)
    //   })
    const funcRef = firebase.app().functions(process.env.REACT_APP_FUNCTIONS_SERVER_LOCATION).httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink')
    funcRef({ returnUrl: window.location.href })
      .then(res => {  
        // console.log(res)
        window.location.assign(res.data.url)
      })
  }

  const createConnect = () => {
    // console.log('user id =====', userId)
    axios.post('/connectAccount/new', {userId: userId}, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        window.location.assign(res.data.url)       
      })
      .catch(err => console.log(err))
  }

  const editConnect = () => {
    axios.post('/connectAccount/edit', {accountId: userData.stripe_account.id}, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        // console.log(res)
        window.location.assign(res.data.url)        
      })
      .catch(err => console.log(err))
  }
  
  const sendToCheckout = (event, price) => {
    event.preventDefault()
    axios.post('/subscriptions/new', { userId: userId, price: price, url: process.env.REACT_APP_SUBSCRIPTIONS_NEW_URL },
     { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        const { error, sessionId } = res.data
        if (error) {
          console.log(error)
        } else if (sessionId) {
          stripe.redirectToCheckout({ sessionId })
        }
      })
      .catch(err => console.log(err))
  }

  if (!userData) return null
  if (hasSubs) return (
    <Grid container spacing={3}>
    {/* <Container> */}
      <Grid item xs={6}>
        <Typography gutterBottom variant="h5" component="h2">Subscribed</Typography>
        <Button variant="contained" color="primary" onClick={sendToPortal}>Click here to view your subscription details</Button>
      </Grid>
      { accountStatus === '' ?
      <Grid item xs={6}>
        <Typography gutterBottom variant="h5" component="h2">In order for you to receive payments online you will need to register as a connected account</Typography>
        <Button variant="contained" color="primary" onClick={createConnect}>Click here to create your connected account</Button>
      </Grid> :
      accountStatus === 'unverified' ?
      <Grid item xs={6}>
        <h1>Stripe needs more information</h1>
        <p>In order for you to receive payments you need to add a few more details to your Stripe account for verification.</p>
        <Button variant="contained" color="primary" onClick={editConnect}>Get verified</Button>
      </Grid>
      :
      <Grid item xs={6}>
        <Typography gutterBottom variant="h5" component="h2">Your Stripe account is up to date!</Typography>
        <Button variant="contained" color="primary" onClick={editConnect}>Edit details</Button>
      </Grid>
      }
    {/* </Container> */}
    </Grid>
  )

  if (!hasSubs) return (
    <>
    <div className={classes.headerBox}>
      <div  className={classes.paper}>
        <Typography variant="h4">
          Welcome to ftballer!
        </Typography>
        <Typography variant="h6">
          To post listings on our service you'll need a subscription, please see the options below.
        </Typography>
      </div>
    </div>
    {/* <Typography gutterBottom variant="h3" component="h2">Welcome to ftballer!</Typography>
    <Typography gutterBottom variant="h5" component="h2">To post listings on our service you'll need a subscription, please see the options below.</Typography> */}
    <div>
      {plans.length > 0 && 
        plans.map((plan, i) => {
          return (
            <>
            <Typography gutterBottom variant="h5" component="h2" style={{marginLeft: '20px'}}>
              {plan.name}
            </Typography>
            <Grid container direction="row" spacing={5} flexGrow={1} style={{marginTop: '10px'}}>
              {Object.keys(plan.prices).map(price => {
                const itemPrice = plan.prices[price]
                return(
                  <Grid item xs={12} sm={6} style={{padding: '2px !important'}}>
                    <Card key={i}>
                      <CardActionArea>
                        <CardMedia
                          image="https://picsum.photos/id/237/200/300"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            {itemPrice.description}
                          </Typography>

                          <Typography variant="body2" color="textSecondary" component="p">
                            {itemPrice.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions>
                        <Button variant="contained" color="primary" size="small" onClick={(event) => sendToCheckout(event, price)}>
                          Choose Subscription
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                )}
              )}
            </Grid>
          </>
        )}
      )}
    </div>
    </> 
  )
  return null
}
export default Subscription
// <div>
            //   <h1>{plan.name}</h1>
            //   <ul>
            //   {Object.keys(plan.prices).map(price => {
            //     const itemPrice = plan.prices[price]
            //     return (
            //       <Container>
            //       <li>{itemPrice.description}</li>
            //       <Button onClick={(event) => sendToCheckout(event, price)}>Choose Subscription</Button>
            //       </Container>
            //     )
            //   })}
            //   </ul>
            // </div>