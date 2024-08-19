import axios from "axios";
import { logout, refreshTokens } from "../redux/slices/authSlices";

export async function refreshAuthToken(
  refreshToken: string,
  dispatch: any
) {
  if (!refreshToken) {
    dispatch(logout());
    return;
  }

  try {
    const response = await axios.post("https://dummyjson.com/auth/refresh", {
      refreshToken: refreshToken,
    });
    dispatch(
      refreshTokens({
        token: response.data.token,
        refreshToken: response.data.refreshToken,
      })
    );
  } catch (error) {
    console.error("Token refresh failed", error);
    dispatch(logout());
  }
}
