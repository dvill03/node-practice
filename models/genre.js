import { Schema, model } from 'mongoose'

const GenreSchema = new Schema(
	{
		name: { required: true, type: String, minLength: 3, maxLength: 100 },
	},
	{
		virtuals: {
			url: {
				get() {
					return `/catalog/genre/${this._id}`
				},
			},
		},
	},
)

export default model('Genre', GenreSchema)
