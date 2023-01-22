import * as React from 'react'
import { useEffect, useState } from 'react'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

import { PATH } from '../../app/routes/routes'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { ErrorSnackbar } from '../../common/components/ErrorSnackbar/ErrorSnackbar'
import { NotFoundSearching } from '../../common/components/NotFoundSearching/NotFoundSearching'
import { SuperPagination } from '../../common/components/SuperPagination/SuperPagination'
import { SuperSort } from '../../common/components/SuperSort/SuperSort'
import { setPackId } from '../cards/cards-reducer'

import {
  cardPacksTotalCountSelector,
  fetchPacks,
  packNameSelector,
  packSelector,
  pageCountSelector,
  pageSelector,
} from './cardsPack-reducer'
import s from './CardsPack.module.scss'
import { ChangePacks } from './ChangePacks/ChangePacks'
import { FiltersField } from './FiltersField/FiltersField'
import { HeaderPacks } from './headerPacks/HeaderPacks'

export const CardsPack = () => {
  const pack = useAppSelector(packSelector)
  const cardPacksTotalCount = useAppSelector(cardPacksTotalCountSelector)
  const [page, setPage] = useState(useAppSelector(pageSelector))
  const packName = useAppSelector(packNameSelector)
  const [pageCount, setPageCount] = useState(useAppSelector(pageCountSelector))
  const [sort, setSort] = useState('')

  const onChangePagination = (newPage: number, newCount: number) => {
    setPage(newPage)
    setPageCount(newCount)
  }
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchPacks({ page, pageCount }))
  }, [page, pageCount])

  const handlerOpenCards = (packId: string) => {
    if (packId) {
      dispatch(setPackId(packId))
      debugger
      navigate(PATH.CARDS + `/${packId}`)
    }
  }
  const onChangeSort = (newSort: string) => {
    setSort(newSort)
    dispatch(fetchPacks({ sortPacks: newSort }))
  }

  return (
    <div className={s.container}>
      <ErrorSnackbar />
      <HeaderPacks />
      <FiltersField />
      {pack.cardPacks.length ? (
        <div>
          <TableContainer>
            <Table sx={{ minWidth: 650, border: '1px solid #D9D9D9' }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className={s.name}>Name</TableCell>
                  <TableCell className={s.name} align="right">
                    Cards
                  </TableCell>
                  <TableCell className={s.name} align="right">
                    <span>Last Updated</span>
                    <SuperSort sort={sort} value={'updated'} onChange={onChangeSort} />
                  </TableCell>
                  <TableCell className={s.name} align="right">
                    Created by
                  </TableCell>
                  <TableCell className={s.name} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pack?.cardPacks?.map((el, i) => (
                  <TableRow
                    key={`${el._id}-${i}`}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      sx={{ cursor: 'pointer' }}
                      component="th"
                      scope="row"
                      onClick={() => handlerOpenCards(el._id)}
                    >
                      {el.name}
                    </TableCell>
                    <TableCell align="right">{el.cardsCount}</TableCell>
                    <TableCell align="right">{dayjs(el.updated).format('DD.MM.YYYY')}</TableCell>
                    <TableCell align="right">{el.user_name}</TableCell>
                    <TableCell className={s.icons} align="left">
                      <ChangePacks id={el._id} userId={el.user_id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <SuperPagination
            page={page}
            onChange={onChangePagination}
            pageCount={pageCount}
            cardPacksTotalCount={cardPacksTotalCount}
          />
        </div>
      ) : (
        <NotFoundSearching packName={packName} />
      )}
    </div>
  )
}
