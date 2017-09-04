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
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var oidc_client_1 = require("oidc-client");
var global_events_manager_1 = require("./global.events.manager");
var AuthService = (function () {
    function AuthService(http, _router, _globalEventsManager) {
        var _this = this;
        this.http = http;
        this._router = _router;
        this._globalEventsManager = _globalEventsManager;
        this._loggedIn = false;
        this._userLoadedEvent = new core_1.EventEmitter();
        if (typeof window !== 'undefined') {
            //instance needs to be created within the if clause
            //otherwise you'll get a sessionStorage not defined error.
            this._mgr = new oidc_client_1.UserManager(settings);
            this._mgr
                .getUser()
                .then(function (user) {
                if (user) {
                    _this._currentUser = user;
                    _this._userLoadedEvent.emit(user);
                }
            })
                .catch(function (err) {
                console.log(err);
            });
            this._mgr.events.addUserUnloaded(function (e) {
                //if (!environment.production) {
                console.log("user unloaded");
                //}
            });
        }
    }
    AuthService.prototype.clearState = function () {
        this._mgr.clearStaleState().then(function () {
            console.log("clearStateState success");
        }).catch(function (e) {
            console.log("clearStateState error", e.message);
        });
    };
    AuthService.prototype.getUser = function () {
        var _this = this;
        this._mgr.getUser().then(function (user) {
            console.log("got user");
            _this._userLoadedEvent.emit(user);
        }).catch(function (err) {
            console.log(err);
        });
    };
    AuthService.prototype.removeUser = function () {
        var _this = this;
        this._mgr.removeUser().then(function () {
            _this._userLoadedEvent.emit(null);
            console.log("user removed");
        }).catch(function (err) {
            console.log(err);
        });
    };
    AuthService.prototype.startSigninMainWindow = function () {
        this._mgr.signinRedirect({ data: 'some data' }).then(function () {
            console.log("signinRedirect done");
        }).catch(function (err) {
            console.log(err);
        });
    };
    AuthService.prototype.endSigninMainWindow = function () {
        //TODO: Validate why in a promise a global variable is not accessible,
        //      instead a method scope variable is required so it can be used within
        //      the promise.
        //Answer: the previous code was using function (user) { } instead of just (user) =>
        //        because is a function that only has one parameter (user) that explains
        //        why the other variables were undefined, the fix was to use an anonymous function
        //        a lambda expression.
        var _this = this;
        //TODO: Validate why even though _mgr has already been instantiated, I need to enclose
        //      the call in !== undefined, removing the if clause results in a failure of _mgr
        //      is undefined
        if (typeof window !== 'undefined') {
            this._mgr.signinRedirectCallback().then(function (user) {
                console.log("signed in");
                _this._loggedIn = true;
                _this._globalEventsManager.showNavBar(_this._loggedIn);
                _this._router.navigate(['home']);
            }).catch(function (err) {
                console.log(err);
            });
        }
    };
    AuthService.prototype.startSignoutMainWindow = function () {
        this._mgr.signoutRedirect().then(function (resp) {
            console.log("signed out", resp);
            setTimeout(5000, function () {
                console.log("testing to see if fired...");
            });
        }).catch(function (err) {
            console.log(err);
        });
    };
    ;
    AuthService.prototype.endSignoutMainWindow = function () {
        this._mgr.signoutRedirectCallback().then(function (resp) {
            console.log("signed out", resp);
        }).catch(function (err) {
            console.log(err);
        });
    };
    ;
    /**
     * Example of how you can make auth request using angulars http methods.
     * @param options if options are not supplied the default content type is application/json
     */
    AuthService.prototype.AuthGet = function (url, options) {
        if (options) {
            options = this._setRequestOptions(options);
        }
        else {
            options = this._setRequestOptions();
        }
        return this.http.get(url, options);
    };
    /**
     * @param options if options are not supplied the default content type is application/json
     */
    AuthService.prototype.AuthPut = function (url, data, options) {
        var body = JSON.stringify(data);
        if (options) {
            options = this._setRequestOptions(options);
        }
        else {
            options = this._setRequestOptions();
        }
        return this.http.put(url, body, options);
    };
    /**
     * @param options if options are not supplied the default content type is application/json
     */
    AuthService.prototype.AuthDelete = function (url, options) {
        if (options) {
            options = this._setRequestOptions(options);
        }
        else {
            options = this._setRequestOptions();
        }
        return this.http.delete(url, options);
    };
    /**
     * @param options if options are not supplied the default content type is application/json
     */
    AuthService.prototype.AuthPost = function (url, data, options) {
        var body = JSON.stringify(data);
        if (options) {
            options = this._setRequestOptions(options);
        }
        else {
            options = this._setRequestOptions();
        }
        return this.http.post(url, body, options);
    };
    AuthService.prototype._setAuthHeaders = function (user) {
        this._authHeaders = new http_1.Headers();
        this._authHeaders.append('Authorization', user.token_type + " " + user.access_token);
        this._authHeaders.append('Content-Type', 'application/json');
    };
    AuthService.prototype._setRequestOptions = function (options) {
        if (options) {
            options.headers.append(this._authHeaders.keys[0], this._authHeaders.values[0]);
        }
        else {
            //setting default authentication headers
            this._setAuthHeaders(this._currentUser);
            options = new http_1.RequestOptions({ headers: this._authHeaders, body: "" });
        }
        return options;
    };
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        router_1.Router,
        global_events_manager_1.GlobalEventsManager])
], AuthService);
exports.AuthService = AuthService;
var settings = {
    authority: process.env.authority,
    client_id: process.env.client_id,
    redirect_uri: process.env.redirect_uri,
    post_logout_redirect_uri: process.env.post_logout_redirect_uri,
    response_type: process.env.response_type,
    scope: process.env.scope,
    silent_redirect_uri: process.env.silent_redirect_uri,
    //automaticSilentRenew: true,
    //silentRequestTimeout:10000,
    filterProtocolClaims: process.env.filterProtocolClaims,
    loadUserInfo: process.env.loadUserInfo
};
//# sourceMappingURL=auth.service.js.map