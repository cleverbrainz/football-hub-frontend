import React from 'react'
import LocationFilter from './LocationFilter'
import AgeFilter from './AgeFilter'
import TimingFilter from './TimingFilter'
import { Typography, Box, TextField, InputAdornment } from '@material-ui/core';


const FilterModal = ({ toggleModal,
  handleFilterSubmit,
  filterDetails,
  address,
  setAddress,
  handleSelect,
  classes,
  selectedFilter,
  handleTimingChange,
  handleAgeChange 
}) => {

  const componentsObject = {
    Location: LocationFilter,
    Age: AgeFilter,
    Timing: TimingFilter
  }

  const Component = componentsObject[selectedFilter]

  const modalTitle = selectedFilter === 'Timing' ? 'date & time' : selectedFilter.toLowerCase()

  return (

    <div className='modal is-active'>
      <div onClick={toggleModal} className='modal-background'></div>
      <div className="modal-content">

        <Typography component='div'>
          <Box fontSize={23} fontWeight="fontWeightBold" m={5}>
            Filter by {modalTitle}
          </Box>
        </Typography>

        <Component
          handleFilterSubmit={(e) => handleFilterSubmit(e)}
          handleAgeChange={(e) => handleAgeChange(e)}
          handleTimingChange={(e) => handleTimingChange(e)}
          filterDetails={filterDetails}
          classes={classes}
          address={address}
          handleSelect={(value) => handleSelect(value)}
          setAddress={setAddress}
          toggleModal={() => toggleModal()}
        />

      </div>
    </div>

  )
}

export default FilterModal
