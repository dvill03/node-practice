import { fileURLToPath } from 'url'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import createError from 'http-errors'
import express from 'express'
import logger from 'morgan'
import path, { dirname } from 'path'
import helmet from 'helmet'
import RateLimit from 'express-rate-limit'

import catalogRouter from './routes/catalog.js'
import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(limiter)
app.use(helmet)
app.use(compression)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/catalog', catalogRouter)

// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404))
})

// error handler
app.use(function (err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

export default app
