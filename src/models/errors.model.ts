export interface APIResponseError {
  error: {
    message: string
    type: string
    param: string | null
    code: string
  }
}

export class APIError extends Error {
  public response: APIResponseError

  constructor(response: APIResponseError) {
    super(response.error.message)
    this.response = response
  }
}

export class NoBodyError extends Error {
  constructor() {
    super('No body received')
  }
}
