import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchIncomes, addIncome, deleteIncome, updateIncome } from "../../services/incomeServices";
interface IncomeInterface{
    incomes: any[];
    loading: boolean;
    error: string | null;
}

const initialState:IncomeInterface = {
    incomes: [],
    loading: false,
    error: null,
}

export const getIncomes = createAsyncThunk(
    "incomes/getIncomes",
    async (_,thunkAPI)=>{
        try{
            const response = await fetchIncomes();
            console.log(response);
            return response
        }catch(err:any){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const createIncome = createAsyncThunk(
    "incomes/addIncome",
    async (data:any , thunkAPI)=>{
        try{
            const response = await addIncome(data);
            return response;
        }catch(err:any){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const removeIncome = createAsyncThunk(
    "incomes/deleteIncome",
    async (id: number, thunkAPI)=>{
        try{
            const response = await deleteIncome(id);
            console.log(id)
            return response;
        }catch(err:any){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const editIncome = createAsyncThunk<any, { id: number; data: any }>(
    "incomes/updateIncome",
    async ({id, data}:{id: number, data:any}, thunkAPI)=>{
        try{
            const response = await updateIncome(id, data);
            console.log(id)
            return response;
        }catch(err:any){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

const incomeSlice = createSlice({
    name: 'incomes',
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder
            .addCase(getIncomes.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getIncomes.fulfilled, (state, action)=>{
                state.loading = false;
                state.incomes = action.payload
                state.error = null;
            })
            .addCase(getIncomes.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createIncome.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(createIncome.fulfilled, (state, action)=>{
                state.incomes.push(action.payload)
                state.loading = false;
            })
            .addCase(createIncome.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(removeIncome.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(removeIncome.fulfilled, (state, action)=>{
                state.incomes = state.incomes.filter((exp) => exp.id !== action.payload);
                state.loading = false;
            })
            .addCase(removeIncome.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })  
            .addCase(editIncome.pending, (state)=>{
                state.loading = true;                
                state.error = null;
            })
            .addCase(editIncome.fulfilled, (state, action)=>{
                const index = state.incomes.findIndex((exp: any) => exp.id === action.payload.id);
                if (index !== -1) {
                state.incomes[index] = action.payload;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(editIncome.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            }) 
    },
})

export default incomeSlice.reducer;