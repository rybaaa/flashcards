import React, { FC, useEffect, useState } from 'react'

import { Slider, SliderProps } from '@mui/material'

import { useAppDispatch, useAppSelector } from '../../../app/store'
import {
  fetchPacks,
  maxCardsCountSelector,
  minCardsCountSelector,
} from '../../../features/packs/cardsPack-reducer'
import style from '../SuperRange/SuperRange.module.scss'

type SuperRangePropsType = {
  min: number
  max: number
  value: number[]
  changeValue: (value: number | number[]) => void
  changeValueCommitted: (value: number | number[]) => void
}

export const SuperRange: FC<SliderProps & SuperRangePropsType> = props => {
  const change = (event: React.SyntheticEvent | Event, value: number | number[]) => {
    props.changeValue(value)
  }
  const changeCommitted = (event: React.SyntheticEvent | Event, value: number | number[]) => {
    props.changeValueCommitted(value)
  }

  return (
    <div className={style.wrapper}>
      <span>{props.value[0]}</span>
      <Slider
        sx={{ width: 150 }}
        color={'primary'}
        onChange={change}
        onChangeCommitted={changeCommitted}
        value={props.value}
        min={props.min}
        max={props.max}
        valueLabelDisplay={'auto'}
      />
      <span>{props.value[1]}</span>
    </div>
  )
}
