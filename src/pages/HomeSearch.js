import React from "react";
import { TextField, Fab, AppBar, Card } from "@material-ui/core";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import PlacesAutocomplete from "react-places-autocomplete";

const SearchBar = ({ classes, handleSearch }) => {
  const [loc, setLoc] = React.useState();
  const [address, setAddress] = React.useState();
  const [age, setAge] = React.useState();
  const handleLoc = (event) => {
    setLoc(event.target.value);
    console.log(loc);
  };
  const handleAge = (event) => {
    setAge(event.target.value);
    console.log(age);
  };
  return (
    <PlacesAutocomplete value={address} onChange={setAddress}>
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <AppBar position="static" className={classes.appBar}>
            <tr>
              <td>
                <Fab variant="extended" disableFocusRipple>
                  <TextField
                    label="Location"
                    className={classes.textField}
                    margin="normal"
                    placeholder="Where to search?"
                    value={loc}
                    onChange={(e) => handleLoc(e)}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    {...getInputProps()}
                  />
                </Fab>
              </td>
              <td>
                <Fab variant="extended" disableFocusRipple>
                  <TextField
                    label="Age"
                    type="number"
                    className={classes.textField}
                    margin="normal"
                    placeholder="What's your age?"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    // InputLabelProps={{
                    //   shrink: true,
                    // }}
                    value={age}
                    onChange={(e) => handleAge(e)}
                  />
                </Fab>
              </td>
              <td>
                <Link
                  to={{
                    pathname: "/companies",
                    state: age,
                  }}
                >
                  <Fab
                    color="secondary"
                    style={{ width: "42px", height: "42px", margin: "5px" }}
                  >
                    <SearchIcon />
                  </Fab>
                </Link>
              </td>
            </tr>
          </AppBar>
          <Card>
            <div>
              {loading ? <div>...loading</div> : null}

              {suggestions.map((suggestion) => {
                const style = {
                  backgroundColor: suggestion.active ? "#41b6e6" : "#e0e0e0",
                  position: "relative",
                };

                return (
                  <div {...getSuggestionItemProps(suggestion, { style })}>
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default SearchBar;
