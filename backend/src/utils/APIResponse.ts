class ApiResponse {
  statusCode: number;
  message: string;
  data: object;
  success: boolean = true;

  constructor(
    statusCode: number,
    message: string,
    data: object = {},
    success: boolean = true,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
