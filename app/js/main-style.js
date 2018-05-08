var restarauntSiteScripts;

(function($){

	restarauntSiteScripts = {

		init: function(){
			var _this = this;

			$( document ).ready( function() {

				_this.magnificInit();
				_this.slidersInit();
				_this.fixedMenuInit();
				_this.responsiveNavInit();
				_this.menuToggleInit();
				_this.loginFormInit();
				_this.filterProducts();
				_this.toTopInit();
				_this.extraFeaturesInit();
			} );

		},

		magnificInit: function( target ){
			$( '.modal-window' ).magnificPopup({
				type: 'inline'
			});
		},

		slidersInit: function() {
			let slider = $('.slider');
				slider.css('height',slider.width());

			$('.slider').slick({
				appendArrows: $('.slider-top .arrows'),
				prevArrow: '<button class="prev"><i class="linearicons-chevron-left" ></i></button>',
				nextArrow: '<button class="next"><i class="linearicons-chevron-right" ></i></button>'
			});
			//slider-top//

			//visitors-slider//
			$('.visitors-slider').slick({
				appendArrows: $('.visitors-wrap .arrows'),
				prevArrow: '<button class="prev"><i class="linearicons-chevron-left" ></i></button>',
				nextArrow: '<button class="next"><i class="linearicons-chevron-right" ></i></button>'
			});
			////////////////////
		},

		fixedMenuInit: function() {
			let header = $('.header');

			$(window).scroll(function () {
				if ($(this).scrollTop() > 40) {
					header.addClass("header-fixed");
				} else {
					header.removeClass("header-fixed");
				}
			});
		},

		responsiveNavInit: function () {
			let btn = $('#menu-btn');
			let nav = $('nav');
			let overlay = $('.overlay');

			btn.on('click', function () {
				nav.addClass('nav--active');
				overlay.addClass('overlay--active');
				$('body').addClass('body-fixed');

				$(this).attr('disabled', true);
			});

			overlay.on('click', function () {
				nav.removeClass('nav--active');
				overlay.removeClass('overlay--active');
				$('body').removeClass('body-fixed');

				btn.removeAttr('disabled');
			})
		},

		menuToggleInit: function() {
			var o = $('.toggle');

			$('.toggle').click(function (e) {
				e.preventDefault();
				var tmp = $(this);
				o.each(function () {
				if ($(this).hasClass('active') && !$(this).is(tmp)) {
					$(this).parent().find('.toggle_cont').slideToggle();
					$(this).removeClass('active');
				}
			});
				$(this).toggleClass('active');
				$(this).parent().find('.toggle_cont').slideToggle();
			});

			$(document).on('click touchstart', function (e) {
				var container = $(".toggle-wrap");
				var removeBtnWrap = $('#cart .btn-remove-wrap');
				if (!container.is(e.target) && container.has(e.target).length === 0 && container.find('.toggle').hasClass('active')) {
					container.find('.active').toggleClass('active').parent().find('.toggle_cont').slideToggle();
					if (removeBtnWrap.length > 0 ) {
						removeBtnWrap.fadeOut();
					}
				}
			});
		},

		loginFormInit: function(){

			let _this = this,
				allUsersData = {},
				$loginForm = $('.login-form'),
				$registerForm = $('.register-form'),
				$message = $('.message'),
				messageTimeOut,
				jsonUrl = 'https://loginform-11c2d.firebaseio.com/users.json';

				/////////// handler login form/////////
			$('.loginButton', $loginForm ).on('click', function( event ) {
				let userNameValue = $('#loginUsername', $loginForm).val(),
					userPassValue = $('#loginPassword', $loginForm).val(),
					inputs        = $( 'input', $loginForm ),
					isError       = false;

				event.preventDefault();

				inputs.each( function() {
					let $this = $(this),
						value = $this.val(),
						$error = $this.siblings('.error');

					if ($this.prop('required') && value == '') {
						$error.addClass('showState');

						isError = true;
					}

				} );

				if ( isError ) {
					return false;
				}

				loginHandler( userNameValue, userPassValue );
			});


				///////////handler register form/////////
			$('.registerButton', $registerForm).on('click', function() {
				let nameValue = $('#newUsername', $registerForm).val(),
					loginValue = $('#newUserlogin', $registerForm).val(),
					passValue = $('#newPassword', $registerForm).val(),
					confirmPassValue = $('#comfirmPassword', $registerForm).val(),
					inputs = $('input', $registerForm),
					isError = false;

				event.preventDefault();

				inputs.each( function() {
					let $this = $(this),
						value = $this.val(),
						$error = $this.siblings('.error');

					if ($this.prop('required') && value == '') {
						$error.addClass('showState');

						isError = true;
					} else {
						$error.removeClass('showState');
					}

				} );

				if (passValue !== confirmPassValue) {
					showMessage('Passwords do not match');

					return false;
				}

				if ( isError ) {
					return false;
				}

				registerHandler(nameValue, loginValue, passValue);
			});
				///////////handler register form/////////

			$('.form-instance').on('input', 'input', function() {
				let $target = $(event.target),
					$error = $target.siblings('.error');

				$error.removeClass('showState');
			});
				///////////function ajax inquiry database login form/////////
			function loginHandler( login, pass ) {
				let usersData = {},
					isAccess = false;

				$.ajax({
					type: 'GET',
					url: jsonUrl,
					success: function(responce) {
						usersData = responce;

						console.log(usersData);

						for ( let id in usersData ) {
							// console.log(usersData[id]);
							let itemData = usersData[ id ];

							if ( itemData.login == login ) {
								if ( itemData.pass == pass ) {
									isAccess = true;
								} else {
									showMessage( 'Wrong Password' );

									return false;
								}
							}
						}

						if ( isAccess ) {
							showMessage( 'Success! Redirect... '+ login +'' );
							$('.login-form__link').css('color','white');
							$('.custom-title').html(login).css('display', 'block');
						} else {
							showMessage( 'User with name <b>' + login + '</b> not exist!'  );

							return false;
						}
					}
				});

			}
				///////////function ajax inquiry database login form/////////

				///////////function ajax inquiry database register form/////////
			function registerHandler(name, login, pass) {
				let data = {
					name: name,
					login: login,
					pass: pass
				}

				$.ajax({
					type: 'POST',
					data: JSON.stringify(data),
					url: jsonUrl,
					success: function(responce) {

						showMessage( 'New user with login <b>' + login + '</b> has been registered!' );
					}
				});
			}
				///////////function ajax inquiry database register form/////////

				///////////function showMessage form/////////
			function showMessage(text) {

				$message.addClass('showState');
				$message.html(text);
				_this.preloaderShow();
				clearTimeout(messageTimeOut);

				messageTimeOut = setTimeout(function() {
					$message.removeClass('showState');
					_this.preloaderHide();
				}, 5000);

			}
		},//end Login form

		filterProducts: function() {
			const resultContainer = $('.result-tabs-list');

			let _this          = this,
				$filterList    = $('.tabs-filter-list__btn'),
				jsonUrlProduct = 'https://indigo-codex-180809.firebaseio.com/products.json';

			showData( 'starters' );

			$filterList.each( function(){

				let $this = $(this),
					curentCategory = $this.data('category');

				$this.on('click', function(e){
					e.preventDefault();
					showData( curentCategory );
				});

			});

			function showData( category ) {
				let products = {};

				_this.preloaderShow();

				$filterList.each( function() {
					let $this        = $( this ),
						eachCategory = $this.data( 'category' );

					if ( eachCategory === category) {
						$this.addClass('active');
					} else {
						$this.removeClass('active');
					}
				});

				$.ajax({
					type: 'GET',
					url: jsonUrlProduct,
					data: JSON.stringify(products),
					success: function( products ) {
						let productsDB = products
						let allContent = '';

						$.each( productsDB, function(i) {

							let cardData = productsDB[i]['cardData'];
							let content = '';

							if ( cardData === category || category === 'all') {

								let card = productsDB[i];

								content = nunjucks.render('./views/filter-category.njk', card);
								allContent += content;

								resultContainer.html(allContent)
								_this.preloaderHide();

								////timeout animation show///////
								$('.result-tabs__item').each(function(index) {
									(function(that, i) {
										let t = setTimeout(function() { $(that).css("right", 0); }, 300 * i);
									})(this, index);
								});

								////timeout animation show///////
							};
						});

					}
				});
			};
		},// filterProducts

		toTopInit: function() {
			let cont   = $('.container'),
				coordUi = cont.width() + cont.offset().left,
				UiTiTop = $('.ui-to-top');

			$(window).scroll(function(){

				if ( $( this ).scrollTop() > 100 ) {
					UiTiTop.fadeIn();
				} else {
					UiTiTop.fadeOut();
				}
			});

			UiTiTop.click(function(){
				$("html, body").animate({ scrollTop: 0 }, 600);

				return false;
			});
			UiTiTop.css({
				"left": (coordUi - UiTiTop.width() + 30)
			});
		},

		extraFeaturesInit: function() {
			let pozLogo = $('.logo').offset();
			let widthLogo = $('.logo').width();

			$('.wrap-bg').css("width" ,$(window).width() - (pozLogo.left + (widthLogo / 3 * 2 )));
		},

		preloaderShow: function() {
			let preloader = document.getElementById('preloader');

			preloader.classList.add('preloader--active');
		},

		preloaderHide: function() {
			let preloader = document.getElementById('preloader');

			preloader.classList.remove('preloader--active');
		}
	}

	//main scripts init
	restarauntSiteScripts.init();

})( jQuery );




