import { createSlice } from "@reduxjs/toolkit";

const initialState={
    status:false,
    userData:false
}
// authSliceReducer
const authSlice = createSlice({
    name:"authSlice",
    initialState:initialState,
    reducers:{
        login:(state,action)=>{
            state.status=true,
            state.userData = action.payload
        }
    }
})

export default authSlice.reducer