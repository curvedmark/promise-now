!function(){function t(){this.state=r,this.callbacks=[]}function n(t){return t&&"function"==typeof t.then}function i(t,i,r){return function(l,e){var a;if(l===s){if("function"!=typeof(a=t))return r.fulfill(e)}else if("function"!=typeof(a=i))return r.reject(e);try{e=a(e)}catch(c){return e=c,r.reject(e)}return n(e)?(e.then(function(t){r.fulfill(t)},function(t){r.reject(t)}),void 0):r.fulfill(e)}}var r=0,s=1,l=2;t.prototype.then=function(n,r){var s=new t,l=i(n,r,s);return this.state?this.runCallback(l):this.callbacks.push(l),s},t.prototype.fulfill=function(t){return this.state?this:(this.state=s,this.arg=t,this.runAllCallbacks(),this)},t.prototype.reject=function(t){return this.state?this:(this.state=l,this.arg=t,this.runAllCallbacks(),this)},t.prototype.runCallback=function(t){t(this.state,this.arg)},t.prototype.runAllCallbacks=function(){for(var t=0,n=this.callbacks.length;n>t;++t){var i=this.callbacks[t];i(this.state,this.arg)}this.callbacks=null},window.Promise=t}();