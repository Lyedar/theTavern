import React from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/home';
import {Link, IndexLink, browserHistory} from 'react-router';
import {connect} from 'react-redux'
import {Form, FormGroup, FormControl, ControlLabel, Col, Row, Button, HelpBlock} from 'react-bootstrap'
import _ from 'lodash';
const cx = classNames.bind(styles);
import requestApi from '../utilities/requests'
import Calendar from './Calendar'
import Suggestions from './Suggestions'
import Party from './Party'
import ToggleEditButton from '../components/ToggleEditButton'
import {ProfileField, ProfileListField, ProfileCheckboxField, ProfileTextAreaField} from '../components/profileFields'
import {setProfileUserNameAction, changeEditAction, addProfileAction, setSuggestionsAction, setErrorMessageAction, setDescriptionAction} from '../redux/actions'
import editButtonBehavior from '../components/ToggleEditBehavior'
import getProfileBehavior from '../components/getProfileBehavior'
import CommitButton from '../components/CommitButton'


function mapStateToProps(state){
  var profileUserName = state.get("profileUserName")
  return { 
    profileUserName,
    loggedIn: state.get('loggedIn'),
    currentUser: state.get('currentUser'),
    profile: state.getIn(['profiles', profileUserName]),
    profiles: state.get('profiles'), 
    host: state.getIn(['profiles', profileUserName, 'host']),
    dungeonMaster: state.getIn(['profiles', profileUserName, "dungeonMaster"]),
    player:  state.getIn(['profiles', profileUserName, "player"]),
    edit : state.get("edit"),
    errorMessage: state.get('errorMessage')
  }
}

function mapDispatchToProps(dispatch){
  return {
    setProfileUserName : (userName) => dispatch(setProfileUserNameAction(userName)),
    changeEdit : () => dispatch(changeEditAction()),
    addProfile : (profile) => dispatch(addProfileAction(profile)),
    setSuggestions : (suggestions) => dispatch(setSuggestionsAction(suggestions)),
    setErrorMessage: (message) => dispatch(setErrorMessageAction(message))
  }
}


class ProfileView extends React.Component {

 whosProfile() {
  requestApi('/api/v1/getprofile/' + this.props.params.slug)()
    .then((profile)=>{
      if(profile){
        this.props.setErrorMessage(false)
        this.props.setProfileUserName(profile.userName)
        this.props.addProfile(profile)
      }else{
        this.props.setErrorMessage('No Profile')
      }
    })
 }

  componentWillUpdate(newProps){
    if(newProps.params.slug !== newProps.profileUserName || !newProps.profileUserName && newProps.currentUser){
      this.whosProfile()
    }
  }

  componentWillMount(){
    if(this.currentUser){
      console.log('meep')
    this.whosProfile()
    }
  }

  render() {
    console.log('Am i logged in?', this.props)
    const profileUserName = this.props.profileUserName
    const currentUser = this.props.currentUser
    const partyLength = _.get(this.props.profiles.toJS(), `${currentUser}.party`, []).length
    if(this.props.loggedIn && !this.props.errorMessage){
      return (
        <div className = 'container-fluid marginTop centerText profileCD'>
          <h1 className = 'profileName'>{this.props.params.slug}'s Profile</h1>
          <ProfileTextAreaField userName = {this.props.params.slug} />
          <Row>
            <Col md = {6}>
            {profileUserName !== currentUser ? '' : <ToggleEditButton /> }
              <h4>
                <ul className = 'leftText'>
                  <div><ProfileField field='name' label="Name"/></div>
                  <div><ProfileField label='User Name' field='userName'/></div>
                  <div><ProfileField label='Age' field='age'/></div>
                  <div><ProfileField label='Location' field='location'/></div>
                  <div><ProfileField label='Phone' field='phone'/></div>
                  <div><ProfileField label='Email' field='email'/></div>
                  {this.props.host || this.props.edit ? <div><ProfileCheckboxField label='Host' field='host'/></div> : ''}
                  <div><ProfileField label='Drink' field='alcohol'/></div>
                  <div><ProfileField label='Skill' field='skillLevel'/></div>
                  {this.props.dungeonMaster || this.props.edit ? <div><ProfileCheckboxField label='Dungeon Master' field='dungeonMaster'/></div> : ''}
                  {this.props.player || this.props.edit ? <div><ProfileCheckboxField label='Player' field='player'/></div> : ''}
                  <div><ProfileListField label='Games'field='games'/></div>
                  <div><ProfileListField label='Friends' field='friends'/></div>
                  <div><ProfileListField label='Party' field='party'/></div>
                  {this.props.edit ? <div><ProfileListField label='Blocked Users' field='blockedUser' /></div> : ''}
                </ul>
              </h4>
              {this.props.edit ? <span><CommitButton/><br/><br/></span> : ''}
            </Col>

            <Col md = {6}>
              {profileUserName === currentUser && partyLength === 0 ? <Suggestions /> : <Party userName = {this.props.params.slug} />}
            </Col>
          </Row>
          <Row>
            <Col md = {12}>
              <Calendar userName={this.props.params.slug} />
            </Col>
          </Row>
        </div>
       );
    }else if(this.props.errorMessage){
      return(<div>
        <h1 className = 'profileName'>{this.props.errorMessage}</h1>
        <h2>Return to <Link to={'/profile/'+this.props.currentUser} onClick={this.whosProfile}>{this.props.currentUser}'s</Link> Profile</h2>
      </div>)
    }else{  
      console.log("To late we're rendering")
      return (<div className="addToFriends">
        <br/>
        <br/>
        <h1>PLEASE LOGIN</h1>
        <h3><Link to ="/">return home</Link></h3>
        </div>)
    }


  }
};



module.exports = connect(mapStateToProps , mapDispatchToProps)(ProfileView)