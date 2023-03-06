import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { Todo } from "../../types/todoTypes";

interface TodoState {
    todoList: Todo[]
    status: 'idle' | 'loading' | 'successed' | 'failed',
    error: null | string
}

const initialState: TodoState = {
    todoList: [],
    status: 'idle',
    error: null
}

const todo = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        fetchData: (state, action: PayloadAction<Todo[]>) => {
            state.todoList = action.payload
        }
    },
    extraReducers: (bulder) => {
        bulder
            .addCase(getTodo.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getTodo.fulfilled, (state, action) => {
                state.status = 'successed'
                state.todoList = action.payload
            })
            .addCase(getTodo.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload as string
            })
    }
})

export const getTodo = createAsyncThunk('todos/getTodo', async () => {
    try {
        console.log("redux")
        let result = await axios.get('http://localhost:3500/todos');
        console.log("Redux: ", result.data)
        return result.data
    } catch (e: any) {
        return e.message
    }
})

export const getTodoStatus = (state: RootState) => state.todo.status
export const getTodoError = (state: RootState) => state.todo.error

export const { fetchData } = todo.actions

export default todo.reducer

