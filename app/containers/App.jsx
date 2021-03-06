import React, { Component, PropTypes } from 'react';
import Navigation from 'containers/Navigation';

import classNames from 'classnames/bind';
import styles from 'css/main';

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />

const cx = classNames.bind(styles);

/*
 * React-router's <Router> component renders <Route>'s
 * and replaces `this.props.children` with the proper React Component.
 *
 * Please refer to `routes.jsx` for the route config.
 *
 * A better explanation of react-router is available here:
 * https://github.com/rackt/react-router/blob/latest/docs/Introduction.md
 */
export default class App extends Component {
  
  constructor(props){
    super(props);
    this.state={
      local: {}
    };
  }

   componentWillMount(){
    this.resetState()
  }

   resetState(){
    var self = this
    return fetch('/api/v1/getuser', {credentials : 'same-origin'})
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log('userdata', json)
      self.setState({local: json.local || {}})
    }).catch(function(ex) {
      console.log('parsing failed.....', ex)
    })
  }

  toggleLogin(){
  	this.resetState()
  }

  render() {
    return (
      <div className={cx('app')}>
        <Navigation toggleLogin={this.toggleLogin.bind(this)} user={this.state.local.userName} />
        {this.props.children && React.cloneElement(this.props.children, {user: this.state.local.userName,
  				   														 toggleLogin: this.toggleLogin.bind(this)})}
      </div>
    );
  }
};

App.propTypes = {
  children: PropTypes.object
};
