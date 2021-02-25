import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import Marketing from './Marketing'
import ApplicationForm from './ApplicationForm'
import SwitchLanguageFab from './SwitchLanguageFab'
import ApplicationProcessFlow from './ApplicationProcessFlow'
import UserAuthForm from './UserAuthForm'
import HomeNav from '../components/Navbars/HomeNav'
import ApplicationDashboard from './ApplicationDashboard';


const RouteContainer = (props) => {

  const [locale, setLocale] = useState('en')


  return (

    <Router>
    <HomeNav />
    <SwitchLanguageFab
      locale={locale}
      handleLocaleChange={(e) => {
        locale === 'en' ? setLocale('ko') : setLocale('en')
      }} />
    <Switch>
    
    <Route exact path="/success=true" component={ApplicationProcessFlow} /> 
    <Route exact path="/application" component={ApplicationForm} />
    <Route exact path="/authentication"
        render={(props) => (
          <UserAuthForm
            {...props}
            locale={locale} />
        )} />

      <Route exact path="/"
        render={(props) => (
          <Marketing
            {...props}
            locale={locale} />
        )} />

      <Route exact path="/dashboard" component={ApplicationDashboard}/>

     
    </Switch>
  </Router>
  );
};

export default RouteContainer;