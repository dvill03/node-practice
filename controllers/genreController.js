import { body, validationResult } from 'express-validator'
import asyncHandler from 'express-async-handler'

import Book from '../models/book.js'
import Genre from '../models/genre.js'

// Display list of all Genre.
const genre_list = asyncHandler(async (req, res) => {
	const allGenres = await Genre.find({}).exec()

	res.render('lists/genre_list', {
		title: 'Genre List',
		genre_list: allGenres,
	})
})

// Display detail page for a specific Genre.
const genre_detail = asyncHandler(async (req, res, next) => {
	const [genre, booksInGenre] = await Promise.all([Genre.findById(req.params.id).exec(), Book.find({ genre: req.params.id }, 'title summary').exec()])
	if (genre === null) {
		const err = new Error('Genre not found')
		err.status = 404
		return next(err)
	}

	res.render('details/genre_detail', {
		title: 'Genre Detail',
		genre: genre,
		genre_books: booksInGenre,
	})
})

// Display Genre create form on GET.
const genre_create_get = asyncHandler(async (req, res) => {
	res.render('forms/genre_form', { title: 'Create Genre' })
})

// Handle Genre create on POST.
const genre_create_post = [
	// Validate and sanitize the name field.
	body('name', 'Genre name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),
	// Process request after validation and sanitization.
	asyncHandler(async (req, res) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req)
		const genre = new Genre({ name: req.body.name })

		if (!errors.isEmpty()) {
			// There are errors. Render the form again with sanitized values/error messages.
			res.render('forms/genre_form', {
				title: 'Create Genre',
				genre: genre,
				errors: errors.array(),
			})
			return
		}

		// Check if Genre with same name already exists.
		const genreExists = await Genre.findOne({ name: req.body.name }).collation({ locale: 'en', strength: 2 }).exec()
		if (!genreExists) {
			await genre.save()
		}

		res.redirect(genreExists?.url ?? genre.url)
	}),
]

// Display Genre delete form on GET.
const genre_delete_get = asyncHandler(async (req, res) => {
	res.send('NOT IMPLEMENTED: Genre delete GET')
})

// Handle Genre delete on POST.
const genre_delete_post = asyncHandler(async (req, res) => {
	res.send('NOT IMPLEMENTED: Genre delete POST')
})

// Display Genre update form on GET.
const genre_update_get = asyncHandler(async (req, res) => {
	res.send('NOT IMPLEMENTED: Genre update GET')
})

// Handle Genre update on POST.
const genre_update_post = asyncHandler(async (req, res) => {
	res.send('NOT IMPLEMENTED: Genre update POST')
})

export default {
	genre_create_get,
	genre_create_post,
	genre_delete_get,
	genre_delete_post,
	genre_detail,
	genre_list,
	genre_update_get,
	genre_update_post,
}
