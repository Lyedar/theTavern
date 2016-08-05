import React from 'react';
import {updateProfileAction} from '../../redux/actions'
import {Link} from 'react-router';
import {Button} from 'react-bootstrap'
import {connect} from 'react-redux'

function mapStateToProps(state, ownProps){
	var currentUser = state.get('currentUser')
	var userName = ownProps.userName || currentUser
  return {
  	userName,
    edit : state.get('edit'),
    description : _.get(state.get('profiles').toJS(), `${userName}.description`, 'No Description Available')
  }

}

function mapDispatchToProps(dispatch, ownProps){
  return {
 	updateProfile : (value) => dispatch(updateProfileAction('description', value))
  }

}



class ProfileTextAreaFieldView extends React.Component {

	render(){
		if(this.props.edit){
			return(<textarea rows='5' cols='100' className='black' onChange={(e)=> this.props.updateProfile(e.target.value)} value={this.props.description}/>)
		}else{
			return(<span>{this.props.description !== '' ? this.props.description : "THIS PERSON SUCKS AND HASN'T WRITTEN A DESCRIPTION"}</span>)
		}
	}	

}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ProfileTextAreaFieldView)