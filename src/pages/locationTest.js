import React from "react";

const test = ({ location }) => {
  const { name } = location.state;
  console.log(location.state);
  const [companyDetails, setCompanyDetails] = React.useState({
    name,
  });

  return (
    <div>
      <h1>{{ name }}</h1>
    </div>
  );
};

export default test;
