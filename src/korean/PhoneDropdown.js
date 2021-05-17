import React from 'react'
import { option, select } from '@material-ui/core'


const PhoneDropDown = ({locale}) => {
  
  return (
      <>
        <option data-countryCode="" disabled value="">Select</option>
        <option data-countryCode="KR" value="82">{locale === 'ko' ? '대한민국' : 'Korea, South'} (+82)</option>
        <option data-countryCode="GB" value="44">UK (+44)</option>
      </>
  )
}


export default PhoneDropDown