import React from 'react';
import classNames from 'classnames/bind';
import {Form, FormGroup, FormControl, ControlLabel, Col, Row, Button, HelpBlock} from 'react-bootstrap'
import {addToListAction, deleteFromListAction, addProfileAction} from '../redux/actions';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import styles from 'css/components/home';
import requestApi from '../utilities/requests';
import _ from 'lodash';


function mapStateToProps(state, ownProps){
	var currentUser = state.get('currentUser')
	var userName = ownProps.userName || currentUser
  	return {
	    userName,
	    profiles : state.get('profiles').toJS(),
	    userProfile: state.getIn(['profiles', userName]),
	    edit : state.get('edit'),
	    party: _.get(state.get('profiles').toJS(),`${userName}.party`, [])
	}
}

function mapDispatchToProps(dispatch, ownProps){
  return {
  	addProfile: (profile) => dispatch(addProfileAction(profile)),
  	addPartyMember: (member) => dispatch(addToListAction(member)), 
  	deletePartyMember: (member) => dispatch(deleteFromListAction(member))
  }
}

export default class PartyView extends React.Component {


	getParty(){
		console.log('Getting party', this.props.party)

		this.props.party.map((name)=>{
			console.log('Party Member: ', name)
			requestApi('/api/v1/getprofile/' + name)()
				.then((profile)=>{
					console.log('profile: ', profile)
					this.props.addProfile(profile)})
		})
	}

	displayParty(){
			return this.props.party.map((name)=>{
				const profile = this.props.profiles[name] || {}
				return <div>
					<h2>{<Link to={'/profile/'+profile.userName}>{profile.userName}</Link> || 'Loading...'}</h2>
					{profile.dungeonMaster ? <h3>Dungeon Master</h3> : <h4>Player</h4>}
					<h6>{profile.location || ''}</h6>

				</div>
			})
		
	}


	componentWillMount(){
		this.getParty()
	}



	render(){
		console.log('This.props', this.props)
		if(this.props.party.length > 0 && this.props.party){
			return(<div>
				<h2>Party Members</h2>
				{this.displayParty()}
			</div>)
		}else{
			return(<div>
				<h2>This Player is not in a party</h2>
				</div>)
		}
	}



}

module.exports = connect(mapStateToProps , mapDispatchToProps)(PartyView)