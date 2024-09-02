import React, { useState } from "react";
import { Modal, Box, Typography, TextField, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "../atoms/customButton";
import apiClient, { AxiosResponse } from "../../api/apiClient";

const otpSchema = z.object({
  otp: z.string().min(1, "OTP is required"),
});

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

type OtpFormData = z.infer<typeof otpSchema>;

const ProfileModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  userInfo: UserData;
}> = ({ open, onClose, onSubmit, userInfo }) => {
  const { email, firstname, lastname } = userInfo;
  const [otpConfirm, setOtpConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onCloseModal = () => {
    onClose();
    reset();
    setOtpConfirm(false);
  };

  const generateOtp = async () => {
    try {
      const response: AxiosResponse = await apiClient.post(
        "users/generateOtp",
        { email, firstname, lastname }
      );
      if (response.data.success) {
        setOtpConfirm(true);
      }
    } catch (error) {
      console.error("Error Edit Profile Data:", error);
    }
  };

  const handleOtpSubmit = async (otp: OtpFormData) => {
    try {
      const response: AxiosResponse = await apiClient.post("users/verifyOTP", {
        email,
        otp,
      });
      if (response.data.success) {
        onSubmit();
        onClose();
        reset();
      }
    } catch (error) {
      console.error("Error Edit Profile Data:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "background.paper",
          borderRadius: "12px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {!otpConfirm ? "Generate OTP..." : "Enter OTP"}
          </Typography>
          <IconButton onClick={onCloseModal}>
            <CloseIcon />
          </IconButton>
        </Box>

        {!otpConfirm ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography>
              You Will be logged out after successfull update!
            </Typography>
            <CustomButton variant="contained" onClick={generateOtp}>
              Generate OTP
            </CustomButton>
          </Box>
        ) : (
          <form
            onSubmit={handleSubmit(handleOtpSubmit)}
            style={{ width: "100%" }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                placeholder="Enter OTP"
                {...register("otp")}
                error={!!errors.otp}
                helperText={errors.otp ? errors.otp.message : ""}
                variant="filled"
                fullWidth
              />
              <CustomButton variant="contained" type="submit">
                Verify OTP
              </CustomButton>
            </Box>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default ProfileModal;
