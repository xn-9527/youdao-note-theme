
(function () {

    if (window.getWordInfoFromPosition) {
        return;
    }

    /**
     * @param {Array} list
     * @param {Function} fn
     * @return {Boolean}
     */
    var SOME = function (list, fn) {
            if (!list || !list.length) {
                return;
            }
            var i = 0,
                len = list.length,
                isReturn;
            for (i = 0; i < len; i++) {
                isReturn = fn(list[i], i);
                if (isReturn) {
                    return true;
                }
            }

            return false;
        },
        /**
         * @param {Node} node
         * @return {Boolean}
         */
        IS_TEXT_NODE = function (node) {
            return node != null && node.nodeType === 3;
        },
        /**
         * @param {Range} range
         * @return {iFrameNode}
         */
        GET_IFRAME_BY_RANGE = function (range) {
            range = range || {};
            var node,
                common,
                len,
                index,
                nodeValue;

            if (range.collapsed !== true) {
                return;
            }

            index = range.startOffset;
            common = range.commonAncestorContainer;
            len = common.childNodes.length;

            if (len > index) {
                node = common.childNodes[index];

                if (IS_TEXT_NODE(node) && /^\r?\n/.test(node.nodeValue)) {
                    nodeValue = node.nodeValue;
                    nodeValue = nodeValue.trim();
                    if (!nodeValue) {
                        node = common.childNodes[index - 1];
                    }
                }

                if (node && node.tagName === 'IFRAME') {
                    return node;
                }
            }

        },
        COMPUTE_IFRAME_BOX = function (iframe) {
            var countLeft = 0;
            var countTop = 0;
            var styles = window.getComputedStyle(iframe, name);

            ['padding-left', 'border-left-width'].forEach(function (name) {
                var value = styles[name] || '0';
                value = parseInt(value, 10);
                if (isNaN(value)) {
                    value = 0;
                }
                //console.log(name, value);
                countLeft += value;
            });

            ['padding-top', 'border-top-width'].forEach(function (name) {
                var value = styles[name] || '0';
                value = parseInt(value, 10);
                if (isNaN(value)) {
                    value = 0;
                }
                //console.log(name, value);
                countTop += value;
            });


            return {
                left: countLeft,
                top: countTop
            };
        },

        /**
         * @param {Integer} left
         * @param {Integer} top
         * @param {Window} contentWin
         */
        GET_WORD = function (left, top, contentWin) {
            var range,
                common,
                containerRange,
                containerRects,
                isInRect,
                wordInfo,
                iframe,
                contextDoc,
                rect,
                computedBox;
                    

            if (!contentWin) {
                //console.error('on contentWin');
                return;
            }

            contextDoc = contentWin.document;

            if (!contextDoc) {
                //console.error('on contextDoc');
                return;
            }

            range = contextDoc.caretRangeFromPoint(left, top);


            if (!range) {
                //console.error('on range');
                return;
            }

            if (IS_TEXT_NODE(range.commonAncestorContainer)) {
                common = range.commonAncestorContainer;

                containerRange = contextDoc.createRange();
                containerRange.selectNode(common);
                containerRects = containerRange.getClientRects();
                
                var zoom = (document.getElementsByClassName("note-view-frame").length && document.getElementsByClassName("note-view-frame")[0].style.zoom) || 1;
                isInRect = SOME(containerRects, function (rect) {
                    //console.log(rect);
                    //console.log('left:' + left + '; top:' + top);
                    return rect.top * zoom < top && rect.left * zoom < left &&
                        rect.bottom * zoom > top && rect.right * zoom > left;
                });

                if (!isInRect) {
                    //console.error('is not in rect');
                    return '';
                }

                wordInfo = range.startOffset + '|' + common.nodeValue;
                //console.log(wordInfo);
                return wordInfo;
            }
            //console.error(range);
            iframe = GET_IFRAME_BY_RANGE(range);

            if (iframe) {
                rect = iframe.getBoundingClientRect();
                if (!rect) {
                    return;
                }
                computedBox = COMPUTE_IFRAME_BOX(iframe);

                return GET_WORD(
                    left - rect.left - computedBox.left,
                    top - rect.top - computedBox.top,
                    iframe.contentWindow
                );
            }

        };



    window.getWordInfoFromPosition = function(left, top) {
        var wordInfo = GET_WORD(left, top, window) || '';
        //console.error(left, top, zoom);
        //console.error(left, top, wordInfo);

        return wordInfo;
    };
    
    window.DictHelper.RegisterJsFunction('getWordInfoFromPosition', 
        window.getWordInfoFromPosition, window);
    
    var GET_SELECT_TEXT = function(left, top, contentWin){
        var range,
            iframe,
            contextDoc,
            rect,
            computedBox;  

        if (!contentWin) {
            //console.error('on contentWin');
            return;
        }

        contextDoc = contentWin.document;
        if (!contextDoc) {
            //console.error('on contextDoc');
            return;
        }

        if( contentWin.frames.length > 0 )
        {
            range = contextDoc.caretRangeFromPoint(left, top);

            if (!range) {
                //console.error('on range');
                return;
            }
            iframe = GET_IFRAME_BY_RANGE(range);
        }
        
        if (iframe) {
            rect = iframe.getBoundingClientRect();
            if (!rect) {
                return;
            }
            computedBox = COMPUTE_IFRAME_BOX(iframe);

            return GET_SELECT_TEXT(
                left - rect.left - computedBox.left,
                top - rect.top - computedBox.top,
                iframe.contentWindow
            );
        }
        else{
            var sel = contentWin.getSelection();
            if (sel.rangeCount > 0) {
	            var txt = sel.getRangeAt(0).toString();
                if( txt.length > 1000 ){
                    return txt.substr(0, 1000);
                }
                else{
                    return txt;
                }
                
	        }
        }
           
    };
    
    window.getWordInfoFromSelection = function(x,y){
    
          var selText = GET_SELECT_TEXT(x, y, window) || '';
          return selText;
    };
    
    window.DictHelper.RegisterJsFunction('getWordInfoFromSelection', 
        window.getWordInfoFromSelection, window);

})();
