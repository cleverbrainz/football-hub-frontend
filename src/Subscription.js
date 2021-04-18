import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import auth from './lib/auth'
import { useStripe } from '@stripe/react-stripe-js'
import { Container, Button, Card, CardContent, CardActionArea, CardMedia, Typography, CardActions, Grid } from '@material-ui/core'
import { firebaseFunctions } from './lib/firebase'
import { AuthContext } from "./lib/context";
import firebase from 'firebase'



const Subscription = () => {
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
      const plans = await axios.get('/plans')
      const planData = plans.data
      // console.log(user.user.uid)
      const userCall = await axios.get(`/users/${user.user.uid}`)
      // const userCall = await axios.get(`/users/id7ZeO3z8eOVpQXWdIXavYo9UNB3`)
      
      // console.log(userCall)
      const returnData = await userCall.data[0]
      // console.log('plans', planData)
      // console.log('user', returnData)
      let subs
      let status = ''
      
      const { subscriptions, stripe_account } = { ...returnData }
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
      setPlans(planData)
      setUserData(returnData)
      setHasSubs(subs)
      setAccountStatus(status)

    }

    getData()
  },[!user.user])

  console.log('hasSubs', hasSubs)
  console.log('accountStatus', accountStatus)

  const sendToPortal = () => {
    // axios.get('/subscriptions/portal')
    //   .then(res => {
    //     const { data } = res
    //     window.location.assign(data.url)
    //   })
    const funcRef = firebase.app().functions(process.env.REACT_APP_FUNCTIONS_SERVER_LOCATION).httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink')
    funcRef({ returnUrl: window.location.href })
      .then(res => {  
        console.log(res)
        window.location.assign(res.data.url)
      })

  }

  const createConnect = () => {
    axios.post('/connectAccount/new', {userId: userId})
      .then(res => {
        console.log(res)
        window.location.assign(res.data.url)
      })
      .catch(err => console.log(err))
  }

  const editConnect = () => {
    axios.post('/connectAccount/edit', {accountId: userData.stripe_account.id})
      .then(res => {
        console.log(res)
        window.location.assign(res.data.url)
      })
      .catch(err => console.log(err))
  }


  const sendToCheckout = (event, price) => {
    event.preventDefault()
    axios.post('/subscriptions/new', { userId: userId, price: price, url: process.env.REACT_APP_SUBSCRIPTIONS_NEW_URL })
      .then(res => {
        const { error, sessionId } = res.data
        console.log(res)
        if (error) {
          console.log(error)
        } else if (sessionId) {
          stripe.redirectToCheckout({ sessionId })
        }
      })
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
    <Typography gutterBottom variant="h3" component="h2">Welcome to FTBallr!</Typography>
    <Typography gutterBottom variant="h5" component="h2">To post listings on our service you'll need a subscription, please see the options below.</Typography>
    <Container>
      {plans.length > 0 && 
        plans.map((plan, i) => {
          return (
            <>
            <Typography gutterBottom variant="h5" component="h2">
            {plan.name}
          </Typography>
          <Grid container direction="row" spacing={10} flexGrow={1}>
          {Object.keys(plan.prices).map(price => {
            const itemPrice = plan.prices[price]
            return(
              <Grid item xs={6}>
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
          </Container>
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