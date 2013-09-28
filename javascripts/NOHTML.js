/*	
	JS script to allow linear format of programming, similar to the command line in nature
	so beginners can focus less on html/css, and more on JS
*/
var NOHTML = NOHTML || (function($){
	var Private = {};
	Private.wrapper = '#NOHTML_wrapper';
	Private.output = '#NOHTML_output';
	var Public = {};
	Public.start = function(title){
		$(document).ready(function(){
			//reset program onclick
			$(document).on('click', '#NOHTML_title', function(){ //onclick:
				$(Private.output).html('<h1>Output</h1>');
				$('input').val('');
				$('input').removeAttr('disabled');
			});
			//add starting HTML
			$('<div class="row text-center"></div>').prependTo(document.body);
			$('<div id="NOHTML_wrapper"class="span8"style="padding-right:20px; border-right: 1px solid #ccc;"><h1 id="NOHTML_title"style="cursor:pointer;">'+title+'</h1></div>').appendTo('.row'); //area for forms
			$('<div id="NOHTML_output"class="span4"><h1>Output</h1></div>').appendTo('.row'); //area for output
		});
	};
	//create any element with an object
	Public.create = function(what, obj){
		var obj = obj || {};
		$(document).ready(function(){
			//expand the object into html
			$(Public.expand(what, obj)).appendTo(Private.wrapper);
		});
	};
	//expand JSON into an element
	Public.expand = function(what, obj){
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
	//input forms
	Public.input = function(id, prompt){
		$(document).ready(function(){
			//give a question, add an id, append to wrapper
			$('<br /><input type="text"placeholder="'+prompt+'"id="'+id+'"value=""/><br />').appendTo(Private.wrapper);
		});	
	};
	//select boxes
	Public.select = function(id, func){
		var select = '<select id="'+id+'">';
		for(var i = 2; i < arguments.length; ++i){
			select += '<option>'+arguments[i]+'</option>';
		}
		select += '</select>';
		$(document).ready(function(){
			$(document).on('change', '#'+id, function(){
				func();
			});
			$('<br />'+select+'<br />').appendTo(Private.wrapper);
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
	Public.print = function(txt, id){
		id = id || '';
		$(document).ready(function(){
			$(Private.wrapper).append('<br /><span id="'+id+'">'+txt+'</span><br />');
		});
	}
	Public.remove = function(id){
		$(document).ready(function(){
			$('#'+id).remove(); //remove an element
		});
	};
	Public.disable = function(id){
		$(document).ready(function(){
			$('#'+id).attr('disabled', 'disabled');
		});
	};
	//"stuff" parameter does it all, use with _val to output the value of "stuff" onclick
	Public.button = function(id, txt, func){
		$(document).ready(function(){
			//create a button with text and append to wrapper
		$('<br /><button id="'+id+'">'+txt+'</button><br/>').appendTo(Private.wrapper);
			$(document).on('click', '#'+id, function(){ //onclick:
				func();
			});
		});
	};
	//for numbers
	Public.intval = function(id){
		return parseInt($('#'+id).val());
	};
	Public.floatval = function(id){
		return parseFloat($('#'+id).val());
	};
	Public.val = function(id){
		return $('#'+id).val();
	};
	Public.txt = function(id){
		return $('#'+id).text();
	}
	return Public;
})(jQuery);