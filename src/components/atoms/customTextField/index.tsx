import type { SxProps, TextFieldProps, Theme } from "@mui/material";
import { InputLabel, TextField, Box, Typography } from "@mui/material";
import { forwardRef } from "react";
import { inputFieldStyle } from "./style";

interface InputFieldProps {
  label?: string;
  value?: unknown;
  className?: string;
  sx?: SxProps<Theme>;
  variant?: "outlined" | "standard" | "filled";
  labelStyle?: SxProps<Theme>;
  labelVariant?: "standard" | "floating";
  errorMessage?: string;
  type?: string;
  inputStyle?: SxProps<Theme>;
  required?: boolean;
  isLabelRequired?: boolean;
  isErrorRequired?: boolean;
  borderFilled?: string;
  borderColorFilled?: string;
  borderRadiusFilled?: string;
  filledHeight?: string;
  filledLabelPadding?: string;
  fontSizeFilled?: string;
  fontWeightFilled?: number | string;
  errorStyle?: SxProps<Theme>;
  error?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  InputProps?: TextFieldProps["InputProps"];
}

export const InputField = forwardRef<HTMLDivElement, InputFieldProps>(
  (props, ref) => {
    const {
      className = "",
      sx = {},
      type = "text",
      label,
      isLabelRequired = true,
      isErrorRequired = true,
      value,
      inputStyle,
      labelStyle,
      labelVariant = "standard",
      placeholder = "",
      fullWidth = false,
      required,
      error,
      errorMessage,
      variant,
      InputProps,
      ...rest
    } = props;

    return (
      <Box
        sx={[
          inputFieldStyle.rootSx,
          {
            "& .MuiFilledInput-root.Mui-error": {
              border: "1px solid #F44F5A",
            },
            "& .MuiFilledInput-root": {
              backgroundColor: "#fff !important",
              "&.Mui-disabled": {
                backgroundColor: "#0000001f !important",
              },
            },
            "& .MuiFilledInput-input": {
              lineHeight: "20px",
            },
            "& .MuiInputLabel-root": {
              fontSize: "14px",
              color: "#3B3B3B",
              fontWeight: 400,
              lineHeight: "20px",
            },
            "& .MuiFormHelperText-root": {
              marginInlineEnd: "14px",
              marginInlineStart: "10px",
              textAlign: "start",
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        className={className}
        ref={ref}
      >
        {isLabelRequired &&
          labelVariant === "standard" &&
          variant !== "filled" && (
            <InputLabel sx={{ ...inputFieldStyle.labelStyle, ...labelStyle }}>
              {label} {required && <span>*</span>}
            </InputLabel>
          )}

        <TextField
          value={value}
          type={type}
          error={error}
          placeholder={placeholder}
          fullWidth={fullWidth}
          variant={variant}
          InputProps={InputProps}
          sx={{ ...inputFieldStyle.textFieldSx, ...inputStyle }}
          {...rest}
        />
        {isErrorRequired && (
          <Typography sx={{ fontSize: "12px" }} color="error">
            {error && errorMessage}
          </Typography>
        )}
      </Box>
    );
  }
);

InputField.displayName = "InputField";
