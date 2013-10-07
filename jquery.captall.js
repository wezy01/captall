/**
 * jQuery Captall - Add a caption to everything - http://www.captall.be
 * ---------------------------------------------------------------------------------
 *
 * jQuery Captall is a plugin that creates captions on images or any DOM element.
 *
 * Licensed under The MIT License
 *
 * @version         1.0.1
 * @since           09-29-2013
 * @author          Erwin Van Wesemael
 * @documentation   www.captall.be
 * @license         opensource.org/licenses/mit-license.php MIT
 * @package         jQuery Plugins
 *
 */

;(function($) {
	"use strict";
	var self = $(this);
	
	$.fn.captall = function(settings, callback){
		
		var options = $.extend({}, $.fn.captall.defaults, settings);
		
		if (this.length === 0) {
			debug('Invalid selector!');
			return;
		} else if (this.length > 1) {
			return this.each(function() {
				$.fn.captall.apply($(this), [settings]);
			});
		}
	
		if(options.padding !== ''){
			var p = options.padding;
			if(p.length === 4){
				options.paddingTop = p[0];	
				options.paddingRight = p[1];	
				options.paddingBottom = p[2];	
				options.paddingLeft = p[3];	
			}else if(p.length === 2){
				options.paddingTop = p[0];	
				options.paddingRight = p[1];	
				options.paddingBottom = p[0];	
				options.paddingLeft = p[1];	
			}else if(p.length === 1){
				options.paddingTop = p[0];	
				options.paddingRight = p[0];	
				options.paddingBottom = p[0];	
				options.paddingLeft = p[0];	
			}else{
				debug('Invalid padding properties');
				return;
			}
		}


		var $this		= $(this),
		totalVerPadding	= options.paddingTop + options.paddingBottom,
		totalHorPadding	= options.paddingLeft + options.paddingRight,
		f;

		if(options.height === 'full'){
			options.height = $this.height() + totalVerPadding;
		}else if(options.height === 'half'){
			options.height = ($this.height() / 2) - totalVerPadding;
		}else if(options.height === ''){
			options.height = 30;// + totalVerPadding;
		}else if(options.height.toString().indexOf("/") >= 0){
			f = options.height.split("/");
			options.height = ($this.height() - totalVerPadding) / f[1] * f[0];
		}else if(options.height.toString().indexOf("%") >= 0){
			f = options.height.split("%");
			options.height = ($this.height() - totalVerPadding) * f[0] / 100;
		}
		
		if(options.width === 'full'){
			options.width = $this.width() - totalHorPadding;
		}else if(options.width === 'half'){
			options.width = ($this.width() / 2) - totalHorPadding;
		}else if(options.width === ''){
			options.width = $this.width() - totalHorPadding;
		}else if(options.width.toString().indexOf("/") >= 0){
			f = options.width.split("/");
			options.width = ($this.width() - totalHorPadding) / f[1] * f[0];
		}else if(options.width.toString().indexOf("%") >= 0){
			f = options.width.split("%");
			options.width = ($this.width() - totalHorPadding) * f[0] / 100;
		}

		if(options.time !== ''){
			options.inTime = options.time;
			options.outTime = options.time;
		}
		
		if(options.easing !== ''){
			options.easingIn = options.easing;
			options.easingOut = options.easing;
		}
		
		if(options.delay !== 0){
			options.delayShow = options.delay;
			options.delayHide = options.delay;
		}

		var name		= $this.attr('name'),
			$caption	= $('<div class="' + options.cCaption + '"/>'),
			$elem		= $this,
			fullHeight 	= options.height + totalVerPadding, //Height of the sliding element.
			fullWidth 	= options.width + totalHorPadding;

		if ($this.parent().is('a')) {
			$elem = $this.parent();
		}

		var $image		= $elem.wrap('<div class="' + options.cImage + '"/>').parent(),
			$wrapper	= $image.wrap('<div class="' + options.cWrapper + '"/>').parent();
		
		$wrapper.css({
			height:		$this.height(),
			overflow:	'hidden',
			position:	'relative',
			width:		$this.width()
		});

		$caption.css({
			width:				options.width,
			height:				options.height,
			opacity:			options.opacity,
			position:			'absolute',
			'padding-top':		options.paddingTop,
			'padding-bottom':	options.paddingBottom,
			'padding-left':		options.paddingLeft,
			'padding-right':	options.paddingRight,
			'background-color':	options.backgroundColor,
			color:				options.fontColor,
			'font-size':			options.fontSize,
			'text-align':		options.textAlign
		})
		.click(function(evt) {
			evt.stopPropagation();
		})
		.appendTo($wrapper);

		if (name) {
			var $content = $(name);

			if ($content.length) {
				$content.appendTo($caption);
			} else {
				$caption.html('<span style="color: #F00;">Content invalid or missing!</span>');
			}
		}else if(options.caption !== ''){
			$caption.html(options.caption);
		}else {
			$caption.html($this.attr('alt'));
		}

		var start_top 	= 0,
			end_top 	= 0,
			start_left	= 0,
			end_left	= 0;
				
		if(options.top === ''){
			start_top = 0;
		}else if(options.top === 'center'){
			start_top = (this.height()  - fullHeight - totalVerPadding) / 2;
		}else if(!isNaN(options.top)){
			start_top = options.top;	
		}else{
			debug('Invalid top value!');
			return;
		}
		
		var top = 0;
		var left = 0;
		if(options.top === ''){
			top = 0;
		}else if(options.top === 'center'){
			top = (this.height()  - fullHeight) / 2;
		}else if(!isNaN(options.top)){
			top = options.top;
		}else{
			debug('Invalid top value!');
			return;
		}
		
		if(options.left === ''){
			left = 0;
		}else if(options.left === 'center'){
			left = (this.width() - fullWidth) / 2;
		}else if(!isNaN(options.left)){
			left = options.left;
		}else{
			debug('Invalid top value!');
			return;
		}

		if (options.animation === 'slide' || options.animation === 'float') {
			if(options.top === ''){
				if(options.slideTo === 'bottom'){
					start_top = this.height() - options.height - totalVerPadding;
				}else if(options.slideTo === 'top'){
					start_top = 0;// - totalVerPadding;
				}else if(options.slideTo === 'center'){
					start_top = (this.height()  - fullHeight) / 2;
				}else{
					start_top = options.slideTo;
				}
			}else{
				start_top = options.top;
			}

			if(options.left === ''){
				if(options.slideTo === 'left' || options.slideTo === 'bottom'){
					start_left = 0;
				}else if(options.slideTo === 'right'){
					start_left = (this.width()  - fullWidth);
				}else if(options.slideTo === 'center'){
					start_left = (this.width()  - fullWidth) / 2;
				}else{
					start_left = options.slideTo;	
				}
			}else{
				start_left = options.left;	
			}
			
				
			if(options.slideFrom === 'bottom' || options.slideFrom === 'bottomleft'){
				end_top = this.height();
				start_left = 0;
			}if(options.slideFrom === 'bottomcenter'){
				end_top = this.height();
				start_left = (this.width()  - fullWidth) / 2;
				end_left = start_left;
			}if(options.slideFrom === 'bottomright'){
				end_top = this.height();
				start_left = (this.width()  - fullWidth);
				end_left = start_left;
			}else if(options.slideFrom === 'top' || options.slideFrom === 'topleft'){
				end_top = - fullHeight;
				start_left = 0;
			}else if(options.slideFrom === 'topcenter'){
				end_top = - fullHeight;
				start_left = (this.width()  - fullWidth) / 2;
				end_left = start_left;
			}else if(options.slideFrom === 'topright'){
				end_top = - fullHeight;
				start_left = (this.width()  - fullWidth);
				end_left = start_left;
			}
			$caption.css({
				top:	end_top + 'px',
				left: 	start_left + 'px'
			});
			
			if(options.slideFrom === 'left' || options.slideFrom === 'lefttop'){
				end_left = - fullWidth;
				start_top =  options.top;
				end_top = start_top;
			}else if(options.slideFrom ==='leftcenter'){
				end_left = - fullWidth;
				start_top = (this.height()  - fullHeight) / 2;
				end_top = start_top;
			}else if(options.slideFrom === 'leftbottom'){
				end_left = - fullWidth;
				end_top = start_top;
			}else if(options.slideFrom === 'right' || options.slideFrom === 'righttop'){
				end_left = this.width();
				start_top = 0;
				end_top = start_top;
			}else if(options.slideFrom === 'rightcenter'){
				end_left = this.width();
				start_top = (this.height()  - fullHeight) / 2;
				end_top = start_top;
			}else if(options.slideFrom === 'rightbottom'){
				end_left = this.width();
				start_top = (this.height()  - fullHeight);
				end_top = start_top;
			}
			$caption.css({
				top: 		end_top + 'px',
				left: 		end_left + 'px'
			});
			
			var op_out = options.opacity;
			if(options.animation === 'float'){
				$caption.css('opacity', 0)
				$caption.animate({ opacity: 0 }, 0);		
				op_out = 0;
			}
			
			$wrapper.hover(
				function() {	
					$caption.delay(options.showDelay).animate({ top: start_top, left: start_left, opacity: options.opacity }, { duration: options.inTime, easing: options.easingIn , queue: true });
				},
				function() {
					$caption.stop().delay(options.hideDelay).animate({ top: end_top, left: end_left, opacity: op_out }, { duration: options.outTime, easing: options.easingOut, queue: true });
				}
			);
		}else if (options.animation === 'fade') {
			$caption.css({
				opacity:	0,
				top:		top + 'px',
				left:		left + 'px'
			});
			
			$wrapper.hover(
				function() {
					$caption.stop().delay(options.delayShow).animate({ opacity: options.opacity }, {duration: options.inTime});
				},
	    		function() {
					$caption.stop().delay(options.delayHide).animate({ opacity: 0 }, {duration: options.outTime});
				}
	    	);
		} else if (options.animation === 'fixed') {
			$caption.css({
				top:		top + 'px',
				left:		left + 'px'
			});
						
			if(options.fadeOutAfter !== '') {
				$caption.delay(options.fadeOutAfter).animate({ opacity: 0 }, options.outTime);
			}
			
		} else {
			debug($this.attr('id') + ': invalid animation!');
		}

		function setCaption(text){
			$caption.html(options.caption);
		}
		
		return $this;
	};

	function debug(message) {
		if (window.console && window.console.log) {
			window.console.log(message);
		}
	}
	
	$.fn.captall.caption = function(txt){
		self.setCaption(txt);
	};

	$.fn.captall.defaults = {
		caption:			'',
		animation:			'slide',
		slideFrom: 			'top',
		slideTo:			'bottom',
		cCaption:			'captall-caption',
		cImage:				'captall-image',
		cWrapper:			'captall-wrapper',
		top:				'',
		left:				'',
		width:				'',
		height:				'',  //full == 100%
		opacity:			.7,
		time:				'',
		inTime:				200,
		outTime:			200,
		padding:			'',
		paddingTop:			0,
		paddingBottom:		0,
		paddingLeft:		0,
		paddingRight:		0,
		backgroundColor:	'#fff',
		fontColor:			'#000',
		fontsize:			'16px',
		textAlign:			'left',
		delay:				0, //slide & fade
		delayShow:			0,
		delayHide:			0, //fixed
		fadeOutAfter:		'',
		easing:				'',
		easingIn:			'',
		easingOut:			''
	};
	
	

}(jQuery));