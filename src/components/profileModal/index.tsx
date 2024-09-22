import React, { useState } from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "../atoms/customButton";
import apiClient, { AxiosResponse } from "../../api/apiClient";
import { InputField } from "../atoms/customTextField";
import { toast } from "react-toastify";

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
  const [generateOTP, setGenerateOTP] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setGenerateOTP(false);
  };

  const generateOtp = async () => {
    setGenerateOTP(true);
    try {
      const response: AxiosResponse = await apiClient.post(
        "users/generateOtp",
        { email, firstname, lastname }
      );
      if (response.data.success) {
        toast.success("OTP sent to your email!");
        setOtpConfirm(true);
      } else {
        toast.error(response.data.message || "Failed to generate OTP.");
      }
    } catch (error) {
      console.error("Error generating OTP:", error);
      toast.error("An error occurred while generating OTP.");
    } finally {
      setGenerateOTP(false);
    }
  };

  const handleOtpSubmit = async (otp: OtpFormData) => {
    setIsSubmitting(true);
    try {
      const response: AxiosResponse = await apiClient.post("users/verifyOTP", {
        email,
        otp,
      });
      if (response.data.success) {
        toast.success("Profile updated!.");
        onSubmit();
        onClose();
        reset();
        setOtpConfirm(false);
      } else {
        toast.error(response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred while verifying OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onCloseModal}
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
              {!otpConfirm ? "Generate OTP" : "Enter OTP"}
            </Typography>
            <IconButton onClick={onCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {!otpConfirm ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography>
                {generateOTP
                  ? "Your OTP is generating, please wait!..."
                  : "You will be logged out after a successful update!"}
              </Typography>
              <CustomButton
                variant="contained"
                disabled={generateOTP}
                onClick={generateOtp}
              >
                Generate OTP
              </CustomButton>
            </Box>
          ) : (
            <form
              onSubmit={handleSubmit(handleOtpSubmit)}
              style={{ width: "100%" }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <InputField
                  label="Enter OTP"
                  fullWidth
                  {...register("otp")}
                  placeholder="Enter OTP..."
                  error={!!errors.otp}
                  errorMessage={errors.otp ? errors.otp.message : ""}
                  isErrorRequired={true}
                  required
                  rootSx={{ mb: 0 }}
                />
                <CustomButton
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP / Update"}
                </CustomButton>
              </Box>
            </form>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ProfileModal;
