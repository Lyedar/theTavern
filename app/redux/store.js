import { createStore } from 'redux'
import tavernReducer from './reducer'
import Immutable from 'immutable'


var initialState = Immutable.fromJS({
	loggedIn: false,
	errorMessage: '',
	profiles: {},
	currentUser : false,
	profileUserName: false,
	edit: false,
	search: {
		dm: true,
		player: true,
		list: 'game'
	},
	results: {},
	suggestions: {},
	userName: '',
	email: '',
	password: '',
	confirmPassword: ''
})

module.exports =  createStore(tavernReducer, initialState, window.devToolsExtension && window.devToolsExtension())