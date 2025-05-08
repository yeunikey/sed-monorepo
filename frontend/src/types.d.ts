
interface ApiResponse<T> {
    statusCode: number,
    message?: string,
    data: T
}

interface User {
    id: number,
    login: string,
    role: "ADMIN" | "USER"
}

interface DataSet {
    id: number;
    question: string;
    answer: string;
}

export {
    User,
    ApiResponse,
    DataSet
}