export function genTodo(title, description, id = Math.random().toString()) {
    return ({title, description, id})
}

export function genList(name, id = Math.random().toString()) {
    const todos = []
    return ({name, id, todos})
}