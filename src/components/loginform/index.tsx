import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/authSlices";
import { RootState, AppDispatch } from "../../redux/store";
import apiClient, { AxiosResponse } from "../../api/apiClient";
import {
  Container,
  Box,
  Typography,
  InputAdornment,
  Grid,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomButton from "../atoms/customButton";
import { InputField } from "../atoms/customTextField";
import { SelectField } from "../atoms/customSelectDropDown";
import profileImage from "../../assets/profile.png";

const genderEnum = z.enum(["male", "female", "other"]);
const roleEnum = z.enum(["1", "2"]);

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  role: roleEnum,
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
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, tokenExpirationTime, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const getUserRole = (userType: number): string => {
    switch (userType) {
      case 1:
        return "Admin";
      case 2:
        return "User";
      default:
        return "Guest";
    }
  };

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
      const loginData = data as LoginFormData;
      const payload = {
        username: loginData.username,
        password: loginData.password,
        role: loginData.role,
        time: tokenExpirationTime,
      };
      try {
        const response = await dispatch(login(payload));
        if (response?.meta?.requestStatus === "fulfilled")
          toast(
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                alt={loginData.username}
                src={profileImage}
                sx={{ fontSize: "40px", mr: 1 }}
              />
              <Box sx={{ ml: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {loginData.username}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "gray", fontSize: "small" }}
                >
                  {getUserRole(Number(loginData.role))}
                </Typography>
              </Box>
            </Box>
          );
      } catch (error) {
        console.error("Login failed", error);
      }
    } else {
      try {
        const registerData = data as RegisterFormData;
        const response: AxiosResponse = await apiClient.post(
          "auth/register",
          registerData
        );
        if (response.data.success) {
          toast.success(response.data.message);
          registerLogin();
        } else {
          toast.error(response.data.message);
        }
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
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      dispatch(logout());
    }
  }, [isAuthenticated, navigate]);

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
          maxWidth={isLogin ? "350px" : "600px"}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            p: 2,
            borderRadius: "8px",
          }}
        >
          <Typography textAlign="center" mb={1}>
            {isLogin ? "Login" : "Register"}
          </Typography>

          {isLogin ? (
            <>
              <InputField
                label="Username"
                fullWidth={true}
                {...register("username")}
                placeholder="username..."
                error={!!loginErrors.username}
                errorMessage={getErrorMessage(loginErrors.username)}
                isErrorRequired={true}
                required={true}
              />
              <InputField
                label="Password"
                required={true}
                type={confirmPasswordVisible ? "text" : "password"}
                {...register("password")}
                error={!!loginErrors.password}
                errorMessage={getErrorMessage(loginErrors.password)}
                fullWidth={true}
                placeholder="password..."
                isErrorRequired={true}
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
              <SelectField
                label="Role"
                placeholder="Select a role..."
                options={[
                  { label: "Admin", value: "1" },
                  { label: "User", value: "2" },
                ]}
                error={!!loginErrors.role}
                errorMessage="Please select a role"
                {...register("role")}
                required
                widthStyle={{ minWidth: 150, height: 35 }}
              />
            </>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputField
                  label="First Name"
                  fullWidth
                  rootSx={{ mb: 0 }}
                  {...register("firstName")}
                  placeholder="first name..."
                  error={!!registrationErrors.firstName}
                  errorMessage={getErrorMessage(registrationErrors.firstName)}
                  isErrorRequired={true}
                  required={true}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputField
                  label="Last Name"
                  fullWidth
                  rootSx={{ mb: 0 }}
                  {...register("lastName")}
                  placeholder="last name..."
                  error={!!registrationErrors.lastName}
                  errorMessage={getErrorMessage(registrationErrors.lastName)}
                  isErrorRequired={true}
                  required={true}
                />
              </Grid>

              <Grid item xs={6}>
                <InputField
                  label="Password"
                  required={true}
                  rootSx={{ mb: 0 }}
                  type={confirmPasswordVisible ? "text" : "password"}
                  {...register("password")}
                  error={!!registrationErrors.password}
                  errorMessage={getErrorMessage(registrationErrors.password)}
                  fullWidth
                  placeholder="password..."
                  isErrorRequired={true}
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
                <InputField
                  label="Confirm Password"
                  required={true}
                  rootSx={{ mb: 0 }}
                  type={confirmPasswordVisible ? "text" : "password"}
                  {...register("confirmPassword")}
                  error={!!registrationErrors.confirmPassword}
                  errorMessage={getErrorMessage(
                    registrationErrors.confirmPassword
                  )}
                  fullWidth
                  placeholder="confirm password..."
                  isErrorRequired={true}
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
                <InputField
                  label="Email"
                  type="email"
                  fullWidth
                  rootSx={{ mb: 0 }}
                  {...register("email")}
                  placeholder="email..."
                  error={!!registrationErrors.email}
                  errorMessage={getErrorMessage(registrationErrors.email)}
                  isErrorRequired={true}
                  required={true}
                />
              </Grid>

              <Grid item xs={12}>
                <SelectField
                  label="Gender"
                  placeholder="Select gender..."
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Other", value: "other" },
                  ]}
                  error={!!registrationErrors.gender}
                  errorMessage="Please select gender"
                  {...register("gender")}
                  required
                  fullWidth
                />
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
            sx={{ mt: 1 }}
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
    </Container>
  );
};

export default LoginForm;
