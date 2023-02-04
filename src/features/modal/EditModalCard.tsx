import React, { ChangeEvent, FC, useEffect, useState } from 'react'

import EditIcon from '@mui/icons-material/Edit'
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

import { InputTypeFileCard } from '../../common/inputFile/InputTypeFileCard'
import { userIdSelector } from '../profile/profile-reducer'

import s from './AddandUpdateModal.module.scss'
import { BasicModals } from './basicModals'

import { appStatusSelector } from 'app/app-reducer'
import { RootStateType, useAppDispatch, useAppSelector } from 'app/store'
import Close from 'assets/icons/close.svg'
import {
  packUserIdSelector,
  pageCountCardsSelector,
  updateCard,
} from 'features/cards/cards-reducer'
import { isNewCardPackAddedAC, isNewCardPackAddedSelector } from 'features/packs/cardsPack-reducer'

type AddModalsType = {
  id: string
  questionValue: string
  answerValue: string
  questionCover: string
  answerCover: string
}
export const EditModalCard: FC<AddModalsType> = ({
  id,
  questionValue,
  answerValue,
  answerCover,
  questionCover,
}) => {
  console.log(answerValue)
  const dispatch = useAppDispatch()
  const loadingStatus = useAppSelector(appStatusSelector)
  const isNewCardPackAdded = useAppSelector(isNewCardPackAddedSelector)
  const { packId } = useAppSelector((state: RootStateType) => state.cards)
  const [open, setOpen] = useState(false)
  const [answer, setAnswer] = useState(answerValue)
  const [question, setQuestion] = useState(questionValue)
  const pageCount = useAppSelector(pageCountCardsSelector)

  const packUserId = useAppSelector(packUserIdSelector)
  const userId = useAppSelector(userIdSelector)
  const [imageQuestion, setImageQuestion] = useState('')
  const [imageAnswer, setImageAnswer] = useState('')
  const [format, setFormat] = useState('')
  const handleChange = (event: SelectChangeEvent) => {
    setFormat(event.target.value)
  }
  const handlerQuestion = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.currentTarget.value)
  }
  const handlerAnswer = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.currentTarget.value)
  }
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handlerOnClickCancel = () => {
    setOpen(false)
  }
  const handlerOnClickEditCard = () => {
    dispatch(
      updateCard({
        updatedCard: {
          _id: id,
          question: question,
          answer: answer,
          answerImg: imageAnswer,
          questionImg: imageQuestion,
        },
        data: {
          cardsPack_id: packId,
          pageCount,
        },
      })
    )
  }

  useEffect(() => {
    if (isNewCardPackAdded) {
      setOpen(false)
      setAnswer(answer)
      setQuestion(question)
      dispatch(isNewCardPackAddedAC({ isNewCardPackAdded: false }))
    }
  }, [isNewCardPackAdded])

  return (
    <>
      <Tooltip title="Update">
        <span>
          <IconButton
            disabled={loadingStatus === 'loading' || packUserId !== userId}
            onClick={handleOpen}
          >
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
          {questionCover || answerCover ? (
            <InputTypeFileCard
              addAnswerImage={setImageAnswer}
              addQuestionImage={setImageQuestion}
            />
          ) : (
            <>
              <TextField
                className={s.input}
                id="standard-basic"
                label="Question"
                variant="standard"
                onChange={handlerQuestion}
                defaultValue={question}
              />
              <TextField
                className={s.input}
                id="standard-basic"
                label="Answer"
                variant="standard"
                onChange={handlerAnswer}
                defaultValue={answer}
              />
            </>
          )}
          <div className={s.buttonContainer}>
            <Button onClick={handlerOnClickCancel} variant="text" className={s.buttonCancel}>
              Cancel
            </Button>
            <Button
              onClick={handlerOnClickEditCard}
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
    </>
  )
}
