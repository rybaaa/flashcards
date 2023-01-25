import React from 'react'

import SchoolIcon from '@mui/icons-material/School'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useNavigate } from 'react-router-dom'

import { appStatusSelector } from '../../../app/app-reducer'
import { PATH } from '../../../app/routes/routes'
import { useAppSelector } from '../../../app/store'
import { DeleteModalPack } from '../../modal/DeleteModalPack'
import { EditModalPack } from '../../modal/EditModalPack'
import { userIdSelector } from '../../profile/profile-reducer'

import style from './ChangePacks.module.scss'

type ActionSettingType = {
  id: string
  userId: string
  name: string
  cardscount: number
}
export const ChangePacks = (props: ActionSettingType) => {
  const navigate = useNavigate()
  const userId = useAppSelector(userIdSelector)
  const loadingStatus = useAppSelector(appStatusSelector)
  const handlerOpenCards = () => {
    if (props.id) {
      navigate(PATH.CARDS)
    }
  }

  return (
    <div className={style.container}>
      {userId === props.userId ? (
        <>
          <Tooltip title="Learn">
            <span>
              <IconButton
                disabled={loadingStatus === 'loading' || !props.cardscount}
                onClick={handlerOpenCards}
              >
                <SchoolIcon />
              </IconButton>
            </span>
          </Tooltip>
          <div>
            <EditModalPack id={props.id} name={props.name} />
          </div>
          <DeleteModalPack id={props.id} name={props.name} />
        </>
      ) : (
        <Tooltip title="Learn">
          <span>
            <IconButton disabled={!props.cardscount} onClick={handlerOpenCards}>
              <SchoolIcon />
            </IconButton>
          </span>
        </Tooltip>
      )}
    </div>
  )
}
