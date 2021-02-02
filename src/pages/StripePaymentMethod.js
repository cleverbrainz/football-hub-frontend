import React, { useState } from 'react';
// import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import auth from '../lib/auth'
import { useStripe } from "@stripe/react-stripe-js";
import { useEffect } from 'react';
import moment from 'moment'

const useStyles = makeStyles({
  root: {
    margin: '15px 0',
    width: 300,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});


export default function CheckoutForm({
  stripeId,
  open,
  name,
  handleClose,
  connectedAccount,
  courseId,
  companyId
}) {
  const stripe = useStripe()
  const classes = useStyles();
  const [prices, setPrices] = useState()
  const [selectedPlan, setSelectedPlan] = useState({
    type: null,
    id: null
  })
  const [user, setUser] = useState()



  const getUserData = async () => {
    const data = await axios.get(`/users/${auth.getUserId()}`)
    const user = await data.data[0]
    setUser(user)
  }

  useEffect(() => {

    getUserData()

    axios.get(`/connected-account/${stripeId}/product`)
      .then(res => {
        setPrices(res.data.prices)
      })
  }, [])

  async function handlePlanSelection() {

    const { id, type } = selectedPlan
    const { userId, name, stripeId, email } = user
    let checkout

    

    if (type !== 'recurring') {

      checkout = await axios.post('/create-payment', {
        email,
        type,
        priceId: id,
        connectedAccountId: connectedAccount,
        customerId: stripeId,
        metadata: {
          companyId,
          courseId,
          playerName: name,
          playerId: userId
        }
      })

    } else {
      checkout = await axios.post('/connected-account/subscriptions', {
        customerId: stripeId,
        metadata: {
          priceId: id,
          connectedAccountId: connectedAccount,
          companyId,
          courseId,
          playerName: name,
          playerId: userId
        }
      })
    }

    const session = await checkout.data

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    })

    if (result.error) {
      console.log(result.error)
    }


  }

  


  return (
    <>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"> Select Payment Plan </DialogTitle>
        <DialogContent >

          {prices && (
            prices.map((el, i) => {
              const { unit_amount, id, type, metadata } = el
              const { subscription_end_date } = metadata
              const subscription_length = moment(subscription_end_date).diff(moment(), 'weeks')
              const amount = unit_amount.toString()
              return (
                <Card onClick={() => setSelectedPlan({ id, type })} className={classes.root}
                  style={{ border: selectedPlan.id === id ? '2px #b19cd9 solid' : 'none' }}>
                  <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                      £{`${unit_amount / 100}.${amount.slice(-2)}`}
                    </Typography>

                    <Typography className={classes.pos} color="textSecondary">
                      {type === 'recurring' ?
                        `Weekly subscription payment for ${subscription_length} weeks`
                        : 'One-off payment'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small"> Select </Button>
                  </CardActions>
                </Card>
              )
            })
          )}

        </DialogContent>
        <DialogActions>
          <Button onClick={handlePlanSelection} color="primary">
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}