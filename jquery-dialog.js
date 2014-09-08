(function($){
	'use strict';
	var defaultConfig = {
		title: '',
		footer: '',
		modal: false,
		draggable: true,
		closeable: true,
		autoOpen: true,
		minify: true,
		maxify: true,
		css: {
			panel: 'wd-ui-pn',
			title: 'wd-ui-tt',
			content: 'wd-ui-ctn',
			footer: 'wd-ui-ft',
			close: 'wd-ui-close',
			topClose: 'wd-ui-tp-close',
			topMinify: 'wd-ui-tp-min',
			topMaxify: 'wd-ui-tp-max'
		},
		minimize: function(){},
		maximize: function(){}
	};

	var commands = {};
	var $win = $(window);

	commands.close = function($ele){
		var $widget = $ele.data('dlg_data').widget;
		$widget.close();
	};

	commands.open = function($ele){
		var $widget = $ele.data('dlg_data').widget;
		$widget.open();
	};

	commands.minify = function($ele, minify){
		var $widget = $ele.data('dlg_data').widget;
		if(minify === 'true'){
			$widget.find('.wd-ctn').hide();
			$widget.find('.wd-ft').hide();
		} else if(minify === 'false'){
			$widget.find('.wd-ctn').show();
			$widget.find('.wd-ft').show();
		} else {
			$widget.find('.wd-ctn').toggle();
			$widget.find('.wd-ft').toggle();
		}
	};

	commands.maxify = function($ele, maxify){
		var data = $ele.data('dlg_data');
		var $widget = data.widget;
		console.log(data, maxify);
		if(maxify === true){
			data.originSize = {
				width: $widget.width(),
				height: $widget.height()
			};
			$widget.width($win.width());
			$widget.find('.wd-ctn').height($win.height() - $widget.find('.wd-tt').outerHeight() - $widget.find('.wd-ft').outerHeight());
			$widget.align({
				base: 'screen'
			});
		} else if(maxify === false){
			$widget.width(data.originSize.width);
			$widget.height(data.originSize.height);
			delete data.originSize;
			$widget.align({
				base: 'screen'
			});
		} else {
			if(data.originSize) {
				commands.maxify($ele, false);
			} else {
				commands.maxify($ele, true);
			}
		}
	};

	function runCommand($elements, command, commandParam) {
		$.each($elements, function(index, $ele){
			commands[command]($ele, commandParam);
		});
	}

	function initDialog($element) {
		var data = $element.data('dlg_data');
		var config = data.config;
		var css = config.css;
		var $tt = $('<div class="wd-tt-ctn"><div class="wd-tt-text">' + (config.title || '') + '<div></div>');
		if(config.closeable || config.minify || config.maxify) {
			var $tp = $('<div></div>');
			if(config.closeable) {
				$tp.append('<button class="wd-tp-op wd-tp-close ' + css.topClose + '">&#xe603;</button>');
			}
			if(config.maxify) {
				$tp.append('<button class="wd-tp-op wd-tp-max ' + css.topMaxify + '">&#xe601;</button>');
			}
			if(config.minify) {
				$tp.append('<button class="wd-tp-op wd-tp-min ' + css.topMinify + '">&#xe604;</button>');
			}
			$tt.prepend($tp);
		}
		config.title = $tt;
		config.closeable = false;
		var $widget = $.widget(config);
		data.widget = $widget;
		$widget.delegate('.wd-tp-close', 'click', function(event){
			event.stopPropagation();
			commands.close($element);
		});
		$widget.delegate('.wd-tp-min', 'click', function(event){
			event.stopPropagation();
			commands.minify($element);
		});
		$widget.delegate('.wd-tp-max', 'click', function(event){
			event.stopPropagation();
			commands.maxify($element);
		});
	}

	$.fn.dialog = function(config, commandParam){
		var self = this;
		if(typeof config === 'string') {
			runCommand(self, config, commandParam);
			return;
		}
		config = $.extend(true, {}, defaultConfig, config);
		$.each(self, function(index, $content){
			$content = $($content);
			config.content = $content;
			$content.data('dlg_data', {
				config: config
			});
			initDialog($content);
		});
		return self;
	};
})(jQuery);