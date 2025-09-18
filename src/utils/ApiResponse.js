class ApiResponse { 
    constructor(statusCode, message, data) {
        this.success = statusCode >= 200 && statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}
export default ApiResponse;