/**
 * m5ImageViewer
 *
 * @version      0.1
 * @author       nori (norimania@gmail.com)
 * @copyright    5509 (http://5509.me/)
 * @license      The MIT License
 * @link         http://5509.me/log/m5imageviewer
 *
 * 2010-01-27 23:50
 */
 
 ;(function($) {
 	// ImgLoad
 	$.fn.m5ImgLoad = function(callback, interval) {
		var _this = this,
			_img = $(this).get(0),
			newImg = new Image();
			
		newImg.src = _img.src;
		
		(function() {
			if ( newImg.complete ) {
				callback.call(_this.attr({width: newImg.width, height: newImg.height}));
				return;
			}
			setTimeout(arguments.callee, interval || 20);
		})();
	}
 
 	$.fn.m5ImageViewer = function(options) {
		var body = $("body");
		return $(this).each(function() {
			var _this = $(this),
				_img = _this.find("img"),
				_pos = _img.offset(),
				_size = {
					width: _img.attr("offsetWidth"),
					height: _img.attr("offsetHeight"),
					top: _pos.top,
					left: _pos.left
				},
				_loadedSize = {};
				
			_this.click(function() {
				$("<img src='" + _this.attr("href") + "'/>").load(function() {
					var __this = this,
						_$this = $(this);
					_loadedSize = {
						width: this.width,
						height: this.height
					}
					//alert(_loadedSize.width + " " + _loadedSize.height);
					//console.log(__this);
					// _loadedSizeが取れないのでここから下にすすめない
					
					body
						.click(function() {
							$("img.m5ImageViewerPrev")
								.animate({
									width: _size.width,
									height: _size.height,
									opacity: 0
								}, {
									duration: 400,
									easing: "swing",
									complete: function() {
										$(this).remove();
									}
								});
						})
						.append(
							_$this
								.addClass("m5ImageViewerPrev")
								.css({
									width: _size.width,
									height: _size.height,
									position: "absolute",
									top: _size.top,
									left: _size.left,
									opacity: 0
								})
								.animate({
									width: _loadedSize.width,
									height: _loadedSize.height,
									opacity: 1
								}, {
									duration: 400,
									easing: "swing"
								})
						)
				});
				
				return false;
			});
			
		});
	}
 })(jQuery);
