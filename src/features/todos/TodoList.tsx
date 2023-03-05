import axios from "axios"
import { useEffect } from "react"
import { useAppDispatch } from "../../app/hooks"
import AddTodoForm from "./AddTodoForm"
import { fetchData } from "./todoSlice"

const TodoList = () => {

    const dispatch = useAppDispatch()

    useEffect(() => {
        const getData = async () => {
            let result = await axios.get('http://localhost:3500/todos')
            console.log(result.data)
            dispatch(fetchData(result.data))
        }

        getData()
    }, [])

    return (
        <main>
            <h1>Todo List</h1>
            <AddTodoForm />
            {/* {content} */}
        </main>
    )
}

export default TodoList