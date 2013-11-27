(function() {
	Model.create({
		numChapters: 0,
		numSubs: 1,
		subBlock: function(chapnum, subnum) {
			//this.numSubs++;
			return '<input id="sub_' + chapnum + '-' + subnum + '-input"class="form-control subtitle-input"placeholder="Subtitle"><br />' +
				'<textarea id="sub_' + chapnum + '-' + subnum + '-text"class="form-control"name="" id="" cols="30" rows="10"></textarea><br />'
		},
		json: {} //will hold obj for plugin
	});
	Controller.create(function(model) {
		$(document).on('click', '#chapter', function() {
			$(this).before([
				'<div id="chapter-' + (++model.numChapters) + '">',
				'<br />',
				'<input id="chapt_' + model.numChapters + '-input"class="form-control chapter-input"placeholder="New Chapter"value="Chapter ' + model.numChapters + '"><br />',
				model.subBlock(model.numChapters, model.numSubs),
				'<button id="' + model.numChapters + '-' + (model.numSubs + 1) + '-subtitle"class="btn btn-default subtitle">+ Subtitle</button>',
				'</div><br />'
			].join(''));
		});
		$(document).on('click', '.subtitle', function() {
			var id = $(this).attr('id').split('-');
			$(this).before(model.subBlock(id[0], id[1]));
			$(this).attr('id', id[0] + '-' + (parseInt(id[1]) + 1) + '-subtitle');
		});
		$(document).on('click', '#view', function() {
			model.json.title = $('#title').val();
			model.json.by = $('#by').val();
			model.json.description = $('#description').val();
			model.json.content = {};
			//now lets get the chapters and subtitles through loop
			var t;
			var chapter;
			var obj;
			var subtitle;
			var chapt;
			for(var i = 0; i < model.numChapters; ++i){
				t = i + 1;
				chapter = $('#chapt_'+t+'-input').val();
				for(var j = 1; j < $('.subtitle[id^="'+(t)+'"]').attr('id').split('-')[1]; ++j){
					subtitle = $('#sub_'+(t)+ '-' + j + '-input').val();
					if(subtitle !== ''){
						chapt = chapter.replace(/ /g, '_');
						if(!model.json.content[chapt]) model.json.content[chapt] = {};
						model.json.content[chapt][subtitle.replace(/ /g, '_')] = $('#sub_'+(t)+ '-' + j + '-text').val();
					}
					else model.json.content[chapt] = $('#sub_'+(t)+ '-' + j + '-text').val();
				}
			}
			$('body').isABook(model.json);
			console.log("$('body').isABook(" + JSON.stringify(model.json) + ');');
		});
	});
})();