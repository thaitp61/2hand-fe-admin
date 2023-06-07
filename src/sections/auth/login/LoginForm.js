import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSignIn } from "react-auth-kit";
import { useFormik } from "formik";

import axios, { AxiosError } from "axios";
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm(props) {
  // login
  const [error, setError] = useState("");
  const signIn = useSignIn();
  const onSubmit = async (values) => {
    console.log("Values: ", values);
    setError("");

    try {
      const response = await axios.post(
        "https://2hand.monoinfinity.net/api/v1.0/auth/login",
        values
      );
      const token = response.data.token;
      console.log(token);

      signIn({
        token: response.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { email: values.email },
      });
      navigate('/dashboard');
    } catch (err) {
      if (err && err instanceof AxiosError)
        setError(err.response?.data.message || "Email or password is incorrect");
      else if (err && err instanceof Error) setError(err.message);

      console.log("Error: ", err);
    }
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit,
  });

  //----------------------------------------------------------------

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  return (

    <form onSubmit={formik.handleSubmit}>
      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Stack spacing={3}>
        <TextField
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          clearOnEscape
        />

        <TextField
          name="password"
          label="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" isLoading={formik.isSubmitting} >
        Login
      </LoadingButton>
    </form>

  );
}
