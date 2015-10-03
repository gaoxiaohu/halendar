
! function($) {

	"use strict";

	var Halendar = function(element, options) {

		this.element = $(element);
		
		this.picker = $(HGlobal.template)
						.appendTo(this.element)
						.on({click:$.proxy(this.click,this)});
		this.date = this.element.find('input').val();
		this.lang = options.lang;
		this.onClick = options.onClick;
		this.addHalendarClass();
		this.fillDaysName();
		this.fill();
		

	};

	Halendar.prototype = {
		constructor: Halendar,

		addHalendarClass: function() {
			this.element.addClass('halendar');
		},

		fillDaysName: function() {
			var l = this.lang;
			for (var i = 0; i < HGlobal.dates[l].daysMin.length; i++) this.element.find('.day-names').append(HGlobal.createDom('h2').text(HGlobal.dates[l].daysMin[i]));
		},

		fill: function() {
			if (this.date == '') {
				this.date = new Date();
			};
			var d = new Date(this.date),
			year = d.getFullYear(),
			month = d.getMonth();
			
			this.picker.find('h1')
						.text(HGlobal.dates[this.lang].months[month]+' '+year);
			this.picker.find('h1')
						.attr('date-month',HGlobal.dates['EN'].months[month]+' '+year);

			var prevMonth = new Date(year,month-1, 28,0,0,0,0),
				day = HGlobal.getDaysInMonth(prevMonth.getFullYear(),prevMonth.getMonth());
			prevMonth.setDate(day);
			prevMonth.setDate(day - (prevMonth.getDay() - 1 + 7)%7);

			var nextMonth = new Date(prevMonth);
			nextMonth.setDate(nextMonth.getDate() + 42);
			nextMonth = nextMonth.valueOf();

			var html = [];
			var clsName,
				prevY,
				prevM;
				
			while(prevMonth.valueOf() < nextMonth) {
				

				prevY = prevMonth.getFullYear();
				prevM = prevMonth.getMonth();

				if (prevM == month &&  prevY === year) {
					clsName = 'this-month';
				} else {
					clsName = '';
				}

				if (prevMonth.valueOf()  === new Date(d.toDateString()).valueOf() ) {
					clsName = ' today';
				}

				html.push('<div class="day '+clsName+'" data-date="'+prevMonth+'"><span>'+prevMonth.getDate() + '</span></div>');
				
				prevMonth.setDate(prevMonth.getDate()+1);
			}
			
			this.picker.find('.days').empty().append(html.join(''));

		},

		click: function(e) {
			e.stopPropagation();
			e.preventDefault();

			var target = $(e.target).closest('span,a');
			
			if (target.length === 1) {

				switch(target[0].nodeName.toLowerCase()) {

					case 'span':
						if (target.parent().is('.this-month')) {
							var day = target.parent().attr('data-date');

							this.element.find('input').val(HGlobal.formatDate(new Date(day)));
							this.element.find(".this-month.selected").removeClass("selected");
							target.parent().addClass('selected');
							this.onClick.call(this.element.find('input'));
							
						}

					break;
				
					case 'a':
						switch(target[0].className) {
							case 'prv-m':
								this.date = new Date(new Date(this.element.find('h1').attr('date-month')).getFullYear(), new Date(this.element.find('h1').attr('date-month')).getMonth()-1, 1, 0, 0, 0, 0);
								this.fill();
							break;
							case 'nxt-m':
							this.date = new Date(new Date(this.element.find('h1').attr('date-month')).getFullYear(), new Date(this.element.find('h1').attr('date-month')).getMonth()+1, 1, 0, 0, 0, 0);
							this.fill();
							break;
						}

				}
			};


		}



	};

	$.fn.halendar = function(option, val) {

		return this.each(function() {
			var $this = $(this),
				data = $this.data('halendar'),
				options = typeof option === 'object' && option;
				options = options || {}
				if (!data) {
					$this.data('halendar', (data = new Halendar(this, $.extend({}, $.fn.halendar.defaults,options))));
				}
				if (typeof option === 'string') data[option](val);

				//if (typeof option === 'function') option.call(this);

		});


		
		


	};

	$.fn.halendar.defaults = {
		lang:"EN",
		onClick:function(){}
		
	};

	$.fn.halendar.Constructor = Halendar;



	var HGlobal = {
		dates:{
			EN: {
				daysMin: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				
			},
			ZN: {
				daysMin: ["一", "二", "三", "四", "五", "六", "日"],
				months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月","八月","九月","十月","十一月","十二月"],
				
			}
		},
		createDom: function(dom, c) {
			return $(document.createElement(dom)).addClass(c);
		},
		isLeapYear: function (year) {
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
		},
		getDaysInMonth: function (year, month) {
			return [31, (HGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
		},
		formatDate: function(date) {
			var val = {
				d: date.getDate(),
				m: date.getMonth() + 1,
				yy: date.getFullYear().toString().substring(2),
				yyyy: date.getFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;

			return val.yyyy+'-'+val.mm+'-'+val.dd;
		},

		template: '<input type="hidden" class="data"  />'+
						'<div class="halendar-container">'+
							'<div class="halendar-pages">'+
								'<div class="header">'+
									'<a class="prv-m"><i class="fa fa-angle-left"></i></a>'+
									'<h1></h1>'+
									'<a class="nxt-m"><i class="fa fa-angle-right"></i></a>'+
									'<div class="day-names"></div>'+
								'</div>'+
								'<div class="days"></div>'+
							'</div>'+
						'</div>'

	};
	
	 
}(window.jQuery);