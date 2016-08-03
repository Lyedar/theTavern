import React from 'react';
import classNames from 'classnames/bind';
import {Form, FormGroup, FormControl, ControlLabel, Col, Row, Button, HelpBlock} from 'react-bootstrap'
import {addToListAction, deleteFromListAction} from '../redux/actions';
import {connect} from 'react-redux';
import styles from 'css/components/home';
import requestApi from '../utilities/requests';
import _ from 'lodash';


function mapStateToProps(state, ownProps){
	var userName = ownProps.userName || currentUser
  	return {
	    userName,
	    userProfile: state.getIn(['profiles', userName]),
	    edit : state.get('edit'),
	    party: state.getIn(['profiles', userName, 'party'])

	}
}

function mapDispatchToProps(dispatch, ownProps){
  return {
  	addPartyMember: (member) => dispatch(addToListAction(member)), 
  	deletePartyMember: (member) => dispatch(deleteFromListAction(member))
  }
}

export default class PartyView extends React.Component {




	render(){
		console.log('FROM PARTY, THIS.PROPS.PARTY.toJS() = ', this.props.party.toJS())
		if(this.props.party.toJS().length > 0){
			return(<div>
				<h2>This Player is in a party </h2>
			</div>)
		}else{
			return(<div>
				<h2>This Player is not in a party</h2>
				</div>)
		}
	}



}

module.exports = connect(mapStateToProps , mapDispatchToProps)(PartyView)