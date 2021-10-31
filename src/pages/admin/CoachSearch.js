import { Search } from '@material-ui/icons'
import {
  FormControl,
  TextField,
  Button,
  CircularProgress,
  Typography
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import SearchResultCard from '../../components/SearchResultCard'
import axios from 'axios'
import auth from '../../lib/auth'
import { isEmpty } from 'lodash'


const CoachSearch = ({setNewCoach, setSentInvite}) => {
  const [searchResults, setSearchResults] = useState([])
  const [companyInfo, setCompanyInfo] = useState([])
  
  useEffect(() => {    
    axios.get(`/users/${auth.getUserId()}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        setCompanyInfo(res.data[0])
      })
  },[])
  
  const handleSearch = (event) => {
    console.log('searcheddd')
    event.preventDefault()
    const query = event.target.value
    if (!query) {
      setSearchResults([])
    } else {
    axios.get(`/coaches/search/${query}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(response => {
        if (response.status === 400) {
          console.log(response.data)
        } else {
          if (isEmpty(response.data)) {
            setSearchResults([])
            setNewCoach(true)
          } else {
            setSearchResults(response.data)
            setNewCoach(false)
          }
        }        
      })
    }
  }

  return (
    <FormControl >
      <TextField type="search" placeholder="Search for coaches here" onChange={(event) => handleSearch(event)}/>
      <SearchResultCard companyInfo={companyInfo} results={searchResults} setSentInvite={setSentInvite}/>

    
    {/* {searchResults.map(user => {
      return (
        <h2>{user.name}</h2>
      )
    })} */}
    </FormControl>
  )
}

export default CoachSearch