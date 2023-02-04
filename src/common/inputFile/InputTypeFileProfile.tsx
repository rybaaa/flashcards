import React, { ChangeEvent, Dispatch, SetStateAction } from 'react'

import { IconButton } from '@mui/material'

import { useAppSelector } from '../../app/store'
import icon from '../../assets/icons/photo.png'
import defaultAva from '../../assets/images/default-avatar.svg'
import { avatarSelector } from '../../features/profile/profile-reducer'

import style from './InputTypeFileProfile.module.scss'

type InputTypeFileProfileType = {
  setImage: Dispatch<SetStateAction<string>>
}
export const InputTypeFileProfile = (props: InputTypeFileProfileType) => {
  const avatar = useAppSelector(avatarSelector)

  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0]

      if (file.size < 4000000) {
        convertFileToBase64(file, (file64: string) => {
          props.setImage(file64)
        })
      } else {
        console.error('Error: ', 'Файл слишком большого размера')
      }
    }
  }

  const convertFileToBase64 = (file: File, callBack: (value: string) => void) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      const file64 = reader.result as string

      callBack(file64)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className={style.containerLabel}>
      <img className={style.avatar} src={avatar ? avatar : defaultAva} alt="ava" />
      <label>
        <input className={style.input} type="file" onChange={uploadHandler} />
        <IconButton component="span" className={style.icon}>
          <img src={icon} alt={'change avatar'} />
        </IconButton>
      </label>
    </div>
  )
}
