import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.scss";
import bulma from "bulma";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import AdminDashboard from './pages/AdminDashboard'
import Companies from "./pages/Companies";
import IndividualCompany from "./pages/IndividualCompany";
import ForgottenPassword from "./pages/ForgottenPassword";
import Profile from "./pages/Profile";
// import SignUp from './pages/SignupDraft'
import auth from "./lib/auth";
import jwt from "jsonwebtoken";
import axios from "axios";

import CompanyMessages from "./components/Dashboard/CompanyMessages";
import Listings from "./components/Dashboard/Listings";

import AddCoaches from "./pages/admin/AddCoaches";
import EditCoaches from "./pages/admin/EditCoaches";
import EditCompany from "./pages/admin/EditCompany";
import EditServices from "./pages/admin/EditServices";
import EditCourses from "./pages/admin/EditCourses";
import EditWeeklyCourse from "./pages/admin/EditWeeklyCourse";
import EditSingleCampCourse from "./pages/admin/EditSingleCampCourse";
import CoachDetails from "./pages/admin/CoachDetails";
import Coaches from "./pages/admin/Coaches";
import AddCourses from "./pages/admin/AddCourses";
import WeeklyCourses from "./pages/admin/WeeklyCourses";
import WeeklyCourseDetails from "./pages/admin/WeeklyCourseDetails";
import WeeklyDetails from "./pages/admin/WeeklyDetails";
import SingleCampDetails from "./pages/admin/SingleCampDetails";
import Courses from "./pages/admin/Courses";
import CompanyDashboard from "./pages/admin/CompanyDashboard";
import CompanyDetails from "./pages/admin/CompanyDetails";
import CompanyDetailsApproved from "./pages/admin/CompanyDetailsApproved";
import Services from "./pages/admin/Services";
import ServiceDetails from "./pages/admin/ServiceDetails";
import CourseDetails from "./pages/admin/CourseDetails";
import CampOptions from "./pages/admin/CampOptions";
import CampMultiDetails from "./pages/admin/CampMultiDetails";
import CampSingleDetails from "./pages/admin/CampSingleDetails";
import AddServices from "./pages/admin/AddServices";
import AddAgeGroup from "./pages/admin/AddAgeGroup";
import ClientMessages from "./pages/ClientMessages";
import Join from "./pages/Join";
import Location from "./pages/admin/Location";

const App = () => {
  const [userType, setUserType] = useState();

  useEffect(() => {
    // console.log('hello')
    const token = localStorage.token;
    if (token) {
      const decodedToken = jwt.decode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        auth.logOut();
        window.location.href = "/";
      }
    }
  }, []);

  const CustomerRoutes = (
    <>
      <Route exact path="/companies" component={Companies} />
      <Route exact path="/companies/:id" component={IndividualCompany} />

      {/* <Route exact path='/:id/profile' component={Profile} /> */}
      <Route exact path="/companyDashboard" component={CompanyDashboard} />

      {/*  */}

      {/*  HELLOOOOOO BOYYSSSSSSS BHOWWW ARE YOU??? */}
    </>
  );

  const AdminRoutes = <></>;

  const additionalRoutes = () => {
    let route;

    axios.get(`/users/${auth.getUserId()}`).then(async (res) => {
      await setUserType(res.data[0].category);

      // if (res.data[0].category === 'player') {
      //   route = CustomerRoutes
      // } else route = AdminRoutes
    });

    return CustomerRoutes;
  };

  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/join" component={Join} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/forgot_password" component={ForgottenPassword} />
        <Route exact path="/test" component={Listings} />
        {/*  */}
        <Route exact path="/companies" component={Companies} />
        <Route exact path="/companies/:id" component={IndividualCompany} />
        {/*  */}
        <Route exact path="/:id/profile" component={Profile} />
        <Route
          exact
          path="/companyDashboard/messages"
          component={CompanyMessages}
        />
        <Route exact path="/:id/messages" component={ClientMessages} />

        <Route exact path="/companyDashboard" component={CompanyDashboard} />

        <Route exact path="/companyDashboard/location" component={Location} />

        <Route
          exact
          path="/companyDashboard/companyDetails"
          component={CompanyDetails}
        />
        <Route
          exact
          path="/companyDashboard/editCompany"
          component={EditCompany}
        />
        <Route
          exact
          path="/companyDashboard/companyDetailsApproved"
          component={CompanyDetailsApproved}
        />
        <Route
          exact
          path="/companyDashboard/addCoaches"
          component={AddCoaches}
        />
        <Route
          exact
          path="/companyDashboard/editCoaches"
          component={EditCoaches}
        />
        <Route exact path="/companyDashboard/coaches" component={Coaches} />
        <Route
          exact
          path="/companyDashboard/coachDetails"
          component={CoachDetails}
        />
        <Route exact path="/companyDashboard/courses" component={Courses} />
        <Route
          exact
          path="/companyDashboard/addCourses"
          component={AddCourses}
        />
        <Route
          exact
          path="/companyDashboard/weeklyCourses"
          component={WeeklyCourses}
        />
        <Route
          exact
          path="/companyDashboard/editWeeklyCourse"
          component={EditWeeklyCourse}
        />
        <Route
          exact
          path="/companyDashboard/editSingleCampCourse"
          component={EditSingleCampCourse}
        />
        <Route
          exact
          path="/companyDashboard/weeklyCourseDetails"
          component={WeeklyCourseDetails}
        />
        <Route
          exact
          path="/companyDashboard/weeklyDetails"
          component={WeeklyDetails}
        />
        <Route
          exact
          path="/companyDashboard/singleCampDetails"
          component={SingleCampDetails}
        />
        <Route exact path="/companyDashboard/services" component={Services} />
        <Route
          exact
          path="/companyDashboard/editServices"
          component={EditServices}
        />
        <Route
          exact
          path="/companyDashboard/editCourses"
          component={EditCourses}
        />
        <Route
          exact
          path="/companyDashboard/serviceDetails"
          component={ServiceDetails}
        />
        <Route
          exact
          path="/companyDashboard/courseDetails"
          component={CourseDetails}
        />
        <Route
          exact
          path="/companyDashboard/campOptions"
          component={CampOptions}
        />
        <Route
          exact
          path="/companyDashboard/campMultiDetails"
          component={CampMultiDetails}
        />
        <Route
          exact
          path="/companyDashboard/campSingleDetails"
          component={CampSingleDetails}
        />
        <Route
          exact
          path="/companyDashboard/addServices"
          component={AddServices}
        />
        <Route
          exact
          path="/companyDashboard/addAgeGroup"
          component={AddAgeGroup}
        />
        {/* {auth.isLoggedIn() && additionalRoutes()} */}
      </Switch>
    </Router>
  );
};

export default App;
