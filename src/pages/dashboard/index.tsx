import { Box } from "@mui/material";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import DashboardComponent from "../../components/dashboard";
import Header from "../../components/header";
import { RootState } from "../../redux/store";

const Dashboard: React.FC<PropsFromRedux> = (props) => {
  console.log(props.userData);
  return (
    <>
      <Header />
      <Box sx={{ margin: 1 }}>
        <DashboardComponent />
      </Box>
    </>
  );
};

const mapStateToProps = (state: RootState) => state.auth;
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Dashboard);
