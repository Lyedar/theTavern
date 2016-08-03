import React from 'react';
import classNames from 'classnames/bind';
import {Form, FormGroup, FormControl, ControlLabel, Col, Row, Button, HelpBlock} from 'react-bootstrap'
import {setSuggestionsAction, setResultsAction, addProfileAction, addToListAction} from '../redux/actions';
import {connect} from 'react-redux';
import styles from 'css/components/home';
import requestApi from '../utilities/requests';
import _ from 'lodash';


function mapStateToProps(state, ownProps){
	console.log('stttate', state.toJS())
  	return {
	    edit : state.get('edit'),
	    user: state.get('currentUser'),
	    search: state.get('search').set('currentUser',state.getIn(['currentUser', 'userName'])),
	    results: state.get('results')
	}
}

function mapDispatchToProps(dispatch, ownProps){
  return {
  }
}

export default class PartyView extends React.Component {




	render(){
		if(false){
			return('We have a party')
		}else{
			return(<div>
				<h2>This Player is not in a party</h2>
				</div>)
		}
	}



}

module.exports = connect(mapStateToProps , mapDispatchToProps)(PartyView)