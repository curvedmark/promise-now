!function(){function t(){this.state="pending",this.composers=[]}function n(t){return t&&"function"==typeof t.then}function s(t,s){return function(i,e,r){var o;if("fulfilled"===i&&"function"==typeof(o=t)||"rejected"===i&&"function"==typeof(o=s)){try{e=o(e)}catch(h){return e=h,i="rejected",r(i,e)}if(n(e))return e.then(function(t){r("fulfilled",t)},function(t){r("rejected",t)});i="fulfilled"}r(i,e)}}function i(){this.fns=[],this.started=!1}t.prototype.then=function(t,n){var e=new i;return e.add(s(t,n)),this.composers.push(e),"pending"!==this.state&&this.runAllComposers(),{then:function(t,n){return e.add(s(t,n)),this}}},t.prototype.fulfill=function(t){return"pending"!==this.state?this:(this.state="fulfilled",this.arg=t,this.runAllComposers(),this)},t.prototype.reject=function(t){return"pending"!==this.state?this:(this.state="rejected",this.arg=t,this.runAllComposers(),this)},t.prototype.runAllComposers=function(){for(;this.composers.length;){var t=this.composers.shift();t.run(this.state,this.arg)}};var e=[].slice;i.prototype.add=function(t){this.fns.push(t),this.started&&this.runOne()},i.prototype.run=function(){this.started=!0,this.args=e.call(arguments,0),this.runOne()},i.prototype.runOne=function(){if(!this.pending&&this.fns.length){var t=this.fns.shift(),n=this;this.args.push(function(){n.pending=!1,n.args=e.call(arguments,0),n.runOne()}),this.pending=!0,t.apply(void 0,this.args)}},window.Promise=t}();