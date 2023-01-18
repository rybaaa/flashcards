import React, { useState } from 'react'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Checkbox, FormControlLabel, FormGroup, IconButton, LinearProgress } from '@mui/material'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import Paper from '@mui/material/Paper'
import { useFormik } from 'formik'
import { Navigate, useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { appStatusSelector } from '../../../app/app-reducer'
import { PATH } from '../../../app/routes/routes'
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { ErrorSnackbar } from '../../../common/components/ErrorSnackbar/ErrorSnackbar'

import styleContainer from './../../../common/styles/Container.module.scss'
import { isLoggedInSelector, LoginTC } from './auth-reducer'
import style from './Login.module.scss'

export const Login = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const status = useAppSelector(appStatusSelector)
  const isLoggedIn = useAppSelector(isLoggedInSelector)
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword(show => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const validationSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup
      .string()
      .min(8, 'Minimum number of characters 8')
      .required('Password is required'),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      dispatch(LoginTC(values))
    },
  })

  if (isLoggedIn) {
    return <Navigate to={PATH.CARDS} />
  }
  const handlerForgotPassword = () => {
    navigate(PATH.PASSWORD_RECOVERY)
  }

  const handlerSignIn = () => {
    navigate(PATH.REGISTER)
  }

  return (
    <div className={`${style.container} ${styleContainer.container}`}>
      <Paper>
        <ErrorSnackbar />
        <FormControl className={style.formControl}>
          {status === 'loading' && <LinearProgress color={'primary'} />}
          <h1 className={style.singIn}>Sign in</h1>
          <form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <FormControl sx={{ m: 1 }} variant="standard">
                <InputLabel>Email</InputLabel>
                <Input className={style.input} {...formik.getFieldProps('email')} />
                {formik.touched.email && formik.errors.email && (
                  <div className={style.fieldError}>{formik.errors.email}</div>
                )}
              </FormControl>

              <FormControl sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                <Input
                  className={style.input}
                  id="standard-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  {...formik.getFieldProps('password')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {formik.touched.password && formik.errors.password && (
                  <div className={style.fieldError}>{formik.errors.password}</div>
                )}
              </FormControl>
              <FormControl sx={{ m: 1 }} variant="standard">
                <FormControlLabel
                  label={'Remember me'}
                  control={
                    <Checkbox
                      {...formik.getFieldProps('rememberMe')}
                      checked={formik.values.rememberMe}
                    />
                  }
                />
              </FormControl>
              <a className={style.forgotPassword} onClick={handlerForgotPassword}>
                Forgot Password?
              </a>
              <Button type={'submit'} variant={'contained'} className={style.button}>
                Sign In
              </Button>
            </FormGroup>
          </form>
          <p className={style.text}>Don&apos;t have an account?</p>
          <a className={style.signUp} onClick={handlerSignIn}>
            Sign Up
          </a>
        </FormControl>
      </Paper>
    </div>
  )
}
