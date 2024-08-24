import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/slices/authSlices";
import { RootState, AppDispatch } from "../../redux/store";
import apiClient, { AxiosResponse } from "../../api/apiClient";
import {
  TextField,
  Container,
  Box,
  Typography,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomButton from "../atoms/customButton";

const genderEnum = z.enum(["male", "female", "other"]);

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string(),
    email: z.string().email("Invalid email address"),
    gender: genderEnum,
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .transform((data) => ({
    ...data,
    username: `${data.firstName} ${data.lastName}`,
  }));

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

type FormData = LoginFormData | RegisterFormData;

const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, tokenExpirationTime } = useSelector(
    (state: RootState) => state.auth
  );
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const togglePasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: {
      gender: undefined,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isLogin) {
      const payload = {
        ...data,
        time: tokenExpirationTime,
      };
      try {
        await dispatch(login(payload));
      } catch (error) {
        console.error("Login failed", error);
      }
    } else {
      try {
        const response: AxiosResponse = await apiClient.post(
          "auth/register",
          data
        );
        toast.success(response.data);
        registerLogin();
      } catch (error) {
        console.error("Registration failed", error);
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  const getErrorMessage = (error: any) => {
    if (typeof error === "string") {
      return error;
    } else if (error && typeof error.message === "string") {
      return error.message;
    }
    return undefined;
  };

  const registerLogin = () => {
    setIsLogin(!isLogin);
    reset({
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      firstName: "",
      lastName: "",
      gender: undefined,
    });
    setConfirmPasswordVisible(false);
  };

  useEffect(() => {
    dispatch(logout());
  }, [isLogin]);

  const registrationErrors = !isLogin
    ? (errors as FieldErrors<RegisterFormData>)
    : {};
  const loginErrors = isLogin ? (errors as FieldErrors<LoginFormData>) : {};

  return (
    <Container>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          width="100%"
          maxWidth={isLogin ? "300px" : "600px"}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            p: 2,
            borderRadius: "8px",
          }}
        >
          <Typography textAlign="center" mb={3}>
            {isLogin ? "Login" : "Register"}
          </Typography>

          {isLogin ? (
            <>
              <TextField
                label="Username"
                fullWidth
                {...register("username")}
                error={!!loginErrors.username}
                helperText={getErrorMessage(loginErrors.username)}
                variant="filled"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Password"
                type={confirmPasswordVisible ? "text" : "password"}
                fullWidth
                {...register("password")}
                error={!!loginErrors.password}
                helperText={getErrorMessage(loginErrors.password)}
                variant="filled"
                sx={{
                  mb: 2,
                  ".MuiInputBase-root.MuiFilledInput-root": {
                    backgroundColor: "#e8f0fe",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      sx={{
                        cursor: "pointer",
                      }}
                      onClick={togglePasswordVisibility}
                      position="end"
                    >
                      {confirmPasswordVisible ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  {...register("firstName")}
                  error={!!registrationErrors.firstName}
                  helperText={getErrorMessage(registrationErrors.firstName)}
                  variant="filled"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  {...register("lastName")}
                  error={!!registrationErrors.lastName}
                  helperText={getErrorMessage(registrationErrors.lastName)}
                  variant="filled"
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Password"
                  type={confirmPasswordVisible ? "text" : "password"}
                  fullWidth
                  {...register("password")}
                  error={!!registrationErrors.password}
                  helperText={getErrorMessage(registrationErrors.password)}
                  variant="filled"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        sx={{
                          cursor: "pointer",
                        }}
                        onClick={togglePasswordVisibility}
                        position="end"
                      >
                        {confirmPasswordVisible ? (
                          <VisibilityOffOutlined />
                        ) : (
                          <VisibilityOutlined />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Confirm Password"
                  type={confirmPasswordVisible ? "text" : "password"}
                  fullWidth
                  {...register("confirmPassword")}
                  error={!!registrationErrors.confirmPassword}
                  helperText={getErrorMessage(
                    registrationErrors.confirmPassword
                  )}
                  variant="filled"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        sx={{
                          cursor: "pointer",
                        }}
                        onClick={togglePasswordVisibility}
                        position="end"
                      >
                        {confirmPasswordVisible ? (
                          <VisibilityOffOutlined />
                        ) : (
                          <VisibilityOutlined />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  {...register("email")}
                  error={!!registrationErrors.email}
                  helperText={getErrorMessage(registrationErrors.email)}
                  variant="filled"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    {...register("gender")}
                    error={!!registrationErrors.gender}
                    defaultValue=""
                  >
                    <MenuItem value="">Please select a gender</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {!!registrationErrors.gender && (
                    <Typography fontSize="12px" color="error">
                      Gender is required
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          )}

          {error && (
            <Typography fontSize="12px" color="error" textAlign="center" mt={2}>
              {error}
            </Typography>
          )}

          <CustomButton
            type="submit"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading
              ? isLogin
                ? "Logging in..."
                : "Registering..."
              : isLogin
              ? "Login"
              : "Register"}
          </CustomButton>

          <CustomButton
            fullWidth
            variant="text"
            sx={{ mt: 2 }}
            onClick={registerLogin}
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </CustomButton>
        </Box>
      </Box>

      <ToastContainer
        position="top-right"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
};

export default LoginForm;
