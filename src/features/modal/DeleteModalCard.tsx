import React, { FC, useEffect, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { userIdSelector } from '../profile/profile-reducer'

import { BasicModals } from './basicModals'
import s from './DeleteModal.module.scss'

import { appStatusSelector } from 'app/app-reducer'
import { RootStateType, useAppDispatch, useAppSelector } from 'app/store'
import Close from 'assets/icons/close.svg'
import {
  deleteCard,
  packUserIdSelector,
  pageCountCardsSelector,
} from 'features/cards/cards-reducer'
import { isNewCardPackAddedAC, isNewCardPackAddedSelector } from 'features/packs/cardsPack-reducer'

type AddModalsType = {
  id: string
  questionValue: string
}
export const DeleteModalCard: FC<AddModalsType> = ({ id, questionValue }) => {
  const dispatch = useAppDispatch()
  const loadingStatus = useAppSelector(appStatusSelector)
  const isNewCardPackAdded = useAppSelector(isNewCardPackAddedSelector)
  const { packId } = useAppSelector((state: RootStateType) => state.cards)
  const packUserId = useAppSelector(packUserIdSelector)
  const userId = useAppSelector(userIdSelector)
  const pageCount = useAppSelector(pageCountCardsSelector)

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handlerOnClickCancel = () => {
    setOpen(false)
  }
  const handlerOnClickDeleteCard = () => {
    dispatch(
      deleteCard({
        data: {
          cardsPack_id: packId,
          pageCount,
        },
        cardId: id,
      })
    )
  }

  useEffect(() => {
    if (isNewCardPackAdded) {
      setOpen(false)
      dispatch(isNewCardPackAddedAC({ isNewCardPackAdded: false }))
    }
  }, [isNewCardPackAdded])

  return (
    <>
      <Tooltip title="Delete">
        <span>
          <IconButton
            disabled={loadingStatus === 'loading' || packUserId !== userId}
            onClick={handleOpen}
          >
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>
      <BasicModals isOpen={open} handleClose={handleClose}>
        <div className={s.container}>
          <div className={s.headerContainer}>
            <p className={s.title}>Delete Pack</p>
            <img onClick={handlerOnClickCancel} className={s.img} src={Close} alt={'close'} />
          </div>
          <p>Do you really want to remove {<b>{questionValue}</b>}? All cards will be deleted.</p>
          <div className={s.buttonContainer}>
            <Button onClick={handlerOnClickCancel} variant="text" className={s.buttonCancel}>
              Cancel
            </Button>
            <Button
              onClick={handlerOnClickDeleteCard}
              type={'submit'}
              variant={'contained'}
              className={s.buttonDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </BasicModals>
    </>
  )
}
