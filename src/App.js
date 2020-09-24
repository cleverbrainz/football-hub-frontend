import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom'
import './App.scss';
import bulma from 'bulma'

// components and pages import
// import NavbarTwo from './components/Navbars/NavbarTwo'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import Companies from './pages/Companies'
import IndividualCompany from './pages/IndividualCompany'
import ForgottenPassword from './pages/ForgottenPassword'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import SignUp from './pages/SignupDraft'
import { useMemo } from 'react';
import axios from 'axios'
import auth from './lib/auth'
import { AuthContext } from './lib/context'


const App = () => {

  const authContext = useMemo(() => ({
    getUserDetails: () => {
      axios.get(`/user/${auth.getUserId()}`)
        .then(res => res.data)
    }
  }))



  const preLoginRoute = (

    <Router>
      {/* <Navbar /> */}
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/forgot_password' component={ForgottenPassword} />
      </Switch>
    </Router>
  )

  const customerRoute = (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path='/companies' component={Companies} />
        <Route exact path='/companies/:id' component={IndividualCompany} />
        <Route exact path='/:id/messages' component={Messages} />
        <Route exact path='/:id/profile' component={Profile} />
      </Switch>
    </Router>
  )

  const AdminRoute = (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path='/admin/:id' component={AdminDashboard} />
      </Switch>
    </Router>
  )



  return (
    <AuthContext.Provider value={authContext}>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/admin/:id' component={AdminDashboard} />
          <Route exact path='/companies' component={Companies} />
          <Route exact path='/companies/:id' component={IndividualCompany} />
          <Route exact path='/forgot_password' component={ForgottenPassword} />
          <Route exact path='/:id/messages' component={Messages} />
          <Route exact path='/:id/profile' component={Profile} />
          <Route exact path='/signup' component={SignUp} />
        </Switch>

      </Router>
    </AuthContext.Provider>

  );
}

export default App;
