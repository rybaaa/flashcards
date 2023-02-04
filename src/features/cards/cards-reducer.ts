import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'

import { cardsApi } from 'api/cardsApi'
import { setErrorAC, setSubmittingAC } from 'app/app-reducer'
import { RootStateType } from 'app/store'
import {
  AsyncThunkConfig,
  CardType,
  CreateCardRequestType,
  GetCardsRequestType,
  GetCardsResponseType,
  GradeRequestType,
  UpdateCardRequestType,
} from 'common/types/types'
import { isNewCardPackAddedAC } from 'features/packs/cardsPack-reducer'
import { errorMessage } from 'utils/error-utils'

// thunk

export const fetchCards = createAsyncThunk<
  { data: GetCardsResponseType<CardType[]>; packId: string | null },
  GetCardsRequestType,
  AsyncThunkConfig
>('cards/fetchCards', async (data, thunkAPI) => {
  thunkAPI.dispatch(setSubmittingAC({ status: 'loading' }))
  try {
    const response = await cardsApi.getCards(data)

    thunkAPI.dispatch(setSubmittingAC({ status: 'success' }))

    return { packId: data.cardsPack_id, data: response.data }
  } catch (e) {
    const error = e as Error | AxiosError

    return thunkAPI.rejectWithValue(errorMessage(thunkAPI.dispatch, error))
  }
})

export const updateCard = createAsyncThunk(
  'cards/updateCard',
  async (
    { data, updatedCard }: { data: GetCardsRequestType; updatedCard: UpdateCardRequestType },
    thunkAPI
  ) => {
    thunkAPI.dispatch(setSubmittingAC({ status: 'loading' }))
    try {
      console.log('upd: ', updatedCard)
      console.log('data: ', data)
      await cardsApi.updateCard(updatedCard)
      await thunkAPI.dispatch(fetchCards(data))
    } catch (e: any) {
      thunkAPI.dispatch(setSubmittingAC({ status: 'failed' }))
    } finally {
      thunkAPI.dispatch(isNewCardPackAddedAC({ isNewCardPackAdded: true }))
    }
  }
)

export const createCard = createAsyncThunk<
  { data: CardType[] },
  { card: CreateCardRequestType },
  AsyncThunkConfig
>('cards/createCard', async (card, thunkAPI) => {
  thunkAPI.dispatch(setSubmittingAC({ status: 'loading' }))
  try {
    const state = thunkAPI.getState() as RootStateType
    const response = await cardsApi.createCard({
      cardsPack_id: card.card.cardsPack_id,
      question: card.card.question,
      answer: card.card.answer,
      answerImg: card.card.answerImg,
      questionImg: card.card.questionImg,
    })

    thunkAPI.dispatch(
      fetchCards({
        cardsPack_id: card.card.cardsPack_id,
        pageCount: state.cards.cardsData.pageCount,
      })
    )

    return response.data
  } catch (e: any) {
    thunkAPI.dispatch(setSubmittingAC({ status: 'failed' }))
    thunkAPI.dispatch(setErrorAC({ error: 'Size is too much' }))
  } finally {
    thunkAPI.dispatch(isNewCardPackAddedAC({ isNewCardPackAdded: true }))
  }
})

export const deleteCard = createAsyncThunk<
  {},
  { data: GetCardsRequestType; cardId: string },
  AsyncThunkConfig
>(
  'cards/deleteCard',
  async ({ data, cardId }: { data: GetCardsRequestType; cardId: string }, thunkAPI) => {
    thunkAPI.dispatch(setSubmittingAC({ status: 'loading' }))
    try {
      await cardsApi.deleteCard(cardId)
      await thunkAPI.dispatch(fetchCards(data))

      return cardId
    } catch (e: any) {
      thunkAPI.dispatch(setSubmittingAC({ status: 'failed' }))
      errorMessage(thunkAPI.dispatch, e)
    } finally {
      thunkAPI.dispatch(isNewCardPackAddedAC({ isNewCardPackAdded: true }))
    }
  }
)

export type UpdatedGradeResponseType = {
  updatedGrade: {
    card_id: string
    cardsPack_id: string
    created: Date
    grade: number
    more_id: string
    shots: number
    updated: string
    user_id: string
    __v: number
    _id: string
  }
}

export const setGrade = createAsyncThunk<
  UpdatedGradeResponseType,
  { card_id: string; grade: number },
  AsyncThunkConfig
>('cards/fetchGrade', async (data: GradeRequestType, thunkAPI) => {
  thunkAPI.dispatch(setSubmittingAC({ status: 'loading' }))
  try {
    const result = await cardsApi.setGrade(data)

    thunkAPI.dispatch(setSubmittingAC({ status: 'success' }))

    return result.data
  } catch (e: any) {
    thunkAPI.dispatch(setSubmittingAC({ status: 'failed' }))
    errorMessage(thunkAPI.dispatch, e)
  }
})

const slice = createSlice({
  name: 'cards',
  initialState: {
    cardsData: {
      cards: [] as CardType[],
      cardsTotalCount: 0 as number,
      maxGrade: 0 as number,
      minGrade: 0 as number,
      packUserId: null as string | null,
      page: 1 as number,
      pageCount: 4 as number,
      packName: '' as string,
    },
    packId: null as string | null,
    isLoaded: false,
    searchParams: {
      cardName: '' as string,
    },
  },
  reducers: {
    setPackId(state, action: PayloadAction<string>) {
      state.packId = action.payload
    },
    setSearchCardName(state, action: PayloadAction<string>) {
      state.searchParams.cardName = action.payload
    },
    setCardPage(state, action: PayloadAction<number>) {
      state.cardsData.page = action.payload
    },
    setCardPageCount(state, action: PayloadAction<number>) {
      state.cardsData.pageCount = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchCards.fulfilled, (state, action) => {
      if (action.payload) {
        state.cardsData = { ...action.payload.data }
        state.isLoaded = true
        state.packId = action.payload.packId
      }
    })
    builder.addCase(setGrade.fulfilled, (state, action) => {
      if (action.payload) {
        state.cardsData.cards.map(card => {
          if (card._id === action.payload.updatedGrade.card_id) {
            card.shots = action.payload.updatedGrade.shots
            card.grade = action.payload.updatedGrade.grade
          } else {
            return card
          }
        })
      }
    })
  },
})

export const cardsReducer = slice.reducer
export const { setPackId, setSearchCardName, setCardPage, setCardPageCount } = slice.actions
export const cardsTotalCountSelector = (state: RootStateType): number =>
  state.cards.cardsData.cardsTotalCount
export const userIdSelector = (state: RootStateType): string => state.profile.profile._id
export const packUserIdSelector = (state: RootStateType): string | null =>
  state.cards.cardsData.packUserId
export const packNameSelector = (state: RootStateType): string => state.cards.cardsData.packName
export const cardNameSelector = (state: RootStateType): string => state.cards.searchParams.cardName
export const pageCardsSelector = (state: RootStateType): number => state.cards.cardsData.page
export const pageCountCardsSelector = (state: RootStateType): number =>
  state.cards.cardsData.pageCount
// types
export type CardsReducerType =
  | ReturnType<typeof setPackId>
  | ReturnType<typeof setSearchCardName>
  | ReturnType<typeof setCardPage>
  | ReturnType<typeof setCardPageCount>

export const cardsListTableNames: CardsTableHeaderDataType[] = [
  { name: 'Question', sortName: 'question' },
  { name: 'Answer', sortName: 'answer' },
  { name: 'Last Updated', sortName: 'updated' },
  { name: 'Grade', sortName: 'user_name' },
  { name: '', sortName: '' },
]

export type CardsTableHeaderDataType = {
  name: string
  sortName: string
}
