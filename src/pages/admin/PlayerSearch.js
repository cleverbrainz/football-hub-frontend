import { Search } from '@material-ui/icons'
import {
  FormControl,
  TextField,
  Button,
  CircularProgress
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import SearchResultCard from '../../components/SearchResultCard'
import axios from 'axios'
import auth from '../../lib/auth'


const PlayerSearch = () => {
  const [searchResults, setSearchResults] = useState([])
  const [companyInfo, setCompanyInfo] = useState([])
  
  useEffect(() => {
    axios.get(`/users/${auth.getUserId()}`)
      .then(res => {
        setCompanyInfo(res.data[0])
      })
  },[])
  
  console.log(companyInfo)
  
  const handleSearch = (event) => {
    event.preventDefault()
    const query = event.target.value
    console.log(query)
    if (!query) {
      setSearchResults([])
    } else {
    axios.get(`/players/search/${query}`)
      .then(response => {
        console.log(response.data)
        setSearchResults(response.data)
      })
    }
  }

  return (
    <FormControl>
    <TextField type="search" placeholder="Search for players here" onChange={(event) => handleSearch(event)}/>
    <SearchResultCard companyInfo={companyInfo} results={searchResults}/>

    
    {/* {searchResults.map(user => {
      return (
        <h2>{user.name}</h2>
      )
    })} */}
    </FormControl>
  )
}

export default PlayerSearch