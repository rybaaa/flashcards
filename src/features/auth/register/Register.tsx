import React, { useState } from 'react'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import Paper from '@mui/material/Paper'
import { useFormik } from 'formik'
import { NavLink } from 'react-router-dom'
import * as yup from 'yup'

import { PATH } from '../../../app/routes/routes'
import styleContainer from '../../../common/styles/Container.module.scss'

import style from './Register.module.scss'

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
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
      console.log(JSON.stringify(values, null, 2))
    },
  })

  return (
    <div className={`${style.formWrapper} ${styleContainer.container}`}>
      <Paper>
        <form className={style.form} onSubmit={formik.handleSubmit}>
          <h1 className={style.heading}>Sign Up</h1>
          <FormControl fullWidth margin={'normal'}>
            <InputLabel htmlFor={'email'}>Email</InputLabel>
            <Input
              id={'email'}
              name={'email'}
              autoComplete={'email'}
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
            />
            <div className={style.fieldError}>{formik.touched.email && formik.errors.email}</div>
          </FormControl>
          <FormControl fullWidth margin={'normal'}>
            <InputLabel htmlFor={'password'}>Password</InputLabel>
            <Input
              id={'password'}
              name={'password'}
              autoComplete={'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              type={showPassword ? 'password' : 'input'}
              endAdornment={
                showPassword ? (
                  <InputAdornment position="end">
                    <VisibilityOff
                      fontSize="medium"
                      className={style.passwordEye}
                      onClick={toggleShowPassword}
                    />
                  </InputAdornment>
                ) : (
                  <InputAdornment position="end">
                    <Visibility
                      fontSize="medium"
                      className={style.passwordEye}
                      onClick={toggleShowPassword}
                    />
                  </InputAdornment>
                )
              }
            />
            <div className={style.fieldError}>
              {formik.touched.password && formik.errors.password}
            </div>
          </FormControl>
          <FormControl fullWidth margin={'normal'}>
            <InputLabel htmlFor={'confirmPassword'}>Confirm password</InputLabel>
            <Input
              id={'confirm-password'}
              name={'confirmPassword'}
              autoComplete={'password'}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              type={showConfirmPassword ? 'password' : 'input'}
              endAdornment={
                showConfirmPassword ? (
                  <InputAdornment position="end">
                    <VisibilityOff
                      fontSize="medium"
                      className={style.passwordEye}
                      onClick={toggleShowConfirmPassword}
                    />
                  </InputAdornment>
                ) : (
                  <InputAdornment position="end">
                    <Visibility
                      fontSize="medium"
                      className={style.passwordEye}
                      onClick={toggleShowConfirmPassword}
                    />
                  </InputAdornment>
                )
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
            className={style.button}
          >
            Sign Up
          </Button>
        </form>
        <div className={style.account}>
          <span>Already have an account?</span>
          <NavLink to={PATH.LOGIN}>Sign In</NavLink>
        </div>
      </Paper>
    </div>
  )
}
