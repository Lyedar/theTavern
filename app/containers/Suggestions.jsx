import React from 'react';
import 'whatwg-fetch';
var Immutable = require('immutable')
import { Link } from 'react-router';
import {browserHistory} from 'react-router';
import {setSuggestionsAction, setResultsAction, addProfileAction} from '../redux/actions';
import {connect} from 'react-redux';
import requestApi from '../utilities/requests';
import _ from 'lodash';
import Calendar from './Calendar'
import {Popover, OverlayTrigger, Button} from 'react-bootstrap'


function mapStateToProps (state) {
	const currentUserName = state.get('currentUser')
	const currentUser = state.getIn(['profiles', currentUserName])
	return {
		suggestions : state.get('suggestions'),
		currentUser,
		currentUserName,
		userAvailability : state.getIn(['profiles', currentUserName, 'availability']),
		profiles: state.get('profiles')
	}

}



function mapDispatchToProps (dispatch){

	return {
		setSuggestions : (suggestions) => dispatch(setSuggestionsAction(suggestions)),
		addProfile : (profile) => dispatch(addProfileAction(profile))
	}

}




function compareTimes(userTime, profileTime){
	console.log('USERTIME ', userTime)
	console.log('PROFILETIME ', profileTime)
	const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
	const times = ['Morning', 'Lunch', 'Afternoon', 'Night', 'GraveYard']
	const returnVal = days.map(day=> times.filter(time => userTime.getIn([day,time]) && profileTime[day][time]).length)
						  .reduce((acc, next) => acc + next)
	console.log('ReturnVal ', returnVal)					  
	return returnVal
}	

class suggestionsView extends React.Component {


	componentWillMount(){
		requestApi('/api/v1/suggestions/' + this.props.currentUserName)()
			.then((results)=>{
				this.props.setSuggestions(results)
				results.map((profile) => this.props.addProfile(profile))
			})
	}

	displaySuggestions() {


		const popoverHoverFocus = (
		  <Popover id="popover-trigger-hover-focus" title="Popover bottom">
		    <strong>Holy guacamole!</strong> Check this info.
		  </Popover>
		);

		if(this.props.suggestions) {
			console.log('all the suggestions: ', this.props.suggestions)
			return this.props.suggestions.map(profile => 
				<div>
					<Link to={'/profile/' + profile.userName}>{profile.userName}</Link>
					{' '}
					{profile.dm ? <span>DM</span> : <span>Player</span>}<br />
					{profile.location}<br />
					{profile.games[0]}<br />
					Similar Times: {compareTimes(this.props.userAvailability, profile.availability)}
					<OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverHoverFocus}>
      					<Button>Hover + Focus</Button>
    				</OverlayTrigger>
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