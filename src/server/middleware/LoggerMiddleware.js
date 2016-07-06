import chalk from 'chalk'
import moment from 'moment'
import HttpError from '../http/errors/HttpError'
import NoResponseError from '../../pipeline/NoResponseError'

export default function LoggerMiddleware (next) {
  return async function (request) {
    const startTime = Date.now()
    try {
      const response = await next(request)
      const endTime = Date.now()
      report(request, startTime, endTime, response.statusCode)
      return response
    } catch (error) {
      const endTime = Date.now()
      if (error instanceof HttpError) {
        report(request, startTime, endTime, error.statusCode)
      } else if (error instanceof NoResponseError) {
        report(request, startTime, endTime, 404)
      } else {
        report(request, startTime, endTime, 500)
      }
      throw error
    }
  }
}

function report (request, startTime, endTime, statusCode) {
  const milliseconds = endTime - startTime
  const url = request.url
  const method = request.method
  const time = `[${moment(startTime).format('ddd, MMM D, YYYY HH:mm:ss [GMT]Z')}]`

  const tookLong = milliseconds > 500
  const tookVeryLong = milliseconds > 2000
  const isError = statusCode >= 500
  const isBadRequest = statusCode >= 400
  const isRedirect = statusCode >= 300
  const isOK = statusCode >= 200

  const timeColor = chalk.gray
  const methodColor = chalk.yellow
  const pathColor = chalk.bold
  const durationColor =
    tookVeryLong
      ? chalk.red
      : tookLong
        ? chalk.yellow
        : chalk.green
  const statusColor =
    isError
      ? chalk.red
      : isBadRequest
        ? chalk.blue
        : isRedirect
          ? chalk.yellow
          : isOK
            ? chalk.green
            : chalk.magenta

  console.log(
    timeColor(time),
    methodColor(method),
    pathColor(url),
    statusColor(statusCode),
    durationColor(milliseconds + 'ms')
  )
}
