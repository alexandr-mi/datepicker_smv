import './localisation_ru';

$(function () {


    var Datepicker = function (args) {

      //_зисвсемуголова
      var _this = this;

      this.input = $(args.input);
      this.container = $(args.container);

      this.edit = this.container.find(args.edit);
      this.editTitle = this.edit.find('.datepicker__edit_header_title');
      this.editClose = this.edit.find('.datepicker__edit_close');
      this.editMonth = this.edit.find('.datepicker__edit_month_item');
      this.editYear = this.edit.find('.datepicker__edit_years_item');


      this.currentDate = {
        month: parseInt(this.input.data().start_month),
        year: parseInt(this.input.data().start_year),
      };


      // создаем датапикер
      this.createDatepicker = function () {

        _this.range = {
          year: {
            min: this.getDateForDatepicker(_this.currentDate).year,
            max: 0
          },

          date: {
            month: this.getDateForDatepicker(_this.currentDate).month,
            week: 0
          }
        };

        if (_this.range.year.min < 0) {
          _this.range.date.month = _this.range.date.month + (_this.range.year.min * 12);
        }
        ;

        _this.datepicker = this.input.datepicker({

          gotoCurrent: true,
          // отображение примыкающих месяцев
          showOtherMonths: true,
          // Start. Кнопка отображения дата пикера
          showOn: "button",
          buttonImage: "images/icon/basket.svg",
          buttonImageOnly: true,
          buttonText: "Выбрать дату",
          // Finish. Кнопка отображения дата пикера
          // Ограничение возможности выбора года (!только календарь!)
          // rage
          yearRange: _this.range.year.min + ':' + _this.range.year.max,
          // Ограничение возможности выбора месяца/недели
          maxDate: "+0m +0w",
          minDate: _this.range.date.month + 'm',
          onChangeMonthYear: _this.onChangeMonthYear,
          beforeShow: _this.beforeShow,
        });

        $.datepicker.setDefaults($.datepicker.regional["ru"]);
      };

      this.setViewEditMenu = function () {
        _this.setViewEditMonth();
        _this.updateEditTitle();
      };


      // Вью меню изменения года
      this.setViewEditMenuYear = function () {

        // Год
        _this.editYear.each(function (index, item) {
          if (parseInt(item.dataset.year) < _this.currentDate.year) {
            $(item).addClass('datepicker__edit_years_item ui-state-disabled')
          }
        });
      };

      // Вью меню изменения месяца
      this.setViewEditMonth = function () {
        // Минимальный месяц
        var indexMinMonth = parseInt(_this.input.data().start_month);

        // Минимальный год
        var indexMinYear = parseInt(_this.input.data().start_year);
        // Максимальный месяц
        var indexMaxMonth = parseInt(new Date().getMonth());


        // Максимальный год
        var indexMaxYear = parseInt(new Date().getFullYear());

        if (indexMinYear === _this.currentDate.year) {
          _this.editMonth.removeClass('ui-state-disabled');

          _this.editMonth.each(function (index, item) {

            if (item.dataset.month < indexMinMonth) {
              $(item).addClass('ui-state-disabled')
            }

          })

        } else if (indexMaxYear === _this.currentDate.year) {

          _this.editMonth.removeClass('ui-state-disabled');
          _this.editMonth.each(function (index, item) {

            if (item.dataset.month > indexMaxMonth + 1) {
              $(item).addClass('ui-state-disabled')
            }

          })

        } else {
          _this.editMonth.removeClass('ui-state-disabled');
        }
      };


      // Получение читаемого для датапикера формата времени
      this.getDateForDatepicker = function (date) {

        var date = {
          month: -((new Date().getMonth()) - parseInt(_this.currentDate.month)) - 1,
          year: -((new Date().getFullYear()) - parseInt(_this.currentDate.year))
        };

        return date;
      };


      // Обновление датапикера
      this.refreshDatepicker = function () {
        _this.input.datepicker("option", "defaultDate", _this.getDateForDatepicker().month + 'm ' + _this.getDateForDatepicker().year + 'y');
      };

      // Эвенты
      this.eventListener = function () {

        // клик по дате в хедере календаря
        $(document).on('click', '.ui-datepicker-title', function () {

          // скрываем календарь
          _this.datepickerHide();

          // показываем меню выбора месяца/года
          _this.editShow();
        });

        // Start. Клик по выбору месяца/года
        // месяц
        _this.editMonth.on('click', function () {

          _this.editMonth.removeClass('checked');
          $(this).addClass('checked');

          _this.currentDate.month = parseInt(this.dataset.month);

          _this.setViewEditMenu()

        });

        // Год
        _this.editYear.on('click', function () {

          _this.editYear.removeClass('checked');
          $(this).addClass('checked');

          _this.currentDate.year = parseInt(this.dataset.year);

          // Обновляем тайтл
          _this.updateEditTitle();
          // Обновляем
          _this.setViewEditMenu();
        });
        // Finish. Клик по выбору месяца/года


        // Start. Переход к календарю после выбора в меню месяца/года
        var goToCalendarAfterChoise = function () {
          _this.editHide();
          _this.refreshDatepicker();
          _this.datepickerShow();
        };

        $(_this.editTitle).on('click', function () {
          _this.input.datepicker("setDate", "");
          goToCalendarAfterChoise();
        });

        $(_this.editClose).on('click', function () {
          _this.input.datepicker("setDate", "");
          goToCalendarAfterChoise();
        })
        // Finish.
      };

      // скрытие календаря
      this.datepickerHide = function () {
        this.input.datepicker("hide");
      };

      // отображение календаря
      this.datepickerShow = function () {
        this.input.datepicker("show");
      };

      // скрытие меню выбора месяца/года
      this.editHide = function () {
        this.edit.hide();
      };

      // Отображение меню выбора месяца/года
      this.editShow = function () {
        _this.edit.show();

        _this.setCurrentMonthAndYear();

        // Скрывание если клик за пределами объекта
        $(document).mouseup(function (e) { // событие клика по веб-документу
          var div = _this.edit; // тут указываем элемент
          if (!div.is(e.target) // если клик был не по нашему блоку
            && div.has(e.target).length === 0) { // и не по его дочерним элементам

            _this.edit.hide(); // скрываем его
          }
        });
      };

      // Отображение выбранного месяца/года в меню выбора
      this.setCurrentMonthAndYear = function () {
        _this.editMonth.removeClass('checked');
        _this.editYear.removeClass('checked');

        _this.editMonth.filter('[data-month = ' + _this.currentDate.month + ']').addClass('checked');
        _this.editYear.filter('[data-year = ' + _this.currentDate.year + ']').addClass('checked');
      };

      this.updateEditTitle = function () {
        var currentMonth = $.datepicker.regional["ru"].monthNames[_this.currentDate.month - 1];
        var currentYear = _this.currentDate.year;

        _this.editTitle.html(currentMonth + ' ' + currentYear);
      };
      
      
      this.beforeShow = function() {
        console.log( 'show' );  
      };

      this.init = function () {
        this.createDatepicker();
        this.setViewEditMenuYear();
        this.setViewEditMenu();
        this.refreshDatepicker();
        this.setCurrentMonthAndYear();
        this.eventListener();
      };


      this.init();
    };

    var datepicker = new Datepicker({
      input: '.datepicker__input',
      edit: '.datepicker__edit',
      container: '.datepicker__container',
    });
  }
);
