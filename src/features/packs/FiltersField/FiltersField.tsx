import React, { useEffect, useState } from 'react'

import { useDebounce } from 'usehooks-ts'

import { useAppDispatch, useAppSelector } from '../../../app/store'
import { SuperRange } from '../../../common/components/SuperRange/SuperRange'
import { fetchPacks, maxCardsCountSelector, minCardsCountSelector } from '../cardsPack-reducer'
import style from '../FiltersField/FiltersField.module.scss'

import { ResetFilters } from './ResetFilters/ResetFilters'
import { SearchField } from './SearchField/SearchField'
import { SelectPackField } from './SelectPackField/SelectPackField'

export const FiltersField = () => {
  const maxCardsCount = useAppSelector(maxCardsCountSelector)
  const minCardsCount = useAppSelector(minCardsCountSelector)

  const dispatch = useAppDispatch()
  const [value, setValue] = useState<number[]>([minCardsCount, maxCardsCount])
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce<string>(search, 500)

  const change = (value: number | number[]) => {
    setValue(value as number[])
  }
  const changeCommitted = (value: number | number[]) => {
    const min = Array.isArray(value) ? value[0] : value
    const max = Array.isArray(value) ? value[1] : value

    setValue([min, max])
    dispatch(fetchPacks({ min, max, packName: debouncedSearch }))
  }

  const handleChangeSearch = (search: string) => {
    setSearch(search)
  }

  const resetFilters = () => {
    setValue([minCardsCount, maxCardsCount])
    setSearch('')
  }

  useEffect(() => {
    setValue([minCardsCount, maxCardsCount])
  }, [minCardsCount, maxCardsCount])

  useEffect(() => {
    dispatch(
      fetchPacks({
        packName: debouncedSearch,
        min: value[0],
        max: value[1],
      })
    )
  }, [debouncedSearch])

  return (
    <div className={style.wrapper}>
      <SearchField search={search} handleChangeSearch={handleChangeSearch} />
      <SelectPackField />
      <SuperRange
        min={minCardsCount}
        max={maxCardsCount}
        value={value}
        changeValue={change}
        changeValueCommitted={changeCommitted}
      />
      <ResetFilters reset={resetFilters} />
    </div>
  )
}
