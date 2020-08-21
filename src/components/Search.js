import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { Link } from "react-router-dom";
import { CardActions } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";

const endpoint = "http://api.additivasia.io/api/v1/assignment/employees/";

function Search() {
  const [employees, setEmployees] = useState([]);
  const [employeeSearch, setEmployeeSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(endpoint);

      setEmployees(result.data.sort());
    };

    fetchData();
  }, []);

  return (
    <Container fluid>
      <Grid container direction="row" justify="center" alignItems="center">
        <Card style={{ width: 275, marginTop: 50 }}>
          <CardContent>
            <span style={{ fontSize: 20, fontWeight: 600 }}>
              Employee Exlporer
            </span>

            <Divider style={{ marginTop: 15 }} />
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="flex-start"
            >
              <Autocomplete
                id="employee-search"
                options={employees}
                freeSolo
                style={{ width: 250, marginTop: 20 }}
                onInputChange={(event, value) => {
                  console.log(value);
                  setEmployeeSearch(value);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Employee" variant="outlined" />
                )}
              />
            </Grid>
          </CardContent>
          <CardActions disableSpacing>
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="flex-start"
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                component={Link}
                to={"/searchResult?name=" + employeeSearch}
                disableElevation
              >
                Search
              </Button>
            </Grid>
          </CardActions>
        </Card>
      </Grid>
    </Container>
  );

  function submitSearch(employeeSearch) {
    console.log("Search");
    console.log(employeeSearch);
  }
}

export default Search;
