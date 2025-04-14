import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../slice/authSlice";
import expenseReducer from "../slice/expenseSlice";
import incomeReducer from "../slice/incomeSlice"
import budgetReducer from '../slice/budgetSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expense: expenseReducer,
    income: incomeReducer,
    budget: budgetReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch