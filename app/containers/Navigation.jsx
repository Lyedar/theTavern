import React, { Component, PropTypes } from 'react';
import {Link, IndexLink, browserHistory} from 'react-router';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import styles from 'css/components/navigation';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Form, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap'
import requestApi from '../utilities/requests'
import {setUserAction, toggleLoginAction, setEmailAction, setPasswordAction} from '../redux/actions'
const cx = classNames.bind(styles);
const {Header, Brand} = Navbar


function mapStateToProps(state, ownProps){
  return {
    edit : state.get('edit'),
    user : state.get('currentUser').toJS(),
    email: state.get('email'),
    password: state.get('password'),
    loggedIn: state.get('loggedIn')
  }

}

function mapDispatchToProps(dispatch, ownProps){
  return {
    setUser : (user) => dispatch(setUserAction(user)),
    toggleLogin: () => dispatch(toggleLoginAction()), 
    setEmail: (value) => dispatch(setEmailAction(value)), 
    setPassword: (value) => dispatch(setPasswordAction(value))
  }

}




class NavigationView extends Component {


  // componentWillMount() {
  //   requestApi('/api/v1/getuser')().then(user=>this.props.setUser(user))
  // }

  

  dropDown(){
    if(this.props.user){
      return(
        <NavDropdown eventKey={2} title= {this.props.user.userName} id = "user-drop-down">
          <MenuItem eventKey={2.1}><Link to={/profile/ + this.props.user.userName}>Profile</Link></MenuItem>
          <MenuItem eventKey={2.3}><Link to="/logout">Log Out</Link></MenuItem>  
        </NavDropdown> 
      )     
    } else {
      return <NavItem eventKey={2}><Link to="/login">Login</Link></NavItem>  
    }
  }

  loginDisplay() {
    var self = this
    return (
      <Form inline className="marginTop black alignRight">
        <FormGroup controlId = 'email' >
            <ControlLabel>Email</ControlLabel>
            {' '}
            <FormControl type = 'email' placeholder = 'Email' onChange= {(e)=> self.props.setEmail(e.target.value)}/>
        </FormGroup>
        {' '}
        <FormGroup>
            <ControlLabel>Password</ControlLabel>
            {' '}
            <FormControl type = 'password' placeholder = 'Password' onChange = {(e)=> self.props.setPassword(e.target.value)} />
        </FormGroup>
        {' '}
        <Button  onClick={::self.loginReq}>Login</Button>
      </Form>
    )
  }

  loginReq() {
    requestApi('/api/v1/login', 'POST')({email: this.props.email , password: this.props.password})
      .then(loginSuccess=>
        {
          if(loginSuccess.success){
            this.props.toggleLogin()
            console.log("TOGGLELOGIN", this.props.loggedIn)
            this.props.setUser(loginSuccess.user)
            browserHistory.push('/profile/' + loginSuccess.user.userName)
          } else {
            alert('Login failed. You should feel bad.')
          }
        })
  }

  isLoggedIn(){
    if(this.props.loggedIn){
      return(
        <div>
        {this.dropDown()}
        <NavItem eventKey={3}><Link to='/search'>Search</Link></NavItem>
        </div>
        )
    }else{
      return (
        <div>
        {::this.loginDisplay()}
        </div>
        )
      }
    }

  render() {
    console.log('this is logged in state', this.props.loggedIn)
    return (
      <Navbar className={"navbar-fixed-top"} fluid = 'true'>
        <Header>
          <Brand>
            THE TAVERN
          </Brand>
        </Header>
        <Nav>
            {this.isLoggedIn()}
        </Nav>
      </Navbar>
      );
  }
}



module.exports = connect(mapStateToProps , mapDispatchToProps)(NavigationView)