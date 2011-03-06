/**
 * m5ImageViewer
 *
 * @version      1.3.1
 * @author       nori (norimania@gmail.com)
 * @copyright    5509 (http://5509.me/)
 * @license      The MIT License
 * @link         http://5509.me/log/m5imageviewer
 *
 * @Modified     2010-02-27 17:34
 */
;(function($) {
	/**
	 * m5ImgLoad
	 *
	 * @author       nori (norimania@gmail.com)
	 * @copyright    5509 (http://5509.me/)
	 * @license      The MIT License
	 * @link         https://github.com/5509/m5ImgLoad
	 *
	 */
 	$.fn.m5ImgLoad = function(callback, interval) {
		var _this = this,
			_img = $(this).get(0),
			newImg = new Image();
			
		newImg.src = _img.src;
		
		(function() {
			if ( newImg.complete ) {
				callback.call($(newImg));
				return;
			} 
			setTimeout(arguments.callee, interval || 20);
		})();
	}
	
	/**
	 * exShowHide
	 */
	$.fn.exShow = function(duration) {
		if (!$.support.opacity) {
			$(this).show();
		} else {
			$(this).fadeIn(duration);
		}
		return this;
	}
	$.fn.exHide = function(duration) {
		if (!$.support.opacity) {
			$(this).hide();
		} else {
			$(this).fadeOut(duration);
		}
		return this;
	}
	
	/**
	 * m5GetElementPos
	 *
	 * @author       nori (norimania@gmail.com)
	 * @copyright    5509 (http://5509.me/)
	 * @license      The MIT License
	 * @link         https://github.com/5509/m5GetElemPosition
	 *
	 */
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
		var _scrollTop = {
				y: document.body.scrollTop || document.documentElement.scrollTop,
				x: document.body.scrollLeft || document.documentElement.scrollLeft
			},
			 _clientSize =  {
				x: document.body.clientWidth || document.documentElement.clientWidth,
				y: document.body.clientHeight || document.documentElement.clientHeight
			},
			_offset = this.offset(),
			_size = { // half size
				w: this.attr("offsetWidth") / 2,
				h: this.attr("offsetHeight") / 2
			},
			_eRPos = { // element relative position
				x: _offset.left - _scrollTop.x,
				y: _offset.top - _scrollTop.y
			},
			_elementPos,
			_c = $.extend({
				returnNumber: true, // or false
				returnCancel: false,
				callback: null
			}, options);
			
		if ( (_eRPos.y + _size.h) < _clientSize.y/3 ) {
			if ( (_eRPos.x + _size.w) < _clientSize.x/3 ) {
				_elementPos = _c.returnNumber ? 0 : "LeftTop";
			} else
			if ( _clientSize.x/3 <= (_eRPos.x + _size.w) && (_eRPos.x + _size.w) <= _clientSize.x/3*2 ) {
				_elementPos =  _c.returnNumber ? 1 : "CenterTop";
			} else {
				_elementPos =  _c.returnNumber ? 2 : "RightTop";
			}
		} else
		if ( _clientSize.y/3 <= (_eRPos.y + _size.h) && (_eRPos.y + _size.h) <= _clientSize.y/3*2 ) {
			if ( (_eRPos.x + _size.w) < _clientSize.x/3 ) {
				_elementPos =  _c.returnNumber ? 3 : "LeftCenter";
			} else
			if ( _clientSize.x/3 <= (_eRPos.x + _size.w) && (_eRPos.x + _size.w) <= _clientSize.x/3*2 ) {
				_elementPos =  _c.returnNumber ? 4 : "CenterCenter";
			} else {
				_elementPos =  _c.returnNumber ? 5 : "RightCenter";
			}
		} else {
			if ( (_eRPos.x + _size.w) < _clientSize.x/3 ) {
				_elementPos =  _c.returnNumber ? 6 : "LeftBottom";
			} else
			if ( _clientSize.x/3 <= (_eRPos.x + _size.w) && (_eRPos.x + _size.w) <= _clientSize.x/3*2 ) {
				_elementPos =  _c.returnNumber ? 7 : "CenterBottom";
			} else {
				_elementPos =  _c.returnNumber ? 8 : "RightBottom";
			}
		}
		
		console.log("erPos.y: " + _eRPos.y + " clientSize.y: " + _clientSize.y + " clientSize2/3.y: " + _clientSize.y/3*2)
		console.log("erPos.x: " + _eRPos.x + " clientSize.x: " + _clientSize.x + " clientSize2/3.x: " + _clientSize.x/3*2)

		this.data("element-pos", _elementPos);
		if ( _c.callback && typeof _c.callback === "function" ) {
			_c.callback.call(this);
		}
		if ( !_c.returnCancel ) {
			return this;
		}
	}

	/**
	 * m5ImageViewer
	 */
	$.fn.m5ImageViewer = function(options) {
		var body = $("body"),
			windowResized = false,
			c = $.extend({
					duration: 200,
					easing: "swing"
					// setout => "swing", set, out => { set: "swing", out: "linear" }
				}, options),
			closeBtn = $("<div id='m5ImgViewerClose' style='display: none'></div>"),
			clickBlocker = $("<div id='m5ImgViewerBlocker' style='display: none'></div>"),
			loading = $([
					"<div id='m5ImgViewerLoading' style='display: none'>",
						"<div id='m5ImgViewerLoadingIcon'></div>",
					"</div>"
				].join(""));
			
		body.append(
			clickBlocker,
			loading,
			closeBtn
		);
		
		return this.each(function() {
			var _this = $(this),
				_img = _this.find("img"),
				_pos = _img.offset(),
				_size = {
					width: _img.attr("offsetWidth"),
					height: _img.attr("offsetHeight"),
					top: _pos.top,
					left: _pos.left
				},
				_elementPos, _animEndParams;
				
			_this
				//.m5GetElementPos()
				.click(function() {
					_elementPos = _this.m5GetElementPos().data("element-pos");
					_pos = _img.offset();
					_size = {
						width: _img.attr("offsetWidth"),
						height: _img.attr("offsetHeight"),
						top: _pos.top,
						left: _pos.left
					};
					
					// Enlarging patterns
					// this will be set by the image position of client canvas
					if ( _elementPos === 0 ) {
					// LeftTop - Pattern A
						_animEndParams = function(loadedSize) { 
							return {
								width: loadedSize.width,
								height: loadedSize.height,
								opacity: 1
							}
						}
					} else
					if ( _elementPos === 1 ) {
					// CenterTop - Pattern B
						//_animEndP
						_animEndParams = function(loadedSize) {
							return {
								marginLeft: -loadedSize.width/2 + _size.width/2,
								width: loadedSize.width,
								height: loadedSize.height,
								opacity: 1
							}
						}
					} else
					if ( _elementPos === 2 ) {
					// RightTop - Pattern C
						_animEndParams = function(loadedSize) {
							return {
								marginLeft: -loadedSize.width + _size.width,
								width: loadedSize.width,
								height: loadedSize.height,
								opacity: 1
							}
						}
					} else
					if ( _elementPos === 3 ) {
					// LeftCenter - Pattern D
						_animEndParams = function(loadedSize) {
							return {
								marginTop: -loadedSize.height/2 + _size.height/2,
								width: loadedSize.width,
								height: loadedSize.height,
								opacity: 1
							}
						}
					} else
					if ( _elementPos === 4 ) {
					// CenterCenter - Pattern E
						_animEndParams = function(loadedSize) {
							return {
								marginTop: -loadedSize.height/2 + _size.height/2,
								marginLeft: -loadedSize.width/2 + _size.width/2,
								width: loadedSize.width,
								height: loadedSize.height,
								opacity: 1
							}
						}
					} else
					if ( _elementPos === 5 ) {
					// RightCenter - Pattern F
						_animEndParams = function(loadedSize) {
							return {
								marginTop: -loadedSize.height/2 + _size.height/2,
								marginLeft: -loadedSize.width + _size.width,
								width: loadedSize.width,
								height: loadedSize.height,
								opacity: 1
							}
						}
					} else
					if ( _elementPos === 6 ) {
					// LeftBottom - Pattern G
						_animEndParams = function(loadedSize) {
							return {
								marginTop: -loadedSize.height + _size.height,
								width: loadedSize.width,
								height: loadedSize.height,
								opacity: 1
							}
						}
					} else
					if ( _elementPos === 7 ) {
					// CenterBottom - Pattern H
						_animEndParams = function(loadedSize) {
							return {
								marginTop: -loadedSize.height + _size.height,
								marginLeft: -loadedSize.width/2 + _size.width/2,
								width: loadedSize.width,
								height: loadedSize.height,
								opacity: 1
							}
						}
					} else {
					// RightBottom - Pattern I
						_animEndParams = function(loadedSize) {
							return {
								marginTop: -loadedSize.height + _size.height,
								marginLeft: -loadedSize.width + _size.width,
								width: loadedSize.width,
								height: loadedSize.height,
								opacity: 1
							}
						}
					}
					
					
					clickBlocker
						.css({
							display: "block",
							width: document.body.clientWidth || document.documentElement.clientWidth,
							height: document.body.clientHeight || document.documentElement.clientHeight
						});
						
					$("#m5ImgViewerClose, #m5ImgViewerBlocker")
						.one("click", function() {
							
							$("#m5ImgViewerClose, #m5ImgViewerBlocker").unbind("click");
							
							clickBlocker.css("display", "none");
							closeBtn.exHide("fast");
							$("img.m5ImgViewerPrev")
								.animate({
									marginTop: 0,
									marginLeft: 0,
									width: _size.width,
									height: _size.height,
									opacity: 0
								}, {
									duration: c.duration,
									easing: "swing",
									complete: function() {
										$(this).remove();
									}
								})
						})
					
					loading
						.css({
							display: "block",
							width: _size.width,
							height: _size.height,
							position: "absolute",
							top: _pos.top,
							left: _pos.left
						});
					
					$("<img src='" + _this.attr("href") + "'/>").m5ImgLoad(function() {
						loading.css("display", "none");
					
						var __this = $(this);
						_loadedSize = {
							width: __this.attr("width"),
							height: __this.attr("height")
						}
						
						body
							.append(
								__this
									.addClass("m5ImgViewerPrev")
									.css({
										width: _size.width,
										height: _size.height,
										position: "absolute",
										top: _size.top,
										left: _size.left,
										opacity: 0
									})
									.animate( _animEndParams(_loadedSize),
										{
											duration: c.duration,
											easing: "swing",
											complete: function() {
												$("#m5ImgViewerClose")
													.css({
														top: __this.offset().top,
														left: __this.offset().left
													})
													.exShow("fast");
											}
										}
									)
							);
					});
					
					return false;
				});
			
		});
	}
})(jQuery);