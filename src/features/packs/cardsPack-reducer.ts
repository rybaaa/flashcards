import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'

import { packsApi } from 'api/packsApi'
import { setSubmittingAC } from 'app/app-reducer'
import { RootStateType } from 'app/store'
import {
  AsyncThunkConfig,
  CreatePackResponseType,
  CreatePacksPayloadType,
  DeletePackPayloadType,
  DeletePackResponseType,
  GetPackSPayloadType,
  GetPacksResponseType,
  UpdatePackPayloadType,
  UpdatePackResponseType,
} from 'common/types/types'
import { errorMessage } from 'utils/error-utils'

const slice = createSlice({
  name: 'cardsPack',
  initialState: {
    packs: {
      cardPacks: [
        {
          _id: '' as string,
          user_id: '' as string,
          name: '' as string,
          cardsCount: 0 as number,
          created: '' as string,
          updated: '' as string,
          user_name: '' as string,
          deckCover: '' as string,
        },
      ],
      cardPacksTotalCount: 0 as number,
      maxCardsCount: 0 as number,
      minCardsCount: 0 as number,
      page: 1 as number,
      pageCount: 4 as number,
    },
    searchParams: {
      isMyPacks: false as boolean,
      packName: '' as string,
      idSearch: '' as string,
      min: 0 as number,
      max: 100 as number,
      isNewCardPackAdded: false as boolean,
    },
  },
  reducers: {
    isMyPacksAC(state, action: PayloadAction<{ isMyPacks: boolean }>) {
      state.searchParams.isMyPacks = action.payload.isMyPacks
    },
    setPackNameAC(state, action: PayloadAction<{ packName: string }>) {
      state.searchParams.packName = action.payload.packName
    },
    setPageAC(state, action: PayloadAction<{ page: number }>) {
      state.packs.page = action.payload.page
    },
    setPageCountAC(state, action: PayloadAction<{ pageCount: number }>) {
      state.packs.pageCount = action.payload.pageCount
    },
    setIdSearchAC(state, action: PayloadAction<{ id: string }>) {
      state.searchParams.idSearch = action.payload.id
    },
    isNewCardPackAddedAC(state, action: PayloadAction<{ isNewCardPackAdded: boolean }>) {
      state.searchParams.isNewCardPackAdded = action.payload.isNewCardPackAdded
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchPacks.fulfilled, (state, action) => {
      if (action.payload) {
        state.packs = action.payload.data
      }
    })
  },
})

export const cardsPackReducer = slice.reducer

export const {
  isMyPacksAC,
  setPackNameAC,
  setPageAC,
  isNewCardPackAddedAC,
  setIdSearchAC,
  setPageCountAC,
} = slice.actions

export const addPackTC = createAsyncThunk<
  { data: CreatePackResponseType },
  CreatePacksPayloadType,
  AsyncThunkConfig
>(
  'cardsPack/addPack',
  async (payload: CreatePacksPayloadType, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as RootStateType

    dispatch(setSubmittingAC({ status: 'loading' }))
    try {
      const response = await packsApi.createPack(payload)
      const { pageCount, page } = state.pack.packs
      const userId = state.pack.searchParams.idSearch

      dispatch(fetchPacks({ pageCount, page, user_id: userId }))

      return { data: response.data }
    } catch (e) {
      const error = e as Error | AxiosError

      return rejectWithValue(errorMessage(dispatch, error))
    } finally {
      dispatch(isNewCardPackAddedAC({ isNewCardPackAdded: true }))
    }
  }
)
export const fetchPacks = createAsyncThunk<
  { data: GetPacksResponseType },
  GetPackSPayloadType,
  AsyncThunkConfig
>('cardsPack/fetchPacks', async (filter, { dispatch, rejectWithValue }) => {
  dispatch(setSubmittingAC({ status: 'loading' }))
  try {
    const response = await packsApi.getPack(filter)

    dispatch(setSubmittingAC({ status: 'success' }))

    return { data: response.data }
  } catch (e) {
    const error = e as Error | AxiosError

    return rejectWithValue(errorMessage(dispatch, error))
  }
})

export const deletePack = createAsyncThunk<
  { data: DeletePackResponseType },
  DeletePackPayloadType,
  AsyncThunkConfig
>('cardsPack/deletePack', async (payload, { getState, dispatch, rejectWithValue }) => {
  dispatch(setSubmittingAC({ status: 'loading' }))
  try {
    const response = await packsApi.deletePack(payload)
    const state = getState() as RootStateType
    const { pageCount, page } = state.pack.packs
    const userId = state.pack.searchParams.idSearch

    dispatch(fetchPacks({ pageCount, page, user_id: userId }))

    return { data: response.data }
  } catch (e) {
    const error = e as Error | AxiosError

    return rejectWithValue(errorMessage(dispatch, error))
  } finally {
    dispatch(isNewCardPackAddedAC({ isNewCardPackAdded: true }))
  }
})

export const updatePack = createAsyncThunk<
  { data: UpdatePackResponseType },
  UpdatePackPayloadType,
  AsyncThunkConfig
>(
  'cardsPack/updatePack',
  async (payload: UpdatePackPayloadType, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as RootStateType

    dispatch(setSubmittingAC({ status: 'loading' }))
    try {
      const response = await packsApi.updatePack(payload)
      const { pageCount, page } = state.pack.packs
      const userId = state.pack.searchParams.idSearch

      dispatch(fetchPacks({ pageCount, page, user_id: userId }))

      return { data: response.data }
    } catch (e) {
      const error = e as Error | AxiosError

      return rejectWithValue(errorMessage(dispatch, error))
    } finally {
      dispatch(isNewCardPackAddedAC({ isNewCardPackAdded: true }))
    }
  }
)

export const packSelector = (state: RootStateType) => state.pack.packs
export const isMyPackSelector = (state: RootStateType) => state.pack.searchParams.isMyPacks
export const pageSelector = (state: RootStateType) => state.pack.packs.page
export const cardPacksTotalCountSelector = (state: RootStateType) =>
  state.pack.packs.cardPacksTotalCount
export const pageCountSelector = (state: RootStateType) => state.pack.packs.pageCount
export const maxCardsCountSelector = (state: RootStateType) => state.pack.packs.maxCardsCount
export const minCardsCountSelector = (state: RootStateType) => state.pack.packs.minCardsCount
export const packNameSearchSelector = (state: RootStateType) => state.pack.searchParams.packName
export const idSearchSelector = (state: RootStateType) => state.pack.searchParams.idSearch
export const isNewCardPackAddedSelector = (state: RootStateType) =>
  state.pack.searchParams.isNewCardPackAdded
export const imageSelector = (state: RootStateType) =>
  state.pack.packs.cardPacks.find(el => el.deckCover)

export type CardsPacksActionType =
  | ReturnType<typeof isMyPacksAC>
  | ReturnType<typeof setPackNameAC>
  | ReturnType<typeof isNewCardPackAddedAC>
  | ReturnType<typeof setPageAC>
  | ReturnType<typeof setPageCountAC>
  | ReturnType<typeof setIdSearchAC>

export const packsListTableNames: TableHeaderDataType[] = [
  { name: 'Name', sortName: 'name' },
  { name: 'Cards', sortName: 'cardsCount' },
  { name: 'Last Updated', sortName: 'updated' },
  { name: 'Created by', sortName: 'user_name' },
  { name: 'Actions', sortName: 'updated' },
]

export type TableHeaderDataType = {
  name: string
  sortName: string
}
