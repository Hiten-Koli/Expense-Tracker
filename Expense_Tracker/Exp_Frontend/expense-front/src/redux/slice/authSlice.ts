import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../services/authServices";

interface AuthInterface{
    user: any;
    token: string | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState:AuthInterface = {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    success: false,
}

export const login = createAsyncThunk(
    "login/",
    async ({email, password}:{email:string, password:string}, thunkAPI)=>{
        try{
            const response = await loginUser(email,password);
            console.log(`Resposne Access: ${response.token.access}`)
            localStorage.setItem("token", response.token.access)
            return response
        }catch(err:any){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const register = createAsyncThunk(
    "register/",
    async ({username, email, password, password2}:{username: string, email: string, password: string, password2:string}, thunkAPI)=>{
        try{
            const response = await registerUser(username, email, password, password2);
            return response;
        }catch(err:any){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logout:(state)=>{
            localStorage.removeItem("token");
            state.user = null;
            state.token= null;
        }
    },
    extraReducers:(builder) =>{
        builder
            .addCase(login.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action)=>{
                state.loading = false;
                state.user = action.payload.user;
                console.log(action.payload.token.access)
                state.token = action.payload.token.access
                state.error = null;
            })
            .addCase(login.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(register.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state)=>{
                state.loading = false;
                state.success=true;
            })
            .addCase(register.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })
    },
})

export const {logout} = authSlice.actions;
export default authSlice.reducer;