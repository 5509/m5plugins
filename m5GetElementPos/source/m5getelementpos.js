/**
 * m5GetElementPos
 *
 * @author       nori (norimania@gmail.com)
 * @copyright    5509 (http://5509.me/)
 * @license      The MIT License
 * @link         https://github.com/5509/m5GetElemPosition
 *
 */
;(function($) {
	$.fn.m5GetElementPos = function(options) {
		/* this method will return the number above this;
		    [
		         0: LeftTop,
		         1: CenterTop,
		         2: RightTop,
		         3: LeftCenter,
		         4: CenterCenter,
		         5: RightCenter,
		         6: LeftBottom,
		         7: CenterBottom,
		         8: RightBottom
		    ]
		 */
		var _scrollPos = {
				y: document.body.scrollTop || document.documentElement.scrollTop,
				x: document.body.scrollLeft || document.documentElement.scrollLeft
			},
			 _clientSize =  {
				x: $("html").attr("clientWidth"),
				y: $("html").attr("clientHeight")
			},
			_offset = this.offset(),
			_size = { // half size
				w: this.attr("offsetWidth") / 2,
				h: this.attr("offsetHeight") / 2
			},
			_eRPos = { // element relative position
				x: _offset.left - _scrollPos.x,
				y: _offset.top - _scrollPos.y
			},
			_elementPos,
			_c = $.extend({
				returnNumber: true, // or false
				returnCancel: false,
				callback: null
			}, options);
		
		if ( _eRPos.y < (_clientSize.y/3 - _size.h) ) {
			if ( _eRPos.x < (_clientSize.x/3 - _size.w) ) {
				_elementPos = _c.returnNumber ? 0 : "LeftTop";
			} else
			if ( (_clientSize.x/3 - _size.w) <= _eRPos.x && _eRPos.x <= (_clientSize.x/3*2 - _size.w) ) {
				_elementPos =  _c.returnNumber ? 1 : "CenterTop";
			} else {
				_elementPos =  _c.returnNumber ? 2 : "RightTop";
			}
		} else
		if ( (_clientSize.y/3 - _size.h) <= _eRPos.y && _eRPos.y <= (_clientSize.y/3*2 - _size.h) ) {
			if ( _eRPos.x < (_clientSize.x/3 - _size.w) ) {
				_elementPos =  _c.returnNumber ? 3 : "LeftCenter";
			} else
			if ( (_clientSize.x/3 - _size.w) <= _eRPos.x && _eRPos.x <= (_clientSize.x/3*2 - _size.w) ) {
				_elementPos =  _c.returnNumber ? 4 : "CenterCenter";
			} else {
				_elementPos =  _c.returnNumber ? 5 : "RightCenter";
			}
		} else {
			if ( _eRPos.x < (_clientSize.x/3 - _size.w) ) {
				_elementPos =  _c.returnNumber ? 6 : "LeftBottom";
			} else
			if ( (_clientSize.x/3 - _size.w) <= _eRPos.x && _eRPos.x <= (_clientSize.x/3*2 - _size.w) ) {
				_elementPos =  _c.returnNumber ? 7 : "CenterBottom";
			} else {
				_elementPos =  _c.returnNumber ? 8 : "RightBottom";
			}
		}

		this.data("element-pos", _elementPos);
		if ( _c.callback && typeof _c.callback === "function" ) {
			_c.callback.call(this);
		}
		if ( !_c.returnCancel ) {
			return this;
		}
	}
})(jQuery);