import React from 'react';
import 'whatwg-fetch';
import { Link } from 'react-router';
import {browserHistory} from 'react-router';
import {setSearchAction, setResultsAction, addProfileAction} from '../redux/actions';
import {connect} from 'react-redux';
import requestApi from '../utilities/requests';
import _ from 'lodash';
import Calendar from './Calendar'

module.exports = suggestions