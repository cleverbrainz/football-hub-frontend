import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from 'react-router-dom'
import './App.scss'
import bulma from 'bulma'
// import SignUp from './pages/SignupDraft'
import auth from './lib/auth'
import jwt from 'jsonwebtoken'
import axios from 'axios'

import About from './pages/About'
import PrivacyPolicy from './pages/PrivacyPolicy'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
// import Register from "./pages/Register";
import RegisterPlayer from './pages/RegisterPlayer'
import RegisterTrainer from './pages/RegisterTrainer'
import AdminDashboard from './pages/AdminDashboard'

import CoachDashboard from './pages/CoachDashboard'
import Companies from './pages/Companies'
import IndividualCompany from './pages/IndividualCompany'
import ForgottenPassword from './pages/ForgottenPassword'
import Profile from './pages/Profile'

import CompanyMessages from './components/Dashboard/CompanyMessages'
import Listings from './components/Dashboard/Listings'
import ListingTester from './components/Dashboard/ListingTester'

import AddCoaches from './pages/admin/AddCoaches'
import EditCoaches from './pages/admin/EditCoaches'
import EditCompany from './pages/admin/EditCompany'
import EditServices from './pages/admin/EditServices'
import EditCourses from './pages/admin/EditCourses'
import EditLocation from './pages/admin/EditLocation'
import EditWeeklyCourse from './pages/admin/EditWeeklyCourse'
import EditSingleCampCourse from './pages/admin/EditSingleCampCourse'
import CoachDetails from './pages/admin/CoachDetails'
import Coaches from './pages/admin/Coaches'
import AddCourses from './pages/admin/AddCourses'
import WeeklyCourses from './pages/admin/WeeklyCourses'
import WeeklyCourseDetails from './pages/admin/WeeklyCourseDetails'
import WeeklyDetails from './pages/admin/WeeklyDetails'
import SingleCampDetails from './pages/admin/SingleCampDetails'
import Courses from './pages/admin/Courses'
import Camps from './pages/admin/Camps'
import CompanyDashboard from './pages/admin/CompanyDashboard'
import CompanyDetails from './pages/admin/CompanyDetails'
import CompanyDetailsApproved from './pages/admin/CompanyDetailsApproved'
import PlayersList from './pages/admin/PlayersList'
import Services from './pages/admin/Services'
import ServiceDetails from './pages/admin/ServiceDetails'
import CourseDetails from './pages/admin/CourseDetails'
import CampOptions from './pages/admin/CampOptions'
import CampMultiDetails from './pages/admin/CampMultiDetails'
import CampSingleDetails from './pages/admin/CampSingleDetails'
import AddServices from './pages/admin/AddServices'
import AddAgeGroup from './pages/admin/AddAgeGroup'
import ClientMessages from './pages/ClientMessages'
import Join from './pages/Join'
import Location from './pages/admin/Location'
import PopulateHome from './pages/indulgeadmin/PopulateHome'
import PopulateWhyJoin from './pages/indulgeadmin/PopulateWhyJoin'
import AdminHome from './pages/indulgeadmin/AdminHome'
import Requests from './pages/Requests'
import AddLocation from './pages/admin/AddLocation'
import CoachPageBeta from './pages/admin/CoachPageBeta'
import CoachEdit from './pages/CoachEdit'
import CourseRegister from './pages/CourseRegister'
import CompanyDetailsEdit from './pages/CompanyDetailsEdit'
import PlayerSearch from './pages/admin/PlayerSearch'

import AdminHomeBeta from './pages/indulgeadmin/AdminHomeBeta'

import StripePayment from './pages/Stripe'
import Terms from './components/Terms'
import Subscription from './Subscription'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { AuthProvider } from './lib/context'
import AuthRouter from './lib/PrivateRoute'
import SignIn from './pages/AuthLogin'
import IntroductionPage from './components/Dashboard/IntroductionPage'
import CheckoutForm from './pages/StripePaymentMethod'
import SuccessfulCheckout from './pages/SuccessfulCheckout'

// korean

import Marketing from './korean/Marketing'

import { Dialog, useMediaQuery, DialogContent, DialogTitle, Button, DialogActions } from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core/styles';
const stripePromise = loadStripe('pk_test_JX84GPfLfXGxVFWvGHaz1AWE')



axios.defaults.baseURL = "https://europe-west2-football-hub-4018a.cloudfunctions.net/api"




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
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [userType, setUserType] = useState()
  const [open, setOpen] = useState(true)
  const [navigationRoute, setNavigationRoute] = useState()
  const [selectedCountry, setSelectedCountry] = useState()
  const countries = ['United Kingdom', 'South Korea']

  const enRoutes = (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Switch>
            {/* testing */}
            <AuthRouter exact path="/coachbeta" component={CoachPageBeta} />

            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/privacy-policy" component={PrivacyPolicy} />
            <Route exact path="/join" component={Join} />
            <Route exact path="/login" component={Login} />
            {/* <AuthRouter exact path="/login" component={SignIn} /> */}
            <Route
              exact
              path="/register/player/:companyLink?"
              component={RegisterPlayer}
            />
            <Route
              exact
              path="/register/trainer/:companyLink?"
              component={RegisterTrainer}
            />
            <Route
              exact
              path="/forgot_password"
              component={ForgottenPassword}
            />
            <AuthRouter exact path="/test" component={Listings} />

            <Route exact path="/companies" component={Companies} />
            <Route exact path="/companies/:id/:preview?/:listingId?" component={IndividualCompany} />
            {/* <Route exact path="/companies/:id/:preview?/:listingId?" component={IndividualCompany} /> */}

            <AuthRouter exact path="/:id/profile" component={Profile} />
            <AuthRouter exact path="/:id/profile/requests" component={Requests} />
            <AuthRouter
              exact
              path="/companyDashboard/messages"
              component={CompanyMessages}
            />

            <AuthRouter
              path="/courses/:courseId/register/:sessionDate?"
              component={CourseRegister}
            />

            <AuthRouter exact path="/:id/messages" component={ClientMessages} />
            <AuthRouter
              exact
              path="/companyDashboard"
              component={CompanyDashboard}
            />
            <AuthRouter
              exact
              path="/companyDashboard/location"
              component={Location}
            />
            <AuthRouter
              exact
              path="/companyDashboard/addLocation"
              component={AddLocation}
            />
            <AuthRouter
              exact
              path="/companyDashboard/editLocation"
              component={EditLocation}
            />
            <AuthRouter
              exact
              path="/companyDashboard/companyDetails"
              component={CompanyDetails}
            />
            <AuthRouter
              exact
              path="/companyDashboard/editCompany"
              component={EditCompany}
            />
            <AuthRouter
              exact
              path="/companyDashboard/companyDetailsApproved"
              component={CompanyDetailsApproved}
            />
            <AuthRouter
              exact
              path="/companyDashboard/playersList"
              component={PlayersList}
            />
            <AuthRouter
              exact
              path="/companyDashboard/addCoaches"
              component={AddCoaches}
            />
            <AuthRouter
              exact
              path="/companyDashboard/editCoaches"
              component={EditCoaches}
            />
            <AuthRouter exact path="/companyDashboard/coaches" component={Coaches} />
            <AuthRouter
              exact
              path="/companyDashboard/coachDetails"
              component={CoachDetails}
            />
            <AuthRouter exact path="/companyDashboard/courses" component={Courses} />
            <AuthRouter
              exact
              path="/companyDashboard/addCourses"
              component={AddCourses}
            />
            <AuthRouter exact path="/companyDashboard/camps" component={Camps} />
            <AuthRouter
              exact
              path="/companyDashboard/weeklyCourses"
              component={WeeklyCourses}
            />
            <AuthRouter
              exact
              path="/companyDashboard/editWeeklyCourse"
              component={EditWeeklyCourse}
            />
            <AuthRouter
              exact
              path="/companyDashboard/editSingleCampCourse"
              component={EditSingleCampCourse}
            />
            <AuthRouter
              exact
              path="/companyDashboard/weeklyCourseDetails"
              component={WeeklyCourseDetails}
            />
            <AuthRouter
              exact
              path="/companyDashboard/weeklyDetails"
              component={WeeklyDetails}
            />
            <AuthRouter
              exact
              path="/companyDashboard/singleCampDetails"
              component={SingleCampDetails}
            />
            <AuthRouter
              exact
              path="/companyDashboard/services"
              component={Services}
            />
            <AuthRouter
              exact
              path="/companyDashboard/editServices"
              component={EditServices}
            />
            <AuthRouter
              exact
              path="/companyDashboard/editCourses"
              component={EditCourses}
            />
            <AuthRouter
              exact
              path="/companyDashboard/serviceDetails"
              component={ServiceDetails}
            />
            <AuthRouter
              exact
              path="/companyDashboard/courseDetails"
              component={CourseDetails}
            />
            <AuthRouter
              exact
              path="/companyDashboard/campOptions"
              component={CampOptions}
            />
            <AuthRouter
              exact
              path="/companyDashboard/campMultiDetails"
              component={CampMultiDetails}
            />
            <AuthRouter
              exact
              path="/companyDashboard/campSingleDetails"
              component={CampSingleDetails}
            />
            <AuthRouter
              exact
              path="/companyDashboard/addServices"
              component={AddServices}
            />
            <AuthRouter
              exact
              path="/companyDashboard/addAgeGroup"
              component={AddAgeGroup}
            />
            <AuthRouter exact path="/testlisting" component={ListingTester} />
            {/* {auth.isLoggedIn() && additionalRouts()} */}

            {/* indulge admin */}
            <AuthRouter exact path="/admin/login" component={Login} />
            <AuthRouter exact path="/admin/home" component={PopulateHome} />
            <AuthRouter exact path="/admin" component={AdminHome} />
            <AuthRouter exact path="/adminbeta" component={AdminHomeBeta} />

            <AuthRouter exact path="/tester" component={AdminDashboard} />
            <AuthRouter exact path="/tester/edit" component={CompanyDetailsEdit} />
            <AuthRouter exact path="/tester/search" component={PlayerSearch} />
            <AuthRouter exact path="/testercoach" component={CoachDashboard} />
            <AuthRouter exact path="/testercoach/edit" component={CoachEdit} />

            <AuthRouter exact path="/stripe-payment" component={StripePayment} />

            <AuthRouter exact path="/termsandconditions" component={Terms} />

            <AuthRouter exact path="/subscription" component={Subscription} />
            <AuthRouter exact path="/introduction" component={IntroductionPage} />
            <AuthRouter exact path="/checkout" component={SuccessfulCheckout} />


            <AuthRouter exact path="/checkout-form" component={CheckoutForm} />
          </Switch>
        </Router>
      </AuthProvider>
    </Elements>
  )

  const krRoutes = (
    <Router>
      <Switch>
        <Route exact path="/" component={Marketing} />
      </Switch>
    </Router>

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

    </ Dialog>
  )



  useEffect(() => {

    const version = localStorage.version
    if (version) setNavigationRoute(version === 'United Kingdom' ? enRoutes : krRoutes)

    const token = localStorage.token
    if (token) {
      const decodedToken = jwt.decode(token)
      if (decodedToken.exp * 1000 < Date.now()) {
        auth.logOut()
        window.location.href = '/'
      }
    }
  }, [])




  return (
    !navigationRoute ? <CountrySelection /> : navigationRoute

  )
}

export default App
