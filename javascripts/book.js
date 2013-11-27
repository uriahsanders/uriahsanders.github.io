(function($) {
	$.fn.isABook = function(stuff) {
		//reference current element
		var el = this;
		stuff = stuff || {};
		Model.create({
			init: false, //set to true to begin process
			pre: 'jQuery_Book-', //id/class prefix for conflict mitigation
			title: stuff.title || 'Title',
			//optimized for $('body').isABook();, but you can style sidebar if you please
			fontSize: stuff.fontSize || '1.7em',
			position: stuff.position || 'fixed',
			color: stuff.color || '#428bca',
			height: stuff.height || '100%',
			width: stuff.width || '60px',
			description: stuff.description || 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro, rerum, culpa laudantium tempore blanditiis voluptate quam quidem aliquam aliquid repellendus sunt eveniet odio! Beatae, error tempora in dolore optio temporibus.',
			by: (stuff.by) ? ', by ' + stuff.by : '',
			//merge with defaults (contains chapters, subtitles, content)
			content: stuff.content || {},
			//what are we currently looking at?
			current: {
				//use 'false' for 'null' for better type handling
				chapter: false,
				subtitle: false,
				position: 'home'
			}
		});
		var model = Model.data;
		View.create(function(name, value, states, count, model) {
			if (name === 'init') { //create interface and render html for entire book
				var pre = model.pre;
				//nav is left sidebar
				var nav = (function() {
					var nav = '<ul id="' + pre + 'list"><li><a href="#' + pre + 'title"><button title="Home"data-container="body"data-toggle="tooltip"id="' + pre + 'home"class="btn btn-default ' + pre + 'list-button"><i class="fa fa-home"></i></button></a></li>';
					var chapter;
					var i = 0;
					for (var prop in model.content) {
						//show chapter number but store name as data ("i" to identify it)
						nav += '<li><a href="#' + pre + 'chapter-' + prop + '"><button data-container="body"data-toggle="tooltip"title="' + prop.replace(/_/g, ' ') + '"class="btn btn-default ' +
							pre + 'list-button">' + (++i) + '</button></a></li>';
						chapter = model.content[prop];
						//if we have subtitles, stick em in
						if (typeof chapter === 'object') {
							nav += '<ul id="' + pre + 'sub-list">';
							for (var sub in chapter) {
								nav += '<li>' + sub.replace(/_/g, ' ') + '</li>';
							}
							nav += '</ul>';
						}
					}
					return nav + '</ul>';
				})();
				//table of contents
				var list = (function() {
					var list = '<ul style="list-style-type:upper-roman;font-size:1.5em;">';
					var chapter;
					for (var prop in model.content) {
						//show chapter number but store name as data ("i" to identify it)
						list += '<li><a href="#' + pre + 'chapter-' + prop + '">' + prop.replace(/_/g, ' ') + '</a></li>';
						chapter = model.content[prop];
						//if we have subtitles, stick em in
						if (typeof chapter === 'object') {
							list += '<ul style="list-style-type:upper-roman;">';
							for (var sub in chapter) {
								list += '<li><a href="#' + pre + 'subtitle-' + sub + '">' + sub.replace(/_/g, ' ') + '</a></li>';
							}
							list += '</ul>';
						}
					}
					return list;
				})();
				//actual user content
				var book = (function() {
					var book = '';
					var chapter;
					//html to define normal book text
					for (var prop in model.content) {
						chapter = model.content[prop];
						//chapter
						book += '<span id="' + pre + 'chapter-' + prop + '"class="' + pre + 'chapter">' + prop.replace(/_/g, ' ') + '</span><br />';
						if (typeof chapter === 'object') {
							for (var sub in chapter) {
								//subtitle
								book += '<span id="' + pre + 'subtitle-' + sub + '"class="' + pre + 'subtitle">' + sub.replace(/_/g, ' ') + '</span><br />';
								//text
								book += '<p class="' + pre + 'text-0">' + chapter[sub] + '</p><br />'; //indent twice for subtitle
							}
						} else {
							//text
							book += '<p class="' + pre + 'text-1">' + chapter + '</p><br />'; //indent once
						}
					}
					return book;
				})();
				//content is sidebar, main area
				var content = [
					'<div id="' + pre + 'content"class="row">',
					'<div id="' + pre + 'sidebar"class="col-md-1">',
					'<div id="' + pre + 'nav">' + nav + '</div>',
					'</div>',
					'<div id="' + pre + 'main">',
					'<div id="' + pre + 'home-page">',
					'<span id="' + pre + 'title"class="h1">' + model.title + model.by + '</span><br>',
					'<div id="' + pre + 'writing">',
					'<p class="lead">&emsp;' + model.description + '</p>',
					'</div>',
					list,
					'</div>',
					book,
					'</div>',
					'</div>',
					'</div>'
				].join('');
				el.html(content); //fill in the main interface
				addStyling();
				if (!Router.hash('visible')) Router.goTo('home'); //get home page
				else {
					Model.modify('position', Router.hash());
				}
			} else if (name === 'position') {
				//get proper position in book
			}
		});
		Controller.create(function() {
			$(function() {
				//scroll to div
				$(document).on('click', 'a[href*=#]:not([href=#])', function() {
					if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
						var target = $(this.hash);
						var arr = this.hash.split('-');
						if (arr[1] !== 'title') Router.goTo(arr[1] + '/' + arr[2].replace(/_/g, ' '));
						else Router.goTo('home');
						target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
						if (target.length) {
							$('html,body').animate({
								scrollTop: target.offset().top
							}, 1000);
							return false;
						}
					}
				});
				//id's
				var pre = '#' + model.pre;
				$(document).on('click', pre + 'home', function() {
					Router.goTo('home');
				});
				$(document).on('click', pre + 'list-button', function() {
					if ($(this).attr('id') !== model.pre + 'home') {
						Router.goTo($(this).data('name'));
					}
				});
			});
		});
		Router.create(function(hash, count) {
			//scroll to url position on first load
			if (hash !== 'home' && count === 0) {
				var target = $('#' + model.pre + hash.split('/').join('-').replace(/ /g, '_'));
				target = target.length ? target : $('[name=' + this.hash().slice(1) + ']');
				if (target.length) {
					$('html,body').animate({
						scrollTop: target.offset().top
					}, 1000);
					return false;
				}
			}
		});
		Model.modify('init', true); //lets get it on :)
		//style all page elements
		function addStyling() {
			//style container
			el.css({
				"text-rendering": 'optimizeLegibility',
				"font-size": model.fontSize
			});
			//id's
			var pre = '#' + model.pre;
			//left side bar
			$(pre + 'sidebar').css({
				"background": model.color,
				"position": model.position,
				"height": model.height,
				"overflow-y": 'auto',
				"width": model.width
			});
			//left side bar ul's
			$(pre + 'list, ' + pre + 'sub-list').css({
				"list-style-type": 'none',
				"margin": '0',
				"padding": '0',
				"list-style": 'none',
				"text-transform": 'none',
				"width": '100%'
			});
			//left side bar li's
			$(pre + 'list li, ' + pre + 'sub-list li').css({
				"cursor": 'pointer',
				"margin": '5px',
				"width": '100%',
			});
			//subtitle ul's
			$(pre + 'sub-list').css({
				"display": 'none'
			});
			//book outer wrapper
			$(pre + 'content').css({
				"height": '100%'
			});
			//main content area
			$(pre + 'main').css({
				"margin-left": '65px',
				"width": '75%',
				"margin-top": '5px',
				"padding": '10px'
			});
			//book title
			$(pre + 'title').css({
				"font-style": 'italic'
			});
			//actual content
			$(pre + 'writing').css({
				"margin-top": '10px',
				"padding": '5px'
			});
			//bottom nav
			$(pre + 'bottom').css({
				"position": 'fixed',
				"width": '100%',
				"height": '60px',
				"font-size": '2em',
				"padding": '5px',
				"bottom": '0px',
				"text-align": 'center'
			});
			$(pre + 'home-page').css({
				"margin-bottom": '10px',
				"padding-bottom": '10px'
			});
			//classes
			pre = '.' + model.pre;
			$(pre + 'director').css({
				"cursor": 'pointer'
			});
			$(pre + 'arrow').css({
				"opacity": '0.7',
				"cursor": 'pointer',
				"color": '#428bca'
			});
			//sidebar buttons
			$(pre + 'list-button').css({
				"width": '117%',
			});
			$(pre + 'chapter').css({
				"font-size": '2em'
			});
			$(pre + 'subtitle').css({
				"font-size": '1.5em',
				"margin-left": '25px'
			});
			$(pre + 'text-0').css({
				"margin-left": '50px'
			});
			$(pre + 'text-1').css({
				"margin-left": '25px'
			});
			$('.' + model.pre + 'list-button').tooltip({
				placement: 'right'
			});
		}
	};
})(jQuery);