import axios from "axios";
import { logout, refreshTokens } from "../redux/slices/authSlices";
import { AppDispatch } from "../redux/store";

export async function refreshAuthToken(
  refreshToken: string | null,
  dispatch: AppDispatch
): Promise<void> {
  if (!refreshToken) {
    dispatch(logout());
    return;
  }

  const url = import.meta.env.VITE_REFRESH_URL as string;

  try {
    const response = await axios.post(url, { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    dispatch(
      refreshTokens({
        token: accessToken,
        refreshToken: newRefreshToken,
      })
    );
  } catch (error) {
    console.error("Token refresh failed", error);
    dispatch(logout());
  }
}
