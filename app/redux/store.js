import { createStore } from 'redux'
import tavernReducer from './reducer'
import Immutable from 'immutable'


var initialState = Immutable.fromJS({
	loggedIn: false,
	errorMessage: '',
	currentUser : {},
	currentProfile: {},
	edit: false,
	search: {
		dm: true,
		player: true,
		list: 'game'
	},
	results: {},
	userName: '',
	email: '',
	password: '',
	confirmPassword: ''
})

module.exports =  createStore(tavernReducer, initialState)