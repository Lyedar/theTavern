import React from 'react';
import 'whatwg-fetch';
import { Link } from 'react-router';
import {browserHistory} from 'react-router';
import {setSearchAction} from '../redux/actions'
import {connect} from 'react-redux'

function mapStateToProps(state, ownProps){
  	return {
	    edit : state.get('edit'),
	    value: state.getIn(['currentProfile', ownProps.field]),
	    user: state.getIn(['currentUser', 'local', 'userName'])
	}
}

function mapDispatchToProps(dispatch, ownProps){
  return {
    setSearch : (value) => dispatch(setSearchAction(value))
  }
}

export default class SearchView extends React.Component {

	searchTag() {
		var test
		test.value = document.getElementById('valueSelector').value
		test.dm = document.getElementById('dm').checked
		test.player = document.getElementById('player').checked
		console.log('this is the test object', test)
	}

	render () {
		return (
			<div className='marginBiggerTop'>
				<h1>Search Page</h1>
	            <select id='valueSelector' >
	            	<option value='times'>Times</option>
	            	<option value='location'>Location</option>
	            	<option value='game'>Game</option>
	            </select>
	            <input type='checkbox' id = 'dm'  value={true}/>Dungeon Master
	            <input type='checkbox' id = 'player' value={true}/>Player		
				<button onClick={this.searchTag}>Search</button>
			</div>
		)
	}
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(SearchView)