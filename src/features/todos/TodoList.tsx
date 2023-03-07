import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import AddTodoForm from "./AddTodoForm"
import { fetchData, getTodo, getTodoError, getTodoStatus } from "./todoSlice"

const TodoList = () => {

    const todos = useAppSelector(state => state.todo.todoList)
    const status = useAppSelector(getTodoStatus)
    const error = useAppSelector(getTodoError)

    const dispatch = useAppDispatch()

    useEffect(() => {
        // const getData = async () => {
        //     let result = await axios.get('http://localhost:3500/todos')
        //     console.log(result.data)
        //     dispatch(fetchData(result.data))
        // }

        // getData()

        if (status == 'idle') {
            dispatch(getTodo())
        }
    }, [status, dispatch])

    let content;
    if (status == 'loading') {
        content = <p>Loading</p>
    } else if (status == 'successed') {
        content = todos.map((todo) => {
            return (
                <article key={todo.id}>
                    <div className="todo">
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            id={String(todo.id)}
                        //   onChange={() =>
                        //     changeComplete({ ...todo, completed: !todo.completed })
                        //   }
                        />
                        <label htmlFor={String(todo.id)}>{todo.title}</label>
                    </div>
                    <button className="trash">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </article>
            );
        });
    } else if (status == 'failed') {
        content = <p>{error}</p>
    }


    return (
        <main>
            <h1>Todo List</h1>
            <AddTodoForm />
            {content}
        </main>
    )
}

export default TodoList