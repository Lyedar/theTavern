import React from 'react';
import 'whatwg-fetch';
import { Link } from 'react-router';
import {browserHistory} from 'react-router';
import {setSuggestionsAction, setResultsAction, addProfileAction} from '../redux/actions';
import {connect} from 'react-redux';
import requestApi from '../utilities/requests';
import _ from 'lodash';
import Calendar from './Calendar'



function mapStateToProps (state) {

	return {
		suggestions : state.get('suggestions'),
		currentUser : state.get('currentUser')
	}

}

function mapDispatchToProps (dispatch){

	return {
		setSuggestions : (suggestions) => dispatch(setSuggestionsAction(suggestions)),
		addProfile : (profile) => dispatch(addProfileAction(profile))
	}

}

class suggestionsView extends React.Component {


	componentWillMount(){
		requestApi('/api/v1/suggestions/' + this.props.currentUser)()
			.then((results)=>{
				this.props.setSuggestions(results)
				results.map((profile) => this.props.addProfile(profile))
			})
	}

	displaySuggestions() {
		if(this.props.suggestions) {
			console.log('all the suggestions: ', this.props.suggestions)
			return this.props.suggestions.map(profile => 
				<div>
					<Link to={'/profile/' + profile.userName}>{profile.userName}</Link>
					{' '}
					{profile.dm ? <span>DM</span> : <span>Player</span>}<br />
					{profile.location}<br />
					{profile.games[0]}
					{profile.availabilityScore}
					<Calendar userName={profile.userName} />
				</div>
			)
		}
	}

	render(){
		console.log(this.props.suggestions)
		return(<span>
				<h3>Suggested Possible Party Members</h3>
				{this.displaySuggestions()}
			</span>)
	}

}


module.exports = connect(mapStateToProps , mapDispatchToProps)(suggestionsView)