import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import {
    TextField,
    FormControl,
    InputLabel,
    Container,
    Typography,
    MenuItem,
    Select,
} from "@material-ui/core";
import { companyCollection, storage } from "../../lib/firebase";

const useStyles = makeStyles((theme) => ({
    container: {
        margin: "270px 0 ",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: `${window.innerHeight - 100}px`,
        textAlign: "center",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 300,
    },
    form: {
        width: "40%",
        minWidth: "300px",
        display: "flex",
        flexDirection: "column",
        height: "55%",
        justifyContent: "space-around",
    },
    button: {
        position: "relative",
        margin: "15px 0",
    },
    spacing: {
        margin: "20px 0",
    },
    upload: {
        margin: "20px auto",
    }
}));

export default function ContainedButtons({ location }) {
    const classes = useStyles();

    const [name, setName] = React.useState(location.state[0].company_name);
    const [vat, setVat] = React.useState(location.state[0].vat_number);
    const [rnumber, setRnumber] = React.useState(location.state[0].company_registration_number);
    const [cnumber, setCnumber] = React.useState(location.state[0].main_contact_number);
    const [memail, setMemail] = React.useState(location.state[0].main_email);
    const [anumber, setAnumber] = React.useState(location.state[0].accounts_contact_number);
    const [email, setEmail] = React.useState(location.state[0].company_email);
    const [insurance, setInsurance] = React.useState(location.state[0].liability_insurance);
    const [pinsurance, setPinsurance] = React.useState(location.state[0].professional_idemnity_insurance);

    const [image, setImage] = React.useState(null);
    const [url, setUrl] = React.useState("");

    const handleUpload = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        companyCollection
            .doc("weCmZPEJY9vh8ApacEy0")
            .update({
                company_name: name,
                vat_number: vat,
                company_registration_number: rnumber,
                main_contact_number: cnumber,
                main_email: memail,
                company_email: email,
                accounts_contact_number: anumber,
                liability_insurance: insurance,
                professional_idemnity_insurance: pinsurance,
            })
            .then(() => {
                alert("Message has been submitted!");
            })
            .catch((error) => {
                alert(error.message);
            });

        const uploadTask = storage.ref(`company-details/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (error) => {
                console.log(error);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then((url) => {
                        setUrl(url);
                    });
            }
        );

        setName("");
        setVat("");
        setRnumber("");
        setCnumber("");
        setMemail("");
        setAnumber("");
        setEmail("");
        setInsurance("");
        setPinsurance("");
    };

    return (
        <Container className={classes.container}>
            <form
                className={classes.form}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <Typography variant="h4"> EDIT COMPANY DETAILS </Typography>
                <TextField
                    className={classes.spacing}
                    id="outlined-basic"
                    label="Company name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    className={classes.spacing}
                    id="outlined-basic"
                    label="VAT number (optional)"
                    variant="outlined"
                    value={vat}
                    onChange={(e) => setVat(e.target.value)}
                />
                <TextField
                    className={classes.spacing}
                    id="outlined-basic"
                    label="Company registration number"
                    variant="outlined"
                    value={rnumber}
                    onChange={(e) => setRnumber(e.target.value)}
                />
                <TextField
                    className={classes.spacing}
                    id="outlined-basic"
                    label="Main contact number"
                    variant="outlined"
                    value={cnumber}
                    onChange={(e) => setCnumber(e.target.value)}
                />
                <TextField
                    className={classes.spacing}
                    id="outlined-basic"
                    label="Main email"
                    variant="outlined"
                    value={memail}
                    onChange={(e) => setMemail(e.target.value)}
                />
                <TextField
                    className={classes.spacing}
                    id="outlined-basic"
                    label="Accounts contact number"
                    variant="outlined"
                    value={anumber}
                    onChange={(e) => setAnumber(e.target.value)}
                />
                <TextField
                    className={classes.spacing}
                    id="outlined-basic"
                    label="Accounts email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <FormControl variant="outlined" className={classes.spacing}>
                    <InputLabel>Public Liability insurance</InputLabel>
                    <Select
                        label="Public Liability insurance"
                        value={insurance}
                        onChange={(e) => setInsurance(e.target.value)}
                    >
                        <MenuItem value={"Select cover amount"}>Select cover amount</MenuItem>
                        <MenuItem value={"I don't have any insurance"}>
                            I don't have any insurance
            </MenuItem>
                        <MenuItem value={"£250,000"}>£250,000</MenuItem>
                        <MenuItem value={"£500,000"}>£500,000</MenuItem>
                        <MenuItem value={"£1,000,000"}>£1,000,000</MenuItem>
                        <MenuItem value={"£2,000,000"}>£2,000,000</MenuItem>
                        <MenuItem value={"£5,000,000"}>£5,000,000</MenuItem>
                        <MenuItem value={"£10,000,000"}>£10,000,000</MenuItem>
                        <MenuItem value={"Other"}>Other</MenuItem>
                    </Select>

                </FormControl>

                <FormControl variant="outlined" className={classes.spacing}>
                    <InputLabel>Professional idemnity insurance</InputLabel>
                    <Select
                        label="Professional idemnity insurance"
                        value={pinsurance}
                        onChange={(e) => setPinsurance(e.target.value)}
                    >
                        <MenuItem value={"Select cover amount"}>Select cover amount</MenuItem>
                        <MenuItem value={"I don't have any insurance"}>
                            I don't have any insurance
            </MenuItem>
                        <MenuItem value={"£250,000"}>£250,000</MenuItem>
                        <MenuItem value={"£500,000"}>£500,000</MenuItem>
                        <MenuItem value={"£1,000,000"}>£1,000,000</MenuItem>
                        <MenuItem value={"£2,000,000"}>£2,000,000</MenuItem>
                        <MenuItem value={"£5,000,000"}>£5,000,000</MenuItem>
                        <MenuItem value={"£10,000,000"}>£10,000,000</MenuItem>
                        <MenuItem value={"Other"}>Other</MenuItem>
                    </Select>

                </FormControl>

                <input id="upload-photo" className={classes.upload} type="file" onChange={handleUpload} />

                <Button
                    className={classes.button}
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    SUBMIT
        </Button>

                <Link to="/companyDashboard/companyDetailsApproved">
                    <Button className={classes.button} variant="outlined" color="primary">
                        Back
          </Button>
                </Link>
            </form>
        </Container>
    );
}
