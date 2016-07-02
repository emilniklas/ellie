import HttpError from './HttpError'

export { HttpError }

export class BadRequestHttpError extends HttpError {
  constructor (message = 'Bad Request') {
    super(400, message)
  }
}

export class UnauthorizedHttpError extends HttpError {
  constructor (message = 'Unauthorized') {
    super(401, message)
  }
}

export class ForbiddenHttpError extends HttpError {
  constructor (message = 'Forbidden') {
    super(403, message)
  }
}

export class NotFoundHttpError extends HttpError {
  constructor (message = 'Not Found') {
    super(404, message)
  }
}

export class InternalServerHttpError extends HttpError {
  constructor (message = 'Internal Server Error') {
    super(500, message)
  }
}

export class NotImplementedHttpError extends HttpError {
  constructor (message = 'Not Implemented') {
    super(501, message)
  }
}
