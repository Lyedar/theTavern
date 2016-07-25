import React from 'react';
import 'whatwg-fetch';
import { Link, IndexLink } from 'react-router';
import {browserHistory} from 'react-router';
import {Form, FormGroup, FormControl, ControlLabel, Col, Row, Button, HelpBlock} from 'react-bootstrap'
import {setUserAction, setUserNameAction, toggleLoginAction, setEmailAction, setPasswordAction, setConfirmPasswordAction, setErrorMessageAction} from '../redux/actions'
import requestApi from '../utilities/requests'
import GroupForm from '../components/GroupForm'
import {connect} from 'react-redux'

/*
 * Note: This is kept as a container-level component, 
 *  i.e. We should keep this as the container that does the data-fetching 
 *  and dispatching of actions if you decide to have any sub-components.
 */

function mapStateToProps(state){
  return { 
    user : state.get('currentUser').toJS(),
    userName: state.get('userName'),
    email: state.get('email'),
    password: state.get('password'),
    confirmPassword: state.get('confirmPassword'),
    loggedIn: state.get('loggedIn'),
    errorMessage: state.get('errorMessage')
  }
}

function mapDispatchToProps(dispatch){
  return {
    setProfile : (profile) => dispatch(setProfileAction(profile)),
    toggleLoggin : () => dispatch(toggleLogginAction()),
    setEmail : (email) => dispatch(setEmailAction(email)),
    setPassword: (password) => dispatch(setPasswordAction(password)),
    setConfirm: (password) => dispatch(setConfirmPasswordAction(password)),
    setUserName: (userName) => dispatch(setUserNameAction(userName)),
    setError: (message) => dispatch(setErrorMessageAction(message))
  }
}
 
 class HomeView extends React.Component {

 	signUpRequest(e) {
 		e.preventDefault()
 		if(this.props.confirmPassword !== this.props.password){
 			this.props.setError("Password's don't match")
 		}else{
 		console.log('attempting signup')	
 		requestApi('api/v1/signup', 'POST')({userName: this.props.userName, email: this.props.email, password: this.props.password})
 		.then(()=>{ 
 			requestApi('api/v1/createprofile', 'POST')({userName: this.props.userName, email: this.props.email})
 			})
 			.then(browserHistory.push('/profile/'+ this.props.userName))
 		}
 	}

 	signUpDisplay() {
 		return (
	 		<Form horizontal>

	 			<GroupForm id='userName' label='UserName' placeholder='Username' type='text' update={(val) => this.props.setUserName(val)} />
	 			<GroupForm id='email' label='Email' placeholder='Email'type='email' update={(val) => this.props.setEmail(val)}/>
	 			<GroupForm id='password' label='Password' placeholder='Password' type='password' update={(val) => this.props.setPassword(val)} />
	 			<GroupForm id='confirmPassword' label='Confirm Password' placeholder='Confirm Password' type='password' update={(val) => this.props.setConfirm(val)}/>

	 			<Col smOffset = {2} sm = {2} md = {2}>
	 				<Button type = 'submit' onClick = {::this.signUpRequest}>Signup</Button>
	 			</Col>
	 		</Form>
	 	)
 	}


 	render(){
 		console.log("reRender")
 		return (
 			<div className = 'centerText marginTop'>
 				<h1 className = 'profileName'>Welcome to The Tavern</h1>
 				<h2>The Tavern is a place where D & D users and enthusiasts gather to plan their next party</h2>
 				{this.props.errorMessage ? this.props.errorMessage : ''}
 				{this.signUpDisplay()}
 			</div>

 		)
 	} 	
 }

 module.exports = connect(mapStateToProps , mapDispatchToProps)(HomeView)