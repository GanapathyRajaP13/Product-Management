import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Divider,
  Card,
  CardHeader,
  CardContent,
  InputAdornment,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "../atoms/customButton";
import apiClient, { AxiosResponse } from "../../api/apiClient";
import ProfileModal from "../profileModal";
import { logout } from "../../redux/authSlices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputField } from "../atoms/customTextField";
import { SelectField } from "../atoms/customSelectDropDown";

const genderEnum = z.enum(["male", "female", "other"]);

interface UserData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  gender: string;
  userCode: string;
  isActive: number;
  UserType: number;
  id: string;
}

interface UserProfileProps {
  userData: UserData;
}

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

const editProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string(),
  email: z.string().email("Invalid email address"),
  gender: genderEnum,
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(5, "Current password is required"),
    newPassword: z.string().min(5, "Password must be at least 5 characters"),
    confirmPassword: z.string().min(5, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Profile = {
  type: string;
  data: object;
};

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
  const {
    username,
    email,
    firstname,
    lastname,
    gender,
    userCode,
    isActive,
    UserType,
    id,
  } = userData;
  const dispatch = useDispatch();
  const userRole = getUserRole(UserType);
  const [editPassword, setEditPassword] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setData] = useState<Profile>({
    type: "",
    data: {},
  });

  const onModalClose = () => {
    setModalVisible(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: firstname,
      lastName: lastname,
      email,
      gender,
    },
  });

  const {
    register: registerChangePassword,
    handleSubmit: handleSubmitChangePassword,
    formState: { errors: changePasswordErrors },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onOtpSubmit = async () => {
    if (userInfo.type === "profile") {
      const payload = {
        ...userInfo.data,
        id: id,
      };
      try {
        const response: AxiosResponse = await apiClient.post(
          "users/editProfile",
          { info: payload }
        );
        if (response.data.success) {
          setEditProfile(false);
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error Edit Profile Data:", error);
      }
    } else {
      const payload = {
        ...userInfo.data,
        id: id,
      };
      try {
        const response: AxiosResponse = await apiClient.post(
          "users/changePassword",
          { info: payload }
        );
        if (response.data.success) {
          toast.success(response.data.message);
          setEditProfile(false);
          dispatch(logout());
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error Edit Profile Data:", error);
      }
    }
  };

  const handleEditProfileSubmit = async (data: any) => {
    setModalVisible(true);
    setData({ type: "profile", data: data });
  };

  const handleChangePasswordSubmit = (data: any) => {
    setModalVisible(true);
    setData({ type: "password", data: data });
  };

  const getErrorMessage = (error: any) => {
    if (typeof error === "string") {
      return error;
    } else if (error && typeof error.message === "string") {
      return error.message;
    }
    return undefined;
  };

  const getFormVisible = (val: string) => {
    if (val === "profile") {
      setEditProfile(!editProfile);
      setEditPassword(false);
    } else if (val === "password") {
      setEditProfile(false);
      setEditPassword(!editPassword);
      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <Paper elevation={3} sx={{ padding: 3, position: "relative" }}>
        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
          <Typography variant="subtitle1" color="textSecondary">
            Role: {userRole}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ width: 80, height: 80, marginRight: 3 }}>
            {firstname[0]} {lastname[0]}
          </Avatar>
          <Box>
            <Typography variant="h5">{username}</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              User Code: {userCode}
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color={isActive ? "green" : "red"}
            >
              {isActive ? "Active" : "Inactive"}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>First Name:</strong> {firstname}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Last Name:</strong> {lastname}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Email:</strong> {email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Gender:</strong> {gender}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ marginY: 3 }} />
        <Grid container>
          <Grid item xs={6} sm={2}>
            <CustomButton onClick={() => getFormVisible("profile")}>
              Edit Profile
            </CustomButton>
          </Grid>
          <Grid item xs={6} sm={2}>
            <CustomButton onClick={() => getFormVisible("password")}>
              Change Password
            </CustomButton>
          </Grid>
        </Grid>

        {editProfile && (
          <Card sx={{ marginTop: 2 }}>
            <CardHeader
              title="Edit Profile"
              titleTypographyProps={{
                variant: "h6",
              }}
              sx={{
                backgroundColor: "#e2e6e7",
                borderBottom: "1px solid #ddd",
              }}
            />
            <CardContent>
              <form onSubmit={handleSubmit(handleEditProfileSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <InputField
                      label="First Name"
                      fullWidth={true}
                      {...register("firstName")}
                      placeholder="first name..."
                      error={!!errors.firstName}
                      errorMessage={errors.firstName?.message || ""}
                      isErrorRequired={true}
                      required={true}
                      rootSx={{ mb: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputField
                      label="Last Name"
                      fullWidth={true}
                      {...register("lastName")}
                      placeholder="last name..."
                      error={!!errors.lastName}
                      errorMessage={errors.lastName?.message || ""}
                      isErrorRequired={true}
                      rootSx={{ mb: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputField
                      label="Email"
                      fullWidth={true}
                      type="email"
                      {...register("email")}
                      placeholder="email..."
                      error={!!errors.email}
                      errorMessage={errors.email?.message || ""}
                      isErrorRequired={true}
                      required={true}
                      rootSx={{ mb: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <SelectField
                      label="Gender"
                      placeholder="Select gender..."
                      defaultValue={gender}
                      options={[
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                        { label: "Other", value: "other" },
                      ]}
                      error={!!errors.gender}
                      errorMessage={errors?.gender?.message}
                      {...register("gender")}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomButton variant="contained" type="submit">
                      Save Changes
                    </CustomButton>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        )}

        {editPassword && (
          <Card sx={{ marginTop: 2 }}>
            <CardHeader
              title="Change Password"
              titleTypographyProps={{
                variant: "h6",
              }}
              sx={{
                backgroundColor: "#e2e6e7",
                borderBottom: "1px solid #ddd",
              }}
            />
            <CardContent>
              <form
                onSubmit={handleSubmitChangePassword(
                  handleChangePasswordSubmit
                )}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InputField
                      label="Current Password"
                      required={true}
                      rootSx={{ mb: 0 }}
                      type={passwordVisible ? "text" : "password"}
                      {...registerChangePassword("currentPassword")}
                      error={!!changePasswordErrors.currentPassword}
                      errorMessage={getErrorMessage(
                        changePasswordErrors.currentPassword?.message
                      )}
                      fullWidth
                      placeholder="Current Password..."
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
                            {passwordVisible ? (
                              <VisibilityOffOutlined />
                            ) : (
                              <VisibilityOutlined />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputField
                      label="New Password"
                      fullWidth={true}
                      type={passwordVisible ? "text" : "password"}
                      {...registerChangePassword("newPassword")}
                      placeholder="New password..."
                      error={!!changePasswordErrors.newPassword}
                      errorMessage={getErrorMessage(
                        changePasswordErrors.newPassword?.message
                      )}
                      isErrorRequired={true}
                      required={true}
                      rootSx={{ mb: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputField
                      label="Confirm Password"
                      fullWidth={true}
                      type={passwordVisible ? "text" : "password"}
                      {...registerChangePassword("confirmPassword")}
                      placeholder="Confirm password..."
                      error={!!changePasswordErrors.confirmPassword}
                      errorMessage={getErrorMessage(
                        changePasswordErrors.confirmPassword?.message
                      )}
                      isErrorRequired={true}
                      required={true}
                      rootSx={{ mb: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomButton variant="contained" type="submit">
                      Change Password
                    </CustomButton>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        )}
      </Paper>
      <ProfileModal
        open={modalVisible}
        onClose={onModalClose}
        onSubmit={onOtpSubmit}
        userInfo={userData}
      />
    </>
  );
};

export default UserProfile;
