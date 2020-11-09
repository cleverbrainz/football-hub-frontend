import React from 'react'
import PlacesAutocomplete from 'react-places-autocomplete'
import SearchSharpIcon from '@material-ui/icons/SearchSharp';
import LocationOnSharpIcon from '@material-ui/icons/LocationOnSharp';
import { Typography, Box, TextField, InputAdornment } from '@material-ui/core';


const LocationFilter = ({ toggleModal, address, setAddress, handleSelect, classes }) => {

  return (
    <>

      <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <>
            <TextField
              style={{ width: '75%', marginBottom: '25px' }}
              variant="outlined"
              label='Search for location'
              {...getInputProps()}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start">
                    <SearchSharpIcon />
                  </InputAdornment>
                ),
                // classes: {
                //   input: classes.resize
                // }
              }}
            />

            <div>
              {loading && <div> ... </div>}

              {suggestions.map((el) => {
                const style = {
                  backgroundColor: el.active ? '#e6e6e6' : 'white',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 35px',
                }

                return (
                  <div {...getSuggestionItemProps(el, { style })}>
                    <LocationOnSharpIcon />
                    <p> {el.description} </p>
                  </div>
                )
              })}
            </div>

          </>
        )}
      </PlacesAutocomplete>
    </>
  )
}

export default LocationFilter
