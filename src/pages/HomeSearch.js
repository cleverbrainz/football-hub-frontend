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
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  appBar: {
    height: "60px",
    zIndex: 50,
    backgroundColor: "#e0e0e0",
    minWidth: "650px",
    width: "60%",
    position: 'absolute',
    top: '50%',
    left: '50%',
    borderRadius: '50px',
    transform: 'translate(-50%, -50%)',
    display: 'none',
    [theme.breakpoints.up("sm")]: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row'
    },

  },
  locationField: {
    borderTopLeftRadius: '50px',
    borderBottomLeftRadius: '50px',
    flex: 1.5,
    minHeight: "45px",
    display: 'flex',
    paddingLeft: '20px',
    justifyContent: 'center',
    borderRight: '1px solid grey',

    "&:hover": {
      backgroundColor: 'lightgrey',
    },
  },
  ageContainer: {
    // whiteSpace: 'nowrap',
    overflow: 'scroll',
    flex: 1,
    color: 'grey',
    paddingLeft: '10px',
    display: 'flex',
    alignItems: 'center',
    "&:hover": {
      cursor: 'pointer',
      backgroundColor: 'lightgrey',
    },
    minHeight: "45px",
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  filterCard: {
    position: 'absolute',
    minHeight: '250px',
    padding: '25px',
    top: '80%',
    left: 0,
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
  const [selectedValues, setSelectedValues] = useState({
    age: null,
    day: null,
    time: null
  })

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

  useEffect(() => {
    const { age, timing } = filterDetails
    let ageResult = false;
    let daysResult = false;
    let timeResult = false;

    for (const i in age) {
      if (age[i] === true) {
        ageResult = true;
        break;
      }
    }

    for (const i in timing) {
      for (const j in timing[i]) {
        if (timing[i][j] === true) {
          if (timing[i] === 'days') daysResult = true;
          else timeResult = true
          break;
        }
      }
    }

    setSelectedValues({ day: daysResult, age: ageResult, time: timeResult })
  }, [filterDetails])

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

      {/* location filter */}
      <PlacesAutocomplete value={address} onSelect={value => handleSelect(value)}
        onChange={setAddress}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <>
            <TextField
              className={classes.locationField}
              placeholder="Explore locations"
              {...getInputProps()}
              InputProps={{
                disableUnderline: true,
              }}
            />

            <Card style={{
              position: 'absolute',
              marginTop: '25rem',
              borderRadius: '25px'
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




      <div onClick={() => {
        if (nonLocationFilter === 'age') setNonLocationFilter(null)
        else setNonLocationFilter('age')
      }}
        style={{ borderRight: '1px grey solid' }}
        className={classes.ageContainer}>
        {selectedValues.age ? Object.keys(filterDetails.age).map((data, i) => {
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
        }) : (
            <p> Explore ages </p>
          )}

      </div>



      <div style={{ width: '40%', left: '60%' }}
        onClick={() => {
          if (nonLocationFilter === 'timing') setNonLocationFilter(null)
          else setNonLocationFilter('timing')
        }}
        className={classes.ageContainer}>
        {(selectedValues.day || selectedValues.time) ? Object.keys(filterDetails.timing.days).map((data, i) => {
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
        }) : <p> Explore days & times </p>}
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

      {nonLocationFilter && <Card id='filter-card' className={classes.filterCard}>
        <div>
          {nonLocationFilter === 'age' ? ageFilters : timingFilters}
        </div>
      </Card> }

    </AppBar>
  );
};

export default withRouter(SearchBar);
