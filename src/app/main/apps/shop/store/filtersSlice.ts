import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { appSelector } from 'app/store/store'
import { AppRootStateType } from '.'

export interface IProductFilters {
  gender: string[]
  colors: string[]
  rating: string
  category: string
  priceRange: number[]
}

export const initialState: IProductFilters = {
  gender: [],
  colors: [],
  rating: '',
  category: 'all',
  priceRange: [0, 400]
}

/**
 * The Shop App Filters.
 */
export const filtersSlice = createSlice({
  name: 'shopApp/filters',
  initialState,
  reducers: {
    resetFilters: () => initialState,
    setGender: (state, action: PayloadAction<string[]>) => {
      state.gender = action.payload
    },
    setColors: (state, action: PayloadAction<string[]>) => {
      state.colors = action.payload
    },
    setRating: (state, action: PayloadAction<string>) => {
      state.rating = action.payload
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload
    },
    setPriceRange: (state, action: PayloadAction<number[]>) => {
      state.priceRange = action.payload
    },
    setFilters: (state, action: PayloadAction<IProductFilters>) =>
      action.payload,
    updateFilters: (
      state,
      action: PayloadAction<Partial<IProductFilters>>
    ) => ({
      ...state,
      ...action.payload
    })
  }
})

export const {
  setGender,
  setColors,
  setRating,
  setCategory,
  setPriceRange,
  setFilters,
  resetFilters,
  updateFilters
} = filtersSlice.actions

export type filtersSliceType = typeof filtersSlice

export const selectFilters = appSelector(
  (state: AppRootStateType) => state.shopApp?.filters
)

const filtersReducer = filtersSlice.reducer

export default filtersReducer
