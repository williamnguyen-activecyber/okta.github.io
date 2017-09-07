(function($) {

	var $titles = $('.BlogPost-content h1, .BlogPost-content h2, .BlogPost-content h3, .BlogPost-content h4, .BlogPost-content h5, .BlogPost-content h6');

	$titles.each(function() {
		$(this).wrapInner(
			$('<a>').attr('href', '#' + $(this).attr('id'))
			);
	})

	if(history) {
		$('a', $titles).click(function(e) {
			var offset = ($(this).offset().top - 130);

			e.preventDefault();
			history.pushState({}, null, $(this).attr('href'));

			$('html, body').animate({
				scrollTop: offset+'px'
			}, 200);

		});
	}

	$(window).load(function() {

		$('.StickyAddThis').each(function() {

			var $wrap			= $(this);
			var $window			= $(window);
			var $header			= $('.Header');
			var $addThis		= $('.addthis_toolbox', $wrap);

			var isBottom		= false;
			var isFixed			= false;
			var headerHeight	= $header.outerHeight();
			var addThisHeight	= $addThis.outerHeight();
			var offset			= $wrap.offset().top;
			var wrapHeight		= $wrap.outerHeight();
			var scrollTop		= $window.scrollTop();

			var onResize = function() {

				addThisHeight = $addThis.outerHeight();
				headerHeight = $header.outerHeight();
				offset = $wrap.offset().top;
				wrapHeight = $wrap.outerHeight();

			};

			var onScroll = function() {

				scrollTop = $window.scrollTop();

				if (scrollTop > offset + wrapHeight - headerHeight - addThisHeight - 100) {
					if (!isBottom) {
						$addThis.addClass('is-fixedToBottom');
						isBottom = true;
					}
				} else if(isBottom) {
					$addThis.removeClass('is-fixedToBottom');
					isBottom = false;
				}

				if (scrollTop > offset - headerHeight) {
					if (!isFixed) {
						$addThis.addClass('is-fixed');
						isFixed = true;
					}
				} else if(isFixed) {
					$addThis.removeClass('is-fixed');
					isFixed = false;
				}

			};

			$window
			.on('resize', onResize)
			.on('scroll', onScroll);

			onScroll();

		});

	});

})(jQuery);
