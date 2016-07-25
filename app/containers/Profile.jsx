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
import ToggleEditButton from '../components/ToggleEditButton'
import {ProfileField, ProfileListField, ProfileCheckboxField} from '../components/profileFields'
import {setProfileAction, changeEditAction} from '../redux/actions'
import editButtonBehavior from '../components/ToggleEditBehavior'
import getProfileBehavior from '../components/getProfileBehavior'



function mapStateToProps(state){
  return { 
    currentProfile : state.get("currentProfile"),
    userName : state.getIn(["currentProfile", "userName"]),
    edit : state.get("edit")
  }
}

function mapDispatchToProps(dispatch){
  return {
    setProfile : (profile) => dispatch(setProfileAction(profile)),
    changeEdit : () => dispatch(changeEditAction()) 
  }
}


class CommitButtonView extends React.Component {
  updateProfile(e) {
    e.preventDefault()
    requestApi('/api/v1/updateprofile', 'PUT')(this.props.currentProfile.toJS())
      .then(this.props.changeEdit)
  }

  render(){
    return <div className='btn btn-primary' onClick={(e)=>this.updateProfile(e)}>Commit</div>
  }
}

var CommitButton = editButtonBehavior(getProfileBehavior(CommitButtonView))



class ProfileView extends React.Component {

 whosProfile() {
  requestApi('/api/v1/getprofile/' + this.props.params.slug)()
    .then((profile)=>{
      this.props.setProfile(profile)
    })
 }

  componentWillMount(){
    this.whosProfile()
  }

  render() {
    return (
      <div className = 'container-fluid marginTop centerText profileCD'>
        <h1 className = 'profileName'>{this.props.userName}'s Profile</h1>
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
                <li><ProfileCheckboxField label='Host' field='host'/></li>
                <li><ProfileField label='Drink' field='alcohol'/></li>
                <li><ProfileField label='Skill' field='skillLevel'/></li>
                <li><ProfileCheckboxField label='Dungeon Master' field='dungeonMaster'/></li>
                <li><ProfileCheckboxField label='Player' field='player'/></li>
                <li><ProfileListField label='Games'field='games'/></li>
                <li><ProfileListField label='Friends' field='friends'/></li>
                <li><ProfileListField label='Blocked Users' field='blockedUser' /></li>
              </ul>
            </h4>
            <CommitButton /><br/><br/>
          </Col>

          <Col md = {6}>
            <a><li>suggestions/party #1</li></a>
            <a><li>suggestions/party #2</li></a>
            <a><li>suggestions/party #3</li></a>
          </Col>
        </Row>
        <Row>
          <Col md = {12}>
            <Calendar/>
          </Col>
        </Row>
      </div>
     );
  }
};



module.exports = connect(mapStateToProps , mapDispatchToProps)(ProfileView)