import { createSlice } from '@reduxjs/toolkit'
import { appSelector } from 'app/store/store'
import { AppRootStateType } from './index'

const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  completed: false,
  createdBy: null,
  modifiedAt: null,
  completedAt: null,
  selectedItemId: null
}

/**
 * The Quiz selected item id.
 */
export const selectedItemIdSlice = createSlice({
  name: 'quizApp/quiz',
  initialState,
  reducers: {
    setQuestions(state, action) {
      state.questions = action.payload
    },
    answerQuestion(state, action) {
      state.answers.push(action.payload)
      state.currentQuestionIndex += 1
    },
    completeQuiz(state, action) {
      state.completed = true
      state.score = action.payload
    },
    setQuiz(state, action) {
      return { ...state, ...action.payload }
    },
    resetQuiz(state) {
      state.currentQuestionIndex = 0
      state.answers = []
      state.score = 0
      state.completed = false
      state.selectedItemId = null
      state.createdBy = null
      state.modifiedAt = null
      state.completedAt = null
    },
    setSelectedItemId(state, action) {
      state.selectedItemId = action.payload
    },
    resetSelectedItemId(state) {
      state.selectedItemId = null
    }
  }
})

export const {
  setQuestions,
  answerQuestion,
  completeQuiz,
  setQuiz,
  resetQuiz,
  setSelectedItemId,
  resetSelectedItemId
} = selectedItemIdSlice.actions

export const selectSelectedItemId = appSelector(
  (state: AppRootStateType) => state?.quizApp?.quiz?.selectedItemId
)

export const selectSelectedQuizId = appSelector(
  (state: AppRootStateType) => state?.quizApp?.quiz
)

export type selectedItemIdSliceType = typeof selectedItemIdSlice

export default selectedItemIdSlice.reducer
