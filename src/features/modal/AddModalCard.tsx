import React, { ChangeEvent, FC, useEffect, useState } from 'react'

import { FormControl, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'

import { InputTypeFileCard } from '../../common/inputFile/InputTypeFileCard'

import s from './AddandUpdateModal.module.scss'
import { BasicModals } from './basicModals'

import { RootStateType, useAppDispatch, useAppSelector } from 'app/store'
import Close from 'assets/icons/close.svg'
import { createCard } from 'features/cards/cards-reducer'
import { isNewCardPackAddedAC, isNewCardPackAddedSelector } from 'features/packs/cardsPack-reducer'

type AddModalsType = {
  isModalAddOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  handleOpen: () => void
  handleClose: () => void
}
export const AddModalCard: FC<AddModalsType> = ({
  isModalAddOpen,
  setIsModalOpen,
  handleClose,
}) => {
  const dispatch = useAppDispatch()
  const isNewCardPackAdded = useAppSelector(isNewCardPackAddedSelector)
  const { packId } = useAppSelector((state: RootStateType) => state.cards)
  const [answer, setAnswer] = useState('')
  const [question, setQuestion] = useState('')

  const [format, setFormat] = useState('')

  const [imageQuestion, setImageQuestion] = useState('')
  const [imageAnswer, setImageAnswer] = useState('')
  const handleChange = (event: SelectChangeEvent) => {
    setFormat(event.target.value)
  }

  const handlerQuestion = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.currentTarget.value)
  }
  const handlerAnswer = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.currentTarget.value)
  }
  const handlerOnClickCancel = () => {
    setIsModalOpen(false)
  }
  const handlerOnClickAddPack = () => {
    dispatch(
      createCard({
        card: {
          answer: answer,
          question: question,
          answerImg: imageAnswer,
          questionImg: imageQuestion,
          cardsPack_id: packId,
        },
      })
    )
  }

  useEffect(() => {
    if (isNewCardPackAdded) {
      setIsModalOpen(false)
      setAnswer('')
      setQuestion('')
      dispatch(isNewCardPackAddedAC({ isNewCardPackAdded: false }))
    }
  }, [isNewCardPackAdded])

  return (
    <BasicModals isOpen={isModalAddOpen} handleClose={handleClose}>
      <div className={s.container}>
        <div className={s.headerContainer}>
          <p className={s.title}>Add new card</p>
          <img onClick={handlerOnClickCancel} className={s.img} src={Close} alt={'close'} />
        </div>

        <FormControl variant="standard" sx={{ width: '100%', marginBottom: '23px' }}>
          <InputLabel id="demo-simple-select-standard-label">Choose a question format</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="select"
            value={format}
            defaultValue="Text"
            onChange={handleChange}
            label="Choose a question format"
          >
            <MenuItem value="Text">Text</MenuItem>
            <MenuItem value="Image">Image</MenuItem>
          </Select>
        </FormControl>
        {format === 'Image' ? (
          <InputTypeFileCard addAnswerImage={setImageAnswer} addQuestionImage={setImageQuestion} />
        ) : (
          <>
            <TextField
              className={s.input}
              id="standard-basic"
              label="Question"
              variant="standard"
              onChange={handlerQuestion}
            />
            <TextField
              className={s.input}
              id="standard-basic"
              label="Answer"
              variant="standard"
              onChange={handlerAnswer}
            />
          </>
        )}
        <div className={s.buttonContainer}>
          <Button onClick={handlerOnClickCancel} variant="text" className={s.buttonCancel}>
            Cancel
          </Button>
          <Button
            onClick={handlerOnClickAddPack}
            type={'submit'}
            variant={'contained'}
            className={s.buttonSave}
            disabled={!question || !answer}
          >
            Save
          </Button>
        </div>
      </div>
    </BasicModals>
  )
}
