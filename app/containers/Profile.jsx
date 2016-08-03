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
import ToggleEditButton from '../components/ToggleEditButton'
import {ProfileField, ProfileListField, ProfileCheckboxField} from '../components/profileFields'
import {setProfileUserNameAction, changeEditAction, addProfileAction, setSuggestionsAction} from '../redux/actions'
import editButtonBehavior from '../components/ToggleEditBehavior'
import getProfileBehavior from '../components/getProfileBehavior'
import CommitButton from '../components/CommitButton'


function mapStateToProps(state){
  var profileUserName = state.get("profileUserName")
  return { 
    profileUserName,
    state: state,
    profile: state.getIn(['profiles', profileUserName]),
    profiles: state.get('profiles'),
    host: state.getIn(['profiles', profileUserName, 'host']),
    dungeonMaster: state.getIn(['profiles', profileUserName, "dungeonMaster"]),
    player:  state.getIn(['profiles', profileUserName, "player"]),
    edit : state.get("edit")
  }
}

function mapDispatchToProps(dispatch){
  return {
    setProfileUserName : (userName) => dispatch(setProfileUserNameAction(userName)),
    changeEdit : () => dispatch(changeEditAction()),
    addProfile : (profile) => dispatch(addProfileAction(profile)),
    setSuggestions : (suggestions) => dispatch(setSuggestionsAction(suggestions))
  }
}


class ProfileView extends React.Component {

 whosProfile() {
  requestApi('/api/v1/getprofile/' + this.props.params.slug)()
    .then((profile)=>{
      this.props.setProfileUserName(profile.userName)
      this.props.addProfile(profile)
    })
 }

  componentWillUpdate(newProps){
    if(newProps.params.slug !== newProps.profileUserName || !newProps.profileUserName){
      this.whosProfile()
    }
  }

  componentWillMount(){
    this.whosProfile()
  }

  render() {

    return (
      <div className = 'container-fluid marginTop centerText profileCD'>
        <h1 className = 'profileName'>{this.props.profileUserName}'s Profile</h1>
        <h2 className = 'marginTop' >Description of individual goes here</h2>
        <Row>
          <Col md = {6}>
          <ToggleEditButton/>
            <h4>
              <ul className = 'leftText'>
                <li><ProfileField field='name' label="Name"/></li>
                <li><ProfileField label='User Name' field='userName'/></li>
                <li><ProfileField label='Age' field='age'/></li>
                <li><ProfileField label='Location' field='location'/></li>
                <li><ProfileField label='Phone' field='phone'/></li>
                <li><ProfileField label='Email' field='email'/></li>
                {this.props.host || this.props.edit ? <li><ProfileCheckboxField label='Host' field='host'/></li> : ''}
                <li><ProfileField label='Drink' field='alcohol'/></li>
                <li><ProfileField label='Skill' field='skillLevel'/></li>
                {this.props.dungeonMaster || this.props.edit ? <li><ProfileCheckboxField label='Dungeon Master' field='dungeonMaster'/></li> : ''}
                {this.props.player || this.props.edit ? <li><ProfileCheckboxField label='Player' field='player'/></li> : ''}
                <li><ProfileListField label='Games'field='games'/></li>
                <li><ProfileListField label='Friends' field='friends'/></li>
                {this.props.edit ? <li><ProfileListField label='Blocked Users' field='blockedUser' /></li> : ''}
              </ul>
            </h4>
            <CommitButton/><br/><br/>
          </Col>

          <Col md = {6}>
            <Suggestions />
          </Col>
        </Row>
        <Row>
          <Col md = {12}>
            <Calendar userName={this.props.params.slug} />
          </Col>
        </Row>
      </div>
     );
  }
};



module.exports = connect(mapStateToProps , mapDispatchToProps)(ProfileView)