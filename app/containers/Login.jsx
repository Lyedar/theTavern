import React from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/home';
import 'whatwg-fetch';
import { Link } from 'react-router';
const cx = classNames.bind(styles);
import {browserHistory} from 'react-router';
import requestApi from '../utilities/requests'
import {Button, form, FormGroup, ControlLabel, FormControl, Col, Row} from 'react-bootstrap';
import {setUserAction, setLoginAction, setEmailAction, setPasswordAction} from '../redux/actions'
import {connect} from 'react-redux'


function mapStateToProps(state, ownProps){
  return {
    edit : state.get('edit'),
    user : state.get('currentUser'),
    email: state.get('email'),
    password: state.get('password'),
    loggedIn: state.get('loggedIn')
  }

}

function mapDispatchToProps(dispatch, ownProps){
  return {
    setUser : (user) => dispatch(setUserAction(user)),
    setLogin: () => dispatch(setLoginAction()), 
    setEmail: (value) => dispatch(setEmailAction(value)), 
    setPassword: (value) => dispatch(setPasswordAction(value))
  }

}

export default class Login extends React.Component {



	pulluser(){
		requestApi('/api/v1/login', POST)({email:this.props.email, password:this.props.password})
			.then(function(response){
				if(response.success){
					this.props.setLogin
					this.props.setEmail('')
					this.props.setPassword('')
					this.props.setUser(response.user)
					browserHistory.push('/')
				}else{
					return(<div>You suck at typing</div>)
				}
			})
	}

	// pullUser(){
	// 	console.log(this.props)
	// 	var self = this
	// 	fetch('/api/v1/login', {
	// 		credentials : 'same-origin',
	// 		method: 'POST',
	// 		headers: {
	// 			'Accept': 'application/json',
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({
	// 			email : self.state.email,
	// 			password : self.state.password
	// 		})
	// 	})
	// 	.then(function(response) {
	// 		return response.json()
	// 	}).then(function(json) {			
	// 		self.setState(json)
	// 	}).catch(function(ex) {
	// 		console.log('parsing failed', ex)
	// 	}).then(function(){
	// 		if(self.state.success){
	// 			self.props.toggleLogin()
	// 			browserHistory.push('/')
	// 		}
	// 	})
	// }

	render(){
		var self = this 
		return(
			<div className = 'marginTop'>
			<form>
				<FormGroup>
					<Row>
					<Col sm={3}>
					<ControlLabel>Email</ControlLabel>
					<FormControl type="email" placeHolder = "Enter Email" onChange={(e)=>this.props.setEmail(e.target.value)}/><br />
					</Col>
					</Row>
				</FormGroup>
				<FormGroup>
					<Row>
					<Col sm={3}>
					<ControlLabel>Password</ControlLabel>
					<FormControl type="password" placeHolder= "Enter Password" onChange={(e)=>this.props.setPassword(e.target.value)} /><br />
					</Col>
					</Row>
				</FormGroup>
			</form>

			<Button onClick ={this.pullUser.bind(this)} bsStyle = 'primary'>Login</Button><br/>
			<br/> Dont have an Account?
			<Link to = "/signup">  Sign Up Here</Link>
			</div>)
		}
	}