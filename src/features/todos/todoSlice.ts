import { AnyAction, AsyncThunk, createAsyncThunk, createSlice, isFulfilled, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { Todo } from "../../types/todoTypes";

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

function isPendingAction(action: AnyAction): action is PendingAction {
    return action.type.endsWith('/pending')
}

function idFulfilledAction(action: AnyAction): action is FulfilledAction {
    return action.type.endsWith('/fulfilled')
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
    return action.type.endsWith('/rejected')
}
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
            // .addCase(getTodo.pending, (state) => {
            //     state.status = 'loading'
            // })
            .addCase(getTodo.fulfilled, (state, action) => {
                // state.status = 'successed'
                state.todoList = action.payload
            })
            // .addCase(getTodo.rejected, (state, action) => {
            //     state.status = 'failed'
            //     state.error = action.payload as string
            // })
            .addCase(addTodo.fulfilled, (state, action) => {
                state.todoList.push(action.payload)
            })
            .addCase(udpateTodo.fulfilled, (state, action) => {
                const { id } = action.payload;
                let todo = state.todoList.filter((item) => item.id !== id);
                todo.push(action.payload);
                state.todoList = todo;
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                const { id } = action.payload;
                const todo = state.todoList.filter((item) => item.id !== id);
                state.todoList = todo;
            })
            .addMatcher(isPendingAction, (state) => {
                state.status = 'loading'
            })
            .addMatcher(isFulfilled, (state) => {
                state.status = 'successed'
            })
            .addMatcher(isRejectedAction, (state, action) => {
                state.status = 'failed'
                state.error = action.payload as string
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

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (todo: Todo) => {
    try {
        const { id } = todo;
        let result = await axios.delete(
            `http://localhost:3500/todos/${id}`
        );
        if (result?.status === 200) return todo;
        return `${result?.status}: ${result?.statusText}`;
    } catch (e: any) {
        return e.message;
    }
})

export const getTodoStatus = (state: RootState) => state.todo.status
export const getTodoError = (state: RootState) => state.todo.error

export const { fetchData } = todo.actions

export default todo.reducer

