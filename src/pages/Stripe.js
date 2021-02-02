import React, { useState, useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import axios from 'axios'
import moment from 'moment'
import PreCheckoutLogin from '../components/PreCheckoutLogin'
import CheckoutForm from '../pages/StripePaymentMethod'
import auth from '../lib/auth'
import { Button, CardActions, CardContent, Paper, Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';


export default function Stripe({
  selectedBooking,
  courses,
  classes,
  accountId,
  preview
}) {
  const stripe = useStripe();
  const [message, setMessage] = useState("");
  const [loginBeforeBooking, setLoginBeforeBooking] = useState(false);
  const [sessionLocations, setSessionLocations] = useState()
  const [bookingWidget, setBookingWidget] = useState({
    spaces: 1,
    total: null
  })
  const [checkout, setCheckout] = useState(false)

  const {
    course,
    courseType } = selectedBooking
  const { courseId, stripe_product_id, companyId } = course
  const {
    age,
    cost,
    space,
    services,
    courseCategory,
    sessions,
    optionalName,
    startDate,
    endDate,
    location,
    campCost,
    firstDay,
    lastDay } = course.courseDetails




  const handleBookingWidget = (e) => {
    const { value } = e.target
    // const { cost, campCost } = course.courseDetails
    setBookingWidget({ spaces: value, total: value * (courseType === 'course' ? cost : campCost) })
  };


  useEffect(() => {
    console.log(course)
    if (courseType === 'course') {
      const locationArr = []
      sessions.forEach((el, i) => {
        const { location } = sessions[i]
        !locationArr.includes(location) && locationArr.push(location)
      })
      setSessionLocations(locationArr)
    }

    setBookingWidget({ spaces: 1, total: 1 * (courseType === 'course' ? cost : campCost) })

    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }
    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, [optionalName]);


  const Message = ({ message }) => (
    <section>
      <p>{message}</p>
    </section>
  );



  const ProductDisplay = ({ handleClick }) => (

    <>

      <Paper style={{ marginTop: '40px' }} elevation={4}>
        <CardContent>
          <Typography style={{ marginBottom: '15px' }} variant="h5" component="h2">
            £{courseType === 'course' ? cost : campCost} / {courseType}
          </Typography>

          <Typography color="textSecondary">
            {optionalName}
            <span style={{ display: 'block' }}> {courseType === 'course' ? startDate : firstDay} - {courseType === 'course' ? endDate : lastDay} </span>
            <span style={{ display: 'block' }}> {age} age group </span>


            <span className={classes.subtitle}> Session(s) </span>
            {sessions.map((el, i) => {
              function toDateTime(secs) {
                var t = new Date(1970, 0, 1); // Epoch
                t.setSeconds(secs);
                return t;
              }
              const { day, startTime, sessionDate } = el
              return <span style={{ display: 'block' }}> {i + 1}. {courseType === 'course' ? day : moment(toDateTime(sessionDate._seconds)).format('MMMM Do YYYY')} @ {startTime}</span>
            })}
            <span className={classes.subtitle}> Location(s) </span>

            {(courseType === 'course' && sessionLocations) ? sessionLocations.map((el, i) => <span style={{ display: 'block ' }}> {i + 1}. {el} </span>) :
              <span style={{ display: 'block ' }}> {location} </span>
            }

          </Typography>

          <FormControl style={{ margin: '25px 0' }} className={classes.formControl}>
            <InputLabel id="demo-customized-select-label"> Reserve spaces </InputLabel>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={bookingWidget.spaces}
              onChange={(e) => handleBookingWidget(e)}
            >
              {Array.from(Array(1).keys()).map(el => {
                return (
                  <MenuItem value={el + 1}> {el + 1} </MenuItem>
                )
              })}
            </Select>
          </FormControl>


          {/* <Typography style={{ fontWeight: 'bold' }} variant="h6" component="h6">
            Total: £{bookingWidget.total}
          </Typography> */}


        </CardContent>


        <CardActions>
          <Button
            disabled={preview}
            onClick={handleClick}
            variant="contained"
            color="primary"
            size="small"> Reserve Now </Button>
          <Typography variant="body2" component="p">{preview ? <p>No booking during preview</p> : <p> You won't be charged yet </p>}

          </Typography>
        </CardActions>



      </Paper>


      {loginBeforeBooking && <PreCheckoutLogin
        followUpAction={'booking'}
        handleClick={(e) => handleClick(e)}
        handleClose={() => setLoginBeforeBooking(false)}
        open={loginBeforeBooking} />}

      {!loginBeforeBooking && <CheckoutForm
        connectedAccount={accountId}
        companyId={companyId}
        courseId={courseId}
        stripeId={stripe_product_id}
        open={checkout}
        handleClose={() => setCheckout(false)}
      />}
    </>

  );



  const handleClick = async (event) => {

    if (!auth.isLoggedIn()) {
      setLoginBeforeBooking(true)
      return
    }

    setCheckout(true)



    // axios.get(`/users/${auth.getUserId()}`)
    //   .then(async res => {
    //     const { name, userId, dob, stripeId } = res.data[0]

    //     const response = await axios.post('/create-payment', {
    //       unitPrice: bookingWidget.total / bookingWidget.spaces,
    //       // product: `${location} weekly course (${day} @ ${startTime} - ${endTime})`,
    //       spaces: bookingWidget.spaces,
    //       accountId,
    //       stripeId,
    //       metadata: {
    //         courseId,
    //         playerId: userId,
    //         dob,
    //         name
    //       }
    //     })

    //     const session = await response.data

    //     const result = await stripe.redirectToCheckout({
    //       sessionId: session.id,
    //     })
    //     if (result.error) {

    //     }
    //   })
  }
  return message ? <Message message={message} /> : <ProductDisplay handleClick={handleClick} />
}