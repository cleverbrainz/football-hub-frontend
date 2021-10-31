import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import './App.scss'
import bulma from 'bulma'
import axios from 'axios'
import {
  Switch as FabSwitch,
} from "@material-ui/core";
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { AuthProvider } from './lib/context'
import { Dialog, useMediaQuery, DialogContent, DialogTitle, Button, DialogActions } from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core/styles';

import Navbar from './components/Navbar'
import CompanyMessages from './components/Dashboard/CompanyMessages'
import Terms from './components/Terms'
import IntroductionPage from './components/Dashboard/IntroductionPage'

import About from './pages/About'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Home from './pages/Home'
import Login from './pages/Login'
import LoginRegister from './pages/LoginRegister'
import RegisterType from './pages/RegisterType'
import RegisterPlayer from './pages/RegisterPlayer'
import RegisterTrainer from './pages/RegisterTrainer'
import AdminDashboard from './pages/AdminDashboard'
import CoachDashboard from './pages/CoachDashboard'
import Companies from './pages/Companies'
import IndividualCompany from './pages/IndividualCompany'
import ForgottenPassword from './pages/ForgottenPassword'
import Profile from './pages/Profile'
import ClientMessages from './pages/ClientMessages'
import Join from './pages/Join'

import StripePayment from './pages/Stripe'
import CheckoutForm from './pages/StripePaymentMethod'

import SuccessfulCheckout from './pages/SuccessfulCheckout'
import CourseRegister from './pages/CourseRegister'

import Subscription from './Subscription'
import AuthRouter from './lib/PrivateRoute'

import RouteContainer from './korean/RouteContainer'
import Setup from './components/Dashboard/Setup'
import AdminHomeBeta from './Dashboards/indulgeDashboard/AdminHomeBeta'
import AddPhone from './Dashboards/dashboardComponents/AddPhone'
import Requests from './Dashboards/dashboardComponents/Requests'
import firebase from 'firebase/firebase'
import Calendar from './components/Dashboard/Calendar'
import Listings from './components/Dashboard/Listings'

// axios.defaults.baseURL = process.env.REACT_APP_AXIOS_DEFAULTS_BASE_URL

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center' 
  },
  root: {
    display: 'flex',
    width: '100%',
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'space-around',

    [theme.breakpoints.up('sm')]: {
      flexDirection: "row",
      width: 550,
    },
  },
  card: {
    width: '150px',
    // padding: '0 15px',
    height: '190px',
    textAlign: 'center',
    "&:hover": {
      cursor: "pointer",
      backgroundColor: '#f1f1f1'
    },
  },
  media: {
    width: '80%',
    height: '140px',
    backgroundSize: 'cover'
  },
}))

const App = () => {

  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [open, setOpen] = useState(true)
  const [navigationRoute, setNavigationRoute] = useState()
  const [selectedCountry, setSelectedCountry] = useState()
  const countries = ['United Kingdom', 'South Korea']
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY)

  const enRoutes = (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/privacy-policy" component={PrivacyPolicy} />
        <Route exact path="/join" component={Join} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/loginregister" component={LoginRegister} />
        <Route exact path="/registerType" component={RegisterType} />
        <Route exact path="/register/player/:companyLink?" component={RegisterPlayer} />
        <Route exact path="/register/trainer/:companyLink?" component={RegisterTrainer} />
        <Route exact path="/forgot_password" component={ForgottenPassword} />
        <Route exact path="/companies" component={Companies} />
        <Route exact path="/companies/:id/:preview?/:listingId?" component={IndividualCompany} />
        <AuthRouter exact path="/:id/profile" component={Profile} />
        {/* need & needs connecting to profile to link to this page */}
        <AuthRouter exact path="/:id/profile/requests" component={Requests} />
        <AuthRouter exact path="/companyDashboard/messages" component={CompanyMessages} />
        <AuthRouter path="/courses/:courseId/register/:sessionDate?" component={CourseRegister} />
        <AuthRouter exact path="/:id/messages" component={ClientMessages} />
        <AuthRouter exact path="/adminbeta" component={AdminHomeBeta} />
        <AuthRouter path="/tester" component={AdminDashboard} />
        <AuthRouter exact path="/testercoach" component={CoachDashboard} />
        <AuthRouter exact path="/stripe-payment" component={StripePayment} />
        <AuthRouter exact path="/termsandconditions" component={Terms} />
        <AuthRouter exact path="/subscription" component={Subscription} />
        <AuthRouter exact path="/introduction" component={IntroductionPage} />
        <AuthRouter exact path="/checkout" component={SuccessfulCheckout} />
        <AuthRouter exact path="/checkout-form" component={CheckoutForm} />
        <AuthRouter exact path="/add-phone" component={AddPhone} />
        <AuthRouter exact path="/setup" component={Setup} />
        <AuthRouter exact path="/calendar" component={Calendar} />
      </Switch>
    </Router>
  )

  const krRoutes = (
    <RouteContainer />
  )

  const CountrySelection = () => (

    <Dialog
      open={open}
      handleClose={() => setOpen(false)}
      fullScreen={fullScreen}>

      <DialogTitle className={classes.title}>
        Select Your Country
      </DialogTitle>

      <DialogContent className={classes.root}>

        {countries.map((el, i) => {
          const src = i === 0 ? 'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg' : "https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg"
          return (
            <div
              key={i}
              className={classes.card}
              style={{ backgroundColor: selectedCountry === el && '#f1f1f1' }}
              onClick={() => setSelectedCountry(el)}
            >
              <img className={classes.media} src={src} alt="" />
              <p> {el} </p>
            </div>
          )
        })}

      </DialogContent>

      {selectedCountry && <DialogActions>
        <Button onClick={() => {
          setNavigationRoute(selectedCountry === 'United Kingdom' ? enRoutes : krRoutes)
          setOpen(false)
          localStorage.setItem('version', selectedCountry)
        }} color="primary">
          {`Continue to ${selectedCountry === 'United Kingdom' ? 'English' : 'Korean'} version`}
        </Button>
      </DialogActions>}
    </Dialog>
  )

  useEffect(() => {

   const version = localStorage.version
    // const version = 'South Korea'
    if (version) setNavigationRoute(version === 'United Kingdom' ? enRoutes : krRoutes)

    // if (!auth.isLoggedIn()) {
    //   auth.logOut()
    //   window.location.href = '/'
    // }

    // const token = localStorage.token
    // if (token) {
    //   const decodedToken = jwt.decode(token)
    //   if (!decodedToken) {
    //     console.log('app logout no Decoded Token')

    //   } else if (decodedToken.exp * 1000 < Date.now()) {
    //     console.log('app logout expired Token')
    //     auth.logOut()
    //     window.location.href = '/'
    //   }
    // }
  }, [])

  return (
    !navigationRoute ? <CountrySelection /> :
      (
        <Elements stripe={stripePromise}>
          <AuthProvider>
            {navigationRoute}
          </AuthProvider>
        </Elements>
      )
  )
}

export default App
