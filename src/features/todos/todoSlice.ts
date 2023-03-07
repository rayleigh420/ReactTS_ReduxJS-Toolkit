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
            .addCase(addTodo.fulfilled, (state, action) => {
                state.todoList.push(action.payload)
            })
            .addCase(udpateTodo.fulfilled, (state, action) => {
                const { id } = action.payload;
                let todo = state.todoList.filter((item) => item.id !== id);
                todo.push(action.payload);
                state.todoList = todo;
            })
    }
})

export const getTodo = createAsyncThunk('todos/getTodo', async () => {
    try {
        let result = await axios.get('http://localhost:3500/todos');
        return result.data
    } catch (e: any) {
        return e.message
    }
})

export const addTodo = createAsyncThunk('todos/addTodo', async (todo: Todo, thunkAPI) => {
    try {
        let result = await axios.post('http://localhost:3500/todos', todo);
        return result.data
    } catch (e: any) {
        return e.message
    }
})

export const udpateTodo = createAsyncThunk('todos/udpateTodo', async (todo: Todo) => {
    try {
        const { id } = todo;
        let result = await axios.put(
            `http://localhost:3500/todos/${id}`,
            todo
        );
        return result.data;
    } catch (e: any) {
        return e.message;
    }
})

export const getTodoStatus = (state: RootState) => state.todo.status
export const getTodoError = (state: RootState) => state.todo.error

export const { fetchData } = todo.actions

export default todo.reducer

