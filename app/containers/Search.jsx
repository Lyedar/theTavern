import React from 'react';
import 'whatwg-fetch';
import { Link } from 'react-router';
import {browserHistory} from 'react-router';
import {setSearchAction} from '../redux/actions'
import {connect} from 'react-redux'

function mapStateToProps(state, ownProps){
	console.log('stttate', state.toJS())
  	return {
	    edit : state.get('edit'),
	    value: state.getIn(['currentProfile', ownProps.field]),
	    user: state.getIn(['currentUser', 'userName']),
	    search: state.get('search').set('currentUser',state.getIn(['currentUser', 'userName']))
	}
}

function mapDispatchToProps(dispatch, ownProps){
  return {
    setSearch : (element, value) => dispatch(setSearchAction(element, value))
  }
}

export default class SearchView extends React.Component {

	searchTag() {
		console.log('this is the test object', this.props.search.toJS())
	}

	render () {
		var {dm, player, list} = this.props.search.toJS()
		console.log('this.props.user', this.props)
		return (
			<div className='marginBiggerTop'>
				<h1>Search Page</h1>
	            <select id='valueSelector' onChange={(e) => this.props.setSearch('list', e.target.value)}>
	            	<option selected={list==='times'} value='times'>Times</option>
	            	<option selected={list==='location'} value='location'>Location</option>
	            	<option selected={list==='game'} value='game'>Game</option>
	            </select>
	            <input type='checkbox' checked={dm} id = 'dm' onChange={(e) => this.props.setSearch('dm', !dm)}  />Dungeon Master
	            <input type='checkbox' checked={player} id = 'player' onChange={(e) => this.props.setSearch('player', !player)}  />Player		
				<button onClick={::this.searchTag}>Search</button>
			</div>
		)
	}
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(SearchView)