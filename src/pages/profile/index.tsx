import React from "react";
import { Box } from "@mui/material";
import { connect, ConnectedProps } from "react-redux";
import UserProfile from "../../components/profileComponent";
import ConnectedHeader from "../../components/header";
import { RootState } from "../../redux/store";
import { UserData } from "../../redux/authSlices";

const Profile: React.FC<PropsFromRedux> = (props) => {
  const { userData } = props;

  return (
    <>
      <ConnectedHeader />
      <Box sx={{ margin: 1 }}>
        <UserProfile userData={userData} />
      </Box>
    </>
  );
};

const mapStateToProps = (state: RootState): { userData: UserData } => ({
  userData: state.auth.userData,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const PageConnector =  connector(Profile);

export default PageConnector;
