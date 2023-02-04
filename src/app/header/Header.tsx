import * as React from 'react'

import { useNavigate } from 'react-router-dom'

import style from './Header.module.scss'

import { PATH } from 'app/routes/routes'
import { useAppSelector } from 'app/store'
import logo from 'assets/images/cards.svg'
import defaultAva from 'assets/images/default-avatar.svg'
import { isLoggedInSelector } from 'features/auth/login/auth-reducer'
import { avatarSelector, nameSelector } from 'features/profile/profile-reducer'

export const Header = () => {
  const isLoggedIn = useAppSelector(isLoggedInSelector)
  const nickname = useAppSelector(nameSelector)
  const avatar = useAppSelector(avatarSelector)

  const navigate = useNavigate()

  const handlerSignIn = () => {
    navigate(PATH.LOGIN)
  }

  const navigateToProfile = () => {
    navigate(PATH.PROFILE)
  }

  return (
    <div className={style.container}>
      <img className={style.logo} src={logo} alt={'incubator logo'} />
      {isLoggedIn ? (
        <div onClick={navigateToProfile} className={style.login_info}>
          <span className={style.nickname}>{nickname}</span>
          <div className={style.avatar}>
            <img src={avatar ? avatar : defaultAva} alt={'avatar'} />
          </div>
        </div>
      ) : (
        <button className={style.button} onClick={handlerSignIn}>
          Sign in
        </button>
      )}
    </div>
  )
}
