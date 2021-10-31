// javascript date is 0 based and so jan is month 0 etc.. 
// need to configure this to adjust for month forward 

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import auth from '../lib/auth'

const CalendarData = () => {

  const [courses, setCourses] = useState()
  const appointments = []

  useEffect(() => {
    axios.get(`/users/${auth.getUserId()}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        const { courses } = res.data[0]

        courses.forEach((el, i) => {
          const { optionalName, startDate, endDate, location, courseType, sessions } = el.courseDetails

          if (el.courseType === 'Camp') {
            sessions.forEach((el, i) => {
              // appointments.push({
              //   title: optionalName,
              //   startDate: new Date(),
              //   endDate: new Date(),
              //   id: i,
              //   location: location
              // })
              console.log(new Date(el.startDate, 9, 35))
            })

          } else {

          }



        })
      })
  }, [])



  return appointments;
};

    // startDate: new Date(2020, 8, 25, 9, 35),

export default CalendarData;

