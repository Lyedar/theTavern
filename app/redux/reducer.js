
import Immutable from 'immutable'



function tavernReducer(previousState, action){
	console.log('DOING A REDUCE STATE:', previousState, 'ACTION:', action)
	switch(action.type){
		case 'TOGGLE_LOGIN':
			console.log("IT'S HAPPENING!!!!")
			return previousState.set('loggedIn', !previousState.get('loggedIn'))
		case 'SET_USER':
			return previousState.set('currentUser', Immutable.fromJS(action.user))
		case 'ADD_USER':
			console.log('ADDING USER', action)
			return previousState.setIn(['users', action.user.userName], Immutable.fromJS(action.user));
		case 'SET_USERNAME':
			return previousState.set('userName', action.userName);
		case 'SET_EMAIL':
			return previousState.set('email', action.email);
		case 'SET_PASSWORD':
			return previousState.set('password', action.password)
		case 'SET_CONFIRM':
			return previousState.set('confirmPassword', action.password)
		case 'CHANGE_EDITABLE':
			return previousState.set('edit', !previousState.get('edit'));
		case 'UPDATE_PROFILE':
			return previousState.setIn(['currentProfile', action.field], action.value)
		case 'SET_PROFILE':
			return previousState.set('currentProfile' , Immutable.fromJS(action.profile))
		case 'SET_AVAILABILTY':
			console.log('setting availabilty', action)
			return previousState.setIn(['currentProfile', 'availability', action.day, action.time], action.available)
		case 'ADD_LIST_ITEM':
			return previousState.setIn(['currentProfile', action.list], previousState.getIn(['currentProfile', action.list]).push(action.item))
		case 'REMOVE_LIST_ITEM':
			console.log('action.item', action.item, 'action.list', action.list)
			return previousState.setIn(['currentProfile', action.list], previousState.getIn(['currentProfile', action.list]).filter((i) => i !== action.item))
		case 'SET_SEARCH':
			return previousState.setIn(['search', action.element], action.value)
		case 'SET_RESULTS':
			return previousState.set('results', action.results)
		case 'SET_ERROR':
			return previousState.set('errorMessage', action.message)
	}
	return previousState
}

module.exports = tavernReducer