import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
// import Marketing from './Marketing'
import ApplicationForm from './ApplicationForm'
import SwitchLanguageFab from './SwitchLanguageFab'
import HomeNav from '../components/Navbars/HomeNav'
import UserAuthForm from './UserAuthForm'
import ApplicantProfile from './ApplicantProfile'
// import JSONConvertor from './JSONConvertor'
import ApplicationDashboard from './ApplicationDashboard';
// import MarketingBeta from './MarketingBeta ';
import MarketingDelta from './MarketingDelta';
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";



const RouteContainer = (props) => {

  const [locale, setLocale] = useState('en')
  // const theme = createMuiTheme({}, locale === 'en' ? enUS : koKR);

  return (

    <Router>
      <HomeNav />
      <SwitchLanguageFab
        locale={locale}
        handleLocaleChange={(e) => {
          locale === 'en' ? setLocale('ko') : setLocale('en')
        }} />
      <Switch>

        <Route exact path="/user/:id"
          render={(props) => (
            <ApplicantProfile
              {...props}
              locale={locale} />
          )} />


        <Route exact path="/application"
          render={(props) => (
            <ApplicationForm
              {...props}
              locale={locale} />
          )} />

        <Route exact path="/authentication"
          render={(props) => (
            <UserAuthForm
              {...props}
              locale={locale} />
          )} />

        <Route exact path="/"
          render={(props) => (
            <MarketingDelta
              {...props}
              locale={locale} />
          )} />

        <Route exact path="/dashboard" render={(props) => (
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