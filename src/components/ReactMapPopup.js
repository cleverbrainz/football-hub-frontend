import React from "react";
import { Popup } from "react-map-gl";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { TimelineLite, Power2 } from "gsap";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import CancelSharpIcon from "@material-ui/icons/CancelSharp";

const useStyles = makeStyles((theme) => ({
  slideshowRoot: {
    overflow: "hidden",
    width: "275px",
    height: "180px",
    position: "relative",
  },
  slideshowContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    transition: "0.2s",
  },
  slideArrows: {
    zIndex: "100",
    width: "100%",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icons: {
    fontSize: '33px',
    color: 'white',
    '&:hover': {
      cursor: 'pointer',
    }
  }
}));

const ReactMapPopup = ({ selected }) => {

  const {company, location} = selected
  const { companyName, images, courses } = company.listingInfo;
  const { latitude, longitude } = courses[location].courseDetails;

  const classes = useStyles();

  let count = 1;
  let currentPosition = 0;

  const HandleSlide = (e) => {
    const size = 275;
    const t1 = new TimelineLite();

    if (e.target.tagName === 'path') e.target = e.target.parentNode

    if (e.target.id === "right") {
      if (count === images.length) {
        return;
      }

      t1.to("#slideshow", 0.1, { filter: "blur(1px)" })
        .to("#slideshow", 0.1, { transform: `translateX(-${size * count}px)` })
        .to("#slideshow", 0.15, { filter: "blur(0)" }, "+=0.1");
      count++;
      currentPosition += size;
      console.log(count);
    } else {
      if (count === 1) {
        return;
      }

      t1.to("#slideshow", 0.1, { filter: "blur(1px)" })
        .to("#slideshow", 0.1, {
          transform: `translateX(-${currentPosition - size}px)`,
        })
        .to("#slideshow", 0.15, { filter: "blur(0)" }, "+=0.1");
      count--;
      currentPosition -= size;
    }
  };

  return (
    <Popup
      offsetLeft={0}
      offsetTop={-32}
      latitude={parseFloat(latitude)}
      longitude={parseFloat(longitude)}
    >
      <section
        style={{ width: "275px", height: "180px", position: "relative" }}
      >
        <div className={classes.slideArrows}>
          <KeyboardArrowLeft
            className={classes.icons}
            id="left"
            onClick={(e) => HandleSlide(e)}
          />
          <KeyboardArrowRight
            className={classes.icons}
            id="right"
            onClick={(e) => HandleSlide(e)}
          />
        </div>
        <div className={classes.slideshowRoot}>
          <div id="slideshow" className={classes.slideshowContainer}>
            {images && images.map((el, i) => <img src={el} key={i} alt="" />)}
          </div>
        </div>
      </section>
      <h1> {companyName} </h1>

      {/* <Link
        to={{
          pathname: `/companies/${company.companyId}`,
          state: company.companyInfo,
        }}
      >
        <p> Know more!</p>
      </Link> */}
    </Popup>
  );
};

export default ReactMapPopup;
