(function ($, Drupal) {
	/**
	 * Toolbar Spacing
	 */
	Drupal.behaviors.toolbarSpace = {
		attach: function (context, settings) {
			function toolbarSpace() {
				toolbarHeight = $("#toolbar-bar").height();
				trayHeight = $(".toolbar-tray-horizontal.is-active").length
					? $(".toolbar-tray-horizontal.is-active").height()
					: 0;
				topPadding = toolbarHeight + trayHeight;

				$("body").css({
					paddingTop: topPadding,
				});
			}

			$(window).resize(toolbarSpace);
		},
	};

	/**
	 * jquery UI dialog box close button fix
	 */
	Drupal.behaviors.dialogCloseButtonFix = {
		attach: function (context, settings) {
			if ($.fn.button && $.fn.button.noConflict) {
				$.fn.bootstrapBtn = $.fn.button.noConflict();
			}
		},
	};

	/**
	 * Make tables responsive
	 */
	Drupal.behaviors.responsiveTables = {
		attach: function (context, settings) {
			$("table", context)
				.not(".fc-content-skeleton > table")
				.each(function () {
					$(this)
						.addClass("table")
						.wrap('<div class="table-responsive"></div>');
				});
		},
	};

	/**
	 * Make Post Header adaptive
	 */
	Drupal.behaviors.adaptivePostHeader = {
		attach: function (context, settings) {
			$(".post-header")
				.has(".author-picture img")
				.addClass("has-author-picture");
		},
	};

	/**
	 * Fullcalendar contrast text
	 */
	Drupal.behaviors.ContrastText = {
		attach: function (context, settings) {
			// Helper function to check color contrast
			const getContrast = (hexcolor) => {
				// If a leading # is provided, remove it
				if (hexcolor.slice(0, 1) === "#") {
					hexcolor = hexcolor.slice(1);
				}

				// Convert to RGB value
				let r = parseInt(hexcolor.substr(0, 2), 16);
				let g = parseInt(hexcolor.substr(2, 2), 16);
				let b = parseInt(hexcolor.substr(4, 2), 16);

				// Get YIQ ratio
				let yiq = (r * 299 + g * 587 + b * 114) / 1000;

				// Check contrast
				return yiq >= 128 ? "black" : "white";
			};

			// Helper function to convert rgba to hex
			const rgba2hex = (rgba) =>
				`#${rgba
					.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
					.slice(1)
					.map((n, i) =>
						(i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
							.toString(16)
							.padStart(2, "0")
							.replace("NaN", "")
					)
					.join("")}`;

			const observer = new MutationObserver(function (mutations, observer) {
				// fired when a mutation occurs
				$(".fc-event", context).each(function () {
					let bgColor = $(this).css("background-color");
					let hexcolor = rgba2hex(bgColor);

					$(this).find(".fc-content").css("color", getContrast(hexcolor));
				});
			});

			const elementToObserve = document.querySelector("#fullcalendar-view");

			$(window).on("load", function () {
				if (elementToObserve) {
					observer.observe(elementToObserve, {
						subtree: true,
						attributes: true,
					});
				}
			});
		},
	};

	/**
	 * Slick view slideshow max width fix
	 */
	Drupal.behaviors.slickMaxWidth = {
		attach: function (context, settings) {
			const target = $(".layout--twocol-section .slick--view");

			const setMaxWidth = () => {
				if ($(".layout--twocol-section.wlar .slick--view").length) {
					target.css("display", "none");
					let parentColumnWidth = target
						.parents(".layout--twocol-section .layout__region")
						.width();
					let sideColumnWidth = target
						.parents(".layout--twocol-section .layout__region")
						.siblings(".layout__region")
						.outerWidth(true);
					slideWidth =
						parentColumnWidth - sideColumnWidth == 0
							? parentColumnWidth
							: parentColumnWidth - sideColumnWidth;
				} else {
					target.css("display", "none");
					const parentWidth = target.parents(".view-content").width();
					slideWidth = parentWidth;
				}

				target.css({
					"max-width": slideWidth,
					display: "inline-block",
				});
				target.find(".slick__slide").css("max-width", slideWidth);
			};

			if (target.length) {
				$(window).on("load resize", Drupal.debounce(setMaxWidth, 150));
			}
		},
	};

	/**
	 * Scroll the first calendar item into view
	 */
	Drupal.behaviors.fcEventView = {
		attach: function (context, settings) {
			const target = document.querySelector(".fc-view .fc-event");

			if (target) {
				target.scrollIntoView({
					behavior: "smooth",
					block: "center",
					inline: "nearest",
				});
			}
		},
	};

	/**
	 * Sticky menu
	 */
	Drupal.behaviors.stickyMenu = {
		attach: function (context, settings) {
			const toolbarTray = document.querySelector(
				".toolbar-tray-horizontal.is-active"
			);
			const toolbarBar = document.querySelector("#toolbar-bar");
			const menu = document.querySelector("#navbar");
			const homeLink = menu.querySelector("li.first");
			// Clone the logo element
			const logoCopy = document.querySelector(".logo").cloneNode(true);

			let topSpacing;

			const setTopSpacing = () => {
				topSpacing =
					(toolbarBar?.offsetHeight || 0) + (toolbarTray?.offsetHeight || 0);
				menu.style.setProperty("--topSpacing", `${topSpacing}px`);
			};

			// Add or remove the "sticky" class
			window.onscroll = () => {
				const { top } = menu.getBoundingClientRect();
				const isSticky = top <= topSpacing;
				const alreadySticky = menu.classList.contains("sticky");
				if (isSticky != alreadySticky) {
					menu.classList.toggle("sticky", isSticky);
					isSticky
						? homeLink.replaceWith(logoCopy)
						: menu.querySelector(".logo").replaceWith(homeLink);
				}
			};

			// Create a new MutationObserver
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.attributeName === "class") {
						setTopSpacing();
					}
				});
			});

			setTopSpacing();

			// Recalculate on window resize
			window.onresize = setTopSpacing;

			// Observe changes to the body element
			observer.observe(document.body, { attributes: true });
		},
	};
})(jQuery, Drupal);
