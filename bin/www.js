#!/usr/bin/env node

/**
 * Module dependencies.
 */

import debug from 'debug'
import dotenv from 'dotenv'
import http from 'http'
import mongoose from 'mongoose'

import app from '../app.js'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

/**
 * Create HTTP server.
 */

var server = http.createServer(app)

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	var portId = parseInt(val, 10)

	if (isNaN(portId)) {
		// named pipe
		return val
	}

	if (portId >= 0) {
		// port number
		return portId
	}

	return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error
	}

	var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges')
			process.exit(1)
			break
		case 'EADDRINUSE':
			console.error(bind + ' is already in use')
			process.exit(1)
			break
		default:
			throw error
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	var addr = server.address()
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
	debug('Node:server')('Listening on ' + bind)
}

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
mongoose.set('strictQuery', false)

const dev_db_url = 'mongodb+srv://becauseofuri:69reasons@cluster0.i0u84nt.mongodb.net/mdn_test?retryWrites=true&w=majority'
const mongoDB = process.env.MONGODB_URI || dev_db_url

console.log(process.env.MONGODB_URI, process.env.NODE_ENV, process.env.PORT)

// Wait for database to connect, logging an error if there is a problem
connectMongoDB().catch((err) => console.log(err))

async function connectMongoDB() {
	await mongoose.connect(mongoDB)
	console.log('connected to mongoDB')
}
