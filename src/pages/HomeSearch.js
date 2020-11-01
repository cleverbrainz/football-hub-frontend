import React, { useState } from "react";
import { TextField, AppBar, Card } from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import PlacesAutocomplete from "react-places-autocomplete";
import LocationOnSharpIcon from '@material-ui/icons/LocationOnSharp';
import { makeStyles } from "@material-ui/core/styles";
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import { FormControlLabel, Checkbox, Typography, Box, Fab } from '@material-ui/core'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

const useStyles = makeStyles((theme) => ({
  appBar: {
    height: "60px",
    padding: "3px",
    backgroundColor: "#e0e0e0",
    minWidth: "650px",
    width: "60%",
    borderRadius: "40px",
    position: 'absolute',
    top: '24%',
    left: '50%',
    transform: 'translate(-50%, -30%)',
    display: 'none',
    [theme.breakpoints.up("sm")]: {
      display: 'block'
    },

  },
  textField: {
    minHeight: "60px",
    borderRadius: '40px',
    // border: '1px solid black',
    position: 'absolute',
    top: '50%',
    left: '0',
    width: '30%',
    padding: '5px 20px 0 20px',
    transform: 'translateY(-50%)',
    display: 'flex',
    justifyContent: 'center',
    "&:hover": {
      backgroundColor: 'lightgrey',
    },
  },
  ageContainer: {
    "&:hover": {
      cursor: 'pointer'
    },
    borderRight: '1px solid black',
    borderLeft: '1px solid black',
    backgroundColor: "#e0e0e0",
    boxShadow: '0',
    minHeight: "60px",
    borderRadius: '40px',
    position: 'absolute',
    top: '50%',
    left: '30%',
    width: '30%',
    padding: '5px 20px 0 20px',
    transform: 'translateY(-50%)',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  filterCard: {
    position: 'absolute',
    minHeight: '250px',
    padding: '25px',
    top: '90%',
    right: 0,
    width: '60%',
    marginTop: '20px',
    borderRadius: '20px',
    // display: 'none'
  }
}))

const SearchBar = ({ history }) => {
  const classes = useStyles();
  const [address, setAddress] = React.useState();
  const [nonLocationFilter, setNonLocationFilter] = useState()


  const [filterDetails, setFilterDetails] = React.useState({
    location: {
      longitude: '',
      latitude: ''
    },
    timing: {
      days: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      },
      times: {
        morning: false,
        afternoon: false,
        evening: false
      }
    },
    age: {
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
      13: false,
      14: false,
      15: false,
      16: false,
      17: false,
      18: false,
      adults: false
    }
  })

  const handleTimingChange = (e) => {
    const { name, checked, id } = e.target
    setFilterDetails({
      ...filterDetails, timing: {
        ...filterDetails.timing,
        [id]: { ...filterDetails.timing[id], [name]: checked }
      }
    })
  };

  const handleAgeChange = (e) => {
    const { name, checked } = e.target
    setFilterDetails({
      ...filterDetails, age: {
        ...filterDetails.age, [name]: checked
      }
    })
  };

  function handleFilterSubmit() {

    console.log(filterDetails)

    history.push({
      pathname: '/companies',
      state: filterDetails
    })

    // axios.post('/filteredCompanies', filterDetails)
    //   .then(res => {
    //     toggleModal()
    //     setCompanies(res.data)
    //   })
  }

  const ageFilters = (
    <div>
      <Typography component='div'>
        <Box fontSize={18} fontWeight="fontWeightBold" m={0}>
          Select Ages
        </Box>
      </Typography>

      {Object.keys(filterDetails.age).map(el => {
        const text = el === 'adults' ? 'Adults' : `${el} years`
        return (
          <FormControlLabel
            control={<Checkbox
              checked={filterDetails.age[el]}
              onChange={handleAgeChange}
              name={el} />}
            label={text}
          />
        )
      })}
    </div>
  )

  const timingFilters = (
    <div>
      <Typography component='div'>
        <Box fontSize={18} fontWeight="fontWeightBold" m={0}>
          Select Days
        </Box>
      </Typography>

      {Object.keys(filterDetails.timing.days).map((el, i) => {
        return (
          <FormControlLabel

            control={<Checkbox id='days' checked={filterDetails.timing.days[el]}
              onChange={handleTimingChange}
              name={el} />}
            label={el.charAt(0).toUpperCase() + el.slice(1)}
          />
        )
      })}

      <Typography component='div'>
        <Box fontSize={18} fontWeight="fontWeightBold" m={0}>
          Select Start Times
        </Box>
      </Typography>

      {Object.keys(filterDetails.timing.times).map((el, i) => {
        let upper = el.charAt(0).toUpperCase() + el.slice(1)
        let text
        if (i === 0) text = `${upper} (8am - 12pm)`
        else if (i === 1) text = `${upper} (12pm - 6pm)`
        else text = `${upper} (6pm - 10pm)`
        return (
          <FormControlLabel
            control={<Checkbox id='times' checked={filterDetails.timing.times[el]}
              onChange={handleTimingChange}
              name={el} />}
            label={text}
          />
        )
      })}
    </div>
  )

  const handleSelect = async (value) => {
    
    const results = await geocodeByAddress(value)
    const latLng = await getLatLng(results[0])

    setAddress(value)
    setFilterDetails({
      ...filterDetails, location: {
        latitude: latLng.lat, longitude: latLng.lng
      }
    })
  }





  return (
    <AppBar position="static" className={classes.appBar}>
      <PlacesAutocomplete value={address} onSelect={value => handleSelect(value)}
        onChange={setAddress}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <>
            <TextField
              className={classes.textField}
              placeholder="Explore location"
              {...getInputProps()}
              InputProps={{
                disableUnderline: true,
              }}

            />


            <Card style={{
              marginTop: '70px',
              borderRadius: '20px'
            }}>
              <div>
                {loading && <div> ... </div>}

                {suggestions.map((el, i) => {
                  const style = {
                    backgroundColor: el.active ? '#e6e6e6' : 'white',
                    height: '65px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '5px 20px',
                  }

                  return (
                    <div key={i} {...getSuggestionItemProps(el, { style })}>
                      <LocationOnSharpIcon />
                      <p> {el.description} </p>
                    </div>
                  )
                })}

              </div>
            </Card>
          </>
        )}
      </PlacesAutocomplete>

      <div
        onClick={() => {
          // openFilterCard()
          setNonLocationFilter('age')
        }}
        className={classes.ageContainer}>
        {Object.keys(filterDetails.age).map((data, i) => {
          const text = data === 'adults' ? 'Adults' : `${data} years`
          if (filterDetails.age[data]) {
            return (

              <Chip
                style={{ backgroundColor: 'lightblue' }}
                icon={<DoneIcon style={{ fontSize: '16px' }} />}
                label={text}
                className={classes.chip}
              />
            );
          }
        })}

      </div>

      <div style={{ width: '40%', left: '60%' }}
        onClick={() => {
          // openFilterCard()
          setNonLocationFilter('timing')
        }}
        className={classes.ageContainer}>
        {Object.keys(filterDetails.timing.days).map((data, i) => {
          const { days } = filterDetails.timing
          const text = data.charAt(0).toUpperCase() + data.slice(1)
          if (days[data]) {
            return (

              <Chip
                style={{ backgroundColor: 'lightgreen' }}
                icon={<DoneIcon style={{ fontSize: '16px' }} />}
                label={text}
                className={classes.chip}
              />
            );
          }
        })}
        {Object.keys(filterDetails.timing.times).map((data, i) => {
          const { times } = filterDetails.timing
          const text = data.charAt(0).toUpperCase() + data.slice(1)
          if (times[data]) {
            return (

              <Chip
                style={{ backgroundColor: 'lightgreen' }}
                icon={<DoneIcon style={{ fontSize: '16px' }} />}
                label={text}
                className={classes.chip}
              />
            );
          }
        })}

      </div>

      <Fab onClick={handleFilterSubmit}
        color="secondary" aria-label="edit">
        <SearchIcon />
      </Fab>

      <Card id='filter-card' className={classes.filterCard}>
        <div>
          {nonLocationFilter === 'age' ? ageFilters : timingFilters}
        </div>
      </Card>

    </AppBar>
  );
};

export default withRouter(SearchBar);
