import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import QueryString from "query-string";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Employee from "../objects/Employee.js";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SvgIcon from "@material-ui/core/SvgIcon";
import Collapse from "@material-ui/core/Collapse";
import { fade, makeStyles, withStyles } from "@material-ui/core/styles";
import { useSpring, animated } from "react-spring/web.cjs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiAlert from "@material-ui/lab/Alert";
import Container from "@material-ui/core/Container";
import { CardActions } from "@material-ui/core";
import ShareIcon from "@material-ui/icons/Share";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";

const endpoint = "http://api.additivasia.io/api/v1/assignment/employees/";

function Results() {
  const [employeeData, setEmployeeData] = useState(null);

  const url = window.location.href;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // on build to fetch the binary tree result of a give employee name
  useEffect(() => {
    const param = QueryString.parse(window.location.search);
    param.name != "" ? getReporting(param.name) : setLoading(false);
  }, []);

  // helper function to handle API call with given employee name, return employee object
  async function handleRequest(name) {
    let url = endpoint.concat(encodeURIComponent(name));
    const res = await axios.get(url).catch((err) => {
      console.log(err);
    });
    if (res != null) {
      let employeeName = name;
      let title = res.data[0];
      let direct =
        res.data[1] != null ? res.data[1]["direct-subordinates"] : [];

      return new Employee(employeeName, title, direct);
    } else {
      return null;
    }
  }

  // with given employee name, recursive to make binary tree structure
  async function getReporting(name) {
    let employee = await handleRequest(name);
    if (employee != null) {
      let res = await recursive(employee, 0);
      res.treeId = "root";
      console.log(res);
      setLoading(false);
      setEmployeeData(res);
    }
  }

  // Recursive method to retrieve all direct/indirect subordinates and output a JS object
  async function recursive(employee, count) {
    if (employee.subordinate == null) return employee;

    for (var e of employee.subordinate) {
      let res = await handleRequest(e);
      res.treeId = count += 1;
      employee.directReports.push(await recursive(res, count));
    }
    return employee;
  }

  // *** handle share button
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  // handle share button ***

  // *** icon for tree view
  function MinusSquare(props) {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
      </SvgIcon>
    );
  }

  function PlusSquare(props) {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
      </SvgIcon>
    );
  }

  function CloseSquare(props) {
    return (
      <SvgIcon
        className="close"
        fontSize="inherit"
        style={{ width: 14, height: 14 }}
        {...props}
      >
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
      </SvgIcon>
    );
  }
  // icon for tree view ***

  // *** transition for tree view
  function TransitionComponent(props) {
    const style = useSpring({
      from: { opacity: 0, transform: "translate3d(20px,0,0)" },
      to: {
        opacity: props.in ? 1 : 0,
        transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
      },
    });

    return (
      <animated.div style={style}>
        <Collapse {...props} />
      </animated.div>
    );
  }

  TransitionComponent.propTypes = {
    /**
     * Show the component; triggers the enter or exit states
     */
    in: PropTypes.bool,
  };
  // transition for tree view ***

  // Styled tree item for tree view
  const StyledTreeItem = withStyles((theme) => ({
    iconContainer: {
      "& .close": {
        opacity: 0.3,
      },
    },
    group: {
      marginLeft: 7,
      paddingLeft: 18,
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
  }))((props) => (
    <TreeItem {...props} TransitionComponent={TransitionComponent} />
  ));

  const useStyles = makeStyles({
    root: {
      height: 264,
      flexGrow: 1,
      maxWidth: 40,
    },
  });

  // Render Tree view
  const renderTree = (nodes) => (
    <StyledTreeItem
      key={nodes.treeId}
      nodeId={nodes.treeId}
      label={nodes.name + " - " + nodes.title}
    >
      {Array.isArray(nodes.directReports)
        ? nodes.directReports.map((node) => renderTree(node))
        : null}
    </StyledTreeItem>
  );

  // function to display content/no content
  function displayContent() {
    console.log(employeeData);
    if (employeeData != null) {
      return (
        <Grid container direction="row" justify="center" alignItems="center">
          <TreeView
            defaultExpanded={["root"]}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
            style={{ textAlign: "left", textTransform: "capitalize" }}
          >
            {renderTree(employeeData)}
          </TreeView>
        </Grid>
      );
    } else {
      return (
        <Grid container direction="row" justify="center" alignItems="center">
          Employee data not found.
        </Grid>
      );
    }
  }

  return (
    <Container fluid>
      <Grid container direction="row" justify="center">
        <Card style={{ width: 500, marginTop: 50 }}>
          <CardContent>
            <span style={{ fontSize: 20, fontWeight: 600 }}>
              Employee Overview
            </span>

            <Divider style={{ marginTop: 15, marginBottom: 15 }} />
            {loading && <LinearProgress />}
            {!loading && displayContent()}
          </CardContent>

          <CardActions disableSpacing>
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <IconButton aria-label="share">
                <CopyToClipboard text={url}>
                  <ShareIcon onClick={handleClick} />
                </CopyToClipboard>
              </IconButton>
            </Grid>
          </CardActions>
        </Card>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert onClose={handleClose} severity="success">
          Link copied!
        </Alert>
      </Snackbar>
    </Container>
  );
}
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default Results;
