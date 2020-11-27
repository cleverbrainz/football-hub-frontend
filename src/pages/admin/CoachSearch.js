import { Search } from '@material-ui/icons'
import {
  FormControl,
  TextField,
  Button,
  CircularProgress
} from '@material-ui/core'
import React, { useState } from 'react'
import SearchResultCard from '../../components/SearchResultCard'
import axios from 'axios'


const CoachSearch = () => {
  const [searchResults, setSearchResults] = useState([])
  const handleSearch = (event) => {
    event.preventDefault()
    const query = event.target.value
    console.log(query)
    if (!query) {
      setSearchResults([])
    } else {
    axios.get(`/coaches/search/${query}`)
      .then(response => {
        console.log(response.data)
        setSearchResults(response.data)
      })
    }
  }

  return (
    <FormControl>
    <TextField type="search" placeholder="Search for coaches here" onChange={(event) => handleSearch(event)}/>
    <SearchResultCard results={searchResults}/>

    
    {/* {searchResults.map(user => {
      return (
        <h2>{user.name}</h2>
      )
    })} */}
    </FormControl>
  )
}

export default CoachSearch