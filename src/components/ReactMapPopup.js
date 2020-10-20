import React from 'react';
import { Popup } from 'react-map-gl'

const ReactMapPopup = ({ selected, closeSelectedPopup }) => {
  const {latitude, longitude } = selected.companyInfo.location
  const { name } = selected.companyInfo
  return (
    <Popup
    offsetLeft={- 5}
    offsetTop={-32}
    latitude={latitude}
    longitude={longitude}
    onClose={closeSelectedPopup}>
    <h1> {name} </h1>
  </Popup>
  );
};

export default ReactMapPopup;