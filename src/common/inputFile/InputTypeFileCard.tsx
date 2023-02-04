import React, { ChangeEvent, FC, SetStateAction, useState, Dispatch } from 'react'

import Button from '@mui/material/Button'

import s from './InputTypeFile.module.scss'
type InputTypeFileCardType = {
  addAnswerImage: Dispatch<SetStateAction<string>>
  addQuestionImage: Dispatch<SetStateAction<string>>
}
export const InputTypeFileCard: FC<InputTypeFileCardType> = ({
  addAnswerImage,
  addQuestionImage,
}) => {
  const [imageQuestion, setImageQuestion] = useState('')
  const [imageAnswer, setImageAnswer] = useState('')
  const addAnswerImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0]

      if (file.size < 4000000) {
        convertFileToBase64(file, (file64: string) => {
          addAnswerImage(file64)
          setImageAnswer(file64)
        })
      } else {
        console.error('Error: ', 'Файл слишком большого размера')
      }
    }
  }
  const addQuestionImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0]

      if (file.size < 4000000) {
        convertFileToBase64(file, (file64: string) => {
          addQuestionImage(file64)
          setImageQuestion(file64)
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
    <>
      <label className={s.container}>
        <p className={s.p}>Question:</p>
        <input type="file" onChange={addQuestionImageHandler} style={{ display: 'none' }} />
        <Button variant="text" component="span" className={s.button}>
          Change cover
        </Button>
      </label>
      <div className={s.imgBlock}>
        {imageQuestion && <img src={imageQuestion} className={s.image} alt={'image question'} />}
      </div>
      <label className={s.container}>
        <p className={s.p}>Answer:</p>
        <input type="file" onChange={addAnswerImageHandler} style={{ display: 'none' }} />
        <Button variant="text" component="span" className={s.button}>
          Change cover
        </Button>
      </label>
      <div className={s.imgBlock}>
        {imageAnswer && <img src={imageAnswer} className={s.image} alt={'image answer'} />}
      </div>
    </>
  )
}
