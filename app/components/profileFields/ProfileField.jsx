import React from 'react';
import {updateProfileAction} from '../../redux/actions'
import {Button} from 'react-bootstrap'
import {connect} from 'react-redux'

function mapStateToProps(state, ownProps){
  var profileUserName = state.get('profileUserName')
  return {
    edit : state.get('edit'),
    value: state.getIn(['profiles', profileUserName, ownProps.field]),
  }

}

function mapDispatchToProps(dispatch, ownProps){
  return {
    updateProfile : (value) => dispatch(updateProfileAction(ownProps.field, value)),
    addToList : (list, item) => dispatch(addToListAction(list, item)),
    deleteFromList : (list, item) => dispatch(deleteFromListAction(list, item))
  }

}



export default class ProfileFieldsView extends React.Component {
  render(){
    if (this.props.field !== 'userName' && this.props.field !== 'email' && this.props.edit){
      return  (<span>{this.props.label}:
        <input className="black" type = 'text' onChange={(e) => this.props.updateProfile(e.target.value)} value = {this.props.value}/>
        </span>)
    } else {
      return <span>{this.props.label}: {this.props.value}</span>
    }
  }


}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ProfileFieldsView)  
