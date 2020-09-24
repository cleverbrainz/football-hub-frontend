import React from 'react'
import LocationFilter from './LocationFilter'
import MoreFilters from './MoreFilters'
import { Typography, Box, TextField, InputAdornment } from '@material-ui/core';


const FilterModal = ({ toggleModal, address, setAddress, handleSelect, classes, selectedFilter }) => {

  console.log(selectedFilter)

  const componentsObject = {
    Location: LocationFilter,
    More: MoreFilters,
    // skill: SkillFilter
  }

  const Component = componentsObject[selectedFilter]

  return (

    <div className='modal is-active'>
      <div onClick={toggleModal} className='modal-background'></div>
      <div className="modal-content">

      <Typography component='div'>
        <Box fontSize={23} fontWeight="fontWeightBold" m={5}>
          Filter by {selectedFilter.toLowerCase()}
        </Box>
      </Typography>

        <Component
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
