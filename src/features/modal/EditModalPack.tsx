import React, { ChangeEvent, FC, useEffect, useState } from 'react'

import EditIcon from '@mui/icons-material/Edit'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

import { InputTypeFilePack } from '../../common/inputFile/InputTypeFilePack'

import s from './AddandUpdateModal.module.scss'
import { BasicModals } from './basicModals'

import { appStatusSelector } from 'app/app-reducer'
import { useAppDispatch, useAppSelector } from 'app/store'
import Close from 'assets/icons/close.svg'
import {
  isNewCardPackAddedAC,
  isNewCardPackAddedSelector,
  updatePack,
} from 'features/packs/cardsPack-reducer'
type AddModalsType = {
  id: string
  name: string
}
export const EditModalPack: FC<AddModalsType> = ({ id, name }) => {
  const dispatch = useAppDispatch()
  const loadingStatus = useAppSelector(appStatusSelector)
  const isNewCardPackAdded = useAppSelector(isNewCardPackAddedSelector)
  const [text, setText] = useState(name)
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState('')
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handlerInput = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value)
  }
  const handlerOnClickCancel = () => {
    setOpen(false)
  }
  const handlerOnClickEditPack = () => {
    dispatch(updatePack({ cardsPack: { _id: id, name: text, deckCover: image } }))
  }

  useEffect(() => {
    if (isNewCardPackAdded) {
      setOpen(false)
      setText(text)
      dispatch(isNewCardPackAddedAC({ isNewCardPackAdded: false }))
    }
  }, [isNewCardPackAdded])

  return (
    <>
      <Tooltip title="Update">
        <span>
          <IconButton disabled={loadingStatus === 'loading'} onClick={handleOpen}>
            <EditIcon />
          </IconButton>
        </span>
      </Tooltip>
      <BasicModals isOpen={open} handleClose={handleClose}>
        <div className={s.container}>
          <div className={s.headerContainer}>
            <p className={s.title}>Edit pack</p>
            <img onClick={handlerOnClickCancel} className={s.img} src={Close} alt={'close'} />
          </div>
          <InputTypeFilePack setImage={setImage} />
          <TextField
            className={s.input}
            id="standard-basic"
            label="Name pack"
            variant="standard"
            onChange={handlerInput}
            defaultValue={text}
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            className={s.checkBox}
            label="Private pack"
          />
          <div className={s.buttonContainer}>
            <Button onClick={handlerOnClickCancel} variant="text" className={s.buttonCancel}>
              Cancel
            </Button>
            <Button
              onClick={handlerOnClickEditPack}
              type={'submit'}
              variant={'contained'}
              className={s.buttonSave}
              disabled={!text}
            >
              Save
            </Button>
          </div>
        </div>
      </BasicModals>
    </>
  )
}
