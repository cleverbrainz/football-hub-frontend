import React, { useState, useEffect } from 'react'
import axios from 'axios'


const CourseRegister = (props) => {
  console.log(props)
  const [register, setRegister] = useState([])

  useEffect(() => {
    axios.get(props.match.params.courseId)
      .then(res => {

      })
  })

  return <h1>Register!</h1>
}


export default CourseRegister