import React from 'react';
import 'whatwg-fetch';
import styles from 'css/components/home';
var Immutable = require('immutable')
import { Link } from 'react-router';
import {browserHistory} from 'react-router';
import {setSuggestionsAction, setResultsAction, addProfileAction, addToListAction} from '../redux/actions';
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
		addProfile : (profile) => dispatch(addProfileAction(profile)),
		addToFriends: (item) => dispatch(addToListAction('friends', item))
	}

}




function compareTimes(userTime, profileTime){
	const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
	const times = ['Morning', 'Lunch', 'Afternoon', 'Night', 'GraveYard']
	const returnVal = days.map(day=> times.filter(time => userTime.getIn([day,time]) && profileTime[day][time]).length)
						  .reduce((acc, next) => acc + next)				  
	return returnVal
}	

class suggestionsView extends React.Component {

	findSuggestions(){
		if(this.props.currentUserName){
			requestApi('/api/v1/suggestions/' + this.props.currentUserName)()
				.then((results)=>{
					results.sort((a,b) => {
						var score 
						var availabilityModifier =0;
						if (a.availabilityScore > b.availabilityScore){
							availabilityModifier = 5
						} else if (b.availabilityScore > a.availabilityScore){
							availabilityModifier = -5
						}
						var overlapModifier = a.gameOverlap - b.gameOverlap
						var locationModifier = 0
						if(this.props.currentUser.toJS().location.toLowerCase() === a.location.toLowerCase()){
							locationModifier += 5
						}
						if(this.props.currentUser.toJS().location.toLowerCase() === b.location.toLowerCase()){
							locationModifier -= 5
						}
						var score = availabilityModifier + overlapModifier + locationModifier
						return score * -1
					})
					this.props.setSuggestions(results)
					results.map((profile) => this.props.addProfile(profile))
				})
		}
	}

	componentWillReceiveProps(newProps){
		if(this.props.currentUserName !== newProps.currentUserName || newProps.currentUserName && !newProps.suggestions) {
			this.findSuggestions()
		}
		if(newProps.currentUser && this.props.currentUser && newProps.currentUser.toJS().friends.length !== this.props.currentUser.toJS().friends.length){
			requestApi("/api/v1/updateprofile", 'PUT')(newProps.currentUser.toJS())
			.then(
				this.findSuggestions()
				)
		}
	}


	addFriend(name){	
		this.props.addToFriends(name);
	}


	displaySuggestions() {

		const popoverHoverFocus = (profile) => (
		  <Popover id="popover-trigger-hover-focus" style={{maxWidth: '10000000px'}} className = 'black' title={profile.userName + "'s Calendar"}>
		    <Calendar userName = {profile.userName}/>
		  </Popover>
		);
		if(this.props.suggestions) {
			return this.props.suggestions.map(profile => 
				<div>
					<Link to={'/profile/' + profile.userName}>{profile.userName}</Link>
					{' '}
					{profile.dm ? <span>DM</span> : <span>Player</span>}<br />
					Lives in: {' '}
					{profile.location}<br/>
					First Listed Game: <br/>
					{profile.games[0]}<br/>
					Similar Times: 
					<OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={popoverHoverFocus(profile)}>
      					<Button className = 'green invisableButton'>{compareTimes(this.props.userAvailability, profile.availability)}</Button>
    				</OverlayTrigger>
    				<br />
    				<Button bsStyle = 'primary' onClick={()=>this.addFriend(profile.userName)}>Add to Friends</Button>
				</div>
			)
		}
	}

	render(){
		return(<span>
				<h3>Suggested Possible Party Members</h3>
				{this.displaySuggestions()}
			</span>)
	}

}


module.exports = connect(mapStateToProps , mapDispatchToProps)(suggestionsView)