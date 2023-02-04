import React, { useEffect, useState } from 'react'

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { useParams } from 'react-router-dom'
import { useDebounce } from 'usehooks-ts'

import { Card } from './card/Card'
import { CardControls } from './cardControls/CardControls'
import {
  cardNameSelector,
  cardsListTableNames,
  cardsTotalCountSelector,
  fetchCards,
  pageCardsSelector,
  pageCountCardsSelector,
  setCardPage,
  setCardPageCount,
  setSearchCardName,
} from './cards-reducer'
import style from './Cards.module.scss'
import { CardsHeader } from './cardsHeader/CardsHeader'
import { NotFoundCards } from './NotFoundCards/NotFoundCards'

import { RootStateType, useAppDispatch, useAppSelector } from 'app/store'
import { Back2Packs } from 'common/components/Back2Packs/Back2Packs'
import { ErrorSnackbar } from 'common/components/ErrorSnackbar/ErrorSnackbar'
import { SuperPagination } from 'common/components/SuperPagination/SuperPagination'
import { SuperTableHeader } from 'common/components/SuperTable/SuperTableHead/SuperTableHeader'
import styleContainer from 'common/styles/Container.module.scss'
import { SearchField } from 'features/packs/FiltersField/SearchField/SearchField'

export const Cards = () => {
  const { cardsPack_id } = useParams()
  const { cardsData, packId } = useAppSelector((state: RootStateType) => state.cards)
  const { cards } = cardsData
  const cardNameSearch = useAppSelector(cardNameSelector)
  const [search, setSearch] = useState<string>(cardNameSearch)
  const debouncedSearch = useDebounce<string>(search, 500)
  const page = useAppSelector(pageCardsSelector)
  const pageCount = useAppSelector(pageCountCardsSelector)
  const cardsTotalCount = useAppSelector(cardsTotalCountSelector)

  const dispatch = useAppDispatch()

  const handleChangeSearch = (search: string) => {
    setSearch(search)
    dispatch(setSearchCardName(search))
  }

  const onChangePagination = (newPage: number, newCount: number) => {
    dispatch(setCardPage(newPage))
    dispatch(setCardPageCount(newCount))
  }

  useEffect(() => {
    if (packId) {
      dispatch(
        fetchCards({
          cardsPack_id: packId,
          page,
          pageCount,
          answer: '',
          cardQuestion: debouncedSearch,
        })
      )
    } else {
      cardsPack_id &&
        dispatch(
          fetchCards({
            cardsPack_id,
            answer: '',
          })
        )
    }
  }, [page, pageCount, debouncedSearch, cardsPack_id])

  return (
    <div>
      <div className={`${style.container} ${styleContainer.container}`}>
        <ErrorSnackbar />
        <Back2Packs />
        {cards && cards.length > 0 ? (
          <>
            <CardsHeader packId={packId} />
            <div className={style.search}>
              <SearchField search={search} handleChangeSearch={handleChangeSearch} />
            </div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <SuperTableHeader titles={cardsListTableNames} cardPack_id={packId} />
                <TableBody>
                  {cardsData.cards &&
                    cardsData.cards.map(card => {
                      return (
                        <TableRow
                          key={card._id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <Card
                            answerImg={card.answerImg}
                            questionImg={card.questionImg}
                            answer={card.answer}
                            question={card.question}
                            grade={card.grade}
                            updated={card.updated}
                          />
                          <TableCell align="center">
                            <CardControls
                              id={card._id}
                              question={card.question}
                              answer={card.answer}
                              answerCover={card.answerImg}
                              questionCover={card.questionImg}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <SuperPagination
              page={page}
              onChange={onChangePagination}
              pageCount={pageCount}
              itemsTotalCount={cardsTotalCount}
            />
          </>
        ) : (
          <NotFoundCards
            debouncedSearch={debouncedSearch}
            handleChangeSearch={handleChangeSearch}
          />
        )}
      </div>
    </div>
  )
}
