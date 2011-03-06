/**
 * m5ImgLoad
 *
 * @version      0.2
 * @author       nori (norimania@gmail.com)
 * @copyright    5509 (http://5509.me/)
 * @license      The MIT License
 * @link         https://github.com/5509/m5ImgLoad
 *
 * 2010-02-08 15:41
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
				callback.call($(newImg));
				return;
			}
			setTimeout(arguments.callee, interval || 20);
		})();
	}
 })(jQuery);
