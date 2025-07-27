class ApiError extends Error {
    constructor(public message:string,public statusCode:number){
        super(message)
        this.statusCode = statusCode,
        this.name = "ApiError"
        Error.captureStackTrace(this, this.constructor); 
    }
}

export default ApiError