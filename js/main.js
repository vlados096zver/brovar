$(document).ready(function() {

  $('.block__points').on('click', function() {
    $('.block__list').slideToggle();
    $(this).toggleClass('block__points--open');
  });

  $('.basket__info').on('click', function() {
    $('.basket__submenu').addClass('basket__submenu--active');
    $(this).addClass('basket__info--active');
  });

  $('#btn--order').on('click', function() {
    $('.overlay-request').addClass('overlay-active');
  });

  $('body').on('click', function(e) {
    if ($(e.target).is('.overlay-request, .overlay-close')) {
      $('.overlay-request').removeClass('overlay-active');
    }
    $('.basket__submenu').removeClass('basket__submenu--active');
    $('.basket__info').removeClass('basket__info--active');
  });

  $('.basket__info').on('click', function(e) {
    e.stopPropagation();
    $('.basket__submenu').addClass('basket__submenu--active');  });

  $('.basket__submenu').on('click', function(e) {
    e.stopPropagation();
  })

  if ($('#menu-main').length > 0) {

    let $s1 = $('#s1'),
      $s2 = $('#s2'),
      $scroll_btn = $('[data-js-scroll]'),
      scroll_position = $(window).scrollTop(),
      scroll_dir = getScrDir(), //определяем направление скрола
      scrolling = false; // происходит ли скроллинг 

    $(window).scroll((e) => {
      scroll_dir = getScrDir();
      scroll_position = $(window).scrollTop();

      let s1_offset_top = $s1.offset().top,
        s1_height = $s1.height(),
        full_offset = s1_offset_top + s1_height;

      if (scroll_dir === 'bottom' && scroll_position < full_offset && !scrolling) {
        animateScroll(full_offset);
      } else if (scroll_dir === 'top' && scroll_position < full_offset && !scrolling) {
        animateScroll(s1_offset_top);
      }
    })

    $scroll_btn.click((e) => {
      e.preventDefault();
      let $this = $(e.currentTarget),
        target = $this.data('target'),
        $target = $('[data-anchor="' + target + '"]');

      if ($target.length) {
        let target_affset_top = $target.offset().top;
        animateScroll(target_affset_top);
      }
    })

    function animateScroll(scroll_pos) {
      scrolling = true;
      $('html, body').animate({
        scrollTop: scroll_pos
      }, 500, 'swing', function() {
        scrolling = false;
      });
    }

    function getScrDir() {
      curren_position = $(window).scrollTop();

      if (curren_position > scroll_position) {
        return 'bottom';
      } else {
        return 'top';
      }
    }

  }

  function validate(input, length, regExp, error, phone) {

    $(input).on('blur keyup', function() {
      var value = $(this).val();
      var that = $(this);

      regExp = regExp == '' ? /./ : regExp;

      if (phone === true) {
        bool_reg = !regExp.test(value);
      } else {
        bool_reg = regExp.test(value);
      }

      if (value.length > length && value !== '' && bool_reg) {
        that.removeClass('form-fail').addClass('form-done');
        $(error).slideUp();
      } else {
        that.removeClass('form-done').addClass('form-fail');
        $(error).slideDown();
      }
    });

  }

  // деакцивация кнопки если есть поле с ошибкой

  function disBtn(input, btn, bool) {
    var input = $(input);
    input.on('blur keyup', function() {

      if (input.hasClass('form-fail') || bool == true) {
        $(btn).attr('disabled', 'disabled');
      } else {
        $(btn).removeAttr('disabled');
      }

    });

  }

  // для проверки при нажатии

  function valClick(input, length, regExp, error, btn, phone) {
    var value = $(input).val();

    regExp = regExp == '' ? /./ : regExp;

    if (phone === true) {
      bool_reg = regExp.test(value);
    } else {
      bool_reg = !regExp.test(value);
    }

    if (value.length < length && value === '' && bool_reg) {
      $(input).addClass('form-fail');
      $(error).slideDown();
    }
  }

  //  деакцивация кнопки при нажатии

  function disBtnClick(input, btn) {
    var input = $(input);

    if (input.hasClass('form-fail')) {
      $(btn).attr('disabled', 'disabled');
      return false;
    } else {
      return true;
    }

  }

  function validateCheck(input) {
    $(input).on('change', function() {
      var check = $(this).prop('checked');
      var that = $(this);

      if (check) {
        that.removeClass('input-fail').addClass('input-done');
      } else {
        that.removeClass('input-done').addClass('input-fail');
      }
    });
  }

  $('input[type="tel"]').mask("+38 (999) 999-99-99");

  var regName = /^[a-zA-Zа-яА-ЯёЁ]+/;
  var regPhone = /[_]/i;
  var regEmail = /.+@.+\..+/i;
  var regNumber = /^\d{1,}$/;

  validate('#с_name', 1, regName, '.contacts__fail--name');

  validate('#с_phone', 1, regPhone, '.contacts__fail--phone', true);

  disBtn('#с_name, #с_phone', '#btn--contact');

  validate('#r_name', 1, regName, '.request__fail-name');

  validate('#r_phone', 1, regPhone, '.request__fail-phone', true);

  disBtn('#r_name, #r_phone', '#btn--request');

  validate('#b_name', 1, regName, '.page-basket__fail-name');

  validate('#b_phone', 1, regPhone, '.page-basket__fail-phone', true);

  disBtn('#b_name, #b_phone', '#btn--page-basket');

  $('.basket__input').on('change, input', function() {
    $(this).val(
      $(this).val().replace(/^0|\D/, '') || 1
    );
  })

  $('.basket__input').on('focus', function() {
    $(this).data("before", $(this).val())
  })

  $('input[data-together-input]').on('change, input', function() {
    $('input[data-together-input]').val($(this).val());
  })


  $('.basket__input').on('blur', function() {
    let v = /\d+/.exec($(this).val())
    if (!v || !parseInt(v)) v = $(this).data("before")
    $(this).val(v)
    $(this).trigger('input')
  })

  function InitProduct() {

    //product

    $('.product__item').each(function(i, e) {
      e = $(e);

      let quantity = e.find('.product__count');

      var recount = new RecountProduct({
        summ: e.find('.product__price'),
        quantity: quantity,
        price: e.find('.product__count').attr('data-price'),
        fun: updateTotalSumm,
        decimalSeparator: ','
      })

      quantity.on('input', function() {
        recount.updateSumm();
      })

      e.find('.product__btn--decrement').click(function() {
        recount.update('minus');
      });

      e.find('.product__btn--increment').click(function() {
        recount.update('plus');
      });

      recount.updateSumm(false);
    });


    //basket

    $('.basket__item').each(function(i, e) {
      e = $(e);

      let quantity = e.find('.basket__input');

      var recount = new RecountProduct({
        summ: e.find('.basket__sum span'),
        quantity: quantity,
        price: e.find('.basket__input').attr('data-price'),
        fun: updateTotalSumm,
        decimalSeparator: ','
      })

      quantity.on('input', function() {
        recount.updateSumm();
      })

      e.find('.basket__arrow--decrement').click(function() {
        recount.update('minus');
      });

      e.find('.basket__arrow--increment').click(function() {
        recount.update('plus');
      });

      e.find('.basket__close').click(function() {
        e.remove();
        recount.updateSumm();
      });

      recount.updateSumm(false);
    });

    updateTotalSumm();
  }

  // summ - jq узел общей стоимости продуктов
  // quantity - jq узел количества продукта
  // price - стоимости продукта
  // after - строка, которая прибавится к общей стоимости
  // fun - функция, которая вызывается после пересчета стоимости

  function RecountProduct(param) {
    this.summ = param.summ;
    this.quantity = param.quantity;
    this.price = parseFloat(param.price);
    this.after = param.after || "";
    this.fun = param.fun;
    this.decimalSeparator = param.decimalSeparator;

    // обновления количества товара
    // action - флаг: 'plus' || 'minus'

    this.update = function(action) {
      var value = this.getQuantity();
      var together = this.quantity.data('together-input');
      console.log(together);

      if (action == 'plus') {
        value += 1;
      } else if (action == 'minus' && value != 1) {
        value -= 1;
      }

      if (together !== undefined) {
        $('[data-together-input="' + together + '"]').val(value).trigger('input');
      }

      this.quantity.val(value);
      this.updateSumm()
    }

    // обновление общей стоимости товара
    // если total == true будет запущен пересчёт общей суммы

    this.updateSumm = function(total = true) {
      var num = (this.getQuantity() * this.price).toFixed(2)
      if (this.decimalSeparator) num = num.replace('.', this.decimalSeparator)
      num = this.format(num)

      this.summ.text(num);
      if (total && typeof this.fun === "function") this.fun()
    }

    // возвращает количество товара

    this.getQuantity = function() {
      return parseInt(this.quantity.val()) || 0
    }

    this.format = function(v) {
      return String(v).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ')
    }
  }


  // Пересчёт общей суммы

  function updateTotalSumm() {
    var val = 0;

    $('.basket__sum span').each(function(i, e) {
      val += parseFloat($(e).text().replace(/ /g, "").replace(',', ".") || 0);
    })

    val = val.toFixed(2).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ')
    $('.basket__total').text(val.replace('.', ","));
  }


  InitProduct();
});
