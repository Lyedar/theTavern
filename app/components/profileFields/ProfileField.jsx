import React from 'react';
import {updateProfileAction} from '../../redux/actions'
import {Button} from 'react-bootstrap'
import {connect} from 'react-redux'

function mapStateToProps(state, ownProps){
  return {
    edit : state.get('edit'),
    value: state.getIn(['currentProfile', ownProps.field]),
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
    if (this.props.edit){
      return  (<span>{this.props.label}:
        <input className="black" type = 'text' onChange={(e) => this.props.updateProfile(e.target.value)} value = {this.props.value}/>
        </span>)
    } else {
      return <span>{this.props.label}: {this.props.value}</span>
    }
  }


}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ProfileFieldsView)  





  // textOutput(curr) {
  //   const updateState = (e) =>{
  //     var profile = this.state.currentProfile
  //     profile[curr] = e.target.value
  //     this.setState({currentProfile : profile})
  //   }

  //   const toggleHideValue = (value) =>
      // this.setState(_.set(this.state, `currentProfile.hiddenValues[${value}]`, !_.get(this.state, `currentProfile.hiddenValues[${value}]`, false)))

  //   if(this.props.edit === true) {
  //      return( 
  //       <div>
  //       <input className="black" type = 'text' onChange={updateState.bind(this)} id = {`textbox${curr}`} value = {this.state.currentProfile[curr]}/>
  //       <input type='checkbox' onClick={toggleHideValue.bind(this, curr)} checked={_.get(this.state, `currentProfile.hiddenValues[${curr}]`)}/>hide
  //       </div>
  //       )
  //   }else if(!_.get(this.state, `currentProfile.hiddenValues[${curr}]`)){
  //     return (
  //       <span>{this.state.currentProfile[curr]}</span>
  //     )
  //   } else {
  //     return <span>Life is a mystery...</span>
  //   }
  // }