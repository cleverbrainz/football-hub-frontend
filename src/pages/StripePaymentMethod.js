import React, { useState } from 'react';
import { withRouter } from 'react-router-dom'
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


function CheckoutForm({
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
  const [terms, setTerms] = useState('')
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [termsDialog, setTermsDialog] = useState(false)



  const getUserData = async () => {
    const data = await axios.get(`/users/${auth.getUserId()}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
    const user = await data.data[0]
    setUser(user)
  }

  const getTerms = async () => {
    const data = await axios.get(`/users/${companyId}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
    console.log(data)
    const user = await data.data[0]
    user.contactInformation?.terms ? setTerms(user.contactInformation.terms) : setTerms('Terms go here')
  }

  useEffect(() => {

    getUserData()
    getTerms()

    axios.get(`/connected-account/${stripeId}/product`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        setPrices(res.data.prices)
      })
  }, [])

  async function handlePlanSelection() {

    const { id, type } = selectedPlan
    const { userId, name, stripeId, email, dob, age } = user
    let checkout



    if (type !== 'recurring') {

      checkout = await axios.post('/create-payment', {
        email,
        priceId: id,
        connectedAccountId: connectedAccount,
        customerId: stripeId,
        metadata: {
          dob: dob ? dob : age,
          companyId,
          courseId,
          name,
          playerId: userId
        }
      }, { headers: { Authorization: `Bearer ${auth.getToken()}` }})

    } else {
      checkout = await axios.post('/connected-account/subscriptions', {
        customerId: stripeId,
        metadata: {
          dob: '',
          priceId: id,
          connectedAccountId: connectedAccount,
          companyId,
          courseId,
          name,
          playerId: userId
        }
      }, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
    }

    const session = await checkout.data

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    })

    if (result.error) {
      // props.history.push('/checkout')
    }


  }

  function handleAgreeToTerms() {
    setTermsAgreed(true)
    setTermsDialog(false)
  }

  function calculateProration(start, end, price) {
    const courseDuration = moment(end, 'YYYY-MM-DD').diff(moment(start, 'YYYY-MM-DD'), 'weeks')
    const weeklyPrice = (price.unit_amount / courseDuration).toFixed(2)
    const remainingDuration = moment(end, 'YYYY-MM-DD').diff(moment(), 'weeks')
    const prorationAmount = remainingDuration * weeklyPrice

    return prorationAmount
  }

  return (

    !termsDialog ? 
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
              const { end_date, start_date } = metadata
              const subscription_length = moment(end_date).diff(moment(), 'weeks')
              const isTodayBeforeStart = moment().isBefore(moment(start_date, 'YYYY-MM-DD'))

              return (
                <Card onClick={() => setSelectedPlan({ id, type })} className={classes.root}
                  style={{ border: selectedPlan.id === id ? '2px #b19cd9 solid' : 'none' }}>
                  <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                      <span style={{
                        marginRight: '10px',
                        textDecoration: (!isTodayBeforeStart && type !== 'recurring') ? 'line-through' : 'none'
                      }}> 
                      £{`${(unit_amount / 100).toFixed(2)}`} 
                      </span>

                    {(!isTodayBeforeStart && type !== 'recurring') && (
                      <span style={{ color: 'blue'}}> 
                      { prices[1] ?
                      `£${(calculateProration(start_date, end_date, prices[1]) / 100).toFixed(2)}` :
                      `£${(calculateProration(start_date, end_date, prices[0]) / 100).toFixed(2)}`
                      }
                      </span>  
                      )}
                    </Typography>

                    <Typography className={classes.pos} color="textSecondary">
                      {type === 'recurring' ?
                        `Weekly subscription payment for ${subscription_length} weeks`
                        : 'One-off payment'}
                    </Typography>

                    {(!isTodayBeforeStart && type !== 'recurring') && (
                      <Typography className={classes.pos} variant="body2" component="p">
                        This course has already started and original price has been reduced.
                      </Typography>
                    )}
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
          <Button onClick={() => setTermsDialog(true)}>
            View Terms & Conditions
          </Button>
          <Button disabled={!termsAgreed} onClick={handlePlanSelection} color="primary">
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
    </>
    :
    <>

    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title"> T's and C's </DialogTitle>
      <DialogContent >

        <Typography>
          {terms}
        </Typography>

      </DialogContent>
      <DialogActions>
        <Button>
          View Terms & Conditions
        </Button>
        <Button onClick={() => handleAgreeToTerms()} color="primary">
          I agree
        </Button>
      </DialogActions>
    </Dialog>
  </>
  );
}

export default CheckoutForm