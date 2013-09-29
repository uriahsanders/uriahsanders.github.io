//Uriah Sanders - 2013
/*	
	JS script to allow linear format of programming, similar to the command line in nature
	so beginners can focus less on html/css, and more on JS
	omit _.start() and _.end() to use as a general framework (like jQuery!)
*/
var NOHTML = NOHTML || (function($){
	"use strict";
	Object.size = Object.size || function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) ++size;
	    }
	    return size;
	};
	var Private = {};
	Private.wrapper = '#NOHTML_wrapper';
	Private.output = '#NOHTML_output';
	//expand JSON into an element
	Private.expand = function(what, obj){
		var element, type, classes, style, id, txt, options;
		//empty string if not set
		txt = obj.txt || '';
		type = obj.type || '';
		classes = obj.classes || '';
		style = obj.style || '';
		id = obj.id || '';
		options = obj.options || '';
		//split into common html components
		if(type !== '') type = 'type="'+type+'"';
		if(classes !==  '') classes = 'class="'+classes.join(' ')+'"';
		if(style !== '') style = 'style="'+style.join(';')+'"';
		if(id !== '') id = 'id="'+id+'"';
		element = '<'+what+' '+id+type+classes+style;
		//do unique tag handling
		if(what === 'input') element += 'placeholder="'+txt+'"value=""/>';
		else if(what === 'select'){
			var select;
			for(var i = 0; i < options.length; ++i) select += '<option>'+options[i]+'</option>';
			element += '>'+select+'</select>';
		}
		else element += '>'+txt+'</'+what+'>';
		return '<br />'+element+'<br />';
	};
	Private.attachTo = function(content, s){
		$(document).ready(function(){
			if(s === 'std' || typeof s === 'undefined') $('<br />'+content+'<br />').appendTo(Private.wrapper);
			else $(content).appendTo(s);
		});
	};
	var Public = {};
	Public.start = function(title){
		$(document).ready(function(){
			//add starting HTML
			$('<div class="row text-center"></div>').prependTo('body');
			$('<div id="NOHTML_wrapper"class="span8"style="padding-right:20px; border-right: 1px solid #ccc;"><h1 id="NOHTML_title"style="cursor:pointer;">'+title+'</h1></div>').appendTo('.row'); //area for forms
			$('<div id="NOHTML_output"class="span4"><h1>Output</h1></div>').appendTo('.row'); //area for output
		});
	};
	Public.end = function(){
		//reset program onclick
		$(document).ready(function(){
			$(document).on('click', '#NOHTML_title', function(){ //onclick:
				var CONTENT = $('body').html();
				$('body').html(CONTENT);
			});
		});
	};
	//create any element with an object
	Public.create = function(what, obj){
		obj = obj || {};
		obj.attachTo = obj.attachTo || 'std';
		$(document).ready(function(){
			//expand the object into html
			Private.attachTo(Private.expand(what, obj), obj.attachTo);
		});
	};
	//expand JSON into a table or list
	Public.expand = function(what, obj, attch){
		$(document).ready(function(){
			//these are actually pretty simple, just sticking data into a var and appending
			if(what === 'list'){ //ul or ol
				var list = '<'+obj.type+' id="'+obj.id+'"class="list-group">';
				for(var i = 0; i < obj.items.length; ++i){
					//add each item into ul with all the information
					list += '<li id="'+obj.ids[i]+'"class="list-group-item '+obj.classes[i]+'">'+obj.items[i]+'</li>';
				}
				list += '</ul>';
				Private.attachTo(list, attch);
			}else if(what === 'table'){
				var table = '<table id="'+obj.id+'"class="table"><tr>';
				//adding headers <th>
				for(var i = 0; i < obj.headers.length; ++i){
					table += '<th>'+obj.headers[i]+'</th>';
				} 
				table += '</tr>';
				//for loop for dividing into rows
				for(var i = 0; i < Object.size(obj.data); ++i){ //get length of assoc array
					table += '<tr>';
					//print contents of each row
					for(var j = 0; j < obj.data['row'+i].length; ++j){
						table += '<td>'+obj.data['row'+i][j]+'</td>';
					}
					table += '</tr>';
				}
				table += '</table>';
				Private.attachTo(table, attch);
			}
		});
	};
	//input forms
	Public.input = function(id, prompt, attch){
		$(document).ready(function(){
			//give a question, add an id, append to wrapper
			Private.attachTo('<input type="text"placeholder="'+prompt+'"id="'+id+'"value=""/>', attch);
		});	
	};
	//select boxes
	Public.select = function(id, attch, func){
		var select = '<select id="'+id+'">';
		//all extra arguments are options
		for(var i = 3; i < arguments.length; ++i){
			select += '<option>'+arguments[i]+'</option>';
		}
		select += '</select>';
		$(document).ready(function(){
			$(document).on('change', '#'+id, function(){
				func(); //call supplied function onclick
			});
			Private.attachTo(select, attch);
		});
	};
	//for now, only changes text in a span
	Public.change = function(id, txt){
		$('#'+id).text(txt);
	};
	//for strings: 'hi #name' (in quotes)
	Public.printout = function(txt){
		$(document).ready(function(){
			$(Private.output).append('<br />'+txt+'<br />');
		});
	};
	Public.print = function(txt, id, attch){
		id = id || '';
		$(document).ready(function(){
			Private.attachTo('<span id="'+id+'">'+txt+'</span>', attch);
		});
	};
	Public.remove = function(id){
		$(document).ready(function(){
			$('#'+id).fadeOut().remove(); //remove an element
		});
	};
	Public.disable = function(id){
		$(document).ready(function(){
			$('#'+id).attr('disabled', 'disabled');
		});
	};
	//"stuff" parameter does it all, use with _val to output the value of "stuff" onclick
	Public.button = function(id, txt, func, attch){
		$(document).ready(function(){
			//create a button with text and append to wrapper
		Private.attachTo('<button id="'+id+'">'+txt+'</button>', attch);
			$(document).on('click', '#'+id, function(){ //onclick:
				func();
			});
		});
	};
	//for numbers
	Public.intval = function(id){
		return parseInt($('#'+id).val(), 10);
	};
	Public.floatval = function(id){
		return parseFloat($('#'+id).val(), 10);
	};
	Public.val = function(id){
		return $('#'+id).val();
	};
	Public.txt = function(id){
		return $('#'+id).text();
	};
	return Public;
})(jQuery);