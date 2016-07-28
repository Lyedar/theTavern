import React from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/home';
import {Form, FormGroup, FormControl, ControlLabel, Col, Row, Button, HelpBlock} from 'react-bootstrap'
import {changeAvailabiltyAction} from '../redux/actions'
import {connect} from 'react-redux'

function mapStateToProps(state, ownprops){
	var loggedInUser = state.getIn(['currentUser','userName'])
	var user = ownprops.user || loggedInUser
	console.log("CALENDAR", user)
	return{
		availability: state.getIn(["users", user, "availability"]),
		userAvailability:  state.getIn(["users", loggedInUser , "availability"]),
		user, 
		loggedInUser,
		edit: state.get('edit')
	}
}

function mapDispatchToProps(dispatch){
	return{
		setAvailability: (day, time, available) => dispatch(changeAvailabiltyAction(day, time, available))
	}
}

export default class CalendarView extends React.Component {



	checkAv(time, day){
		if(this.props.edit){
			if(this.props.availability.getIn([day,time])){
				return(
					<div className = 'green invisableButton' onClick = {()=>this.props.setAvailability(day, time, false)}>Available</div>
					)
			}else{
				return(
				<div className = 'red invisableButton' onClick = {()=>this.props.setAvailability(day, time, true)}>-</div>
				)
			}
		}else{
			if(this.props.availability.getIn([day,time])){
				return(
					<span className = 'green' style={{background: this.match(day, time) ? 'hotpink' : undefined}}>Available</span>
					)
			}else{
				return(
				<span className = 'red'>-</span>
				)
			}
		}	
	}

	match(day, time){
		const {user, loggedInUser, availability, userAvailability} = this.props
		if (user !== loggedInUser && loggedInUser){
			return availability.getIn([day,time]) && userAvailability.getIn([day, time])
		} 
		return false
	}

	times() {
		
		var dayTimes = ["Morning", "Lunch", "Afternoon", "Night", "GraveYard"]
		return dayTimes.map((curr)=> {
			return (
				<tr>
					<td>{curr}</td>
					<td>{this.checkAv(curr , "Monday")}</td>
					<td>{this.checkAv(curr , "Tuesday")}</td>
					<td>{this.checkAv(curr , "Wednesday")}</td>
					<td>{this.checkAv(curr , "Thursday")}</td>
					<td>{this.checkAv(curr , "Friday")}</td>
					<td>{this.checkAv(curr , "Saturday")}</td>
					<td>{this.checkAv(curr , "Sunday")}</td>
				</tr>
			)
		})
	}

	render() {
		console.log('CALENDAR PROPS', this.props)
		if(this.props.availability){
			return(
				<div className = 'profileCal'>
					<Row>
						<table>
							<tr>
								<th> </th>
								<th>Monday</th>
								<th>Tuesday</th>
								<th>Wednesday</th>
								<th>Thursday</th>
								<th>Friday</th>
								<th>Saturday</th>
								<th>Sunday</th>	
							</tr>
							{this.times()}
						</table>
					</Row>
				</div>
			)
		} else {
			return <Row><h1>Loading availability...</h1></Row>
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(CalendarView)