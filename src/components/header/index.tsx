import { connect } from "react-redux";
import { logout, UserData, UserURL } from "../../redux/authSlices";
import { AppDispatch, RootState } from "../../redux/store";
import Header from "./header.tsx";

const mapStateToProps = (
  state: RootState
): { userData: UserData; userURL: UserURL[] } => ({
  userData: state.auth.userData,
  userURL: state.auth.userURL,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  handleLogout: () => dispatch(logout()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectedHeader = connector(Header);

export default ConnectedHeader;
