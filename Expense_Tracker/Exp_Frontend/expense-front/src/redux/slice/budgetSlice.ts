import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBudgets, addBudget, deleteBudget, updateBudget } from "../../services/budgetServices";
interface BudgetInterface{
    budgets: any[];
    loading: boolean;
    error: string | null;
}

const initialState:BudgetInterface = {
    budgets: [],
    loading: false,
    error: null,
}

export const getBudgets = createAsyncThunk(
    "budgets/getBudgets",
    async (_,thunkAPI)=>{
        try{
            const response = await fetchBudgets();
            return response
        }catch(err:any){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const createBudget = createAsyncThunk(
    "budgets/addBudget",
    async (data:any , thunkAPI)=>{
        try{
            const response = await addBudget(data);
            return response;
        }catch(err:any){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const removeBudget = createAsyncThunk(
    "budgets/deleteBudget",
    async (id: number, thunkAPI)=>{
        try{
            const response = await deleteBudget(id);
            return response;
        }catch(err:any){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const editBudget = createAsyncThunk<any, { id: number; data: any }>(
    "budgets/updateBudget",
    async ({id, data}:{id: number, data:any}, thunkAPI)=>{
        try{
            const response = await updateBudget(id, data);
            return response;
        }catch(err:any){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder
            .addCase(getBudgets.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getBudgets.fulfilled, (state, action)=>{
                state.loading = false;
                state.budgets = action.payload
                state.error = null;
            })
            .addCase(getBudgets.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createBudget.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(createBudget.fulfilled, (state, action)=>{
                state.budgets.push(action.payload)
                state.loading = false;
            })
            .addCase(createBudget.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(removeBudget.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(removeBudget.fulfilled, (state, action)=>{
                state.budgets = state.budgets.filter((exp) => exp.id !== action.payload);
                state.loading = false;
            })
            .addCase(removeBudget.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })  
            .addCase(editBudget.pending, (state)=>{
                state.loading = true;                
                state.error = null;
            })
            .addCase(editBudget.fulfilled, (state, action)=>{
                const index = state.budgets.findIndex((exp: any) => exp.id === action.payload.id);
                if (index !== -1) {
                state.budgets[index] = action.payload;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(editBudget.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            }) 
    },
})

export default budgetSlice.reducer;