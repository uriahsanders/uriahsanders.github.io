//Uriah Sanders - 2013
/*	
	JS script to allow linear format of programming, similar to the command line in nature
	so beginners can focus less on html/css, and more on JS
	omit _.start() and _.end() to use as a general framework
*/
var NOHTML = NOHTML || (function($) {
	"use strict";
	var Private = {};
	Private.start = false; //Not using default wrapper
	Private.wrapper = '#NOHTML_wrapper';
	Private.output = '#NOHTML_output';
	//expand JSON into an element
	Private.expand = function(what, obj) {
		var element, type, classes, style, id, txt, options;
		//empty string if not set
		txt = obj.txt || '';
		type = obj.type || '';
		classes = obj.classes || '';
		style = obj.style || '';
		id = obj.id || '';
		options = obj.options || '';
		//split into common html components
		if (type !== '') type = 'type="' + type + '"';
		if (classes !== '') classes = 'class="' + classes + '"';
		if (style !== '') style = 'style="' + style + '"';
		if (id !== '') id = 'id="' + id + '"';
		element = '<' + what + ' ' + id + type + classes + style;
		//do unique tag handling
		if (what === 'input') element += 'placeholder="' + txt + '"value=""/>';
		else if (what === 'select') {
			var select;
			for (var i = 0; i < options.length; ++i) select += '<option>' + options[i] + '</option>';
			element += '>' + select + '</select>';
		} else element += '>' + txt + '</' + what + '>';
		return element;
	};
	Private.attachTo = function(content, s) {
		if (Private.start) content = '<br />' + content + '<br />';
		if ((s === 'std' && Private.start) || (typeof s === 'undefined' && Private.start)) {
			$(content).appendTo(Private.wrapper);
		} else if ((s === 'std' && !Private.start) || (typeof s === 'undefined' && !Private.start)) {
			$(content).appendTo('body');
		} else {
			$(content).appendTo(s);
		}
	};
	var Public = {};
	Public.start = function(title) {
		Private.start = true; //we are using the default wrapper
		//add starting HTML
		$('<div class="row text-center"></div>').prependTo('body');
		$('<div id="NOHTML_wrapper"class="span8"style="padding-right:20px; border-right: 1px solid #ccc;"><h1 id="NOHTML_title"style="cursor:pointer;">' + title + '</h1></div>').appendTo('.row'); //area for forms
		$('<div id="NOHTML_output"class="span4"><h1>Output</h1></div>').appendTo('.row'); //area for output
	};
	Public.end = function() {
		$(document).on('click', '#NOHTML_title', function() { //onclick:
			//for now just empty inputs and output, later i want to restore intial program state
			$('input').val('');
			$(Private.output).html('<h1>Output</h1>');
		});
	};
	//create any element with an object
	Public.create = function(what, obj) {
		obj = obj || {};
		obj.attachTo = obj.attachTo || 'std';
		//expand the object into html
		Private.attachTo(Private.expand(what, obj), obj.attachTo);
	};
	//divs
	Public.div = function(txt, id, attch) {
		Private.attachTo('<div id="' + id + '">' + txt + '</div>', attch);
	};
	//headers
	Public.h = function(num, txt, id, attch) {
		Private.attachTo('<h' + num + ' id="' + id + '">' + txt + '</h' + num + '>', attch);
	};
	//breaks/hr's
	Public.br = function(num, attch) {
		num = num || 1;
		for (var i = 0; i < num; ++i) {
			Private.attachTo('<br />', attch);
		}
	};
	Public.hr = function(num, attch) {
		num = num || 1;
		for (var i = 0; i < num; ++i) {
			Private.attachTo('<hr />', attch);
		}
	};
	//input forms
	Public.input = function(prompt, id, attch) {
		//give a question, add an id, append to wrapper
		Private.attachTo('<input type="text"placeholder="' + prompt + '"id="' + id + '"value=""/>', attch);
	};
	//select boxes
	Public.select = function(attch, id, func) {
		var select = '<select id="' + id + '">';
		//all extra arguments are options
		for (var i = 3; i < arguments.length; ++i) {
			select += '<option>' + arguments[i] + '</option>';
		}
		select += '</select>';
		$(document).on('change', '#' + id, function() {
			func(); //call supplied function onclick
		});
		Private.attachTo(select, attch);
	};
	//for now, only changes text in a span
	Public.change = function(txt, id) {
		$('#' + id).text(txt);
	};
	Public.printout = function(txt) {
		$(Private.output).append('<br />' + txt + '<br />');
	};
	Public.print = function(txt, id, attch) {
		id = id || '';
		Private.attachTo('<span id="' + id + '">' + txt + '</span>', attch);
	};
	Public.remove = function(id) {
		$('#' + id).fadeOut().remove(); //remove an element
	};
	Public.disable = function(id) {
		$('#' + id).attr('disabled', 'disabled');
	};
	Public.button = function(txt, id, func, attch) {
		Private.attachTo('<button id="' + id + '">' + txt + '</button>', attch);
		$(document).on('click', '#' + id, function() { //onclick:
			func();
		});
	};
	//for numbers
	Public.intval = function(id) {
		return parseInt($('#' + id).val(), 10);
	};
	Public.floatval = function(id) {
		return parseFloat($('#' + id).val(), 10);
	};
	Public.val = function(id) {
		return $('#' + id).val();
	};
	Public.txt = function(id) {
		return $('#' + id).text();
	};
	return Public;
})(jQuery);