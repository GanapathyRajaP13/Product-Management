import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/authSlices";
import { RootState, AppDispatch } from "../../redux/store";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

// Define the form schema using zod
const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Define the form data type based on the schema
type FormData = z.infer<typeof schema>;

const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [conFirmPasswordvisible, setConFormPasswordVisible] = useState(false);

  // possward visiblity logic with icon
  const confirmPasswordVisbleIcon = conFirmPasswordvisible ? (
    <VisibilityOffOutlined />
  ) : (
    <VisibilityOutlined />
  );
  const confirmPassWordInvisibleIcon = !conFirmPasswordvisible ? (
    <VisibilityOutlined />
  ) : (
    <VisibilityOffOutlined />
  );

  // Use the form data type with useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setConFormPasswordVisible(!conFirmPasswordvisible);
  };

  // Define the submit handler with the form data type
  const onSubmit: SubmitHandler<FormData> = (data) => {
    dispatch(login(data));
  };

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          width="300px"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)", // White color with 50% opacity
            p: 3,
            borderRadius: "8px",
          }}
        >
          <Typography textAlign="center" mb={3}>
            Login
          </Typography>
          <TextField
            label="Username"
            fullWidth
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
            variant="filled"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type={conFirmPasswordvisible ? "text" : "password"}
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            variant="filled"
            sx={{ mb: 2,
              ".MuiInputBase-root.MuiFilledInput-root": { backgroundColor: "#e8f0fe" }, }}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  sx={{
                    cursor: "pointer",
                    
                  }}
                  onClick={togglePasswordVisibility}
                  position="end"
                >
                  {conFirmPasswordvisible
                    ? confirmPasswordVisbleIcon
                    : confirmPassWordInvisibleIcon}
                </InputAdornment>
              ),
            }}
          />
          {error && (
            <Typography fontSize="12px" color="error" textAlign="center">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
