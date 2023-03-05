import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "../../types/todoTypes";

interface TodoState {
    todoList: Todo[]
}

const initialState: TodoState = {
    todoList: []
}

const todo = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        fetchData: (state, action: PayloadAction<Todo[]>) => {
            state.todoList = action.payload
        }
    }
})

export const { fetchData } = todo.actions

export default todo.reducer

