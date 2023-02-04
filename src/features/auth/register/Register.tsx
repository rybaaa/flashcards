import React, { useEffect, useState } from 'react'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import Paper from '@mui/material/Paper'
import { useFormik } from 'formik'
import { NavLink, useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { createUserTC } from './register-reducer'
import style from './Register.module.scss'

import { appErrorSelector, appStatusSelector, setSubmittingAC } from 'app/app-reducer'
import { PATH } from 'app/routes/routes'
import { useAppDispatch, useAppSelector } from 'app/store'
import { ErrorSnackbar } from 'common/components/ErrorSnackbar/ErrorSnackbar'
import styleContainer from 'common/styles/Container.module.scss'

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const error = useAppSelector(appErrorSelector)
  const status = useAppSelector(appStatusSelector)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const toggleShowPassword = () => {
    setShowPassword(show => !show)
  }

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(show => !show)
  }

  const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      dispatch(createUserTC(values.email, values.password))
    },
  })

  useEffect(() => {
    if (!error && status === 'success') {
      navigate(PATH.LOGIN)
      dispatch(setSubmittingAC({ status: 'idle' }))
    }
  }, [status, error])

  return (
    <div className={`${style.formWrapper} ${styleContainer.container}`}>
      <Paper>
        <form className={style.form} onSubmit={formik.handleSubmit}>
          <h1 className={style.heading}>Sign Up</h1>
          <FormControl sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor={'email'}>Email</InputLabel>
            <Input
              className={style.input}
              id={'email'}
              autoComplete={'email'}
              {...formik.getFieldProps('email')}
            />
            <div className={style.fieldError}>{formik.touched.email && formik.errors.email}</div>
          </FormControl>
          <FormControl sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor={'password'}>Password</InputLabel>
            <Input
              className={style.input}
              id={'password'}
              {...formik.getFieldProps('password')}
              type={showPassword ? 'input' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={toggleShowPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <div className={style.fieldError}>
              {formik.touched.password && formik.errors.password}
            </div>
          </FormControl>

          <FormControl sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor={'confirmPassword'}>Confirm password</InputLabel>
            <Input
              className={style.input}
              id={'confirm-password'}
              {...formik.getFieldProps('confirmPassword')}
              type={showConfirmPassword ? 'input' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowConfirmPassword}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <div className={style.fieldError}>
              {formik.touched.confirmPassword && formik.errors.confirmPassword}
            </div>
          </FormControl>

          <Button
            variant={'contained'}
            type={'submit'}
            fullWidth
            disableRipple
            disabled={status === 'loading'}
            className={style.button}
          >
            Sign Up
          </Button>
        </form>
        <div className={style.account}>
          <span>Already have an account?</span>
          <NavLink to={PATH.LOGIN}>Sign In</NavLink>
        </div>
        {error && <ErrorSnackbar />}
      </Paper>
    </div>
  )
}
