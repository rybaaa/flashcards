import React from 'react'

import { Navigate, Route, Routes } from 'react-router-dom'

import { Error404 } from '../../common/error/error404/Error404'
import { Login } from '../../features/auth/login/Login'
import { Register } from '../../features/auth/register/Register'
import { CheckEmail } from '../../features/password/recovery/checkMail/CheckEmail'
import { ForgotPassword } from '../../features/password/recovery/forgotPassword/ForgotPassword'
import { CreateNewPassword } from '../../features/password/recovery/newPassword/CreateNewPassword'
import { Profile } from '../../features/profile/Profile'
import { TestPage } from '../../features/test/testPage'

import { PATH } from './routes'

export const RoutesComponent = () => {
  return (
    <Routes>
      <Route path={PATH.MAIN} element={<Navigate to={PATH.PROFILE} />} />
      <Route path={PATH.LOGIN} element={<Login />} />
      <Route path={PATH.REGISTER} element={<Register />} />
      <Route path={PATH.PROFILE} element={<Profile />} />
      <Route path={PATH.NOT_FOUND} element={<Error404 />} />
      <Route path={PATH.PASSWORD_RECOVERY} element={<ForgotPassword />} />
      <Route path={PATH.NEW_PASSWORD} element={<CreateNewPassword />} />
      <Route path={PATH.TEST_PAGE} element={<TestPage />} />
      <Route path={PATH.CHECK_EMAIL} element={<CheckEmail />} />
    </Routes>
  )
}
