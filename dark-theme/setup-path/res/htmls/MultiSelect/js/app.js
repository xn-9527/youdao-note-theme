/**
 * Created by shihongzhi on 2014/5/5.
 *
 * 还存在bug，当快速选中取消，选中取消笔记，会导致有些笔记节点没有删除掉
 */

function Escape( text )
{
    text = text.replace(new RegExp('&', 'g'), '&amp;')
        		.replace(new RegExp('"', 'g'), '&quot;')
        		.replace(new RegExp("'", 'g'), "&apos;")
        		.replace(new RegExp('<', 'g'), '&lt;')
        		.replace(new RegExp('>', 'g'), '&gt;')
        		.replace(new RegExp(' ', 'g'), '&nbsp;')
    return text;
}

function Note(data, index, zindex, pNum) {
    this.index = index;		//递增,但在ReplaceNote的时候复用之前的deleteNotes的index;
	this.zindex = zindex;	//用于z-index

	this.pNum = pNum !== undefined ? pNum : this.index % 5;	//总共有5个位置 标示该笔记在哪个位置
	this.id = data.NoteId;
	this.thumbnail = data.AbstractPicBase64;
    this.thumbnailType = data.thumbnailType;
	this.title = data.NoteTitle || '无标题笔记';
    this.title = Escape(this.title);

	this.content = Escape(data.AbstractText);
}

var Notes = {
	notes: [],				//选择的笔记对象列表
	noteIndex: 0,			//笔记的index, 递增
	noteZindex: 0,
	deletedNotes: [],		//保存删除笔记的index,zindex,pNum信息,被replaceNotes所使用
	replacedNotes: [],	//保存被替换的笔记的index,zindex,pNum信息，被addNotes所使用
	reminderPosition: [0, 1, 2, 3, 4],		//用于记录 还剩余的位置编码
	$noteContainer: $('#note-container'),
	createNoteDom: function (note, isTransform) {
		var $el = $("<div></div>"),
			$title = $("<div></div>"),
			$preview = $("<div></div>");

		$el.addClass('note');
		$el.attr('id', 'note' + note.index);

		$title.addClass('note-title');
		$title.append('<span>' + note.title + '</span>');
		$preview.addClass('note-preview');

		if (note.thumbnail) {
            if( note.thumbnailType == 0){
                $preview.append('<img class="iconImg" draggable="false" src="data:image/png;base64,' + note.thumbnail + '"></img>');
            }
            else{
               $preview.append('<img class="picImg" draggable="false" src="data:image/png;base64,' + note.thumbnail + '"></img>');
            }
			
		} else {
			$preview.append('<span>' + note.content + '</span>');
		}


		$el.append($title);
		$el.append($preview);

		$el.css('z-index', note.zindex * 10);

		this.$noteContainer.append($el);

		if (isTransform) {
			setTimeout(function () {
				$el.addClass('note-position' + note.pNum);
				//console.log('createNoteDom:' + note.pNum + ':' + note.index);
    		}, 0);
		} else {
			$el.addClass('note-position' + note.pNum);
		}

		return $el;
	},
	deleteNoteDom: function (index, pNum, isTransform) {
		var $el = $('#note' + index);

		if ($el.length) {
			$el.css('z-index', Number($el.css('z-index')) + 5);

			if (isTransform) {
				$el.removeClass('note-position' + pNum);
			}

    		setTimeout(function () {
    			$el.remove();
    			//console.log($el);
    			//console.log('deleteNoteDom:' + pNum + ':' + index);
    		}, 500);
		}
	},
	addNotes: function (data) {

        if (Object.prototype.toString.call(data) === '[object Array]') {
			if (this.replacedNotes.length && (this.replacedNotes.length !== data.length)) {
                //
			}

            for (var i = 0; i < data.length; i++) {
    			var note;

    			if (this.replacedNotes.length) {
    				note = new Note(data[i], this.replacedNotes[0].index, this.noteZindex++, this.replacedNotes[0].pNum);

    				var pIndex = this.reminderPosition.indexOf(this.replacedNotes[0].pNum);
					if (pIndex !== -1) {
						this.reminderPosition.splice(pIndex, 1);
					}

    				this.replacedNotes.shift();
				} else {
					note = new Note(data[i], this.noteIndex++, this.noteZindex++, this.reminderPosition[0]);
					this.reminderPosition.shift();
				}

				this.notes.push(note);
				this.createNoteDom(note,  true);
			}
		}
	},
	deleteNotes: function (data) {

        if (Object.prototype.toString.call(data) === '[object Array]') {
			this.deletedNotes = [];
            for (var i = 0; i < data.length; i++) {
				var noteId = data[i].NoteId,
					index,
					pNum;

                for (var j = 0; j < this.notes.length; j++) {
					if (this.notes[j].id === noteId) {
						index = this.notes[j].index;
						pNum = this.notes[j].pNum;
						zindex = this.notes[j].zindex;
						this.notes.splice(j, 1);
						break;
					}
				}

				if (index !== undefined) {
					this.deleteNoteDom(index, pNum, true);

					if (this.reminderPosition.indexOf(pNum) === -1) {
                        this.reminderPosition.unshift(pNum);
					}

					this.deletedNotes.push({index: index, zindex: zindex, pNum: pNum});
				}
			}
		}
	},
	replaceNotes: function (data) {
        if (Object.prototype.toString.call(data) === '[object Array]') {
			if (this.deletedNotes.length !== data.length) {
				//alert('删除和替换的笔记数量不一致');
			}

			// 不会出现 deletedNotes.length > data.length 的情况
			for (var i = 0; i < data.length; i++) {
				var note = new Note(data[i], this.deletedNotes[i].index, this.deletedNotes[i].zindex, this.deletedNotes[i].pNum);

				var pIndex = this.reminderPosition.indexOf(this.deletedNotes[i].pNum);
				if (pIndex !== -1) {
					this.reminderPosition.splice(pIndex, 1);
				}

				this.notes.push(note);
				this.createNoteDom(note,  false);
			}
		}
	},
	delReplacedNotes: function (data) {
        if (Object.prototype.toString.call(data) === '[object Array]') {
			this.replacedNotesIndex = [];
            for (var i = 0; i < data.length; i++) {
				var noteId = data[i].NoteId,
					index,
					pNum;

                for (var j = 0; j < this.notes.length; j++) {
					if (this.notes[j].id === noteId) {
						index = this.notes[j].index;
						pNum = this.notes[j].pNum;
						zindex = this.notes[j].zindex;
						this.notes.splice(j, 1);
						break;
					}
				}

				if (index !== undefined) {
					this.deleteNoteDom(index, pNum, false);

					if (this.reminderPosition.indexOf(pNum) === -1) {
						this.reminderPosition.push(pNum);
					}

					this.replacedNotes.push({index: index, zindex: zindex, pNum: pNum});
				}
			}
		}
	},
	clearNotes: function () {
		$('#note-container').children().remove();
		this.notes = [];
		this.reminderPosition = [0, 1, 2, 3, 4];
		this.noteIndex = 0
		this.noteZindex = 0;

		Tags.clear();
	}
}

//bind operations event
var Operations = {
	addTag: function (tagVal) {
		SendMessageToClient('AddTag', tagVal);
	},
	delTag: function (tagVal) {
		SendMessageToClient('DelTag', tagVal);
	},
    copyNotes: function (){
          //移动笔记的
        var x = $(window).width() / 2 - 155,
            y = 380 + 43;
        SendMessageToClient('CopyToNotebook', x, y);
        return false;
    },
    recoverNotes: function(){
        SendMessageToClient('RecoverNotes');
    },
    saveAs: function(){
        SendMessageToClient('SaveAs');
    },
	moveNotes: function () {
		//移动笔记的
		var x = $(window).width() / 2 - 155,
			y = 380;
		SendMessageToClient('MoveToNotebook', x, y);
		return false;
	},
	removeNotes: function () {
		SendMessageToClient('DeleteNote');
		return false;
	},
	saveFile: function () {
		SendMessageToClient('SaveFile');
		return false;
	},
	savePic: function () {
		SendMessageToClient('SavePic');
		return false;
	},
	mergeNotes: function () {
		var isMergeTitle;

		isMergeTitle = $('#isKeepTitle').is(':checked');

		SendMessageToClient('MergeNote', isMergeTitle);
		return false;
	}
}

var	Tags = {
	availableTags: [],
	tags: [],
	$tagInput: $('#tagInput'),
	$addTag: $('#addTag'),
	init: function () {
		this.$tagInput.focusout($.proxy(this.lostFocus, this));
		this.$tagInput.on('keydown', $.proxy(this.addTag, this));
		this.$addTag.click($.proxy(this.showTagInput, this));
	},
	getAvailableTags: function () {
		var result = [],
            data = JSON.parse(SendMessageToClient('GetTagList'));
        if (data === null) {
			return result;
		}
		for (var i = 0; i < data.length; i++) {
			result.push(data[i].TagName);
		}
		return result;
	},
	showTagInput: function () {
		this.availableTags = this.getAvailableTags();
		//console.log(this.availableTags);
		this.$tagInput.autocomplete({
    		source: this.availableTags
		});

		this.$tagInput.val('');
		this.$tagInput.show();
		this.$tagInput.focus();
		this.$addTag.hide();

		return false;
	},
	addTag: function (e) {
		if (e.keyCode === 13) {
			//TODO split by ',' create more tag
            this.addTagInner();
            $('.ui-autocomplete').hide();
        }
    },
    addTagInner: function () {
			var self = this,
				tagsVal = $('#tagInput').val();
             console.log(tagsVal);
			tagsVal = tagsVal.split(/,|，/);
                console.log(tagsVal);
             var tagsToAdd = new Array();

			for (var i = 0; i < tagsVal.length; i++) {
                console.log(tagsVal[i]);
                tagsVal[i] = tagsVal[i].trim();
                if(tagsVal[i] == '')
                {
                    continue;
                }
                console.log("tagvalue: " + tagsVal[i]);
				var alreadyHas = false,
					tagVal = tagsVal[i],
					$tag = $('<span>' + tagVal + '</span>'),
					$close = $('<i></i>');
                $tag.click(function () {
                    this.remove();
                    Operations.delTag(tagVal);
                    self.tags.splice(self.tags.indexOf(tagVal), 1);
                })

				for (var j = 0; j < self.tags.length; j++) {
					if (self.tags[j] === tagVal) {
						alreadyHas = true;
						break;
					}
				}

				if (!alreadyHas) {
					$tag.addClass('tag');
					$close.addClass('tag-close');
                $close.click(function () {
						//remove tag
						this.parentNode.remove();
						Operations.delTag(tagVal);
						self.tags.splice(self.tags.indexOf(tagVal), 1);
						return false;
					});
					$tag.append($close);

					this.$addTag.before($tag);

					self.tags.push(tagVal);
                    tagsToAdd.push(tagVal);
					
				}
			}
            
            if( tagsToAdd.length > 0)
            {
                //set message to C++
			    Operations.addTag(tagsToAdd.join(","));
            }
            

			this.$addTag.show();
			this.$tagInput.hide();

			$('.ui-autocomplete').hide();
	},
	lostFocus: function () {
		var tagVal = $('#tagInput').val();
        $('.ui-autocomplete').hide();
		if (!tagVal) {
			this.$addTag.show();
			this.$tagInput.hide();
		}
        else {
            this.addTagInner();
        }

		return false;
	},
	clear: function () {
		$('.tag').remove();

		$('#tagInput').val('')
		this.$addTag.show();
		this.$tagInput.hide();
		this.tags = [];
	}
}

function setNotesCount(count) {
	$('#noteCounter').html(count);
}

function init() {
	//bind event
	$('#moveBtn').click(Operations.moveNotes);
	$('#removeBtn').click(Operations.removeNotes);
    $('#bigRemoveBtn').click(Operations.removeNotes);
	$('#saveFileBtn').click(Operations.saveFile);
	$('#savePicBtn').click(Operations.savePic);
    $('#copyBtn').click(Operations.copyNotes);
    $('#recoverBtn').click(Operations.recoverNotes);
    $('#eraseBtn').click(Operations.removeNotes);
    $('#saveasBtn').click(Operations.saveAs);
    $('.actionSaveFiles').click(Operations.saveFile);
    $('.actionSavePictures').click(Operations.savePic);
    $('.actionMoveNotes').click(Operations.moveNotes);
    $('.actionDeleteNotes').click(Operations.removeNotes)
    $('.actionRemove').click(Operations.removeNotes)
	Tags.init();
}

init();