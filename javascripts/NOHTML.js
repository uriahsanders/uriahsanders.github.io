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
		//reset program onclick
		$(document).ready(function(){
			$(document).on('click', '#NOHTML_title', function(){ //onclick:
				$(Private.output).html('<h1>Output</h1>');
				$('input').val('');
				$('input').removeAttr('disabled');
			});
		});
		//add starting HTML
		$('<div class="row text-center"></div>').prependTo(document.body);
		$('<div id="NOHTML_wrapper"class="span8"style="padding-right:20px; border-right: 1px solid #ccc;"><h1 id="NOHTML_title"style="cursor:pointer;">'+title+'</h1></div>').appendTo('.row'); //area for forms
		$('<div id="NOHTML_output"class="span4"><h1>Output</h1></div>').appendTo('.row'); //area for output
	};
	//input forms
	Public.input = function(prompt, id){
		//give a question, add an id, append to wrapper
		$('<br /><input type="text"placeholder="'+prompt+'"id="'+id+'"/><br />').appendTo(Private.wrapper);
	};
	//select boxes
	Public.select = function(id){
		var select = '<select id="'+id+'">';
		for(var i = 1; i < arguments.length; ++i){
			select += '<option>'+arguments[i]+'</option>';
		}
		select += '</select>';
		$('<br />'+select+'<br />').appendTo(Private.wrapper);
	};
	//for strings: 'hi #name' (in quotes)
	Public.printout = function(txt){
		//replace #'s with id value
		// var regex = /(?:\s|^|\()#([a-zA-Z][\w\-\$]*)(?:\s|^$|$|\))/gim;
		// if(txt.search(regex) != -1){
		// 	var matches = txt.match(regex);
		// 	for(var i = 0; i < matches.length; ++i){
		// 		txt = txt.replace(regex, ' '+$(matches[i]).val());
		// 	}
		// }
		$(Private.output).append('<br />'+txt+'<br />');
	};
	Public.print = function(txt){
		$(Private.wrapper).append('<br />'+txt+'<br />');
	}
	Public.remove = function(id){
		$('#'+id).remove(); //remove an element
	};
	Public.disable = function(id){
		$('#'+id).attr('disabled', 'disabled');
	};
	//"stuff" parameter does it all, use with _val to output the value of "stuff" onclick
	Public.button = function(id, txt, func){
		//create a button with text and append to wrapper
		$('<br /><button id="'+id+'">'+txt+'</button><br/>').appendTo(Private.wrapper);
		$(document).ready(function(){
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
	return Public;
})(jQuery);