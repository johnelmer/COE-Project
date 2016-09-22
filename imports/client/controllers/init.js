"use strict";
var angular_meteor_1 = require('angular-meteor');
var ng2now_1 = require('ng2now');
var angular_ui_bootstrap_1 = require('angular-ui-bootstrap');
var angular_animate_1 = require('angular-animate');
var angular_touch_1 = require('angular-touch');
var angular_sanitize_1 = require('angular-sanitize');
var angular_ui_router_1 = require('angular-ui-router');
ng2now_1.init();
var dependencies = [
    angular_meteor_1.default,
    angular_ui_bootstrap_1.default,
    angular_animate_1.default,
    angular_touch_1.default,
    angular_sanitize_1.default,
    angular_ui_router_1.default
];
ng2now_1.SetModule('banner', dependencies);
