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

module.exports = connect(mapStateToProps, mapDispatchToProps)