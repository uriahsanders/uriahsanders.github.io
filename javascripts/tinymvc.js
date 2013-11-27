"use strict";
var Model = Model || (function() {
	function propFromArray(props, to, get) {
		var obj = Model.data;
		var propPos = props.length - 1; //we will deal with final property alone
		for (var i = 0; i < propPos; ++i) {
			obj = obj[props[i]];
		}
		if (get === true) return obj[props[propPos]]; //just return property
		obj[props[propPos]] = to; //change by reference
	}
	function parseV(what) { //call what as either an array or string broken with -'s
		return (typeof what === 'string') ? what.split('-') : what;
	}
	return {
		changed: [],
		//initialize Model
		create: function(data) {
			this.data = data;
		},
		get: function(what) { //get something from Model
			return propFromArray(parseV(what), false, true);
		},
		//change an element in the Model (add and call view if non-existant)
		modify: function(what, value, notify) {
			what = parseV(what);
			propFromArray(what, value);
			if (notify || typeof notify === 'undefined') {
				this.changed.push(what.join('-'));
				View.notify();
			}
		},
		cascade: function(obj, notify) {
			//call a bunch of modifies() from a hash, arrays not allowed in this one :(
			for (var i in obj) this.modify(i.split('-'), obj[i], notify);
		}
	};
})();
var View = View || (function() {
	return {
		create: function(func) {
			this.func = func;
		},
		count: 0, //how many times func has been called
		states: {},
		//call user defined func with changed in Model and value of changed
		notify: function() {
			var c = Model.changed[Model.changed.length - 1];
			//parse last changed to get true value from -'s
			var value = Model.get(c);
			//save the states of property key to value
			if (this.states[c]) this.states[c].push(value);
			else this.states[c] = [value];
			//call user supplied function
			this.func(c, value, this.states[c], this.count++, Model.data);
		}
	};
})();
var Controller = Controller || (function() {
	return {
		create: function(func) {
			func(Model.data);
		}
	};
})();
var Router = Router || (function() {
	return {
		count: 0, //how many times function has been called
		type: 'hash',
		create: function(func, type) {
			this.func = func;
			if (type === 'push') this.type = type;
			//run current url on back/forward button click
			window.onpopstate = function() {
				Router.run()
			};
		},
		//change URL and do something after
		goTo: function(url) {
			if (this.type === 'hash') location.hash = '!/' + url;
			else {
				history.pushState('', '', url);
				this.run();
			}
		},
		//run function for current url
		run: function() {
			this.func((this.type === 'hash' ? this.hash() : location.pathname), this.count++, Model.data);
		},
		hash: function(action) {
			var hash = location.hash;
			return (action === 'visible') ? (hash.length > 3) : hash.substring(3);
		}
	};
})();
