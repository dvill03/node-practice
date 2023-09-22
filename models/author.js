import { DateTime } from 'luxon'
import { Schema, model } from 'mongoose'

const AuthorSchema = new Schema(
	{
		first_name: { type: String, required: true, maxLength: 100 },
		family_name: { type: String, required: true, maxLength: 100 },
		date_of_birth: { type: Date },
		date_of_death: { type: Date },
	},
	{
		virtuals: {
			name: {
				get() {
					if (!this.first_name || !this.family_name) {
						return ''
					}

					return `${this.family_name}, ${this.first_name}`
				},
			},
			url: {
				get() {
					return `/catalog/author/${this._id}`
				},
			},
			date_of_birth_formatted: {
				get() {
					return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : ''
				},
			},
			date_of_death_formatted: {
				get() {
					return this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : ''
				},
			},
		},
	},
)

export default model('Author', AuthorSchema)
