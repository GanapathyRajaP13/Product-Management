import React from "react";
import { connect, ConnectedProps } from "react-redux";
import Header from "../../components/header";
import { Box } from "@mui/material";
import { RootState } from "../../redux/store";

const Dashboard: React.FC<PropsFromRedux> = (props) => {
  console.log(props.userData);
  return (
    <>
      <Header />
      <Box sx={{ margin: 1 }}>
        <h2>Dashboard</h2>
      </Box>
    </>
  );
};

const mapStateToProps = (state: RootState) => state.auth;
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Dashboard);
