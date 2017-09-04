"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var auth_service_1 = require("../shared/services/auth.service");
var global_events_manager_1 = require("../shared/services/global.events.manager");
var NavMenuComponent = (function () {
    function NavMenuComponent(_authService, _globalEventsManager) {
        var _this = this;
        this._authService = _authService;
        this._globalEventsManager = _globalEventsManager;
        this._loggedIn = false;
        _globalEventsManager.showNavBarEmitter.subscribe(function (mode) {
            // mode will be null the first time it is created, so you need to igonore it when null
            if (mode !== null) {
                console.log("Global Event, sent: " + mode);
                _this._loggedIn = mode;
            }
        });
    }
    NavMenuComponent.prototype.login = function () {
        this._authService.startSigninMainWindow();
    };
    NavMenuComponent.prototype.logout = function () {
        this._authService.startSignoutMainWindow();
    };
    return NavMenuComponent;
}());
NavMenuComponent = __decorate([
    core_1.Component({
        selector: 'nav-menu',
        template: require('./navmenu.component.html'),
        styles: [require('./navmenu.component.css')]
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        global_events_manager_1.GlobalEventsManager])
], NavMenuComponent);
exports.NavMenuComponent = NavMenuComponent;
//# sourceMappingURL=navmenu.component.js.map