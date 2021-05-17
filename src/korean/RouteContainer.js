import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
// import Marketing from './Marketing'
import ApplicationForm from './ApplicationForm'
import SwitchLanguageFab from './SwitchLanguageFab'
import NavBarKorea from '../components/Navbars/NavBarKorea'
import UserAuthForm from './UserAuthForm'
import ApplicantProfile from './ApplicantProfile'
import PostAppForm from './PostAppForm'
// import JSONConvertor from './JSONConvertor'
import ApplicationDashboard from './ApplicationDashboard';
// import MarketingBeta from './MarketingBeta ';
import AddPhone from '../Dashboards/dashboardComponents/AddPhone';
import AuthRouter from '../lib/PrivateRoute'



const RouteContainer = (props) => {

  const [locale, setLocale] = useState('ko')
  // const theme = createMuiTheme({}, locale === 'en' ? enUS : koKR);

  return (

    <Router>
      <NavBarKorea locale={locale} />
      <SwitchLanguageFab
        locale={locale}
        handleLocaleChange={(e) => {
          locale === 'en' ? setLocale('ko') : setLocale('en')
        }} />
      <Switch>

        <AuthRouter exact path="/user/:id/pdp-form"
          locale={locale}
          component={(props) => (
            <PostAppForm
              {...props}
              locale={locale} />
          )} />

        <AuthRouter exact path="/user/:id"
          locale={locale}
          component={(props) => (
            <ApplicantProfile
              {...props}
              locale={locale} />
          )} />

        <AuthRouter exact path="/user/:id/two-factor"
          locale={locale}
          component={(props) => (
            <AddPhone
              {...props}
              locale={locale} />
          )} />


        <AuthRouter exact path="/application/:locale?"
          locale={locale}
          component={(props) => (
            <ApplicationForm
              {...props}
              locale={locale}
              setLocale={setLocale} />
          )} />
        
        <AuthRouter exact path="/challenges"
          locale={locale}
          component={(props) => (
            <ApplicationForm
              {...props}
              locale={locale}
              challenges={true}
              setLocale={setLocale} />
          )} />

        <Route exact path="/authentication"
          render={(props) => (
            <UserAuthForm
              {...props}
              locale={locale} />
          )} />

        <Route exact path="/"
          render={(props) => (
            // <MarketingDelta
            //   {...props}
            //   locale={locale} />
            <Redirect to='/authentication' />
          )} />

        <AuthRouter exact path="/dashboard"
          locale={locale}
          component={(props) => (
            <ApplicationDashboard
              {...props}
              locale={locale}
            />
          )} />






      </Switch>
    </Router>

  );
};

export default RouteContainer;