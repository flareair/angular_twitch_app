'use strict';

import './main.less';

import angular from 'angular';
import ngAnimate from 'angular-animate';

import twitchService from './services/twitchService';
import TwitchCtrl from './controllers/TwitchCtrl';

export default angular.module('app', [ngAnimate])
    .service('twitchService', twitchService)
    .controller('TwitchCtrl', TwitchCtrl)
    .name;
