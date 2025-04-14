import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Typography, Paper, Container, CircularProgress } from "@mui/material";
import { register as registerUser } from "../redux/slice/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearError } from "../redux/slice/authSlice";
import axios, { AxiosError } from "axios";

// Zod schema
const registerSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password2: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;
const API_URL= import.meta.env.VITE_API_URL;
export const Register = () => {
  const dispatch = useAppDispatch();
  const navigate= useNavigate();
  const { loading, error, success } = useAppSelector((state) => state.auth);
  
  const [otp, setOtp] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [emailForOtp, setEmailForOtp] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });
  const emailValue = watch('email');
  const onSubmit = (data: RegisterFormValues) => {
    if(isVerified){
      dispatch(registerUser(data));
    }
  };
  useEffect(() => {
    if (success) {
      navigate("/login"); 
    }
  }, [success, navigate]);
  useEffect(() => {
    dispatch(clearError()); 
  }, [dispatch]);

    //Email verification 
    const handleSendOtp = async()=>{  
      const email = getValues("email")
      setEmailForOtp(email)
      setEmailError("")
      try{
        await axios.post(`${API_URL}send-otp/`, {email:email});
        setIsOtpSent(true)
      }
      catch(err){
        const error = err as AxiosError<{ error: string }>;
        const serverMessage = error.response?.data?.error || "Could not send OTP !!";
        setEmailError(serverMessage)
      } 
    }
    const handleVerifyOtp = async()=>{
      setEmailError("")
      try{
        const response = await axios.post(`${API_URL}verify-otp/`,{email:emailForOtp, otp});
        if(response.data.verified){
          setIsVerified(true)
        } 
      }catch (err){
        const error = err as AxiosError<{ error: string }>;
        const serverMessage = error.response?.data?.error || "Could not send OTP !!";
        setEmailError(serverMessage)
      }
    }

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ padding: 4, marginTop: 10, borderRadius: 3 }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Register
        </Typography>

        {error && (
          <Typography color="error" textAlign="center" mb={2}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isOtpSent}
          /> 
          {emailError &&
            <Typography color="error" mt={2}>
                {emailError}
            </Typography>
          }
          {!isOtpSent?
            (<Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSendOtp}
              disabled={!emailValue}
              sx={{ mt: 2 }}
            >
              Send OTP
            </Button>
            ): !isVerified?( 
            <>
              <TextField
                fullWidth
                label="OTP"
                type="text"
                margin="normal"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleVerifyOtp}
                sx={{ mt: 2 }}
              >
                Verify OTP
              </Button>
            </>
           ) : (
            <Typography color="green" mt={2}>
              ✅ Email Verified
            </Typography>
          )}
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            margin="normal"
            {...register("password2")}
            error={!!errors.password2}
            helperText={errors.password2?.message}
          />
          {!isVerified &&
            <Typography color="red" mt={2}>
                Verify your email to register!
            </Typography>
          }
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading || !isVerified}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
