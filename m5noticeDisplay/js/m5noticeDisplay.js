/**
 * m5noticeDisplay
 *
 * @version      1.0
 * @author       nori (norimania@gmail.com)
 * @copyright    5509 (http://5509.me/)
 * @license      The MIT License
 * @link         http://5509.me/log/m5noticedisplay
 *
 * Date: 2010-12-06 21:20
 */

(function($) {
	
	$.fn.m5noticeDisplay = function(options) {
		var conf = $.extend({
				noticeBlock: '#noticeBlock',
				animateIn: 'slide', // or fadeIn, slideDown
				animateOut: 'slide', // or fadeOut, slideUp
				duration: '300',
				easing: 'swing',
				callback: function() {}		
			}, options),
			$this = $(this),
			chkClientSize = function() {
				return {
					x: document.body.clientWidth || document.documentElement.clientWidth,
					y: document.body.clientHeight || document.documentElement.clientHeight
				}
			},
			chkScrollPos = function() {
				return {
					x: document.body.scrollLeft || document.documentElement.scrollLeft,
					y: document.body.scrollTop || document.documentElement.scrollTop
				}
			},
			clientSize = chkClientSize(),
			scrollPos = chkScrollPos(),
			$thisContent = $this.html(),
			noticeBlock = $(conf.noticeBlock),
			noticeElmChkOffset = { top: 0, left: 0 },
			noticeElmChk = $('<span class="noticeElmChk">.</span>')
				.css({
					height: 1,
					width: 1,
					opacity: 0
				}),
			displayNoticeBlock = function() {
				if ( noticeElmChkOffset.top < (clientSize.y + scrollPos.y) ) {
					if ( noticeBlock.is(':visible') ) return false;
					if ( conf.animateIn != 'slide' ) {
						noticeBlock.stop(true, true);
						noticeBlock[conf.animateIn](conf.duration, conf.easing, conf.callback);
					} else {
						noticeBlock
							.show()
							.css('top', -noticeBlockSize.height)
							.animate({
								top: 0	
							}, {
								queue: false,
								duration: conf.duration,
								easing: conf.easing
							});
					}
				} else {
					if ( noticeBlock.is(':visible') && !noticeBlock.is(':animated') ) {
						if ( conf.animateOut != 'slide' ) {
							noticeBlock.stop(true, true);
							noticeBlock[conf.animateOut](conf.duration, conf.callback);
						} else {
							noticeBlock
								.animate({
									top: -noticeBlockSize.height	
								}, {
									queue: false,
									duration: conf.duration,
									easing: conf.easing,
									complete: function() { noticeBlock.hide() }
								});
						}
					}
				}
			}
		
		// 対象要素の表示位置チェック用の要素追加
		$this
			.html('')
			.append(
				noticeElmChk,
				$thisContent
			)
			
		noticeElmChkOffset = noticeElmChk.offset();
		
		// サイズを取得して非表示にしておく
		$(conf.noticeBlock).show();
		var noticeBlockSize = {
			width: noticeBlock.attr('offsetWidth'),
			height: noticeBlock.attr('offsetHeight')
		}
		$(conf.noticeBlock).hide();
		
		$(window)
			.scroll(function() {
				scrollPos = chkScrollPos();
				displayNoticeBlock();
			})
			.resize(function() {
				clientSize = chkClientSize();
				displayNoticeBlock();
			})
	}

})(jQuery);