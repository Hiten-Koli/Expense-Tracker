import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchExpenses, addExpense, deleteExpense, updateExpense, addBulkExpense } from "../../services/expenseServices";
interface ExpenseInterface{
    expenses: any[];
    loading: boolean;
    error: string | null;
}

const initialState:ExpenseInterface = {
    expenses: [],
    loading: false,
    error: null,
}
interface ExpenseQueryParams {
    page?: number;
    pageSize?: number;
    ordering?: string;
  }

export const getExpenses = createAsyncThunk<any, ExpenseQueryParams>(
    "expenses/getExpenses",
    async ({page = 1, pageSize = 5,  ordering='' }, thunkAPI)=>{
        const params = new URLSearchParams();
        params.append('page_num', page.toString());
        params.append("page_size", pageSize.toString());
        if(ordering){
            params.append("ordering", ordering)
        }
        // Object.entries(filters).forEach(([key, value])=>{
        //     if(value){
        //         params.append(key, value.toString())
        //     }
        // })
        try{
            const response = await fetchExpenses(params.toString());
            console.log(response);
            return response
        }catch(err:any){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const createExpense = createAsyncThunk(
    "expense/addExpense",
    async (data:any , thunkAPI)=>{
        try{
            const response = await addExpense(data);
            return response;
        }catch(err:any){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const removeExpense = createAsyncThunk(
    "expense/deleteExpense",
    async (id: number, thunkAPI)=>{
        try{
            const response = await deleteExpense(id);
            console.log(id)
            return response;
        }catch(err:any){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const editExpense = createAsyncThunk<any, { id: number; data: any }>(
    "expense/updateExpense",
    async ({id, data}:{id: number, data:any}, thunkAPI)=>{
        try{
            const response = await updateExpense(id, data);
            console.log(id)
            return response;
        }catch(err:any){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const uploadBulkExpense = createAsyncThunk(
    "expenses/upload-file",
    async (file:FormData, thunkAPI)=>{
        try{
            const response = await addBulkExpense(file)
            return response
        }catch(err:any){
            return thunkAPI.rejectWithValue(err.response.data);
        }

    }
)

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder
            .addCase(getExpenses.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getExpenses.fulfilled, (state, action)=>{
                state.loading = false;
                state.expenses = action.payload
                state.error = null;
            })
            .addCase(getExpenses.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createExpense.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(createExpense.fulfilled, (state, action)=>{
                state.expenses.push(action.payload)
                state.loading = false;
            })
            .addCase(createExpense.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(removeExpense.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(removeExpense.fulfilled, (state, action)=>{
                state.expenses = state.expenses.filter((exp) => exp.id !== action.payload);
                state.loading = false;
            })
            .addCase(removeExpense.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })  
            .addCase(editExpense.pending, (state)=>{
                state.loading = true;                
                state.error = null;
            })
            .addCase(editExpense.fulfilled, (state, action)=>{
                const index = state.expenses.findIndex((exp: any) => exp.id === action.payload.id);
                if (index !== -1) {
                state.expenses[index] = action.payload;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(editExpense.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            }) 
    },
})

export default expenseSlice.reducer;