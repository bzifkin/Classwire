/*!
 * 
 * Angle - Bootstrap Admin App + jQuery
 * 
 * Version: 3.2.0
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 * 
 */


(function(window, document, $, undefined){

  if (typeof $ === 'undefined') { throw new Error('This application\'s JavaScript requires jQuery'); }

  $(function(){

    // Restore body classes
    // ----------------------------------- 
    var $body = $('body');
    new StateToggler().restoreState( $body );

    // enable settings toggle after restore
    $('#chk-fixed').prop('checked', $body.hasClass('layout-fixed') );
    $('#chk-collapsed').prop('checked', $body.hasClass('aside-collapsed') );
    $('#chk-boxed').prop('checked', $body.hasClass('layout-boxed') );
    $('#chk-float').prop('checked', $body.hasClass('aside-float') );
    $('#chk-hover').prop('checked', $body.hasClass('aside-hover') );

    // When ready display the offsidebar
    $('.offsidebar.hide').removeClass('hide');

  }); // doc ready


})(window, document, window.jQuery);

// Start Bootstrap JS
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    // POPOVER
    // ----------------------------------- 

    $('[data-toggle="popover"]').popover();

    // TOOLTIP
    // ----------------------------------- 

    $('[data-toggle="tooltip"]').tooltip({
      container: 'body'
    });

    // DROPDOWN INPUTS
    // ----------------------------------- 
    $('.dropdown input').on('click focus', function(event){
      event.stopPropagation();
    });

  });

})(window, document, window.jQuery);

// Custom jQuery
// ----------------------------------- 


(function(window, document, $, undefined){

  if(!$.fn.fullCalendar) return;

  // When dom ready, init calendar and events
  $(function() {

    // The element that will display the calendar
    var calendar = $('#calendar');

    var demoEvents = createDemoEvents();

    initExternalEvents(calendar);

    //initCalendar(calendar, demoEvents);
    initCalendar(calendar);

  });


  // global shared var to know what we are dragging
  var draggingEvent = null;

  /**
   * ExternalEvent object
   * @param jQuery Object elements Set of element as jQuery objects
   */
  var ExternalEvent = function (elements) {

    if (!elements) return;

    elements.each(function() {
      var $this = $(this);
      // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
      // it doesn't need to have a start or end
      var calendarEventObject = {
        title: $.trim($this.text()) // use the element's text as the event title
      };

      // store the Event Object in the DOM element so we can get to it later
      $this.data('calendarEventObject', calendarEventObject);

      // make the event draggable using jQuery UI
      $this.draggable({
        zIndex: 1070,
        revert: true, // will cause the event to go back to its
        revertDuration: 0  //  original position after the drag
      });

    });
  };

  /**
   * Invoke full calendar plugin and attach behavior
   * @param  jQuery [calElement] The calendar dom element wrapped into jQuery
   * @param  EventObject [events] An object with the event list to load when the calendar displays
   */
  function initCalendar(calElement, events) {

    // check to remove elements from the list
    var removeAfterDrop = $('#remove-after-drop');

    calElement.fullCalendar({
      // isRTL: true,
      header: {
        left:   'prev,next today',
        center: 'title',
        right:  'month,agendaWeek,agendaDay'
      },
      buttonIcons: { // note the space at the beginning
        prev:    ' fa fa-caret-left',
        next:    ' fa fa-caret-right'
      },
      buttonText: {
        today: 'today',
        month: 'month',
        week:  'week',
        day:   'day'
      },
      editable: true,
      droppable: true, // this allows things to be dropped onto the calendar
      drop: function(date, allDay) { // this function is called when something is dropped

        var $this = $(this),
        // retrieve the dropped element's stored Event Object
            originalEventObject = $this.data('calendarEventObject');

        // if something went wrong, abort
        if(!originalEventObject) return;

        // clone the object to avoid multiple events with reference to the same object
        var clonedEventObject = $.extend({}, originalEventObject);

        // assign the reported date
        clonedEventObject.start = date;
        clonedEventObject.allDay = allDay;
        clonedEventObject.backgroundColor = $this.css('background-color');
        clonedEventObject.borderColor = $this.css('border-color');

        // render the event on the calendar
        // the last `true` argument determines if the event "sticks"
        // (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
        calElement.fullCalendar('renderEvent', clonedEventObject, true);

        // if necessary remove the element from the list
        if(removeAfterDrop.is(':checked')) {
          $this.remove();
        }
      },
      eventDragStart: function (event, js, ui) {
        draggingEvent = event;
      },
      // This array is the events sources
      events: events
    });
  }

  /**
   * Inits the external events panel
   * @param  jQuery [calElement] The calendar dom element wrapped into jQuery
   */
  function initExternalEvents(calElement){
    // Panel with the external events list
    var externalEvents = $('.external-events');

    // init the external events in the panel
    new ExternalEvent(externalEvents.children('div'));

    // External event color is danger-red by default
    var currColor = '#f6504d';
    // Color selector button
    var eventAddBtn = $('.external-event-add-btn');
    // New external event name input
    var eventNameInput = $('.external-event-name');
    // Color switchers
    var eventColorSelector = $('.external-event-color-selector .circle');

    // Trash events Droparea 
    $('.external-events-trash').droppable({
      accept:       '.fc-event',
      activeClass:  'active',
      hoverClass:   'hovered',
      tolerance:    'touch',
      drop: function(event, ui) {

        // You can use this function to send an ajax request
        // to remove the event from the repository

        if(draggingEvent) {
          var eid = draggingEvent.id || draggingEvent._id;
          // Remove the event
          calElement.fullCalendar('removeEvents', eid);
          // Remove the dom element
          ui.draggable.remove();
          // clear
          draggingEvent = null;
        }
      }
    });

    eventColorSelector.click(function(e) {
      e.preventDefault();
      var $this = $(this);

      // Save color
      currColor = $this.css('background-color');
      // De-select all and select the current one
      eventColorSelector.removeClass('selected');
      $this.addClass('selected');
    });

    eventAddBtn.click(function(e) {
      e.preventDefault();

      // Get event name from input
      var val = eventNameInput.val();
      // Dont allow empty values
      if ($.trim(val) === '') return;

      // Create new event element
      var newEvent = $('<div/>').css({
        'background-color': currColor,
        'border-color':     currColor,
        'color':            '#fff'
      })
          .html(val);

      // Prepends to the external events list
      externalEvents.prepend(newEvent);
      // Initialize the new event element
      new ExternalEvent(newEvent);
      // Clear input
      eventNameInput.val('');
    });
  }

  /**
   * Creates an array of events to display in the first load of the calendar
   * Wrap into this function a request to a source to get via ajax the stored events
   * @return Array The array with the events
   */
  function createDemoEvents() {
    // Date for the calendar events (dummy data)
    var date = new Date();
    var d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear();

    return  [
      {
        title: 'All Day Event',
        start: new Date(y, m, 1),
        backgroundColor: '#f56954', //red
        borderColor: '#f56954' //red
      },
      {
        title: 'Long Event',
        start: new Date(y, m, d - 5),
        end: new Date(y, m, d - 2),
        backgroundColor: '#f39c12', //yellow
        borderColor: '#f39c12' //yellow
      },
      {
        title: 'Meeting',
        start: new Date(y, m, d, 10, 30),
        allDay: false,
        backgroundColor: '#0073b7', //Blue
        borderColor: '#0073b7' //Blue
      },
      {
        title: 'Lunch',
        start: new Date(y, m, d, 12, 0),
        end: new Date(y, m, d, 14, 0),
        allDay: false,
        backgroundColor: '#00c0ef', //Info (aqua)
        borderColor: '#00c0ef' //Info (aqua)
      },
      {
        title: 'Birthday Party',
        start: new Date(y, m, d + 1, 19, 0),
        end: new Date(y, m, d + 1, 22, 30),
        allDay: false,
        backgroundColor: '#00a65a', //Success (green)
        borderColor: '#00a65a' //Success (green)
      },
      {
        title: 'Open Google',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        url: '//google.com/',
        backgroundColor: '#3c8dbc', //Primary (light-blue)
        borderColor: '#3c8dbc' //Primary (light-blue)
      }
    ];
  }

})(window, document, window.jQuery);



// Easypie chart
// -----------------------------------

(function(window, document, $, undefined) {

  $(function() {

    if(! $.fn.easyPieChart ) return;

    var pieOptions1 = {
      animate: {
        duration: 800,
        enabled: true
      },
      barColor: APP_COLORS['success'],
      trackColor: false,
      scaleColor: false,
      lineWidth: 10,
      lineCap: 'circle'
    };
    $('#easypie1').easyPieChart(pieOptions1);

    var pieOptions2 = {
      animate: {
        duration: 800,
        enabled: true
      },
      barColor: APP_COLORS['warning'],
      trackColor: false,
      scaleColor: false,
      lineWidth: 4,
      lineCap: 'circle'
    };
    $('#easypie2').easyPieChart(pieOptions2);

    var pieOptions3 = {
      animate: {
        duration: 800,
        enabled: true
      },
      barColor: APP_COLORS['danger'],
      trackColor: false,
      scaleColor: APP_COLORS['gray'],
      lineWidth: 15,
      lineCap: 'circle'
    };
    $('#easypie3').easyPieChart(pieOptions3);

    var pieOptions4 = {
      animate: {
        duration: 800,
        enabled: true
      },
      barColor: APP_COLORS['danger'],
      trackColor: APP_COLORS['yellow'],
      scaleColor: APP_COLORS['gray-dark'],
      lineWidth: 15,
      lineCap: 'circle'
    };
    $('#easypie4').easyPieChart(pieOptions4);

  });

})(window, document, window.jQuery);
// Knob chart
// -----------------------------------

(function(window, document, $, undefined){

  $(function(){

    if(! $.fn.knob ) return;

    var knobLoaderOptions1 = {
      width: '50%', // responsive
      displayInput: true,
      fgColor: APP_COLORS['info']
    };
    $('#knob-chart1').knob(knobLoaderOptions1);

    var knobLoaderOptions2 = {
      width: '50%', // responsive
      displayInput: true,
      fgColor: APP_COLORS['purple'],
      readOnly: true
    };
    $('#knob-chart2').knob(knobLoaderOptions2);

    var knobLoaderOptions3 = {
      width: '50%', // responsive
      displayInput: true,
      fgColor: APP_COLORS['info'],
      bgColor: APP_COLORS['gray'],
      angleOffset: -125,
      angleArc: 250
    };
    $('#knob-chart3').knob(knobLoaderOptions3);

    var knobLoaderOptions4 = {
      width: '50%', // responsive
      displayInput: true,
      fgColor: APP_COLORS['pink'],
      displayPrevious: true,
      thickness: 0.1,
      lineCap: 'round'
    };
    $('#knob-chart4').knob(knobLoaderOptions4);

  });

})(window, document, window.jQuery);

// Start Bootstrap JS
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    if ( typeof Chart === 'undefined' ) return;

    // random values for demo
    var rFactor = function(){ return Math.round(Math.random()*100); };


    // Line chart
    // -----------------------------------

    var lineData = {
      labels : ['January','February','March','April','May','June','July'],
      datasets : [
        {
          label: 'My First dataset',
          fillColor : 'rgba(114,102,186,0.2)',
          strokeColor : 'rgba(114,102,186,1)',
          pointColor : 'rgba(114,102,186,1)',
          pointStrokeColor : '#fff',
          pointHighlightFill : '#fff',
          pointHighlightStroke : 'rgba(114,102,186,1)',
          data : [rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor()]
        },
        {
          label: 'My Second dataset',
          fillColor : 'rgba(35,183,229,0.2)',
          strokeColor : 'rgba(35,183,229,1)',
          pointColor : 'rgba(35,183,229,1)',
          pointStrokeColor : '#fff',
          pointHighlightFill : '#fff',
          pointHighlightStroke : 'rgba(35,183,229,1)',
          data : [rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor()]
        }
      ]
    };


    var lineOptions = {
      scaleShowGridLines : true,
      scaleGridLineColor : 'rgba(0,0,0,.05)',
      scaleGridLineWidth : 1,
      bezierCurve : true,
      bezierCurveTension : 0.4,
      pointDot : true,
      pointDotRadius : 4,
      pointDotStrokeWidth : 1,
      pointHitDetectionRadius : 20,
      datasetStroke : true,
      datasetStrokeWidth : 2,
      datasetFill: true,
      responsive: true
    };

    var linectx = document.getElementById("chartjs-linechart").getContext("2d");
    var lineChart = new Chart(linectx).Line(lineData, lineOptions);

    // Bar chart
    // -----------------------------------

    var barData = {
      labels : ['January','February','March','April','May','June','July'],
      datasets : [
        {
          fillColor : '#23b7e5',
          strokeColor : '#23b7e5',
          highlightFill: '#23b7e5',
          highlightStroke: '#23b7e5',
          data : [rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor()]
        },
        {
          fillColor : '#5d9cec',
          strokeColor : '#5d9cec',
          highlightFill : '#5d9cec',
          highlightStroke : '#5d9cec',
          data : [rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor()]
        }
      ]
    };

    var barOptions = {
      scaleBeginAtZero : true,
      scaleShowGridLines : true,
      scaleGridLineColor : 'rgba(0,0,0,.05)',
      scaleGridLineWidth : 1,
      barShowStroke : true,
      barStrokeWidth : 2,
      barValueSpacing : 5,
      barDatasetSpacing : 1,
      responsive: true
    };

    var barctx = document.getElementById("chartjs-barchart").getContext("2d");
    var barChart = new Chart(barctx).Bar(barData, barOptions);

    //  Doughnut chart
    // -----------------------------------

    var doughnutData = [
      {
        value: 300,
        color: '#7266ba',
        highlight: '#7266ba',
        label: 'Purple'
      },
      {
        value: 50,
        color: '#23b7e5',
        highlight: '#23b7e5',
        label: 'Info'
      },
      {
        value: 100,
        color: '#fad732',
        highlight: '#fad732',
        label: 'Yellow'
      }
    ];

    var doughnutOptions = {
      segmentShowStroke : true,
      segmentStrokeColor : '#fff',
      segmentStrokeWidth : 2,
      percentageInnerCutout : 85,
      animationSteps : 100,
      animationEasing : 'easeOutBounce',
      animateRotate : true,
      animateScale : false,
      responsive: true
    };

    var doughnutctx = document.getElementById("chartjs-doughnutchart").getContext("2d");
    var doughnutChart = new Chart(doughnutctx).Doughnut(doughnutData, doughnutOptions);

    // Pie chart
    // -----------------------------------

    var pieData =[
      {
        value: 300,
        color: '#7266ba',
        highlight: '#7266ba',
        label: 'Purple'
      },
      {
        value: 40,
        color: '#fad732',
        highlight: '#fad732',
        label: 'Yellow'
      },
      {
        value: 120,
        color: '#23b7e5',
        highlight: '#23b7e5',
        label: 'Info'
      }
    ];

    var pieOptions = {
      segmentShowStroke : true,
      segmentStrokeColor : '#fff',
      segmentStrokeWidth : 2,
      percentageInnerCutout : 0, // Setting this to zero convert a doughnut into a Pie
      animationSteps : 100,
      animationEasing : 'easeOutBounce',
      animateRotate : true,
      animateScale : false,
      responsive: true
    };

    var piectx = document.getElementById("chartjs-piechart").getContext("2d");
    var pieChart = new Chart(piectx).Pie(pieData, pieOptions);

    // Polar chart
    // -----------------------------------

    var polarData = [
      {
        value: 300,
        color: '#f532e5',
        highlight: '#f532e5',
        label: 'Red'
      },
      {
        value: 50,
        color: '#7266ba',
        highlight: '#7266ba',
        label: 'Green'
      },
      {
        value: 100,
        color: '#f532e5',
        highlight: '#f532e5',
        label: 'Yellow'
      },
      {
        value: 140,
        color: '#7266ba',
        highlight: '#7266ba',
        label: 'Grey'
      },
    ];

    var polarOptions = {
      scaleShowLabelBackdrop : true,
      scaleBackdropColor : 'rgba(255,255,255,0.75)',
      scaleBeginAtZero : true,
      scaleBackdropPaddingY : 1,
      scaleBackdropPaddingX : 1,
      scaleShowLine : true,
      segmentShowStroke : true,
      segmentStrokeColor : '#fff',
      segmentStrokeWidth : 2,
      animationSteps : 100,
      animationEasing : 'easeOutBounce',
      animateRotate : true,
      animateScale : false,
      responsive: true
    };

    var polarctx = document.getElementById("chartjs-polarchart").getContext("2d");
    var polarChart = new Chart(polarctx).PolarArea(polarData, polarOptions);

    // Radar chart
    // -----------------------------------

    var radarData = {
      labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
      datasets: [
        {
          label: 'My First dataset',
          fillColor: 'rgba(114,102,186,0.2)',
          strokeColor: 'rgba(114,102,186,1)',
          pointColor: 'rgba(114,102,186,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(114,102,186,1)',
          data: [65,59,90,81,56,55,40]
        },
        {
          label: 'My Second dataset',
          fillColor: 'rgba(151,187,205,0.2)',
          strokeColor: 'rgba(151,187,205,1)',
          pointColor: 'rgba(151,187,205,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(151,187,205,1)',
          data: [28,48,40,19,96,27,100]
        }
      ]
    };

    var radarOptions = {
      scaleShowLine : true,
      angleShowLineOut : true,
      scaleShowLabels : false,
      scaleBeginAtZero : true,
      angleLineColor : 'rgba(0,0,0,.1)',
      angleLineWidth : 1,
      pointLabelFontFamily : "'Arial'",
      pointLabelFontStyle : 'bold',
      pointLabelFontSize : 10,
      pointLabelFontColor : '#565656',
      pointDot : true,
      pointDotRadius : 3,
      pointDotStrokeWidth : 1,
      pointHitDetectionRadius : 20,
      datasetStroke : true,
      datasetStrokeWidth : 2,
      datasetFill : true,
      responsive: true
    };

    var radarctx = document.getElementById("chartjs-radarchart").getContext("2d");
    var radarChart = new Chart(radarctx).Radar(radarData, radarOptions);

  });

})(window, document, window.jQuery);

// Chartist
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    if ( typeof Chartist === 'undefined' ) return;

    // Bar bipolar
    // ----------------------------------- 
    var data1 = {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
      series: [
        [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
      ]
    };

    var options1 = {
      high: 10,
      low: -10,
      height: 280,
      axisX: {
        labelInterpolationFnc: function(value, index) {
          return index % 2 === 0 ? value : null;
        }
      }
    };

    new Chartist.Bar('#ct-bar1', data1, options1);

    // Bar Horizontal
    // ----------------------------------- 
    new Chartist.Bar('#ct-bar2', {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      series: [
        [5, 4, 3, 7, 5, 10, 3],
        [3, 2, 9, 5, 4, 6, 4]
      ]
    }, {
      seriesBarDistance: 10,
      reverseData: true,
      horizontalBars: true,
      height: 280,
      axisY: {
        offset: 70
      }
    });

    // Line
    // ----------------------------------- 
    new Chartist.Line('#ct-line1', {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      series: [
        [12, 9, 7, 8, 5],
        [2, 1, 3.5, 7, 3],
        [1, 3, 4, 5, 6]
      ]
    }, {
      fullWidth: true,
      height: 280,
      chartPadding: {
        right: 40
      }
    });


    // SVG Animation
    // ----------------------------------- 

    var chart1 = new Chartist.Line('#ct-line3', {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      series: [
        [1, 5, 2, 5, 4, 3],
        [2, 3, 4, 8, 1, 2],
        [5, 4, 3, 2, 1, 0.5]
      ]
    }, {
      low: 0,
      showArea: true,
      showPoint: false,
      fullWidth: true,
      height: 300
    });

    chart1.on('draw', function(data) {
      if(data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 2000 * data.index,
            dur: 2000,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      }
    });


    // Slim animation
    // ----------------------------------- 


    var chart = new Chartist.Line('#ct-line2', {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      series: [
        [12, 9, 7, 8, 5, 4, 6, 2, 3, 3, 4, 6],
        [4,  5, 3, 7, 3, 5, 5, 3, 4, 4, 5, 5],
        [5,  3, 4, 5, 6, 3, 3, 4, 5, 6, 3, 4],
        [3,  4, 5, 6, 7, 6, 4, 5, 6, 7, 6, 3]
      ]
    }, {
      low: 0,
      height: 300
    });

    // Let's put a sequence number aside so we can use it in the event callbacks
    var seq = 0,
        delays = 80,
        durations = 500;

    // Once the chart is fully created we reset the sequence
    chart.on('created', function() {
      seq = 0;
    });

    // On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
    chart.on('draw', function(data) {
      seq++;

      if(data.type === 'line') {
        // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
        data.element.animate({
          opacity: {
            // The delay when we like to start the animation
            begin: seq * delays + 1000,
            // Duration of the animation
            dur: durations,
            // The value where the animation should start
            from: 0,
            // The value where it should end
            to: 1
          }
        });
      } else if(data.type === 'label' && data.axis === 'x') {
        data.element.animate({
          y: {
            begin: seq * delays,
            dur: durations,
            from: data.y + 100,
            to: data.y,
            // We can specify an easing function from Chartist.Svg.Easing
            easing: 'easeOutQuart'
          }
        });
      } else if(data.type === 'label' && data.axis === 'y') {
        data.element.animate({
          x: {
            begin: seq * delays,
            dur: durations,
            from: data.x - 100,
            to: data.x,
            easing: 'easeOutQuart'
          }
        });
      } else if(data.type === 'point') {
        data.element.animate({
          x1: {
            begin: seq * delays,
            dur: durations,
            from: data.x - 10,
            to: data.x,
            easing: 'easeOutQuart'
          },
          x2: {
            begin: seq * delays,
            dur: durations,
            from: data.x - 10,
            to: data.x,
            easing: 'easeOutQuart'
          },
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'easeOutQuart'
          }
        });
      } else if(data.type === 'grid') {
        // Using data.axis we get x or y which we can use to construct our animation definition objects
        var pos1Animation = {
          begin: seq * delays,
          dur: durations,
          from: data[data.axis.units.pos + '1'] - 30,
          to: data[data.axis.units.pos + '1'],
          easing: 'easeOutQuart'
        };

        var pos2Animation = {
          begin: seq * delays,
          dur: durations,
          from: data[data.axis.units.pos + '2'] - 100,
          to: data[data.axis.units.pos + '2'],
          easing: 'easeOutQuart'
        };

        var animations = {};
        animations[data.axis.units.pos + '1'] = pos1Animation;
        animations[data.axis.units.pos + '2'] = pos2Animation;
        animations['opacity'] = {
          begin: seq * delays,
          dur: durations,
          from: 0,
          to: 1,
          easing: 'easeOutQuart'
        };

        data.element.animate(animations);
      }
    });

    // For the sake of the example we update the chart every time it's created with a delay of 10 seconds
    chart.on('created', function() {
      if(window.__exampleAnimateTimeout) {
        clearTimeout(window.__exampleAnimateTimeout);
        window.__exampleAnimateTimeout = null;
      }
      window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 12000);
    });


  });

})(window, document, window.jQuery);

// CLASSYLOADER
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    var $scroller       = $(window),
        inViewFlagClass = 'js-is-in-view'; // a classname to detect when a chart has been triggered after scroll

    $('[data-classyloader]').each(initClassyLoader);

    function initClassyLoader() {

      var $element = $(this),
          options  = $element.data();

      // At lease we need a data-percentage attribute
      if(options) {
        if( options.triggerInView ) {

          $scroller.scroll(function() {
            checkLoaderInVIew($element, options);
          });
          // if the element starts already in view
          checkLoaderInVIew($element, options);
        }
        else
          startLoader($element, options);
      }
    }
    function checkLoaderInVIew(element, options) {
      var offset = -20;
      if( ! element.hasClass(inViewFlagClass) &&
          $.Utils.isInView(element, {topoffset: offset}) ) {
        startLoader(element, options);
      }
    }
    function startLoader(element, options) {
      element.ClassyLoader(options).addClass(inViewFlagClass);
    }

  });

})(window, document, window.jQuery);

/**=========================================================
 * Module: clear-storage.js
 * Removes a key from the browser storage via element click
 =========================================================*/

(function($, window, document){
  'use strict';

  var Selector = '[data-reset-key]';

  $(document).on('click', Selector, function (e) {
    e.preventDefault();
    var key = $(this).data('resetKey');

    if(key) {
      $.localStorage.remove(key);
      // reload the page
      window.location.reload();
    }
    else {
      $.error('No storage key specified for reset.');
    }
  });

}(jQuery, window, document));

// Color picker
// -----------------------------------

(function(window, document, $, undefined){

  $(function(){

    if(!$.fn.colorpicker) return;

    $('.demo-colorpicker').colorpicker();

    $('#demo_selectors').colorpicker({
      colorSelectors: {
        'default': '#777777',
        'primary': APP_COLORS['primary'],
        'success': APP_COLORS['success'],
        'info':    APP_COLORS['info'],
        'warning': APP_COLORS['warning'],
        'danger':  APP_COLORS['danger']
      }
    });

  });

})(window, document, window.jQuery);

// GLOBAL CONSTANTS
// ----------------------------------- 


(function(window, document, $, undefined){

  window.APP_COLORS = {
    'primary':                '#5d9cec',
    'success':                '#27c24c',
    'info':                   '#23b7e5',
    'warning':                '#ff902b',
    'danger':                 '#f05050',
    'inverse':                '#131e26',
    'green':                  '#37bc9b',
    'pink':                   '#f532e5',
    'purple':                 '#7266ba',
    'dark':                   '#3a3f51',
    'yellow':                 '#fad732',
    'gray-darker':            '#232735',
    'gray-dark':              '#3a3f51',
    'gray':                   '#dde6e9',
    'gray-light':             '#e4eaec',
    'gray-lighter':           '#edf1f2'
  };

  window.APP_MEDIAQUERY = {
    'desktopLG':             1200,
    'desktop':                992,
    'tablet':                 768,
    'mobile':                 480
  };

})(window, document, window.jQuery);


// MARKDOWN DOCS
// ----------------------------------- 


(function(window, document, $, undefined){

  $(function(){

    $('.flatdoc').each(function(){

      Flatdoc.run({

        fetcher: Flatdoc.file('documentation/readme.md'),

        // Setup custom element selectors (markup validates)
        root:    '.flatdoc',
        menu:    '.flatdoc-menu',
        title:   '.flatdoc-title',
        content: '.flatdoc-content'

      });

    });


  });

})(window, document, window.jQuery);

// FULLSCREEN
// ----------------------------------- 

(function(window, document, $, undefined){

  if ( typeof screenfull === 'undefined' ) return;

  $(function(){

    var $doc = $(document);
    var $fsToggler = $('[data-toggle-fullscreen]');

    // Not supported under IE
    var ua = window.navigator.userAgent;
    if( ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident.*rv\:11\./) ) {
      $fsToggler.addClass('hide');
    }

    if ( ! $fsToggler.is(':visible') ) // hidden on mobiles or IE
      return;

    $fsToggler.on('click', function (e) {
      e.preventDefault();

      if (screenfull.enabled) {

        screenfull.toggle();

        // Switch icon indicator
        toggleFSIcon( $fsToggler );

      } else {
        console.log('Fullscreen not enabled');
      }
    });

    if ( screenfull.raw && screenfull.raw.fullscreenchange)
      $doc.on(screenfull.raw.fullscreenchange, function () {
        toggleFSIcon($fsToggler);
      });

    function toggleFSIcon($element) {
      if(screenfull.isFullscreen)
        $element.children('em').removeClass('fa-expand').addClass('fa-compress');
      else
        $element.children('em').removeClass('fa-compress').addClass('fa-expand');
    }

  });

})(window, document, window.jQuery);

/**=========================================================
 * Module: gmap.js
 * Init Google Map plugin
 =========================================================*/

(function($, window, document){
  'use strict';

  // -------------------------
  // Map Style definition
  // -------------------------

  // Custom core styles
  // Get more styles from http://snazzymaps.com/style/29/light-monochrome
  // - Just replace and assign to 'MapStyles' the new style array
  var MapStyles = [{featureType:'water',stylers:[{visibility:'on'},{color:'#bdd1f9'}]},{featureType:'all',elementType:'labels.text.fill',stylers:[{color:'#334165'}]},{featureType:'landscape',stylers:[{color:'#e9ebf1'}]},{featureType:'road.highway',elementType:'geometry',stylers:[{color:'#c5c6c6'}]},{featureType:'road.arterial',elementType:'geometry',stylers:[{color:'#fff'}]},{featureType:'road.local',elementType:'geometry',stylers:[{color:'#fff'}]},{featureType:'transit',elementType:'geometry',stylers:[{color:'#d8dbe0'}]},{featureType:'poi',elementType:'geometry',stylers:[{color:'#cfd5e0'}]},{featureType:'administrative',stylers:[{visibility:'on'},{lightness:33}]},{featureType:'poi.park',elementType:'labels',stylers:[{visibility:'on'},{lightness:20}]},{featureType:'road',stylers:[{color:'#d8dbe0',lightness:20}]}];


  // -------------------------
  // Custom Script
  // -------------------------

  var mapSelector = '[data-gmap]';

  if($.fn.gMap) {
    var gMapRefs = [];

    $(mapSelector).each(function(){

      var $this   = $(this),
          addresses = $this.data('address') && $this.data('address').split(';'),
          titles    = $this.data('title') && $this.data('title').split(';'),
          zoom      = $this.data('zoom') || 14,
          maptype   = $this.data('maptype') || 'ROADMAP', // or 'TERRAIN'
          markers   = [];

      if(addresses) {
        for(var a in addresses)  {
          if(typeof addresses[a] == 'string') {
            markers.push({
              address:  addresses[a],
              html:     (titles && titles[a]) || '',
              popup:    true   /* Always popup */
            });
          }
        }

        var options = {
          controls: {
            panControl:         true,
            zoomControl:        true,
            mapTypeControl:     true,
            scaleControl:       true,
            streetViewControl:  true,
            overviewMapControl: true
          },
          scrollwheel: false,
          maptype: maptype,
          markers: markers,
          zoom: zoom
          // More options https://github.com/marioestrada/jQuery-gMap
        };

        var gMap = $this.gMap(options);

        var ref = gMap.data('gMap.reference');
        // save in the map references list
        gMapRefs.push(ref);

        // set the styles
        if($this.data('styled') !== undefined) {

          ref.setOptions({
            styles: MapStyles
          });

        }
      }

    }); //each
  }

}(jQuery, window, document));

/**=========================================================
 * Module: Image Cropper
 =========================================================*/

(function(window, document, $, undefined) {

  $(function() {

    if(! $.fn.cropper ) return;

    var $image = $('.img-container > img'),
        $dataX = $('#dataX'),
        $dataY = $('#dataY'),
        $dataHeight = $('#dataHeight'),
        $dataWidth = $('#dataWidth'),
        $dataRotate = $('#dataRotate'),
        options = {
          // data: {
          //   x: 420,
          //   y: 60,
          //   width: 640,
          //   height: 360
          // },
          // strict: false,
          // responsive: false,
          // checkImageOrigin: false

          // modal: false,
          // guides: false,
          // highlight: false,
          // background: false,

          // autoCrop: false,
          // autoCropArea: 0.5,
          // dragCrop: false,
          // movable: false,
          // rotatable: false,
          // zoomable: false,
          // touchDragZoom: false,
          // mouseWheelZoom: false,
          // cropBoxMovable: false,
          // cropBoxResizable: false,
          // doubleClickToggle: false,

          // minCanvasWidth: 320,
          // minCanvasHeight: 180,
          // minCropBoxWidth: 160,
          // minCropBoxHeight: 90,
          // minContainerWidth: 320,
          // minContainerHeight: 180,

          // build: null,
          // built: null,
          // dragstart: null,
          // dragmove: null,
          // dragend: null,
          // zoomin: null,
          // zoomout: null,

          aspectRatio: 16 / 9,
          preview: '.img-preview',
          crop: function(data) {
            $dataX.val(Math.round(data.x));
            $dataY.val(Math.round(data.y));
            $dataHeight.val(Math.round(data.height));
            $dataWidth.val(Math.round(data.width));
            $dataRotate.val(Math.round(data.rotate));
          }
        };

    $image.on({
      'build.cropper': function(e) {
        console.log(e.type);
      },
      'built.cropper': function(e) {
        console.log(e.type);
      },
      'dragstart.cropper': function(e) {
        console.log(e.type, e.dragType);
      },
      'dragmove.cropper': function(e) {
        console.log(e.type, e.dragType);
      },
      'dragend.cropper': function(e) {
        console.log(e.type, e.dragType);
      },
      'zoomin.cropper': function(e) {
        console.log(e.type);
      },
      'zoomout.cropper': function(e) {
        console.log(e.type);
      },
      'change.cropper': function(e) {
        console.log(e.type);
      }
    }).cropper(options);


    // Methods
    $(document.body).on('click', '[data-method]', function() {
      var data = $(this).data(),
          $target,
          result;

      if (!$image.data('cropper')) {
        return;
      }

      if (data.method) {
        data = $.extend({}, data); // Clone a new one

        if (typeof data.target !== 'undefined') {
          $target = $(data.target);

          if (typeof data.option === 'undefined') {
            try {
              data.option = JSON.parse($target.val());
            } catch (e) {
              console.log(e.message);
            }
          }
        }

        result = $image.cropper(data.method, data.option);

        if (data.method === 'getCroppedCanvas') {
          $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);
        }

        if ($.isPlainObject(result) && $target) {
          try {
            $target.val(JSON.stringify(result));
          } catch (e) {
            console.log(e.message);
          }
        }

      }
    }).on('keydown', function(e) {

      if (!$image.data('cropper')) {
        return;
      }

      switch (e.which) {
        case 37:
          e.preventDefault();
          $image.cropper('move', -1, 0);
          break;

        case 38:
          e.preventDefault();
          $image.cropper('move', 0, -1);
          break;

        case 39:
          e.preventDefault();
          $image.cropper('move', 1, 0);
          break;

        case 40:
          e.preventDefault();
          $image.cropper('move', 0, 1);
          break;
      }

    });


    // Import image
    var $inputImage = $('#inputImage'),
        URL = window.URL || window.webkitURL,
        blobURL;

    if (URL) {
      $inputImage.change(function() {
        var files = this.files,
            file;

        if (!$image.data('cropper')) {
          return;
        }

        if (files && files.length) {
          file = files[0];

          if (/^image\/\w+$/.test(file.type)) {
            blobURL = URL.createObjectURL(file);
            $image.one('built.cropper', function() {
              URL.revokeObjectURL(blobURL); // Revoke when load complete
            }).cropper('reset').cropper('replace', blobURL);
            $inputImage.val('');
          } else {
            alert('Please choose an image file.');
          }
        }
      });
    } else {
      $inputImage.parent().remove();
    }


    // Options
    $('.docs-options :checkbox').on('change', function() {
      var $this = $(this);

      if (!$image.data('cropper')) {
        return;
      }

      options[$this.val()] = $this.prop('checked');
      $image.cropper('destroy').cropper(options);
    });


    // Tooltips
    $('[data-toggle="tooltip"]').tooltip();

  });

})(window, document, window.jQuery);
// LOAD CUSTOM CSS
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    $('[data-load-css]').on('click', function (e) {

      var element = $(this);

      if(element.is('a'))
        e.preventDefault();

      var uri = element.data('loadCss'),
          link;

      if(uri) {
        link = createLink(uri);
        if ( !link ) {
          $.error('Error creating stylesheet link element.');
        }
      }
      else {
        $.error('No stylesheet location defined.');
      }

    });
  });

  function createLink(uri) {
    var linkId = 'autoloaded-stylesheet',
        oldLink = $('#'+linkId).attr('id', linkId + '-old');

    $('head').append($('<link/>').attr({
      'id':   linkId,
      'rel':  'stylesheet',
      'href': uri
    }));

    if( oldLink.length ) {
      oldLink.remove();
    }

    return $('#'+linkId);
  }


})(window, document, window.jQuery);

// TRANSLATION
// ----------------------------------- 

(function(window, document, $, undefined){

  var preferredLang = 'en';
  var pathPrefix    = 'i18n'; // folder of json files
  var packName      = 'site';
  var storageKey    = 'jq-appLang';

  $(function(){

    if ( ! $.fn.localize ) return;

    // detect saved language or use default
    var currLang = $.localStorage.get(storageKey) || preferredLang;
    // set initial options
    var opts = {
      language: currLang,
      pathPrefix: pathPrefix,
      callback: function(data, defaultCallback){
        $.localStorage.set(storageKey, currLang); // save the language
        defaultCallback(data);
      }
    };

    // Set initial language
    setLanguage(opts);

    // Listen for changes
    $('[data-set-lang]').on('click', function(){

      currLang = $(this).data('setLang');

      if ( currLang ) {

        opts.language = currLang;

        setLanguage(opts);

        activateDropdown($(this));
      }

    });


    function setLanguage(options) {
      $("[data-localize]").localize(packName, options);
    }

    // Set the current clicked text as the active dropdown text
    function activateDropdown(elem) {
      var menu = elem.parents('.dropdown-menu');
      if ( menu.length ) {
        var toggle = menu.prev('button, a');
        toggle.text ( elem.text() );
      }
    }

  });

})(window, document, window.jQuery);

// JVECTOR MAP 
// ----------------------------------- 

(function(window, document, $, undefined){

  window.defaultColors = {
    markerColor:  '#23b7e5',      // the marker points
    bgColor:      'transparent',      // the background
    scaleColors:  ['#878c9a'],    // the color of the region in the serie
    regionFill:   '#bbbec6'       // the base region color
  };

  window.VectorMap = function(element, seriesData, markersData) {

    if ( ! element || !element.length) return;

    var attrs       = element.data(),
        mapHeight   = attrs.height || '300',
        options     = {
          markerColor:  attrs.markerColor  || defaultColors.markerColor,
          bgColor:      attrs.bgColor      || defaultColors.bgColor,
          scale:        attrs.scale        || 1,
          scaleColors:  attrs.scaleColors  || defaultColors.scaleColors,
          regionFill:   attrs.regionFill   || defaultColors.regionFill,
          mapName:      attrs.mapName      || 'world_mill_en'
        };

    element.css('height', mapHeight);

    init( element , options, seriesData, markersData);

    function init($element, opts, series, markers) {

      $element.vectorMap({
        map:             opts.mapName,
        backgroundColor: opts.bgColor,
        zoomMin:         1,
        zoomMax:         8,
        zoomOnScroll:    false,
        regionStyle: {
          initial: {
            'fill':           opts.regionFill,
            'fill-opacity':   1,
            'stroke':         'none',
            'stroke-width':   1.5,
            'stroke-opacity': 1
          },
          hover: {
            'fill-opacity': 0.8
          },
          selected: {
            fill: 'blue'
          },
          selectedHover: {
          }
        },
        focusOn:{ x:0.4, y:0.6, scale: opts.scale},
        markerStyle: {
          initial: {
            fill: opts.markerColor,
            stroke: opts.markerColor
          }
        },
        onRegionLabelShow: function(e, el, code) {
          if ( series && series[code] )
            el.html(el.html() + ': ' + series[code] + ' visitors');
        },
        markers: markers,
        series: {
          regions: [{
            values: series,
            scale: opts.scaleColors,
            normalizeFunction: 'polynomial'
          }]
        },
      });

    }// end init
  };

})(window, document, window.jQuery);

// Morris
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    if ( typeof Morris === 'undefined' ) return;

    var chartdata = [
      { y: "2006", a: 100, b: 90 },
      { y: "2007", a: 75,  b: 65 },
      { y: "2008", a: 50,  b: 40 },
      { y: "2009", a: 75,  b: 65 },
      { y: "2010", a: 50,  b: 40 },
      { y: "2011", a: 75,  b: 65 },
      { y: "2012", a: 100, b: 90 }
    ];

    var donutdata = [
      {label: "Download Sales", value: 12},
      {label: "In-Store Sales",value: 30},
      {label: "Mail-Order Sales", value: 20}
    ];

    // Line Chart
    // ----------------------------------- 

    new Morris.Line({
      element: 'morris-line',
      data: chartdata,
      xkey: 'y',
      ykeys: ["a", "b"],
      labels: ["Serie A", "Serie B"],
      lineColors: ["#31C0BE", "#7a92a3"],
      resize: true
    });

    // Donut Chart
    // ----------------------------------- 
    new Morris.Donut({
      element: 'morris-donut',
      data: donutdata,
      colors: [ '#f05050', '#fad732', '#ff902b' ],
      resize: true
    });

    // Bar Chart
    // ----------------------------------- 
    new Morris.Bar({
      element: 'morris-bar',
      data: chartdata,
      xkey: 'y',
      ykeys: ["a", "b"],
      labels: ["Series A", "Series B"],
      xLabelMargin: 2,
      barColors: [ '#23b7e5', '#f05050' ],
      resize: true
    });

    // Area Chart
    // ----------------------------------- 
    new Morris.Area({
      element: 'morris-area',
      data: chartdata,
      xkey: 'y',
      ykeys: ["a", "b"],
      labels: ["Serie A", "Serie B"],
      lineColors: [ '#7266ba', '#23b7e5' ],
      resize: true
    });

  });

})(window, document, window.jQuery);

// NAVBAR SEARCH
// ----------------------------------- 


(function(window, document, $, undefined){

  $(function(){

    var navSearch = new navbarSearchInput();

    // Open search input 
    var $searchOpen = $('[data-search-open]');

    $searchOpen
        .on('click', function (e) { e.stopPropagation(); })
        .on('click', navSearch.toggle);

    // Close search input
    var $searchDismiss = $('[data-search-dismiss]');
    var inputSelector = '.navbar-form input[type="text"]';

    $(inputSelector)
        .on('click', function (e) { e.stopPropagation(); })
        .on('keyup', function(e) {
          if (e.keyCode == 27) // ESC
            navSearch.dismiss();
        });

    // click anywhere closes the search
    $(document).on('click', navSearch.dismiss);
    // dismissable options
    $searchDismiss
        .on('click', function (e) { e.stopPropagation(); })
        .on('click', navSearch.dismiss);

  });

  var navbarSearchInput = function() {
    var navbarFormSelector = 'form.navbar-form';
    return {
      toggle: function() {

        var navbarForm = $(navbarFormSelector);

        navbarForm.toggleClass('open');

        var isOpen = navbarForm.hasClass('open');

        navbarForm.find('input')[isOpen ? 'focus' : 'blur']();

      },

      dismiss: function() {
        $(navbarFormSelector)
            .removeClass('open')      // Close control
            .find('input[type="text"]').blur() // remove focus
            .val('')                    // Empty input
        ;
      }
    };

  }

})(window, document, window.jQuery);
/**=========================================================
 * Module: notify.js
 * Create toggleable notifications that fade out automatically.
 * Based on Notify addon from UIKit (http://getuikit.com/docs/addons_notify.html)
 * [data-toggle="notify"]
 * [data-options="options in json format" ]
 =========================================================*/

(function($, window, document){
  'use strict';

  var Selector = '[data-notify]',
      autoloadSelector = '[data-onload]',
      doc = $(document);


  $(function() {

    $(Selector).each(function(){

      var $this  = $(this),
          onload = $this.data('onload');

      if(onload !== undefined) {
        setTimeout(function(){
          notifyNow($this);
        }, 800);
      }

      $this.on('click', function (e) {
        e.preventDefault();
        notifyNow($this);
      });

    });

  });

  function notifyNow($element) {
    var message = $element.data('message'),
        options = $element.data('options');

    if(!message)
      $.error('Notify: No message specified');

    $.notify(message, options || {});
  }


}(jQuery, window, document));


/**
 * Notify Addon definition as jQuery plugin
 * Adapted version to work with Bootstrap classes
 * More information http://getuikit.com/docs/addons_notify.html
 */

(function($, window, document){

  var containers = {},
      messages   = {},

      notify     =  function(options){

        if ($.type(options) == 'string') {
          options = { message: options };
        }

        if (arguments[1]) {
          options = $.extend(options, $.type(arguments[1]) == 'string' ? {status:arguments[1]} : arguments[1]);
        }

        return (new Message(options)).show();
      },
      closeAll  = function(group, instantly){
        if(group) {
          for(var id in messages) { if(group===messages[id].group) messages[id].close(instantly); }
        } else {
          for(var id in messages) { messages[id].close(instantly); }
        }
      };

  var Message = function(options){

    var $this = this;

    this.options = $.extend({}, Message.defaults, options);

    this.uuid    = "ID"+(new Date().getTime())+"RAND"+(Math.ceil(Math.random() * 100000));
    this.element = $([
      // alert-dismissable enables bs close icon
      '<div class="uk-notify-message alert-dismissable">',
      '<a class="close">&times;</a>',
      '<div>'+this.options.message+'</div>',
      '</div>'

    ].join('')).data("notifyMessage", this);

    // status
    if (this.options.status) {
      this.element.addClass('alert alert-'+this.options.status);
      this.currentstatus = this.options.status;
    }

    this.group = this.options.group;

    messages[this.uuid] = this;

    if(!containers[this.options.pos]) {
      containers[this.options.pos] = $('<div class="uk-notify uk-notify-'+this.options.pos+'"></div>').appendTo('body').on("click", ".uk-notify-message", function(){
        $(this).data("notifyMessage").close();
      });
    }
  };


  $.extend(Message.prototype, {

    uuid: false,
    element: false,
    timout: false,
    currentstatus: "",
    group: false,

    show: function() {

      if (this.element.is(":visible")) return;

      var $this = this;

      containers[this.options.pos].show().prepend(this.element);

      var marginbottom = parseInt(this.element.css("margin-bottom"), 10);

      this.element.css({"opacity":0, "margin-top": -1*this.element.outerHeight(), "margin-bottom":0}).animate({"opacity":1, "margin-top": 0, "margin-bottom":marginbottom}, function(){

        if ($this.options.timeout) {

          var closefn = function(){ $this.close(); };

          $this.timeout = setTimeout(closefn, $this.options.timeout);

          $this.element.hover(
              function() { clearTimeout($this.timeout); },
              function() { $this.timeout = setTimeout(closefn, $this.options.timeout);  }
          );
        }

      });

      return this;
    },

    close: function(instantly) {

      var $this    = this,
          finalize = function(){
            $this.element.remove();

            if(!containers[$this.options.pos].children().length) {
              containers[$this.options.pos].hide();
            }

            delete messages[$this.uuid];
          };

      if(this.timeout) clearTimeout(this.timeout);

      if(instantly) {
        finalize();
      } else {
        this.element.animate({"opacity":0, "margin-top": -1* this.element.outerHeight(), "margin-bottom":0}, function(){
          finalize();
        });
      }
    },

    content: function(html){

      var container = this.element.find(">div");

      if(!html) {
        return container.html();
      }

      container.html(html);

      return this;
    },

    status: function(status) {

      if(!status) {
        return this.currentstatus;
      }

      this.element.removeClass('alert alert-'+this.currentstatus).addClass('alert alert-'+status);

      this.currentstatus = status;

      return this;
    }
  });

  Message.defaults = {
    message: "",
    status: "normal",
    timeout: 5000,
    group: null,
    pos: 'top-center'
  };


  $["notify"]          = notify;
  $["notify"].message  = Message;
  $["notify"].closeAll = closeAll;

  return notify;

}(jQuery, window, document));

// NOW TIMER
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    $('[data-now]').each(function(){
      var element = $(this),
          format = element.data('format');

      function updateTime() {
        var dt = moment( new Date() ).format(format);
        element.text(dt);
      }

      updateTime();
      setInterval(updateTime, 1000);

    });
  });

})(window, document, window.jQuery);

/**=========================================================
 * Module: panel-tools.js
 * Dismiss panels
 * [data-tool="panel-dismiss"]
 *
 * Requires animo.js
 =========================================================*/
(function($, window, document){
  'use strict';

  var panelSelector = '[data-tool="panel-dismiss"]',
      removeEvent   = 'panel.remove',
      removedEvent  = 'panel.removed';

  $(document).on('click', panelSelector, function () {

    // find the first parent panel
    var parent = $(this).closest('.panel');
    var deferred = new $.Deferred();

    // Trigger the event and finally remove the element
    parent.trigger(removeEvent, [parent, deferred]);
    // needs resolve() to be called
    deferred.done(removeElement);

    function removeElement() {
      if($.support.animation) {
        parent.animo({animation: 'bounceOut'}, destroyPanel);
      }
      else destroyPanel();
    }

    function destroyPanel() {
      var col = parent.parent();

      $.when(parent.trigger(removedEvent, [parent]))
          .done(function(){
            parent.remove();
            // remove the parent if it is a row and is empty and not a sortable (portlet)
            col
                .trigger(removedEvent) // An event to catch when the panel has been removed from DOM
                .filter(function() {
                  var el = $(this);
                  return (el.is('[class*="col-"]:not(.sortable)') && el.children('*').length === 0);
                }).remove();
          });



    }

  });

}(jQuery, window, document));


/**
 * Collapse panels
 * [data-tool="panel-collapse"]
 *
 * Also uses browser storage to keep track
 * of panels collapsed state
 */
(function($, window, document) {
  'use strict';
  var panelSelector = '[data-tool="panel-collapse"]',
      storageKeyName = 'jq-panelState';

  // Prepare the panel to be collapsable and its events
  $(panelSelector).each(function() {
    // find the first parent panel
    var $this        = $(this),
        parent       = $this.closest('.panel'),
        wrapper      = parent.find('.panel-wrapper'),
        collapseOpts = {toggle: false},
        iconElement  = $this.children('em'),
        panelId      = parent.attr('id');

    // if wrapper not added, add it
    // we need a wrapper to avoid jumping due to the paddings
    if( ! wrapper.length) {
      wrapper =
          parent.children('.panel-heading').nextAll() //find('.panel-body, .panel-footer')
              .wrapAll('<div/>')
              .parent()
              .addClass('panel-wrapper');
      collapseOpts = {};
    }

    // Init collapse and bind events to switch icons
    wrapper
        .collapse(collapseOpts)
        .on('hide.bs.collapse', function() {
          setIconHide( iconElement );
          savePanelState( panelId, 'hide' );
          wrapper.prev('.panel-heading').addClass('panel-heading-collapsed');
        })
        .on('show.bs.collapse', function() {
          setIconShow( iconElement );
          savePanelState( panelId, 'show' );
          wrapper.prev('.panel-heading').removeClass('panel-heading-collapsed');
        });

    // Load the saved state if exists
    var currentState = loadPanelState( panelId );
    if(currentState) {
      setTimeout(function() { wrapper.collapse( currentState ); }, 0);
      savePanelState( panelId, currentState );
    }

  });

  // finally catch clicks to toggle panel collapse
  $(document).on('click', panelSelector, function () {

    var parent = $(this).closest('.panel');
    var wrapper = parent.find('.panel-wrapper');

    wrapper.collapse('toggle');

  });

  /////////////////////////////////////////////
  // Common use functions for panel collapse //
  /////////////////////////////////////////////
  function setIconShow(iconEl) {
    iconEl.removeClass('fa-plus').addClass('fa-minus');
  }

  function setIconHide(iconEl) {
    iconEl.removeClass('fa-minus').addClass('fa-plus');
  }

  function savePanelState(id, state) {
    var data = $.localStorage.get(storageKeyName);
    if(!data) { data = {}; }
    data[id] = state;
    $.localStorage.set(storageKeyName, data);
  }

  function loadPanelState(id) {
    var data = $.localStorage.get(storageKeyName);
    if(data) {
      return data[id] || false;
    }
  }


}(jQuery, window, document));


/**
 * Refresh panels
 * [data-tool="panel-refresh"]
 * [data-spinner="standard"]
 */
(function($, window, document){
  'use strict';
  var panelSelector  = '[data-tool="panel-refresh"]',
      refreshEvent   = 'panel.refresh',
      whirlClass     = 'whirl',
      defaultSpinner = 'standard';

  // method to clear the spinner when done
  function removeSpinner(){
    this.removeClass(whirlClass);
  }

  // catch clicks to toggle panel refresh
  $(document).on('click', panelSelector, function () {
    var $this   = $(this),
        panel   = $this.parents('.panel').eq(0),
        spinner = $this.data('spinner') || defaultSpinner
        ;

    // start showing the spinner
    panel.addClass(whirlClass + ' ' + spinner);

    // attach as public method
    panel.removeSpinner = removeSpinner;

    // Trigger the event and send the panel object
    $this.trigger(refreshEvent, [panel]);

  });


}(jQuery, window, document));

/**=========================================================
 * Module: play-animation.js
 * Provides a simple way to run animation with a trigger
 * Targeted elements must have
 *   [data-animate"]
 *   [data-target="Target element affected by the animation"]
 *   [data-play="Animation name (http://daneden.github.io/animate.css/)"]
 *
 * Requires animo.js
 =========================================================*/

(function($, window, document){
  'use strict';

  var Selector = '[data-animate]';

  $(function() {

    var $scroller = $(window).add('body, .wrapper');

    // Parse animations params and attach trigger to scroll
    $(Selector).each(function() {
      var $this     = $(this),
          offset    = $this.data('offset'),
          delay     = $this.data('delay')     || 100, // milliseconds
          animation = $this.data('play')      || 'bounce';

      if(typeof offset !== 'undefined') {

        // test if the element starts visible
        testAnimation($this);
        // test on scroll
        $scroller.scroll(function(){
          testAnimation($this);
        });

      }

      // Test an element visibilty and trigger the given animation
      function testAnimation(element) {
        if ( !element.hasClass('anim-running') &&
            $.Utils.isInView(element, {topoffset: offset})) {
          element
              .addClass('anim-running');

          setTimeout(function() {
            element
                .addClass('anim-done')
                .animo( { animation: animation, duration: 0.7} );
          }, delay);

        }
      }

    });

    // Run click triggered animations
    $(document).on('click', Selector, function() {

      var $this     = $(this),
          targetSel = $this.data('target'),
          animation = $this.data('play') || 'bounce',
          target    = $(targetSel);

      if(target && target.length) {
        target.animo( { animation: animation } );
      }

    });

  });

}(jQuery, window, document));

/**=========================================================
 * Module: portlet.js
 * Drag and drop any panel to change its position
 * The Selector should could be applied to any object that contains
 * panel, so .col-* element are ideal.
 =========================================================*/

(function($, window, document){
  'use strict';

  // Component is optional
  if(!$.fn.sortable) return;

  var Selector = '[data-toggle="portlet"]',
      storageKeyName = 'jq-portletState';

  $(function(){

    $( Selector ).sortable({
      connectWith:          Selector,
      items:                'div.panel',
      handle:               '.portlet-handler',
      opacity:              0.7,
      placeholder:          'portlet box-placeholder',
      cancel:               '.portlet-cancel',
      forcePlaceholderSize: true,
      iframeFix:            false,
      tolerance:            'pointer',
      helper:               'original',
      revert:               200,
      forceHelperSize:      true,
      update:               savePortletOrder,
      create:               loadPortletOrder
    })
      // optionally disables mouse selection
      //.disableSelection()
    ;

  });

  function savePortletOrder(event, ui) {

    var data = $.localStorage.get(storageKeyName);

    if(!data) { data = {}; }

    data[this.id] = $(this).sortable('toArray');

    if(data) {
      $.localStorage.set(storageKeyName, data);
    }

  }

  function loadPortletOrder() {

    var data = $.localStorage.get(storageKeyName);

    if(data) {

      var porletId = this.id,
          panels   = data[porletId];

      if(panels) {
        var portlet = $('#'+porletId);

        $.each(panels, function(index, value) {
          $('#'+value).appendTo(portlet);
        });
      }

    }

  }

}(jQuery, window, document));


// Rickshaw
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    if ( typeof Rickshaw === 'undefined' ) return;

    var seriesData = [ [], [], [] ];
    var random = new Rickshaw.Fixtures.RandomData(150);

    for (var i = 0; i < 150; i++) {
      random.addData(seriesData);
    }

    var series1 = [
      {
        color: "#c05020",
        data: seriesData[0],
        name: 'New York'
      }, {
        color: "#30c020",
        data: seriesData[1],
        name: 'London'
      }, {
        color: "#6060c0",
        data: seriesData[2],
        name: 'Tokyo'
      }
    ];

    var graph1 = new Rickshaw.Graph( {
      element: document.querySelector("#rickshaw1"),
      series:series1,
      renderer: 'area'
    });

    graph1.render();


    // Graph 2
    // ----------------------------------- 

    var graph2 = new Rickshaw.Graph( {
      element: document.querySelector("#rickshaw2"),
      renderer: 'area',
      stroke: true,
      series: [ {
        data: [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 30 }, { x: 4, y: 32 } ],
        color: '#f05050'
      }, {
        data: [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 30 }, { x: 4, y: 32 } ],
        color: '#fad732'
      } ]
    } );

    graph2.render();

    // Graph 3
    // ----------------------------------- 


    var graph3 = new Rickshaw.Graph({
      element: document.querySelector("#rickshaw3"),
      renderer: 'line',
      series: [{
        data: [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 30 }, { x: 4, y: 32 } ],
        color: '#7266ba'
      }, {
        data: [ { x: 0, y: 20 }, { x: 1, y: 24 }, { x: 2, y: 19 }, { x: 3, y: 15 }, { x: 4, y: 16 } ],
        color: '#23b7e5'
      }]
    });
    graph3.render();


    // Graph 4
    // ----------------------------------- 


    var graph4 = new Rickshaw.Graph( {
      element: document.querySelector("#rickshaw4"),
      renderer: 'bar',
      series: [
        {
          data: [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 30 }, { x: 4, y: 32 } ],
          color: '#fad732'
        }, {
          data: [ { x: 0, y: 20 }, { x: 1, y: 24 }, { x: 2, y: 19 }, { x: 3, y: 15 }, { x: 4, y: 16 } ],
          color: '#ff902b'

        } ]
    } );
    graph4.render();


  });

})(window, document, window.jQuery);

// Select2
// -----------------------------------

(function(window, document, $, undefined){

  $(function(){

    if ( !$.fn.select2 ) return;

    // Select 2

    $('#select2-1').select2({
      theme: 'bootstrap'
    });
    $('#select2-2').select2({
      theme: 'bootstrap'
    });
    $('#select2-3').select2({
      theme: 'bootstrap'
    });
    $('#select2-4').select2({
      placeholder: 'Select a state',
      allowClear: true,
      theme: 'bootstrap'
    });

  });

})(window, document, window.jQuery);


// SIDEBAR
// ----------------------------------- 


(function(window, document, $, undefined){

  var $win;
  var $html;
  var $body;
  var $sidebar;
  var mq;

  $(function(){

    $win     = $(window);
    $html    = $('html');
    $body    = $('body');
    $sidebar = $('.sidebar');
    mq       = APP_MEDIAQUERY;

    // AUTOCOLLAPSE ITEMS 
    // ----------------------------------- 

    var sidebarCollapse = $sidebar.find('.collapse');
    sidebarCollapse.on('show.bs.collapse', function(event){

      event.stopPropagation();
      if ( $(this).parents('.collapse').length === 0 )
        sidebarCollapse.filter('.in').collapse('hide');

    });

    // SIDEBAR ACTIVE STATE 
    // ----------------------------------- 

    // Find current active item
    var currentItem = $('.sidebar .active').parents('li');

    // hover mode don't try to expand active collapse
    if ( ! useAsideHover() )
      currentItem
          .addClass('active')     // activate the parent
          .children('.collapse')  // find the collapse
          .collapse('show');      // and show it

    // remove this if you use only collapsible sidebar items
    $sidebar.find('li > a + ul').on('show.bs.collapse', function (e) {
      if( useAsideHover() ) e.preventDefault();
    });

    // SIDEBAR COLLAPSED ITEM HANDLER
    // ----------------------------------- 


    var eventName = isTouch() ? 'click' : 'mouseenter' ;
    var subNav = $();
    $sidebar.on( eventName, '.nav > li', function() {

      if( isSidebarCollapsed() || useAsideHover() ) {

        subNav.trigger('mouseleave');
        subNav = toggleMenuItem( $(this) );

        // Used to detect click and touch events outside the sidebar          
        sidebarAddBackdrop();
      }

    });

    var sidebarAnyclickClose = $sidebar.data('sidebarAnyclickClose');

    // Allows to close
    if ( typeof sidebarAnyclickClose !== 'undefined' ) {

      $('.wrapper').on('click.sidebar', function(e){
        // don't check if sidebar not visible
        if( ! $body.hasClass('aside-toggled')) return;

        var $target = $(e.target);
        if( ! $target.parents('.aside').length && // if not child of sidebar
            ! $target.is('#user-block-toggle') && // user block toggle anchor
            ! $target.parent().is('#user-block-toggle') // user block toggle icon
        ) {
          $body.removeClass('aside-toggled');
        }

      });
    }

  });

  function sidebarAddBackdrop() {
    var $backdrop = $('<div/>', { 'class': 'dropdown-backdrop'} );
    $backdrop.insertAfter('.aside').on("click mouseenter", function () {
      removeFloatingNav();
    });
  }

  // Open the collapse sidebar submenu items when on touch devices 
  // - desktop only opens on hover
  function toggleTouchItem($element){
    $element
        .siblings('li')
        .removeClass('open')
        .end()
        .toggleClass('open');
  }

  // Handles hover to open items under collapsed menu
  // ----------------------------------- 
  function toggleMenuItem($listItem) {

    removeFloatingNav();

    var ul = $listItem.children('ul');

    if( !ul.length ) return $();
    if( $listItem.hasClass('open') ) {
      toggleTouchItem($listItem);
      return $();
    }

    var $aside = $('.aside');
    var $asideInner = $('.aside-inner'); // for top offset calculation
    // float aside uses extra padding on aside
    var mar = parseInt( $asideInner.css('padding-top'), 0) + parseInt( $aside.css('padding-top'), 0);

    var subNav = ul.clone().appendTo( $aside );

    toggleTouchItem($listItem);

    var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
    var vwHeight = $win.height();

    subNav
        .addClass('nav-floating')
        .css({
          position: isFixed() ? 'fixed' : 'absolute',
          top:      itemTop,
          bottom:   (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
        });

    subNav.on('mouseleave', function() {
      toggleTouchItem($listItem);
      subNav.remove();
    });

    return subNav;
  }

  function removeFloatingNav() {
    $('.sidebar-subnav.nav-floating').remove();
    $('.dropdown-backdrop').remove();
    $('.sidebar li.open').removeClass('open');
  }

  function isTouch() {
    return $html.hasClass('touch');
  }
  function isSidebarCollapsed() {
    return $body.hasClass('aside-collapsed');
  }
  function isSidebarToggled() {
    return $body.hasClass('aside-toggled');
  }
  function isMobile() {
    return $win.width() < mq.tablet;
  }
  function isFixed(){
    return $body.hasClass('layout-fixed');
  }
  function useAsideHover() {
    return $body.hasClass('aside-hover');
  }

})(window, document, window.jQuery);
// SKYCONS
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    $('[data-skycon]').each(function(){
      var element = $(this),
          skycons = new Skycons({'color': (element.data('color') || 'white')});

      element.html('<canvas width="' + element.data('width') + '" height="' + element.data('height') + '"></canvas>');

      skycons.add(element.children()[0], element.data('skycon'));

      skycons.play();
    });

  });

})(window, document, window.jQuery);
// SLIMSCROLL
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    $('[data-scrollable]').each(function(){

      var element = $(this),
          defaultHeight = 250;

      element.slimScroll({
        height: (element.data('height') || defaultHeight)
      });

    });
  });

})(window, document, window.jQuery);

// SPARKLINE
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    $('[data-sparkline]').each(initSparkLine);

    function initSparkLine() {
      var $element = $(this),
          options = $element.data(),
          values  = options.values && options.values.split(',');

      options.type = options.type || 'bar'; // default chart is bar
      options.disableHiddenCheck = true;

      $element.sparkline(values, options);

      if(options.resize) {
        $(window).resize(function(){
          $element.sparkline(values, options);
        });
      }
    }
  });

})(window, document, window.jQuery);

// Sweet Alert
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    $('#swal-demo1').on('click', function(e){
      e.preventDefault();
      swal("Here's a message!")
    });


    $('#swal-demo2').on('click', function(e){
      e.preventDefault();
      swal("Here's a message!", "It's pretty, isn't it?")
    });

    $('#swal-demo3').on('click', function(e){
      e.preventDefault();
      swal("Good job!", "You clicked the button!", "success")
    });

    $('#swal-demo4').on('click', function(e){
      e.preventDefault();
      swal({
            title : "Are you sure?",
            text : "You will not be able to recover this imaginary file!",
            type : "warning",
            showCancelButton : true,
            confirmButtonColor : "#DD6B55",
            confirmButtonText : "Yes, delete it!",
            closeOnConfirm : false
          },
          function () {
            swal("Deleted!", "Your imaginary file has been deleted.", "success");
          });

    });

    $('#swal-demo5').on('click', function(e){
      e.preventDefault();
      swal({
        title : "Are you sure?",
        text : "You will not be able to recover this imaginary file!",
        type : "warning",
        showCancelButton : true,
        confirmButtonColor : "#DD6B55",
        confirmButtonText : "Yes, delete it!",
        cancelButtonText : "No, cancel plx!",
        closeOnConfirm : false,
        closeOnCancel : false
      }, function (isConfirm) {
        if (isConfirm) {
          swal("Deleted!", "Your imaginary file has been deleted.", "success");
        } else {
          swal("Cancelled", "Your imaginary file is safe :)", "error");
        }
      });

    });

  });

})(window, document, window.jQuery);

// Custom jQuery
// ----------------------------------- 


(function(window, document, $, undefined){

  $(function(){

    $('[data-check-all]').on('change', function() {
      var $this = $(this),
          index= $this.index() + 1,
          checkbox = $this.find('input[type="checkbox"]'),
          table = $this.parents('table');
      // Make sure to affect only the correct checkbox column
      table.find('tbody > tr > td:nth-child('+index+') input[type="checkbox"]')
          .prop('checked', checkbox[0].checked);

    });

  });

})(window, document, window.jQuery);


// TOGGLE STATE
// -----------------------------------

(function(window, document, $, undefined){

  $(function(){

    var $body = $('body');
    toggle = new StateToggler();

    $('[data-toggle-state]')
        .on('click', function (e) {
          // e.preventDefault();
          e.stopPropagation();
          var element = $(this),
              classname = element.data('toggleState'),
              target = element.data('target'),
              noPersist = (element.attr('data-no-persist') !== undefined);

          // Specify a target selector to toggle classname
          // use body by default
          var $target = target ? $(target) : $body;

          if(classname) {
            if( $target.hasClass(classname) ) {
              $target.removeClass(classname);
              if( ! noPersist)
                toggle.removeState(classname);
            }
            else {
              $target.addClass(classname);
              if( ! noPersist)
                toggle.addState(classname);
            }

          }
          // some elements may need this when toggled class change the content size
          // e.g. sidebar collapsed mode and jqGrid
          $(window).resize();

        });

  });

  // Handle states to/from localstorage
  window.StateToggler = function() {

    var storageKeyName  = 'jq-toggleState';

    // Helper object to check for words in a phrase //
    var WordChecker = {
      hasWord: function (phrase, word) {
        return new RegExp('(^|\\s)' + word + '(\\s|$)').test(phrase);
      },
      addWord: function (phrase, word) {
        if (!this.hasWord(phrase, word)) {
          return (phrase + (phrase ? ' ' : '') + word);
        }
      },
      removeWord: function (phrase, word) {
        if (this.hasWord(phrase, word)) {
          return phrase.replace(new RegExp('(^|\\s)*' + word + '(\\s|$)*', 'g'), '');
        }
      }
    };

    // Return service public methods
    return {
      // Add a state to the browser storage to be restored later
      addState: function(classname){
        var data = $.localStorage.get(storageKeyName);

        if(!data)  {
          data = classname;
        }
        else {
          data = WordChecker.addWord(data, classname);
        }

        $.localStorage.set(storageKeyName, data);
      },

      // Remove a state from the browser storage
      removeState: function(classname){
        var data = $.localStorage.get(storageKeyName);
        // nothing to remove
        if(!data) return;

        data = WordChecker.removeWord(data, classname);

        $.localStorage.set(storageKeyName, data);
      },

      // Load the state string and restore the classlist
      restoreState: function($elem) {
        var data = $.localStorage.get(storageKeyName);

        // nothing to restore
        if(!data) return;
        $elem.addClass(data);
      }

    };
  };

})(window, document, window.jQuery);

// Bootstrap Tour
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    // Prepare steps
    var tourSteps = [];
    $('.tour-step').each(function(){
      var stepsOptions = $(this).data();
      stepsOptions.element = '#'+this.id;
      tourSteps.push( stepsOptions );
    });

    if ( tourSteps.length ) {
      // Instance the tour
      var tour = new Tour({
        backdrop: true,
        onShown: function(tour) {
          // BootstrapTour is not compatible with z-index based layout
          // so adding position:static for this case makes the browser
          // to ignore the property
          $('.wrapper > section').css({'position': 'static'});
        },
        onHide: function (tour) {
          // finally restore on destroy and reuse the value declared in stylesheet
          $('.wrapper > section').css({'position': ''});
        },
        steps: tourSteps
      });

      // Initialize the tour
      tour.init();


      $('#start-tour').on('click', function(){
        // Start the tour
        tour.restart();
      });
    }

  });

})(window, document, window.jQuery);

/**=========================================================
 * Module: utils.js
 * jQuery Utility functions library
 * adapted from the core of UIKit
 =========================================================*/

(function($, window, doc){
  'use strict';

  var $html = $("html"), $win = $(window);

  $.support.transition = (function() {

    var transitionEnd = (function() {

      var element = doc.body || doc.documentElement,
          transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
          }, name;

      for (name in transEndEventNames) {
        if (element.style[name] !== undefined) return transEndEventNames[name];
      }
    }());

    return transitionEnd && { end: transitionEnd };
  })();

  $.support.animation = (function() {

    var animationEnd = (function() {

      var element = doc.body || doc.documentElement,
          animEndEventNames = {
            WebkitAnimation: 'webkitAnimationEnd',
            MozAnimation: 'animationend',
            OAnimation: 'oAnimationEnd oanimationend',
            animation: 'animationend'
          }, name;

      for (name in animEndEventNames) {
        if (element.style[name] !== undefined) return animEndEventNames[name];
      }
    }());

    return animationEnd && { end: animationEnd };
  })();

  $.support.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback){ window.setTimeout(callback, 1000/60); };
  $.support.touch                 = (
  ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
  (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
  (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
  (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
  false
  );
  $.support.mutationobserver      = (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null);

  $.Utils = {};

  $.Utils.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  $.Utils.removeCssRules = function(selectorRegEx) {
    var idx, idxs, stylesheet, _i, _j, _k, _len, _len1, _len2, _ref;

    if(!selectorRegEx) return;

    setTimeout(function(){
      try {
        _ref = document.styleSheets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          stylesheet = _ref[_i];
          idxs = [];
          stylesheet.cssRules = stylesheet.cssRules;
          for (idx = _j = 0, _len1 = stylesheet.cssRules.length; _j < _len1; idx = ++_j) {
            if (stylesheet.cssRules[idx].type === CSSRule.STYLE_RULE && selectorRegEx.test(stylesheet.cssRules[idx].selectorText)) {
              idxs.unshift(idx);
            }
          }
          for (_k = 0, _len2 = idxs.length; _k < _len2; _k++) {
            stylesheet.deleteRule(idxs[_k]);
          }
        }
      } catch (_error) {}
    }, 0);
  };

  $.Utils.isInView = function(element, options) {

    var $element = $(element);

    if (!$element.is(':visible')) {
      return false;
    }

    var window_left = $win.scrollLeft(),
        window_top  = $win.scrollTop(),
        offset      = $element.offset(),
        left        = offset.left,
        top         = offset.top;

    options = $.extend({topoffset:0, leftoffset:0}, options);

    if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
        left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
      return true;
    } else {
      return false;
    }
  };

  $.Utils.options = function(string) {

    if ($.isPlainObject(string)) return string;

    var start = (string ? string.indexOf("{") : -1), options = {};

    if (start != -1) {
      try {
        options = (new Function("", "var json = " + string.substr(start) + "; return JSON.parse(JSON.stringify(json));"))();
      } catch (e) {}
    }

    return options;
  };

  $.Utils.events       = {};
  $.Utils.events.click = $.support.touch ? 'tap' : 'click';

  $.langdirection = $html.attr("dir") == "rtl" ? "right" : "left";

  $(function(){

    // Check for dom modifications
    if(!$.support.mutationobserver) return;

    // Install an observer for custom needs of dom changes
    var observer = new $.support.mutationobserver($.Utils.debounce(function(mutations) {
      $(doc).trigger("domready");
    }, 300));

    // pass in the target node, as well as the observer options
    observer.observe(document.body, { childList: true, subtree: true });

  });

  // add touch identifier class
  $html.addClass($.support.touch ? "touch" : "no-touch");

}(jQuery, window, document));
// Custom jQuery
// ----------------------------------- 


(function(window, document, $, undefined){

  $(function(){

    // document ready

  });

})(window, document, window.jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5pbml0LmpzIiwiYm9vdHN0cmFwLXN0YXJ0LmpzIiwiY2FsZW5kYXIuanMiLCJjaGFydC1lYXN5cGllLmpzIiwiY2hhcnQta25vYi5qcyIsImNoYXJ0LmpzIiwiY2hhcnRpc3QuanMiLCJjbGFzc3lsb2FkZXIuanMiLCJjbGVhci1zdG9yYWdlLmpzIiwiY29sb3ItcGlja2VyLmpzIiwiY29uc3RhbnRzLmpzIiwiZmxhdGRvYy5qcyIsImZ1bGxzY3JlZW4uanMiLCJnbWFwLmpzIiwiaW1hZ2Vjcm9wLmpzIiwibG9hZC1jc3MuanMiLCJsb2NhbGl6ZS5qcyIsIm1hcHMtdmVjdG9yLmpzIiwibW9ycmlzLmpzIiwibmF2YmFyLXNlYXJjaC5qcyIsIm5vdGlmeS5qcyIsIm5vdy5qcyIsInBhbmVsLXRvb2xzLmpzIiwicGxheS1hbmltYXRpb24uanMiLCJwb3JsZXRzLmpzIiwicmlja3NoYXcuanMiLCJzZWxlY3QyLmpzIiwic2lkZWJhci5qcyIsInNreWNvbnMuanMiLCJzbGltc2Nyb2xsLmpzIiwic3BhcmtsaW5lLmpzIiwic3dlZXRhbGVydC5qcyIsInRhYmxlLWNoZWNrYWxsLmpzIiwidG9nZ2xlLXN0YXRlLmpzIiwidG91ci5qcyIsInV0aWxzLmpzIiwiY3VzdG9tLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXHJcbiAqIFxyXG4gKiBBbmdsZSAtIEJvb3RzdHJhcCBBZG1pbiBBcHAgKyBqUXVlcnlcclxuICogXHJcbiAqIFZlcnNpb246IDMuMi4wXHJcbiAqIEF1dGhvcjogQHRoZW1pY29uX2NvXHJcbiAqIFdlYnNpdGU6IGh0dHA6Ly90aGVtaWNvbi5jb1xyXG4gKiBMaWNlbnNlOiBodHRwczovL3dyYXBib290c3RyYXAuY29tL2hlbHAvbGljZW5zZXNcclxuICogXHJcbiAqL1xyXG5cclxuXHJcbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCAkLCB1bmRlZmluZWQpe1xyXG5cclxuICBpZiAodHlwZW9mICQgPT09ICd1bmRlZmluZWQnKSB7IHRocm93IG5ldyBFcnJvcignVGhpcyBhcHBsaWNhdGlvblxcJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnknKTsgfVxyXG5cclxuICAkKGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgLy8gUmVzdG9yZSBib2R5IGNsYXNzZXNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG4gICAgdmFyICRib2R5ID0gJCgnYm9keScpO1xyXG4gICAgbmV3IFN0YXRlVG9nZ2xlcigpLnJlc3RvcmVTdGF0ZSggJGJvZHkgKTtcclxuICAgIFxyXG4gICAgLy8gZW5hYmxlIHNldHRpbmdzIHRvZ2dsZSBhZnRlciByZXN0b3JlXHJcbiAgICAkKCcjY2hrLWZpeGVkJykucHJvcCgnY2hlY2tlZCcsICRib2R5Lmhhc0NsYXNzKCdsYXlvdXQtZml4ZWQnKSApO1xyXG4gICAgJCgnI2Noay1jb2xsYXBzZWQnKS5wcm9wKCdjaGVja2VkJywgJGJvZHkuaGFzQ2xhc3MoJ2FzaWRlLWNvbGxhcHNlZCcpICk7XHJcbiAgICAkKCcjY2hrLWJveGVkJykucHJvcCgnY2hlY2tlZCcsICRib2R5Lmhhc0NsYXNzKCdsYXlvdXQtYm94ZWQnKSApO1xyXG4gICAgJCgnI2Noay1mbG9hdCcpLnByb3AoJ2NoZWNrZWQnLCAkYm9keS5oYXNDbGFzcygnYXNpZGUtZmxvYXQnKSApO1xyXG4gICAgJCgnI2Noay1ob3ZlcicpLnByb3AoJ2NoZWNrZWQnLCAkYm9keS5oYXNDbGFzcygnYXNpZGUtaG92ZXInKSApO1xyXG5cclxuICAgIC8vIFdoZW4gcmVhZHkgZGlzcGxheSB0aGUgb2Zmc2lkZWJhclxyXG4gICAgJCgnLm9mZnNpZGViYXIuaGlkZScpLnJlbW92ZUNsYXNzKCdoaWRlJyk7ICAgICAgXHJcblxyXG4gIH0pOyAvLyBkb2MgcmVhZHlcclxuXHJcblxyXG59KSh3aW5kb3csIGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5KTtcclxuIiwiLy8gU3RhcnQgQm9vdHN0cmFwIEpTXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQsIHVuZGVmaW5lZCl7XG5cbiAgJChmdW5jdGlvbigpe1xuXG4gICAgLy8gUE9QT1ZFUlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuXG4gICAgJCgnW2RhdGEtdG9nZ2xlPVwicG9wb3ZlclwiXScpLnBvcG92ZXIoKTtcblxuICAgIC8vIFRPT0xUSVBcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKHtcbiAgICAgIGNvbnRhaW5lcjogJ2JvZHknXG4gICAgfSk7XG5cbiAgICAvLyBEUk9QRE9XTiBJTlBVVFNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcbiAgICAkKCcuZHJvcGRvd24gaW5wdXQnKS5vbignY2xpY2sgZm9jdXMnLCBmdW5jdGlvbihldmVudCl7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcblxuICB9KTtcblxufSkod2luZG93LCBkb2N1bWVudCwgd2luZG93LmpRdWVyeSk7XG4iLCIvLyBDdXN0b20galF1ZXJ5XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKXtcblxuICBpZighJC5mbi5mdWxsQ2FsZW5kYXIpIHJldHVybjtcblxuICAvLyBXaGVuIGRvbSByZWFkeSwgaW5pdCBjYWxlbmRhciBhbmQgZXZlbnRzXG4gICQoZnVuY3Rpb24oKSB7XG5cbiAgICAgIC8vIFRoZSBlbGVtZW50IHRoYXQgd2lsbCBkaXNwbGF5IHRoZSBjYWxlbmRhclxuICAgICAgdmFyIGNhbGVuZGFyID0gJCgnI2NhbGVuZGFyJyk7XG5cbiAgICAgIHZhciBkZW1vRXZlbnRzID0gY3JlYXRlRGVtb0V2ZW50cygpO1xuXG4gICAgICBpbml0RXh0ZXJuYWxFdmVudHMoY2FsZW5kYXIpO1xuXG4gICAgICBpbml0Q2FsZW5kYXIoY2FsZW5kYXIsIGRlbW9FdmVudHMpO1xuXG4gIH0pO1xuXG5cbiAgLy8gZ2xvYmFsIHNoYXJlZCB2YXIgdG8ga25vdyB3aGF0IHdlIGFyZSBkcmFnZ2luZ1xuICB2YXIgZHJhZ2dpbmdFdmVudCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEV4dGVybmFsRXZlbnQgb2JqZWN0XG4gICAqIEBwYXJhbSBqUXVlcnkgT2JqZWN0IGVsZW1lbnRzIFNldCBvZiBlbGVtZW50IGFzIGpRdWVyeSBvYmplY3RzXG4gICAqL1xuICB2YXIgRXh0ZXJuYWxFdmVudCA9IGZ1bmN0aW9uIChlbGVtZW50cykge1xuICAgICAgXG4gICAgICBpZiAoIWVsZW1lbnRzKSByZXR1cm47XG4gICAgICBcbiAgICAgIGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgICAvLyBjcmVhdGUgYW4gRXZlbnQgT2JqZWN0IChodHRwOi8vYXJzaGF3LmNvbS9mdWxsY2FsZW5kYXIvZG9jcy9ldmVudF9kYXRhL0V2ZW50X09iamVjdC8pXG4gICAgICAgICAgLy8gaXQgZG9lc24ndCBuZWVkIHRvIGhhdmUgYSBzdGFydCBvciBlbmRcbiAgICAgICAgICB2YXIgY2FsZW5kYXJFdmVudE9iamVjdCA9IHtcbiAgICAgICAgICAgICAgdGl0bGU6ICQudHJpbSgkdGhpcy50ZXh0KCkpIC8vIHVzZSB0aGUgZWxlbWVudCdzIHRleHQgYXMgdGhlIGV2ZW50IHRpdGxlXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIHN0b3JlIHRoZSBFdmVudCBPYmplY3QgaW4gdGhlIERPTSBlbGVtZW50IHNvIHdlIGNhbiBnZXQgdG8gaXQgbGF0ZXJcbiAgICAgICAgICAkdGhpcy5kYXRhKCdjYWxlbmRhckV2ZW50T2JqZWN0JywgY2FsZW5kYXJFdmVudE9iamVjdCk7XG5cbiAgICAgICAgICAvLyBtYWtlIHRoZSBldmVudCBkcmFnZ2FibGUgdXNpbmcgalF1ZXJ5IFVJXG4gICAgICAgICAgJHRoaXMuZHJhZ2dhYmxlKHtcbiAgICAgICAgICAgICAgekluZGV4OiAxMDcwLFxuICAgICAgICAgICAgICByZXZlcnQ6IHRydWUsIC8vIHdpbGwgY2F1c2UgdGhlIGV2ZW50IHRvIGdvIGJhY2sgdG8gaXRzXG4gICAgICAgICAgICAgIHJldmVydER1cmF0aW9uOiAwICAvLyAgb3JpZ2luYWwgcG9zaXRpb24gYWZ0ZXIgdGhlIGRyYWdcbiAgICAgICAgICB9KTtcblxuICAgICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEludm9rZSBmdWxsIGNhbGVuZGFyIHBsdWdpbiBhbmQgYXR0YWNoIGJlaGF2aW9yXG4gICAqIEBwYXJhbSAgalF1ZXJ5IFtjYWxFbGVtZW50XSBUaGUgY2FsZW5kYXIgZG9tIGVsZW1lbnQgd3JhcHBlZCBpbnRvIGpRdWVyeVxuICAgKiBAcGFyYW0gIEV2ZW50T2JqZWN0IFtldmVudHNdIEFuIG9iamVjdCB3aXRoIHRoZSBldmVudCBsaXN0IHRvIGxvYWQgd2hlbiB0aGUgY2FsZW5kYXIgZGlzcGxheXNcbiAgICovXG4gIGZ1bmN0aW9uIGluaXRDYWxlbmRhcihjYWxFbGVtZW50LCBldmVudHMpIHtcblxuICAgICAgLy8gY2hlY2sgdG8gcmVtb3ZlIGVsZW1lbnRzIGZyb20gdGhlIGxpc3RcbiAgICAgIHZhciByZW1vdmVBZnRlckRyb3AgPSAkKCcjcmVtb3ZlLWFmdGVyLWRyb3AnKTtcblxuICAgICAgY2FsRWxlbWVudC5mdWxsQ2FsZW5kYXIoe1xuICAgICAgICAgIC8vIGlzUlRMOiB0cnVlLFxuICAgICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgICAgICBsZWZ0OiAgICdwcmV2LG5leHQgdG9kYXknLFxuICAgICAgICAgICAgICBjZW50ZXI6ICd0aXRsZScsXG4gICAgICAgICAgICAgIHJpZ2h0OiAgJ21vbnRoLGFnZW5kYVdlZWssYWdlbmRhRGF5J1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYnV0dG9uSWNvbnM6IHsgLy8gbm90ZSB0aGUgc3BhY2UgYXQgdGhlIGJlZ2lubmluZ1xuICAgICAgICAgICAgICBwcmV2OiAgICAnIGZhIGZhLWNhcmV0LWxlZnQnLFxuICAgICAgICAgICAgICBuZXh0OiAgICAnIGZhIGZhLWNhcmV0LXJpZ2h0J1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYnV0dG9uVGV4dDoge1xuICAgICAgICAgICAgICB0b2RheTogJ3RvZGF5JyxcbiAgICAgICAgICAgICAgbW9udGg6ICdtb250aCcsXG4gICAgICAgICAgICAgIHdlZWs6ICAnd2VlaycsXG4gICAgICAgICAgICAgIGRheTogICAnZGF5J1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZWRpdGFibGU6IHRydWUsXG4gICAgICAgICAgZHJvcHBhYmxlOiB0cnVlLCAvLyB0aGlzIGFsbG93cyB0aGluZ3MgdG8gYmUgZHJvcHBlZCBvbnRvIHRoZSBjYWxlbmRhciBcbiAgICAgICAgICBkcm9wOiBmdW5jdGlvbihkYXRlLCBhbGxEYXkpIHsgLy8gdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiBzb21ldGhpbmcgaXMgZHJvcHBlZFxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgIC8vIHJldHJpZXZlIHRoZSBkcm9wcGVkIGVsZW1lbnQncyBzdG9yZWQgRXZlbnQgT2JqZWN0XG4gICAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50T2JqZWN0ID0gJHRoaXMuZGF0YSgnY2FsZW5kYXJFdmVudE9iamVjdCcpO1xuXG4gICAgICAgICAgICAgIC8vIGlmIHNvbWV0aGluZyB3ZW50IHdyb25nLCBhYm9ydFxuICAgICAgICAgICAgICBpZighb3JpZ2luYWxFdmVudE9iamVjdCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgIC8vIGNsb25lIHRoZSBvYmplY3QgdG8gYXZvaWQgbXVsdGlwbGUgZXZlbnRzIHdpdGggcmVmZXJlbmNlIHRvIHRoZSBzYW1lIG9iamVjdFxuICAgICAgICAgICAgICB2YXIgY2xvbmVkRXZlbnRPYmplY3QgPSAkLmV4dGVuZCh7fSwgb3JpZ2luYWxFdmVudE9iamVjdCk7XG5cbiAgICAgICAgICAgICAgLy8gYXNzaWduIHRoZSByZXBvcnRlZCBkYXRlXG4gICAgICAgICAgICAgIGNsb25lZEV2ZW50T2JqZWN0LnN0YXJ0ID0gZGF0ZTtcbiAgICAgICAgICAgICAgY2xvbmVkRXZlbnRPYmplY3QuYWxsRGF5ID0gYWxsRGF5O1xuICAgICAgICAgICAgICBjbG9uZWRFdmVudE9iamVjdC5iYWNrZ3JvdW5kQ29sb3IgPSAkdGhpcy5jc3MoJ2JhY2tncm91bmQtY29sb3InKTtcbiAgICAgICAgICAgICAgY2xvbmVkRXZlbnRPYmplY3QuYm9yZGVyQ29sb3IgPSAkdGhpcy5jc3MoJ2JvcmRlci1jb2xvcicpO1xuXG4gICAgICAgICAgICAgIC8vIHJlbmRlciB0aGUgZXZlbnQgb24gdGhlIGNhbGVuZGFyXG4gICAgICAgICAgICAgIC8vIHRoZSBsYXN0IGB0cnVlYCBhcmd1bWVudCBkZXRlcm1pbmVzIGlmIHRoZSBldmVudCBcInN0aWNrc1wiIFxuICAgICAgICAgICAgICAvLyAoaHR0cDovL2Fyc2hhdy5jb20vZnVsbGNhbGVuZGFyL2RvY3MvZXZlbnRfcmVuZGVyaW5nL3JlbmRlckV2ZW50LylcbiAgICAgICAgICAgICAgY2FsRWxlbWVudC5mdWxsQ2FsZW5kYXIoJ3JlbmRlckV2ZW50JywgY2xvbmVkRXZlbnRPYmplY3QsIHRydWUpO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgLy8gaWYgbmVjZXNzYXJ5IHJlbW92ZSB0aGUgZWxlbWVudCBmcm9tIHRoZSBsaXN0XG4gICAgICAgICAgICAgIGlmKHJlbW92ZUFmdGVyRHJvcC5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICR0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBldmVudERyYWdTdGFydDogZnVuY3Rpb24gKGV2ZW50LCBqcywgdWkpIHtcbiAgICAgICAgICAgIGRyYWdnaW5nRXZlbnQgPSBldmVudDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIC8vIFRoaXMgYXJyYXkgaXMgdGhlIGV2ZW50cyBzb3VyY2VzXG4gICAgICAgICAgZXZlbnRzOiBldmVudHNcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRzIHRoZSBleHRlcm5hbCBldmVudHMgcGFuZWxcbiAgICogQHBhcmFtICBqUXVlcnkgW2NhbEVsZW1lbnRdIFRoZSBjYWxlbmRhciBkb20gZWxlbWVudCB3cmFwcGVkIGludG8galF1ZXJ5XG4gICAqL1xuICBmdW5jdGlvbiBpbml0RXh0ZXJuYWxFdmVudHMoY2FsRWxlbWVudCl7XG4gICAgLy8gUGFuZWwgd2l0aCB0aGUgZXh0ZXJuYWwgZXZlbnRzIGxpc3RcbiAgICB2YXIgZXh0ZXJuYWxFdmVudHMgPSAkKCcuZXh0ZXJuYWwtZXZlbnRzJyk7XG5cbiAgICAvLyBpbml0IHRoZSBleHRlcm5hbCBldmVudHMgaW4gdGhlIHBhbmVsXG4gICAgbmV3IEV4dGVybmFsRXZlbnQoZXh0ZXJuYWxFdmVudHMuY2hpbGRyZW4oJ2RpdicpKTtcblxuICAgIC8vIEV4dGVybmFsIGV2ZW50IGNvbG9yIGlzIGRhbmdlci1yZWQgYnkgZGVmYXVsdFxuICAgIHZhciBjdXJyQ29sb3IgPSAnI2Y2NTA0ZCc7XG4gICAgLy8gQ29sb3Igc2VsZWN0b3IgYnV0dG9uXG4gICAgdmFyIGV2ZW50QWRkQnRuID0gJCgnLmV4dGVybmFsLWV2ZW50LWFkZC1idG4nKTtcbiAgICAvLyBOZXcgZXh0ZXJuYWwgZXZlbnQgbmFtZSBpbnB1dFxuICAgIHZhciBldmVudE5hbWVJbnB1dCA9ICQoJy5leHRlcm5hbC1ldmVudC1uYW1lJyk7XG4gICAgLy8gQ29sb3Igc3dpdGNoZXJzXG4gICAgdmFyIGV2ZW50Q29sb3JTZWxlY3RvciA9ICQoJy5leHRlcm5hbC1ldmVudC1jb2xvci1zZWxlY3RvciAuY2lyY2xlJyk7XG5cbiAgICAvLyBUcmFzaCBldmVudHMgRHJvcGFyZWEgXG4gICAgJCgnLmV4dGVybmFsLWV2ZW50cy10cmFzaCcpLmRyb3BwYWJsZSh7XG4gICAgICBhY2NlcHQ6ICAgICAgICcuZmMtZXZlbnQnLFxuICAgICAgYWN0aXZlQ2xhc3M6ICAnYWN0aXZlJyxcbiAgICAgIGhvdmVyQ2xhc3M6ICAgJ2hvdmVyZWQnLFxuICAgICAgdG9sZXJhbmNlOiAgICAndG91Y2gnLFxuICAgICAgZHJvcDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG4gICAgICAgIFxuICAgICAgICAvLyBZb3UgY2FuIHVzZSB0aGlzIGZ1bmN0aW9uIHRvIHNlbmQgYW4gYWpheCByZXF1ZXN0XG4gICAgICAgIC8vIHRvIHJlbW92ZSB0aGUgZXZlbnQgZnJvbSB0aGUgcmVwb3NpdG9yeVxuICAgICAgICBcbiAgICAgICAgaWYoZHJhZ2dpbmdFdmVudCkge1xuICAgICAgICAgIHZhciBlaWQgPSBkcmFnZ2luZ0V2ZW50LmlkIHx8IGRyYWdnaW5nRXZlbnQuX2lkO1xuICAgICAgICAgIC8vIFJlbW92ZSB0aGUgZXZlbnRcbiAgICAgICAgICBjYWxFbGVtZW50LmZ1bGxDYWxlbmRhcigncmVtb3ZlRXZlbnRzJywgZWlkKTtcbiAgICAgICAgICAvLyBSZW1vdmUgdGhlIGRvbSBlbGVtZW50XG4gICAgICAgICAgdWkuZHJhZ2dhYmxlLnJlbW92ZSgpO1xuICAgICAgICAgIC8vIGNsZWFyXG4gICAgICAgICAgZHJhZ2dpbmdFdmVudCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGV2ZW50Q29sb3JTZWxlY3Rvci5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvLyBTYXZlIGNvbG9yXG4gICAgICAgIGN1cnJDb2xvciA9ICR0aGlzLmNzcygnYmFja2dyb3VuZC1jb2xvcicpO1xuICAgICAgICAvLyBEZS1zZWxlY3QgYWxsIGFuZCBzZWxlY3QgdGhlIGN1cnJlbnQgb25lXG4gICAgICAgIGV2ZW50Q29sb3JTZWxlY3Rvci5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgfSk7XG5cbiAgICBldmVudEFkZEJ0bi5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgXG4gICAgICAgIC8vIEdldCBldmVudCBuYW1lIGZyb20gaW5wdXRcbiAgICAgICAgdmFyIHZhbCA9IGV2ZW50TmFtZUlucHV0LnZhbCgpO1xuICAgICAgICAvLyBEb250IGFsbG93IGVtcHR5IHZhbHVlc1xuICAgICAgICBpZiAoJC50cmltKHZhbCkgPT09ICcnKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICAvLyBDcmVhdGUgbmV3IGV2ZW50IGVsZW1lbnRcbiAgICAgICAgdmFyIG5ld0V2ZW50ID0gJCgnPGRpdi8+JykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6IGN1cnJDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVyLWNvbG9yJzogICAgIGN1cnJDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29sb3InOiAgICAgICAgICAgICcjZmZmJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5odG1sKHZhbCk7XG5cbiAgICAgICAgLy8gUHJlcGVuZHMgdG8gdGhlIGV4dGVybmFsIGV2ZW50cyBsaXN0XG4gICAgICAgIGV4dGVybmFsRXZlbnRzLnByZXBlbmQobmV3RXZlbnQpO1xuICAgICAgICAvLyBJbml0aWFsaXplIHRoZSBuZXcgZXZlbnQgZWxlbWVudFxuICAgICAgICBuZXcgRXh0ZXJuYWxFdmVudChuZXdFdmVudCk7XG4gICAgICAgIC8vIENsZWFyIGlucHV0XG4gICAgICAgIGV2ZW50TmFtZUlucHV0LnZhbCgnJyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBhcnJheSBvZiBldmVudHMgdG8gZGlzcGxheSBpbiB0aGUgZmlyc3QgbG9hZCBvZiB0aGUgY2FsZW5kYXJcbiAgICogV3JhcCBpbnRvIHRoaXMgZnVuY3Rpb24gYSByZXF1ZXN0IHRvIGEgc291cmNlIHRvIGdldCB2aWEgYWpheCB0aGUgc3RvcmVkIGV2ZW50c1xuICAgKiBAcmV0dXJuIEFycmF5IFRoZSBhcnJheSB3aXRoIHRoZSBldmVudHNcbiAgICovXG4gIGZ1bmN0aW9uIGNyZWF0ZURlbW9FdmVudHMoKSB7XG4gICAgLy8gRGF0ZSBmb3IgdGhlIGNhbGVuZGFyIGV2ZW50cyAoZHVtbXkgZGF0YSlcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIGQgPSBkYXRlLmdldERhdGUoKSxcbiAgICAgICAgbSA9IGRhdGUuZ2V0TW9udGgoKSxcbiAgICAgICAgeSA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcblxuICAgIHJldHVybiAgW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0aXRsZTogJ0FsbCBEYXkgRXZlbnQnLFxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIDEpLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2Y1Njk1NCcsIC8vcmVkIFxuICAgICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6ICcjZjU2OTU0JyAvL3JlZFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0aXRsZTogJ0xvbmcgRXZlbnQnLFxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgLSA1KSxcbiAgICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoeSwgbSwgZCAtIDIpLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2YzOWMxMicsIC8veWVsbG93XG4gICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogJyNmMzljMTInIC8veWVsbG93XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTWVldGluZycsXG4gICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCwgMTAsIDMwKSxcbiAgICAgICAgICAgICAgICAgIGFsbERheTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDA3M2I3JywgLy9CbHVlXG4gICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogJyMwMDczYjcnIC8vQmx1ZVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0aXRsZTogJ0x1bmNoJyxcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCBkLCAxMiwgMCksXG4gICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHksIG0sIGQsIDE0LCAwKSxcbiAgICAgICAgICAgICAgICAgIGFsbERheTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDBjMGVmJywgLy9JbmZvIChhcXVhKVxuICAgICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6ICcjMDBjMGVmJyAvL0luZm8gKGFxdWEpXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQmlydGhkYXkgUGFydHknLFxuICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgKyAxLCAxOSwgMCksXG4gICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHksIG0sIGQgKyAxLCAyMiwgMzApLFxuICAgICAgICAgICAgICAgICAgYWxsRGF5OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyMwMGE2NWEnLCAvL1N1Y2Nlc3MgKGdyZWVuKVxuICAgICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6ICcjMDBhNjVhJyAvL1N1Y2Nlc3MgKGdyZWVuKVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0aXRsZTogJ09wZW4gR29vZ2xlJyxcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCAyOCksXG4gICAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHksIG0sIDI5KSxcbiAgICAgICAgICAgICAgICAgIHVybDogJy8vZ29vZ2xlLmNvbS8nLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzNjOGRiYycsIC8vUHJpbWFyeSAobGlnaHQtYmx1ZSlcbiAgICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiAnIzNjOGRiYycgLy9QcmltYXJ5IChsaWdodC1ibHVlKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgXTtcbiAgfVxuXG59KSh3aW5kb3csIGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5KTtcblxuXG4iLCIvLyBFYXN5cGllIGNoYXJ0XHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgJChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgaWYoISAkLmZuLmVhc3lQaWVDaGFydCApIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyIHBpZU9wdGlvbnMxID0ge1xyXG4gICAgICAgICAgICBhbmltYXRlOiB7XHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogODAwLFxyXG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBiYXJDb2xvcjogQVBQX0NPTE9SU1snc3VjY2VzcyddLFxyXG4gICAgICAgICAgICB0cmFja0NvbG9yOiBmYWxzZSxcclxuICAgICAgICAgICAgc2NhbGVDb2xvcjogZmFsc2UsXHJcbiAgICAgICAgICAgIGxpbmVXaWR0aDogMTAsXHJcbiAgICAgICAgICAgIGxpbmVDYXA6ICdjaXJjbGUnXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkKCcjZWFzeXBpZTEnKS5lYXN5UGllQ2hhcnQocGllT3B0aW9uczEpO1xyXG5cclxuICAgICAgICB2YXIgcGllT3B0aW9uczIgPSB7XHJcbiAgICAgICAgICAgIGFuaW1hdGU6IHtcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA4MDAsXHJcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJhckNvbG9yOiBBUFBfQ09MT1JTWyd3YXJuaW5nJ10sXHJcbiAgICAgICAgICAgIHRyYWNrQ29sb3I6IGZhbHNlLFxyXG4gICAgICAgICAgICBzY2FsZUNvbG9yOiBmYWxzZSxcclxuICAgICAgICAgICAgbGluZVdpZHRoOiA0LFxyXG4gICAgICAgICAgICBsaW5lQ2FwOiAnY2lyY2xlJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJCgnI2Vhc3lwaWUyJykuZWFzeVBpZUNoYXJ0KHBpZU9wdGlvbnMyKTtcclxuXHJcbiAgICAgICAgdmFyIHBpZU9wdGlvbnMzID0ge1xyXG4gICAgICAgICAgICBhbmltYXRlOiB7XHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogODAwLFxyXG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBiYXJDb2xvcjogQVBQX0NPTE9SU1snZGFuZ2VyJ10sXHJcbiAgICAgICAgICAgIHRyYWNrQ29sb3I6IGZhbHNlLFxyXG4gICAgICAgICAgICBzY2FsZUNvbG9yOiBBUFBfQ09MT1JTWydncmF5J10sXHJcbiAgICAgICAgICAgIGxpbmVXaWR0aDogMTUsXHJcbiAgICAgICAgICAgIGxpbmVDYXA6ICdjaXJjbGUnXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkKCcjZWFzeXBpZTMnKS5lYXN5UGllQ2hhcnQocGllT3B0aW9uczMpO1xyXG5cclxuICAgICAgICB2YXIgcGllT3B0aW9uczQgPSB7XHJcbiAgICAgICAgICAgIGFuaW1hdGU6IHtcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA4MDAsXHJcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJhckNvbG9yOiBBUFBfQ09MT1JTWydkYW5nZXInXSxcclxuICAgICAgICAgICAgdHJhY2tDb2xvcjogQVBQX0NPTE9SU1sneWVsbG93J10sXHJcbiAgICAgICAgICAgIHNjYWxlQ29sb3I6IEFQUF9DT0xPUlNbJ2dyYXktZGFyayddLFxyXG4gICAgICAgICAgICBsaW5lV2lkdGg6IDE1LFxyXG4gICAgICAgICAgICBsaW5lQ2FwOiAnY2lyY2xlJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJCgnI2Vhc3lwaWU0JykuZWFzeVBpZUNoYXJ0KHBpZU9wdGlvbnM0KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbn0pKHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpOyIsIi8vIEtub2IgY2hhcnRcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCAkLCB1bmRlZmluZWQpe1xyXG5cclxuICAkKGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIGlmKCEgJC5mbi5rbm9iICkgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIga25vYkxvYWRlck9wdGlvbnMxID0ge1xyXG4gICAgICAgICAgICB3aWR0aDogJzUwJScsIC8vIHJlc3BvbnNpdmVcclxuICAgICAgICAgICAgZGlzcGxheUlucHV0OiB0cnVlLFxyXG4gICAgICAgICAgICBmZ0NvbG9yOiBBUFBfQ09MT1JTWydpbmZvJ11cclxuICAgICAgICB9O1xyXG4gICAgICAgICQoJyNrbm9iLWNoYXJ0MScpLmtub2Ioa25vYkxvYWRlck9wdGlvbnMxKTtcclxuXHJcbiAgICAgICAgdmFyIGtub2JMb2FkZXJPcHRpb25zMiA9IHtcclxuICAgICAgICAgICAgd2lkdGg6ICc1MCUnLCAvLyByZXNwb25zaXZlXHJcbiAgICAgICAgICAgIGRpc3BsYXlJbnB1dDogdHJ1ZSxcclxuICAgICAgICAgICAgZmdDb2xvcjogQVBQX0NPTE9SU1sncHVycGxlJ10sXHJcbiAgICAgICAgICAgIHJlYWRPbmx5OiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkKCcja25vYi1jaGFydDInKS5rbm9iKGtub2JMb2FkZXJPcHRpb25zMik7XHJcblxyXG4gICAgICAgIHZhciBrbm9iTG9hZGVyT3B0aW9uczMgPSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAnNTAlJywgLy8gcmVzcG9uc2l2ZVxyXG4gICAgICAgICAgICBkaXNwbGF5SW5wdXQ6IHRydWUsXHJcbiAgICAgICAgICAgIGZnQ29sb3I6IEFQUF9DT0xPUlNbJ2luZm8nXSxcclxuICAgICAgICAgICAgYmdDb2xvcjogQVBQX0NPTE9SU1snZ3JheSddLFxyXG4gICAgICAgICAgICBhbmdsZU9mZnNldDogLTEyNSxcclxuICAgICAgICAgICAgYW5nbGVBcmM6IDI1MFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgJCgnI2tub2ItY2hhcnQzJykua25vYihrbm9iTG9hZGVyT3B0aW9uczMpO1xyXG5cclxuICAgICAgICB2YXIga25vYkxvYWRlck9wdGlvbnM0ID0ge1xyXG4gICAgICAgICAgICB3aWR0aDogJzUwJScsIC8vIHJlc3BvbnNpdmVcclxuICAgICAgICAgICAgZGlzcGxheUlucHV0OiB0cnVlLFxyXG4gICAgICAgICAgICBmZ0NvbG9yOiBBUFBfQ09MT1JTWydwaW5rJ10sXHJcbiAgICAgICAgICAgIGRpc3BsYXlQcmV2aW91czogdHJ1ZSxcclxuICAgICAgICAgICAgdGhpY2tuZXNzOiAwLjEsXHJcbiAgICAgICAgICAgIGxpbmVDYXA6ICdyb3VuZCdcclxuICAgICAgICB9O1xyXG4gICAgICAgICQoJyNrbm9iLWNoYXJ0NCcpLmtub2Ioa25vYkxvYWRlck9wdGlvbnM0KTtcclxuXHJcbiAgfSk7XHJcblxyXG59KSh3aW5kb3csIGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5KTtcclxuIiwiLy8gU3RhcnQgQm9vdHN0cmFwIEpTXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG5cclxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQsIHVuZGVmaW5lZCl7XHJcblxyXG4gICQoZnVuY3Rpb24oKXtcclxuXHJcbiAgICBpZiAoIHR5cGVvZiBDaGFydCA9PT0gJ3VuZGVmaW5lZCcgKSByZXR1cm47XHJcblxyXG4gICAgLy8gcmFuZG9tIHZhbHVlcyBmb3IgZGVtb1xyXG4gICAgdmFyIHJGYWN0b3IgPSBmdW5jdGlvbigpeyByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKjEwMCk7IH07XHJcblxyXG5cclxuICAvLyBMaW5lIGNoYXJ0XHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcblxyXG4gICAgdmFyIGxpbmVEYXRhID0ge1xyXG4gICAgICAgIGxhYmVscyA6IFsnSmFudWFyeScsJ0ZlYnJ1YXJ5JywnTWFyY2gnLCdBcHJpbCcsJ01heScsJ0p1bmUnLCdKdWx5J10sXHJcbiAgICAgICAgZGF0YXNldHMgOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGxhYmVsOiAnTXkgRmlyc3QgZGF0YXNldCcsXHJcbiAgICAgICAgICAgIGZpbGxDb2xvciA6ICdyZ2JhKDExNCwxMDIsMTg2LDAuMiknLFxyXG4gICAgICAgICAgICBzdHJva2VDb2xvciA6ICdyZ2JhKDExNCwxMDIsMTg2LDEpJyxcclxuICAgICAgICAgICAgcG9pbnRDb2xvciA6ICdyZ2JhKDExNCwxMDIsMTg2LDEpJyxcclxuICAgICAgICAgICAgcG9pbnRTdHJva2VDb2xvciA6ICcjZmZmJyxcclxuICAgICAgICAgICAgcG9pbnRIaWdobGlnaHRGaWxsIDogJyNmZmYnLFxyXG4gICAgICAgICAgICBwb2ludEhpZ2hsaWdodFN0cm9rZSA6ICdyZ2JhKDExNCwxMDIsMTg2LDEpJyxcclxuICAgICAgICAgICAgZGF0YSA6IFtyRmFjdG9yKCksckZhY3RvcigpLHJGYWN0b3IoKSxyRmFjdG9yKCksckZhY3RvcigpLHJGYWN0b3IoKSxyRmFjdG9yKCldXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBsYWJlbDogJ015IFNlY29uZCBkYXRhc2V0JyxcclxuICAgICAgICAgICAgZmlsbENvbG9yIDogJ3JnYmEoMzUsMTgzLDIyOSwwLjIpJyxcclxuICAgICAgICAgICAgc3Ryb2tlQ29sb3IgOiAncmdiYSgzNSwxODMsMjI5LDEpJyxcclxuICAgICAgICAgICAgcG9pbnRDb2xvciA6ICdyZ2JhKDM1LDE4MywyMjksMSknLFxyXG4gICAgICAgICAgICBwb2ludFN0cm9rZUNvbG9yIDogJyNmZmYnLFxyXG4gICAgICAgICAgICBwb2ludEhpZ2hsaWdodEZpbGwgOiAnI2ZmZicsXHJcbiAgICAgICAgICAgIHBvaW50SGlnaGxpZ2h0U3Ryb2tlIDogJ3JnYmEoMzUsMTgzLDIyOSwxKScsXHJcbiAgICAgICAgICAgIGRhdGEgOiBbckZhY3RvcigpLHJGYWN0b3IoKSxyRmFjdG9yKCksckZhY3RvcigpLHJGYWN0b3IoKSxyRmFjdG9yKCksckZhY3RvcigpXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfTtcclxuXHJcblxyXG4gICAgdmFyIGxpbmVPcHRpb25zID0ge1xyXG4gICAgICBzY2FsZVNob3dHcmlkTGluZXMgOiB0cnVlLFxyXG4gICAgICBzY2FsZUdyaWRMaW5lQ29sb3IgOiAncmdiYSgwLDAsMCwuMDUpJyxcclxuICAgICAgc2NhbGVHcmlkTGluZVdpZHRoIDogMSxcclxuICAgICAgYmV6aWVyQ3VydmUgOiB0cnVlLFxyXG4gICAgICBiZXppZXJDdXJ2ZVRlbnNpb24gOiAwLjQsXHJcbiAgICAgIHBvaW50RG90IDogdHJ1ZSxcclxuICAgICAgcG9pbnREb3RSYWRpdXMgOiA0LFxyXG4gICAgICBwb2ludERvdFN0cm9rZVdpZHRoIDogMSxcclxuICAgICAgcG9pbnRIaXREZXRlY3Rpb25SYWRpdXMgOiAyMCxcclxuICAgICAgZGF0YXNldFN0cm9rZSA6IHRydWUsXHJcbiAgICAgIGRhdGFzZXRTdHJva2VXaWR0aCA6IDIsXHJcbiAgICAgIGRhdGFzZXRGaWxsOiB0cnVlLFxyXG4gICAgICByZXNwb25zaXZlOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBsaW5lY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGFydGpzLWxpbmVjaGFydFwiKS5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICB2YXIgbGluZUNoYXJ0ID0gbmV3IENoYXJ0KGxpbmVjdHgpLkxpbmUobGluZURhdGEsIGxpbmVPcHRpb25zKTtcclxuXHJcbiAgLy8gQmFyIGNoYXJ0XHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcblxyXG4gICAgdmFyIGJhckRhdGEgPSB7XHJcbiAgICAgICAgbGFiZWxzIDogWydKYW51YXJ5JywnRmVicnVhcnknLCdNYXJjaCcsJ0FwcmlsJywnTWF5JywnSnVuZScsJ0p1bHknXSxcclxuICAgICAgICBkYXRhc2V0cyA6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgZmlsbENvbG9yIDogJyMyM2I3ZTUnLFxyXG4gICAgICAgICAgICBzdHJva2VDb2xvciA6ICcjMjNiN2U1JyxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0RmlsbDogJyMyM2I3ZTUnLFxyXG4gICAgICAgICAgICBoaWdobGlnaHRTdHJva2U6ICcjMjNiN2U1JyxcclxuICAgICAgICAgICAgZGF0YSA6IFtyRmFjdG9yKCksckZhY3RvcigpLHJGYWN0b3IoKSxyRmFjdG9yKCksckZhY3RvcigpLHJGYWN0b3IoKSxyRmFjdG9yKCldXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBmaWxsQ29sb3IgOiAnIzVkOWNlYycsXHJcbiAgICAgICAgICAgIHN0cm9rZUNvbG9yIDogJyM1ZDljZWMnLFxyXG4gICAgICAgICAgICBoaWdobGlnaHRGaWxsIDogJyM1ZDljZWMnLFxyXG4gICAgICAgICAgICBoaWdobGlnaHRTdHJva2UgOiAnIzVkOWNlYycsXHJcbiAgICAgICAgICAgIGRhdGEgOiBbckZhY3RvcigpLHJGYWN0b3IoKSxyRmFjdG9yKCksckZhY3RvcigpLHJGYWN0b3IoKSxyRmFjdG9yKCksckZhY3RvcigpXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH07XHJcbiAgICBcclxuICAgIHZhciBiYXJPcHRpb25zID0ge1xyXG4gICAgICBzY2FsZUJlZ2luQXRaZXJvIDogdHJ1ZSxcclxuICAgICAgc2NhbGVTaG93R3JpZExpbmVzIDogdHJ1ZSxcclxuICAgICAgc2NhbGVHcmlkTGluZUNvbG9yIDogJ3JnYmEoMCwwLDAsLjA1KScsXHJcbiAgICAgIHNjYWxlR3JpZExpbmVXaWR0aCA6IDEsXHJcbiAgICAgIGJhclNob3dTdHJva2UgOiB0cnVlLFxyXG4gICAgICBiYXJTdHJva2VXaWR0aCA6IDIsXHJcbiAgICAgIGJhclZhbHVlU3BhY2luZyA6IDUsXHJcbiAgICAgIGJhckRhdGFzZXRTcGFjaW5nIDogMSxcclxuICAgICAgcmVzcG9uc2l2ZTogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgYmFyY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGFydGpzLWJhcmNoYXJ0XCIpLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIHZhciBiYXJDaGFydCA9IG5ldyBDaGFydChiYXJjdHgpLkJhcihiYXJEYXRhLCBiYXJPcHRpb25zKTtcclxuXHJcbiAgLy8gIERvdWdobnV0IGNoYXJ0XHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcbiAgICBcclxuICAgIHZhciBkb3VnaG51dERhdGEgPSBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAzMDAsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnIzcyNjZiYScsXHJcbiAgICAgICAgICAgIGhpZ2hsaWdodDogJyM3MjY2YmEnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ1B1cnBsZSdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhbHVlOiA1MCxcclxuICAgICAgICAgICAgY29sb3I6ICcjMjNiN2U1JyxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0OiAnIzIzYjdlNScsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnSW5mbydcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAxMDAsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZhZDczMicsXHJcbiAgICAgICAgICAgIGhpZ2hsaWdodDogJyNmYWQ3MzInLFxyXG4gICAgICAgICAgICBsYWJlbDogJ1llbGxvdydcclxuICAgICAgICAgIH1cclxuICAgICAgICBdO1xyXG5cclxuICAgIHZhciBkb3VnaG51dE9wdGlvbnMgPSB7XHJcbiAgICAgIHNlZ21lbnRTaG93U3Ryb2tlIDogdHJ1ZSxcclxuICAgICAgc2VnbWVudFN0cm9rZUNvbG9yIDogJyNmZmYnLFxyXG4gICAgICBzZWdtZW50U3Ryb2tlV2lkdGggOiAyLFxyXG4gICAgICBwZXJjZW50YWdlSW5uZXJDdXRvdXQgOiA4NSxcclxuICAgICAgYW5pbWF0aW9uU3RlcHMgOiAxMDAsXHJcbiAgICAgIGFuaW1hdGlvbkVhc2luZyA6ICdlYXNlT3V0Qm91bmNlJyxcclxuICAgICAgYW5pbWF0ZVJvdGF0ZSA6IHRydWUsXHJcbiAgICAgIGFuaW1hdGVTY2FsZSA6IGZhbHNlLFxyXG4gICAgICByZXNwb25zaXZlOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBkb3VnaG51dGN0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhcnRqcy1kb3VnaG51dGNoYXJ0XCIpLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIHZhciBkb3VnaG51dENoYXJ0ID0gbmV3IENoYXJ0KGRvdWdobnV0Y3R4KS5Eb3VnaG51dChkb3VnaG51dERhdGEsIGRvdWdobnV0T3B0aW9ucyk7XHJcblxyXG4gIC8vIFBpZSBjaGFydFxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG5cclxuICAgIHZhciBwaWVEYXRhID1bXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAzMDAsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnIzcyNjZiYScsXHJcbiAgICAgICAgICAgIGhpZ2hsaWdodDogJyM3MjY2YmEnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ1B1cnBsZSdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhbHVlOiA0MCxcclxuICAgICAgICAgICAgY29sb3I6ICcjZmFkNzMyJyxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0OiAnI2ZhZDczMicsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnWWVsbG93J1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdmFsdWU6IDEyMCxcclxuICAgICAgICAgICAgY29sb3I6ICcjMjNiN2U1JyxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0OiAnIzIzYjdlNScsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnSW5mbydcclxuICAgICAgICAgIH1cclxuICAgICAgICBdO1xyXG5cclxuICAgIHZhciBwaWVPcHRpb25zID0ge1xyXG4gICAgICBzZWdtZW50U2hvd1N0cm9rZSA6IHRydWUsXHJcbiAgICAgIHNlZ21lbnRTdHJva2VDb2xvciA6ICcjZmZmJyxcclxuICAgICAgc2VnbWVudFN0cm9rZVdpZHRoIDogMixcclxuICAgICAgcGVyY2VudGFnZUlubmVyQ3V0b3V0IDogMCwgLy8gU2V0dGluZyB0aGlzIHRvIHplcm8gY29udmVydCBhIGRvdWdobnV0IGludG8gYSBQaWVcclxuICAgICAgYW5pbWF0aW9uU3RlcHMgOiAxMDAsXHJcbiAgICAgIGFuaW1hdGlvbkVhc2luZyA6ICdlYXNlT3V0Qm91bmNlJyxcclxuICAgICAgYW5pbWF0ZVJvdGF0ZSA6IHRydWUsXHJcbiAgICAgIGFuaW1hdGVTY2FsZSA6IGZhbHNlLFxyXG4gICAgICByZXNwb25zaXZlOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBwaWVjdHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXJ0anMtcGllY2hhcnRcIikuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgdmFyIHBpZUNoYXJ0ID0gbmV3IENoYXJ0KHBpZWN0eCkuUGllKHBpZURhdGEsIHBpZU9wdGlvbnMpO1xyXG5cclxuICAvLyBQb2xhciBjaGFydFxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG4gICAgXHJcbiAgICB2YXIgcG9sYXJEYXRhID0gW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB2YWx1ZTogMzAwLFxyXG4gICAgICAgICAgICBjb2xvcjogJyNmNTMyZTUnLFxyXG4gICAgICAgICAgICBoaWdobGlnaHQ6ICcjZjUzMmU1JyxcclxuICAgICAgICAgICAgbGFiZWw6ICdSZWQnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB2YWx1ZTogNTAsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnIzcyNjZiYScsXHJcbiAgICAgICAgICAgIGhpZ2hsaWdodDogJyM3MjY2YmEnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ0dyZWVuJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdmFsdWU6IDEwMCxcclxuICAgICAgICAgICAgY29sb3I6ICcjZjUzMmU1JyxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0OiAnI2Y1MzJlNScsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnWWVsbG93J1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdmFsdWU6IDE0MCxcclxuICAgICAgICAgICAgY29sb3I6ICcjNzI2NmJhJyxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0OiAnIzcyNjZiYScsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnR3JleSdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICB2YXIgcG9sYXJPcHRpb25zID0ge1xyXG4gICAgICBzY2FsZVNob3dMYWJlbEJhY2tkcm9wIDogdHJ1ZSxcclxuICAgICAgc2NhbGVCYWNrZHJvcENvbG9yIDogJ3JnYmEoMjU1LDI1NSwyNTUsMC43NSknLFxyXG4gICAgICBzY2FsZUJlZ2luQXRaZXJvIDogdHJ1ZSxcclxuICAgICAgc2NhbGVCYWNrZHJvcFBhZGRpbmdZIDogMSxcclxuICAgICAgc2NhbGVCYWNrZHJvcFBhZGRpbmdYIDogMSxcclxuICAgICAgc2NhbGVTaG93TGluZSA6IHRydWUsXHJcbiAgICAgIHNlZ21lbnRTaG93U3Ryb2tlIDogdHJ1ZSxcclxuICAgICAgc2VnbWVudFN0cm9rZUNvbG9yIDogJyNmZmYnLFxyXG4gICAgICBzZWdtZW50U3Ryb2tlV2lkdGggOiAyLFxyXG4gICAgICBhbmltYXRpb25TdGVwcyA6IDEwMCxcclxuICAgICAgYW5pbWF0aW9uRWFzaW5nIDogJ2Vhc2VPdXRCb3VuY2UnLFxyXG4gICAgICBhbmltYXRlUm90YXRlIDogdHJ1ZSxcclxuICAgICAgYW5pbWF0ZVNjYWxlIDogZmFsc2UsXHJcbiAgICAgIHJlc3BvbnNpdmU6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgdmFyIHBvbGFyY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGFydGpzLXBvbGFyY2hhcnRcIikuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgdmFyIHBvbGFyQ2hhcnQgPSBuZXcgQ2hhcnQocG9sYXJjdHgpLlBvbGFyQXJlYShwb2xhckRhdGEsIHBvbGFyT3B0aW9ucyk7XHJcblxyXG4gIC8vIFJhZGFyIGNoYXJ0XHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcblxyXG4gICAgdmFyIHJhZGFyRGF0YSA9IHtcclxuICAgICAgbGFiZWxzOiBbJ0VhdGluZycsICdEcmlua2luZycsICdTbGVlcGluZycsICdEZXNpZ25pbmcnLCAnQ29kaW5nJywgJ0N5Y2xpbmcnLCAnUnVubmluZyddLFxyXG4gICAgICBkYXRhc2V0czogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiAnTXkgRmlyc3QgZGF0YXNldCcsXHJcbiAgICAgICAgICBmaWxsQ29sb3I6ICdyZ2JhKDExNCwxMDIsMTg2LDAuMiknLFxyXG4gICAgICAgICAgc3Ryb2tlQ29sb3I6ICdyZ2JhKDExNCwxMDIsMTg2LDEpJyxcclxuICAgICAgICAgIHBvaW50Q29sb3I6ICdyZ2JhKDExNCwxMDIsMTg2LDEpJyxcclxuICAgICAgICAgIHBvaW50U3Ryb2tlQ29sb3I6ICcjZmZmJyxcclxuICAgICAgICAgIHBvaW50SGlnaGxpZ2h0RmlsbDogJyNmZmYnLFxyXG4gICAgICAgICAgcG9pbnRIaWdobGlnaHRTdHJva2U6ICdyZ2JhKDExNCwxMDIsMTg2LDEpJyxcclxuICAgICAgICAgIGRhdGE6IFs2NSw1OSw5MCw4MSw1Niw1NSw0MF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGxhYmVsOiAnTXkgU2Vjb25kIGRhdGFzZXQnLFxyXG4gICAgICAgICAgZmlsbENvbG9yOiAncmdiYSgxNTEsMTg3LDIwNSwwLjIpJyxcclxuICAgICAgICAgIHN0cm9rZUNvbG9yOiAncmdiYSgxNTEsMTg3LDIwNSwxKScsXHJcbiAgICAgICAgICBwb2ludENvbG9yOiAncmdiYSgxNTEsMTg3LDIwNSwxKScsXHJcbiAgICAgICAgICBwb2ludFN0cm9rZUNvbG9yOiAnI2ZmZicsXHJcbiAgICAgICAgICBwb2ludEhpZ2hsaWdodEZpbGw6ICcjZmZmJyxcclxuICAgICAgICAgIHBvaW50SGlnaGxpZ2h0U3Ryb2tlOiAncmdiYSgxNTEsMTg3LDIwNSwxKScsXHJcbiAgICAgICAgICBkYXRhOiBbMjgsNDgsNDAsMTksOTYsMjcsMTAwXVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgcmFkYXJPcHRpb25zID0ge1xyXG4gICAgICBzY2FsZVNob3dMaW5lIDogdHJ1ZSxcclxuICAgICAgYW5nbGVTaG93TGluZU91dCA6IHRydWUsXHJcbiAgICAgIHNjYWxlU2hvd0xhYmVscyA6IGZhbHNlLFxyXG4gICAgICBzY2FsZUJlZ2luQXRaZXJvIDogdHJ1ZSxcclxuICAgICAgYW5nbGVMaW5lQ29sb3IgOiAncmdiYSgwLDAsMCwuMSknLFxyXG4gICAgICBhbmdsZUxpbmVXaWR0aCA6IDEsXHJcbiAgICAgIHBvaW50TGFiZWxGb250RmFtaWx5IDogXCInQXJpYWwnXCIsXHJcbiAgICAgIHBvaW50TGFiZWxGb250U3R5bGUgOiAnYm9sZCcsXHJcbiAgICAgIHBvaW50TGFiZWxGb250U2l6ZSA6IDEwLFxyXG4gICAgICBwb2ludExhYmVsRm9udENvbG9yIDogJyM1NjU2NTYnLFxyXG4gICAgICBwb2ludERvdCA6IHRydWUsXHJcbiAgICAgIHBvaW50RG90UmFkaXVzIDogMyxcclxuICAgICAgcG9pbnREb3RTdHJva2VXaWR0aCA6IDEsXHJcbiAgICAgIHBvaW50SGl0RGV0ZWN0aW9uUmFkaXVzIDogMjAsXHJcbiAgICAgIGRhdGFzZXRTdHJva2UgOiB0cnVlLFxyXG4gICAgICBkYXRhc2V0U3Ryb2tlV2lkdGggOiAyLFxyXG4gICAgICBkYXRhc2V0RmlsbCA6IHRydWUsXHJcbiAgICAgIHJlc3BvbnNpdmU6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgdmFyIHJhZGFyY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGFydGpzLXJhZGFyY2hhcnRcIikuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgdmFyIHJhZGFyQ2hhcnQgPSBuZXcgQ2hhcnQocmFkYXJjdHgpLlJhZGFyKHJhZGFyRGF0YSwgcmFkYXJPcHRpb25zKTtcclxuXHJcbiAgfSk7XHJcblxyXG59KSh3aW5kb3csIGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5KTtcclxuIiwiLy8gQ2hhcnRpc3RcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcblxyXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKXtcclxuXHJcbiAgJChmdW5jdGlvbigpe1xyXG5cclxuICAgIGlmICggdHlwZW9mIENoYXJ0aXN0ID09PSAndW5kZWZpbmVkJyApIHJldHVybjtcclxuXHJcbiAgICAvLyBCYXIgYmlwb2xhclxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcbiAgICB2YXIgZGF0YTEgPSB7XHJcbiAgICAgIGxhYmVsczogWydXMScsICdXMicsICdXMycsICdXNCcsICdXNScsICdXNicsICdXNycsICdXOCcsICdXOScsICdXMTAnXSxcclxuICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgWzEsIDIsIDQsIDgsIDYsIC0yLCAtMSwgLTQsIC02LCAtMl1cclxuICAgICAgXVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgb3B0aW9uczEgPSB7XHJcbiAgICAgIGhpZ2g6IDEwLFxyXG4gICAgICBsb3c6IC0xMCxcclxuICAgICAgaGVpZ2h0OiAyODAsXHJcbiAgICAgIGF4aXNYOiB7XHJcbiAgICAgICAgbGFiZWxJbnRlcnBvbGF0aW9uRm5jOiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcclxuICAgICAgICAgIHJldHVybiBpbmRleCAlIDIgPT09IDAgPyB2YWx1ZSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIG5ldyBDaGFydGlzdC5CYXIoJyNjdC1iYXIxJywgZGF0YTEsIG9wdGlvbnMxKTtcclxuXHJcbiAgICAvLyBCYXIgSG9yaXpvbnRhbFxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcbiAgICBuZXcgQ2hhcnRpc3QuQmFyKCcjY3QtYmFyMicsIHtcclxuICAgICAgbGFiZWxzOiBbJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknLCAnU3VuZGF5J10sXHJcbiAgICAgIHNlcmllczogW1xyXG4gICAgICAgIFs1LCA0LCAzLCA3LCA1LCAxMCwgM10sXHJcbiAgICAgICAgWzMsIDIsIDksIDUsIDQsIDYsIDRdXHJcbiAgICAgIF1cclxuICAgIH0sIHtcclxuICAgICAgc2VyaWVzQmFyRGlzdGFuY2U6IDEwLFxyXG4gICAgICByZXZlcnNlRGF0YTogdHJ1ZSxcclxuICAgICAgaG9yaXpvbnRhbEJhcnM6IHRydWUsXHJcbiAgICAgIGhlaWdodDogMjgwLFxyXG4gICAgICBheGlzWToge1xyXG4gICAgICAgIG9mZnNldDogNzBcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gTGluZVxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcbiAgICBuZXcgQ2hhcnRpc3QuTGluZSgnI2N0LWxpbmUxJywge1xyXG4gICAgICBsYWJlbHM6IFsnTW9uZGF5JywgJ1R1ZXNkYXknLCAnV2VkbmVzZGF5JywgJ1RodXJzZGF5JywgJ0ZyaWRheSddLFxyXG4gICAgICBzZXJpZXM6IFtcclxuICAgICAgICBbMTIsIDksIDcsIDgsIDVdLFxyXG4gICAgICAgIFsyLCAxLCAzLjUsIDcsIDNdLFxyXG4gICAgICAgIFsxLCAzLCA0LCA1LCA2XVxyXG4gICAgICBdXHJcbiAgICB9LCB7XHJcbiAgICAgIGZ1bGxXaWR0aDogdHJ1ZSxcclxuICAgICAgaGVpZ2h0OiAyODAsXHJcbiAgICAgIGNoYXJ0UGFkZGluZzoge1xyXG4gICAgICAgIHJpZ2h0OiA0MFxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gU1ZHIEFuaW1hdGlvblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcblxyXG4gICAgdmFyIGNoYXJ0MSA9IG5ldyBDaGFydGlzdC5MaW5lKCcjY3QtbGluZTMnLCB7XHJcbiAgICAgIGxhYmVsczogWydNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJywgJ1NhdCddLFxyXG4gICAgICBzZXJpZXM6IFtcclxuICAgICAgICBbMSwgNSwgMiwgNSwgNCwgM10sXHJcbiAgICAgICAgWzIsIDMsIDQsIDgsIDEsIDJdLFxyXG4gICAgICAgIFs1LCA0LCAzLCAyLCAxLCAwLjVdXHJcbiAgICAgIF1cclxuICAgIH0sIHtcclxuICAgICAgbG93OiAwLFxyXG4gICAgICBzaG93QXJlYTogdHJ1ZSxcclxuICAgICAgc2hvd1BvaW50OiBmYWxzZSxcclxuICAgICAgZnVsbFdpZHRoOiB0cnVlLFxyXG4gICAgICBoZWlnaHQ6IDMwMFxyXG4gICAgfSk7XHJcblxyXG4gICAgY2hhcnQxLm9uKCdkcmF3JywgZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICBpZihkYXRhLnR5cGUgPT09ICdsaW5lJyB8fCBkYXRhLnR5cGUgPT09ICdhcmVhJykge1xyXG4gICAgICAgIGRhdGEuZWxlbWVudC5hbmltYXRlKHtcclxuICAgICAgICAgIGQ6IHtcclxuICAgICAgICAgICAgYmVnaW46IDIwMDAgKiBkYXRhLmluZGV4LFxyXG4gICAgICAgICAgICBkdXI6IDIwMDAsXHJcbiAgICAgICAgICAgIGZyb206IGRhdGEucGF0aC5jbG9uZSgpLnNjYWxlKDEsIDApLnRyYW5zbGF0ZSgwLCBkYXRhLmNoYXJ0UmVjdC5oZWlnaHQoKSkuc3RyaW5naWZ5KCksXHJcbiAgICAgICAgICAgIHRvOiBkYXRhLnBhdGguY2xvbmUoKS5zdHJpbmdpZnkoKSxcclxuICAgICAgICAgICAgZWFzaW5nOiBDaGFydGlzdC5TdmcuRWFzaW5nLmVhc2VPdXRRdWludFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gU2xpbSBhbmltYXRpb25cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG5cclxuXHJcbiAgICB2YXIgY2hhcnQgPSBuZXcgQ2hhcnRpc3QuTGluZSgnI2N0LWxpbmUyJywge1xyXG4gICAgICBsYWJlbHM6IFsnMScsICcyJywgJzMnLCAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknLCAnMTAnLCAnMTEnLCAnMTInXSxcclxuICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgWzEyLCA5LCA3LCA4LCA1LCA0LCA2LCAyLCAzLCAzLCA0LCA2XSxcclxuICAgICAgICBbNCwgIDUsIDMsIDcsIDMsIDUsIDUsIDMsIDQsIDQsIDUsIDVdLFxyXG4gICAgICAgIFs1LCAgMywgNCwgNSwgNiwgMywgMywgNCwgNSwgNiwgMywgNF0sXHJcbiAgICAgICAgWzMsICA0LCA1LCA2LCA3LCA2LCA0LCA1LCA2LCA3LCA2LCAzXVxyXG4gICAgICBdXHJcbiAgICB9LCB7XHJcbiAgICAgIGxvdzogMCxcclxuICAgICAgaGVpZ2h0OiAzMDBcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIExldCdzIHB1dCBhIHNlcXVlbmNlIG51bWJlciBhc2lkZSBzbyB3ZSBjYW4gdXNlIGl0IGluIHRoZSBldmVudCBjYWxsYmFja3NcclxuICAgIHZhciBzZXEgPSAwLFxyXG4gICAgICBkZWxheXMgPSA4MCxcclxuICAgICAgZHVyYXRpb25zID0gNTAwO1xyXG5cclxuICAgIC8vIE9uY2UgdGhlIGNoYXJ0IGlzIGZ1bGx5IGNyZWF0ZWQgd2UgcmVzZXQgdGhlIHNlcXVlbmNlXHJcbiAgICBjaGFydC5vbignY3JlYXRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBzZXEgPSAwO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gT24gZWFjaCBkcmF3biBlbGVtZW50IGJ5IENoYXJ0aXN0IHdlIHVzZSB0aGUgQ2hhcnRpc3QuU3ZnIEFQSSB0byB0cmlnZ2VyIFNNSUwgYW5pbWF0aW9uc1xyXG4gICAgY2hhcnQub24oJ2RyYXcnLCBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIHNlcSsrO1xyXG5cclxuICAgICAgaWYoZGF0YS50eXBlID09PSAnbGluZScpIHtcclxuICAgICAgICAvLyBJZiB0aGUgZHJhd24gZWxlbWVudCBpcyBhIGxpbmUgd2UgZG8gYSBzaW1wbGUgb3BhY2l0eSBmYWRlIGluLiBUaGlzIGNvdWxkIGFsc28gYmUgYWNoaWV2ZWQgdXNpbmcgQ1NTMyBhbmltYXRpb25zLlxyXG4gICAgICAgIGRhdGEuZWxlbWVudC5hbmltYXRlKHtcclxuICAgICAgICAgIG9wYWNpdHk6IHtcclxuICAgICAgICAgICAgLy8gVGhlIGRlbGF5IHdoZW4gd2UgbGlrZSB0byBzdGFydCB0aGUgYW5pbWF0aW9uXHJcbiAgICAgICAgICAgIGJlZ2luOiBzZXEgKiBkZWxheXMgKyAxMDAwLFxyXG4gICAgICAgICAgICAvLyBEdXJhdGlvbiBvZiB0aGUgYW5pbWF0aW9uXHJcbiAgICAgICAgICAgIGR1cjogZHVyYXRpb25zLFxyXG4gICAgICAgICAgICAvLyBUaGUgdmFsdWUgd2hlcmUgdGhlIGFuaW1hdGlvbiBzaG91bGQgc3RhcnRcclxuICAgICAgICAgICAgZnJvbTogMCxcclxuICAgICAgICAgICAgLy8gVGhlIHZhbHVlIHdoZXJlIGl0IHNob3VsZCBlbmRcclxuICAgICAgICAgICAgdG86IDFcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIGlmKGRhdGEudHlwZSA9PT0gJ2xhYmVsJyAmJiBkYXRhLmF4aXMgPT09ICd4Jykge1xyXG4gICAgICAgIGRhdGEuZWxlbWVudC5hbmltYXRlKHtcclxuICAgICAgICAgIHk6IHtcclxuICAgICAgICAgICAgYmVnaW46IHNlcSAqIGRlbGF5cyxcclxuICAgICAgICAgICAgZHVyOiBkdXJhdGlvbnMsXHJcbiAgICAgICAgICAgIGZyb206IGRhdGEueSArIDEwMCxcclxuICAgICAgICAgICAgdG86IGRhdGEueSxcclxuICAgICAgICAgICAgLy8gV2UgY2FuIHNwZWNpZnkgYW4gZWFzaW5nIGZ1bmN0aW9uIGZyb20gQ2hhcnRpc3QuU3ZnLkVhc2luZ1xyXG4gICAgICAgICAgICBlYXNpbmc6ICdlYXNlT3V0UXVhcnQnXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZihkYXRhLnR5cGUgPT09ICdsYWJlbCcgJiYgZGF0YS5heGlzID09PSAneScpIHtcclxuICAgICAgICBkYXRhLmVsZW1lbnQuYW5pbWF0ZSh7XHJcbiAgICAgICAgICB4OiB7XHJcbiAgICAgICAgICAgIGJlZ2luOiBzZXEgKiBkZWxheXMsXHJcbiAgICAgICAgICAgIGR1cjogZHVyYXRpb25zLFxyXG4gICAgICAgICAgICBmcm9tOiBkYXRhLnggLSAxMDAsXHJcbiAgICAgICAgICAgIHRvOiBkYXRhLngsXHJcbiAgICAgICAgICAgIGVhc2luZzogJ2Vhc2VPdXRRdWFydCdcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIGlmKGRhdGEudHlwZSA9PT0gJ3BvaW50Jykge1xyXG4gICAgICAgIGRhdGEuZWxlbWVudC5hbmltYXRlKHtcclxuICAgICAgICAgIHgxOiB7XHJcbiAgICAgICAgICAgIGJlZ2luOiBzZXEgKiBkZWxheXMsXHJcbiAgICAgICAgICAgIGR1cjogZHVyYXRpb25zLFxyXG4gICAgICAgICAgICBmcm9tOiBkYXRhLnggLSAxMCxcclxuICAgICAgICAgICAgdG86IGRhdGEueCxcclxuICAgICAgICAgICAgZWFzaW5nOiAnZWFzZU91dFF1YXJ0J1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHgyOiB7XHJcbiAgICAgICAgICAgIGJlZ2luOiBzZXEgKiBkZWxheXMsXHJcbiAgICAgICAgICAgIGR1cjogZHVyYXRpb25zLFxyXG4gICAgICAgICAgICBmcm9tOiBkYXRhLnggLSAxMCxcclxuICAgICAgICAgICAgdG86IGRhdGEueCxcclxuICAgICAgICAgICAgZWFzaW5nOiAnZWFzZU91dFF1YXJ0J1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG9wYWNpdHk6IHtcclxuICAgICAgICAgICAgYmVnaW46IHNlcSAqIGRlbGF5cyxcclxuICAgICAgICAgICAgZHVyOiBkdXJhdGlvbnMsXHJcbiAgICAgICAgICAgIGZyb206IDAsXHJcbiAgICAgICAgICAgIHRvOiAxLFxyXG4gICAgICAgICAgICBlYXNpbmc6ICdlYXNlT3V0UXVhcnQnXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZihkYXRhLnR5cGUgPT09ICdncmlkJykge1xyXG4gICAgICAgIC8vIFVzaW5nIGRhdGEuYXhpcyB3ZSBnZXQgeCBvciB5IHdoaWNoIHdlIGNhbiB1c2UgdG8gY29uc3RydWN0IG91ciBhbmltYXRpb24gZGVmaW5pdGlvbiBvYmplY3RzXHJcbiAgICAgICAgdmFyIHBvczFBbmltYXRpb24gPSB7XHJcbiAgICAgICAgICBiZWdpbjogc2VxICogZGVsYXlzLFxyXG4gICAgICAgICAgZHVyOiBkdXJhdGlvbnMsXHJcbiAgICAgICAgICBmcm9tOiBkYXRhW2RhdGEuYXhpcy51bml0cy5wb3MgKyAnMSddIC0gMzAsXHJcbiAgICAgICAgICB0bzogZGF0YVtkYXRhLmF4aXMudW5pdHMucG9zICsgJzEnXSxcclxuICAgICAgICAgIGVhc2luZzogJ2Vhc2VPdXRRdWFydCdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgcG9zMkFuaW1hdGlvbiA9IHtcclxuICAgICAgICAgIGJlZ2luOiBzZXEgKiBkZWxheXMsXHJcbiAgICAgICAgICBkdXI6IGR1cmF0aW9ucyxcclxuICAgICAgICAgIGZyb206IGRhdGFbZGF0YS5heGlzLnVuaXRzLnBvcyArICcyJ10gLSAxMDAsXHJcbiAgICAgICAgICB0bzogZGF0YVtkYXRhLmF4aXMudW5pdHMucG9zICsgJzInXSxcclxuICAgICAgICAgIGVhc2luZzogJ2Vhc2VPdXRRdWFydCdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgYW5pbWF0aW9ucyA9IHt9O1xyXG4gICAgICAgIGFuaW1hdGlvbnNbZGF0YS5heGlzLnVuaXRzLnBvcyArICcxJ10gPSBwb3MxQW5pbWF0aW9uO1xyXG4gICAgICAgIGFuaW1hdGlvbnNbZGF0YS5heGlzLnVuaXRzLnBvcyArICcyJ10gPSBwb3MyQW5pbWF0aW9uO1xyXG4gICAgICAgIGFuaW1hdGlvbnNbJ29wYWNpdHknXSA9IHtcclxuICAgICAgICAgIGJlZ2luOiBzZXEgKiBkZWxheXMsXHJcbiAgICAgICAgICBkdXI6IGR1cmF0aW9ucyxcclxuICAgICAgICAgIGZyb206IDAsXHJcbiAgICAgICAgICB0bzogMSxcclxuICAgICAgICAgIGVhc2luZzogJ2Vhc2VPdXRRdWFydCdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBkYXRhLmVsZW1lbnQuYW5pbWF0ZShhbmltYXRpb25zKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRm9yIHRoZSBzYWtlIG9mIHRoZSBleGFtcGxlIHdlIHVwZGF0ZSB0aGUgY2hhcnQgZXZlcnkgdGltZSBpdCdzIGNyZWF0ZWQgd2l0aCBhIGRlbGF5IG9mIDEwIHNlY29uZHNcclxuICAgIGNoYXJ0Lm9uKCdjcmVhdGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmKHdpbmRvdy5fX2V4YW1wbGVBbmltYXRlVGltZW91dCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh3aW5kb3cuX19leGFtcGxlQW5pbWF0ZVRpbWVvdXQpO1xyXG4gICAgICAgIHdpbmRvdy5fX2V4YW1wbGVBbmltYXRlVGltZW91dCA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgd2luZG93Ll9fZXhhbXBsZUFuaW1hdGVUaW1lb3V0ID0gc2V0VGltZW91dChjaGFydC51cGRhdGUuYmluZChjaGFydCksIDEyMDAwKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgfSk7XHJcblxyXG59KSh3aW5kb3csIGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5KTtcclxuIiwiLy8gQ0xBU1NZTE9BREVSXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQsIHVuZGVmaW5lZCl7XG5cbiAgJChmdW5jdGlvbigpe1xuXG4gICAgdmFyICRzY3JvbGxlciAgICAgICA9ICQod2luZG93KSxcbiAgICAgICAgaW5WaWV3RmxhZ0NsYXNzID0gJ2pzLWlzLWluLXZpZXcnOyAvLyBhIGNsYXNzbmFtZSB0byBkZXRlY3Qgd2hlbiBhIGNoYXJ0IGhhcyBiZWVuIHRyaWdnZXJlZCBhZnRlciBzY3JvbGxcblxuICAgICQoJ1tkYXRhLWNsYXNzeWxvYWRlcl0nKS5lYWNoKGluaXRDbGFzc3lMb2FkZXIpO1xuICAgIFxuICAgIGZ1bmN0aW9uIGluaXRDbGFzc3lMb2FkZXIoKSB7XG4gICAgXG4gICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpLFxuICAgICAgICAgIG9wdGlvbnMgID0gJGVsZW1lbnQuZGF0YSgpO1xuICAgICAgXG4gICAgICAvLyBBdCBsZWFzZSB3ZSBuZWVkIGEgZGF0YS1wZXJjZW50YWdlIGF0dHJpYnV0ZVxuICAgICAgaWYob3B0aW9ucykge1xuICAgICAgICBpZiggb3B0aW9ucy50cmlnZ2VySW5WaWV3ICkge1xuXG4gICAgICAgICAgJHNjcm9sbGVyLnNjcm9sbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNoZWNrTG9hZGVySW5WSWV3KCRlbGVtZW50LCBvcHRpb25zKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvLyBpZiB0aGUgZWxlbWVudCBzdGFydHMgYWxyZWFkeSBpbiB2aWV3XG4gICAgICAgICAgY2hlY2tMb2FkZXJJblZJZXcoJGVsZW1lbnQsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzdGFydExvYWRlcigkZWxlbWVudCwgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNoZWNrTG9hZGVySW5WSWV3KGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBvZmZzZXQgPSAtMjA7XG4gICAgICBpZiggISBlbGVtZW50Lmhhc0NsYXNzKGluVmlld0ZsYWdDbGFzcykgJiZcbiAgICAgICAgICAkLlV0aWxzLmlzSW5WaWV3KGVsZW1lbnQsIHt0b3BvZmZzZXQ6IG9mZnNldH0pICkge1xuICAgICAgICBzdGFydExvYWRlcihlbGVtZW50LCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc3RhcnRMb2FkZXIoZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgZWxlbWVudC5DbGFzc3lMb2FkZXIob3B0aW9ucykuYWRkQ2xhc3MoaW5WaWV3RmxhZ0NsYXNzKTtcbiAgICB9XG5cbiAgfSk7XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpO1xuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IGNsZWFyLXN0b3JhZ2UuanNcbiAqIFJlbW92ZXMgYSBrZXkgZnJvbSB0aGUgYnJvd3NlciBzdG9yYWdlIHZpYSBlbGVtZW50IGNsaWNrXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuKGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQpe1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIFNlbGVjdG9yID0gJ1tkYXRhLXJlc2V0LWtleV0nO1xuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIFNlbGVjdG9yLCBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIGtleSA9ICQodGhpcykuZGF0YSgncmVzZXRLZXknKTtcbiAgICAgIFxuICAgICAgaWYoa2V5KSB7XG4gICAgICAgICQubG9jYWxTdG9yYWdlLnJlbW92ZShrZXkpO1xuICAgICAgICAvLyByZWxvYWQgdGhlIHBhZ2VcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICQuZXJyb3IoJ05vIHN0b3JhZ2Uga2V5IHNwZWNpZmllZCBmb3IgcmVzZXQuJyk7XG4gICAgICB9XG4gIH0pO1xuXG59KGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCkpO1xuIiwiLy8gQ29sb3IgcGlja2VyXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKXtcclxuXHJcbiAgJChmdW5jdGlvbigpe1xyXG5cclxuICAgIGlmKCEkLmZuLmNvbG9ycGlja2VyKSByZXR1cm47XHJcblxyXG4gICAgJCgnLmRlbW8tY29sb3JwaWNrZXInKS5jb2xvcnBpY2tlcigpO1xyXG5cclxuICAgICQoJyNkZW1vX3NlbGVjdG9ycycpLmNvbG9ycGlja2VyKHtcclxuICAgICAgY29sb3JTZWxlY3RvcnM6IHtcclxuICAgICAgICAnZGVmYXVsdCc6ICcjNzc3Nzc3JyxcclxuICAgICAgICAncHJpbWFyeSc6IEFQUF9DT0xPUlNbJ3ByaW1hcnknXSxcclxuICAgICAgICAnc3VjY2Vzcyc6IEFQUF9DT0xPUlNbJ3N1Y2Nlc3MnXSxcclxuICAgICAgICAnaW5mbyc6ICAgIEFQUF9DT0xPUlNbJ2luZm8nXSxcclxuICAgICAgICAnd2FybmluZyc6IEFQUF9DT0xPUlNbJ3dhcm5pbmcnXSxcclxuICAgICAgICAnZGFuZ2VyJzogIEFQUF9DT0xPUlNbJ2RhbmdlciddXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICB9KTtcclxuXHJcbn0pKHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpO1xyXG4iLCIvLyBHTE9CQUwgQ09OU1RBTlRTXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKXtcblxuICB3aW5kb3cuQVBQX0NPTE9SUyA9IHtcbiAgICAncHJpbWFyeSc6ICAgICAgICAgICAgICAgICcjNWQ5Y2VjJyxcbiAgICAnc3VjY2Vzcyc6ICAgICAgICAgICAgICAgICcjMjdjMjRjJyxcbiAgICAnaW5mbyc6ICAgICAgICAgICAgICAgICAgICcjMjNiN2U1JyxcbiAgICAnd2FybmluZyc6ICAgICAgICAgICAgICAgICcjZmY5MDJiJyxcbiAgICAnZGFuZ2VyJzogICAgICAgICAgICAgICAgICcjZjA1MDUwJyxcbiAgICAnaW52ZXJzZSc6ICAgICAgICAgICAgICAgICcjMTMxZTI2JyxcbiAgICAnZ3JlZW4nOiAgICAgICAgICAgICAgICAgICcjMzdiYzliJyxcbiAgICAncGluayc6ICAgICAgICAgICAgICAgICAgICcjZjUzMmU1JyxcbiAgICAncHVycGxlJzogICAgICAgICAgICAgICAgICcjNzI2NmJhJyxcbiAgICAnZGFyayc6ICAgICAgICAgICAgICAgICAgICcjM2EzZjUxJyxcbiAgICAneWVsbG93JzogICAgICAgICAgICAgICAgICcjZmFkNzMyJyxcbiAgICAnZ3JheS1kYXJrZXInOiAgICAgICAgICAgICcjMjMyNzM1JyxcbiAgICAnZ3JheS1kYXJrJzogICAgICAgICAgICAgICcjM2EzZjUxJyxcbiAgICAnZ3JheSc6ICAgICAgICAgICAgICAgICAgICcjZGRlNmU5JyxcbiAgICAnZ3JheS1saWdodCc6ICAgICAgICAgICAgICcjZTRlYWVjJyxcbiAgICAnZ3JheS1saWdodGVyJzogICAgICAgICAgICcjZWRmMWYyJ1xuICB9O1xuICBcbiAgd2luZG93LkFQUF9NRURJQVFVRVJZID0ge1xuICAgICdkZXNrdG9wTEcnOiAgICAgICAgICAgICAxMjAwLFxuICAgICdkZXNrdG9wJzogICAgICAgICAgICAgICAgOTkyLFxuICAgICd0YWJsZXQnOiAgICAgICAgICAgICAgICAgNzY4LFxuICAgICdtb2JpbGUnOiAgICAgICAgICAgICAgICAgNDgwXG4gIH07XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpO1xuXG4iLCIvLyBNQVJLRE9XTiBET0NTXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKXtcblxuICAkKGZ1bmN0aW9uKCl7XG5cbiAgICAkKCcuZmxhdGRvYycpLmVhY2goZnVuY3Rpb24oKXtcblxuICAgICAgRmxhdGRvYy5ydW4oe1xuICAgICAgICBcbiAgICAgICAgZmV0Y2hlcjogRmxhdGRvYy5maWxlKCdkb2N1bWVudGF0aW9uL3JlYWRtZS5tZCcpLFxuXG4gICAgICAgIC8vIFNldHVwIGN1c3RvbSBlbGVtZW50IHNlbGVjdG9ycyAobWFya3VwIHZhbGlkYXRlcylcbiAgICAgICAgcm9vdDogICAgJy5mbGF0ZG9jJyxcbiAgICAgICAgbWVudTogICAgJy5mbGF0ZG9jLW1lbnUnLFxuICAgICAgICB0aXRsZTogICAnLmZsYXRkb2MtdGl0bGUnLFxuICAgICAgICBjb250ZW50OiAnLmZsYXRkb2MtY29udGVudCdcblxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuXG4gIH0pO1xuXG59KSh3aW5kb3csIGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5KTtcbiIsIi8vIEZVTExTQ1JFRU5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKXtcblxuICBpZiAoIHR5cGVvZiBzY3JlZW5mdWxsID09PSAndW5kZWZpbmVkJyApIHJldHVybjtcblxuICAkKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgJGRvYyA9ICQoZG9jdW1lbnQpO1xuICAgIHZhciAkZnNUb2dnbGVyID0gJCgnW2RhdGEtdG9nZ2xlLWZ1bGxzY3JlZW5dJyk7XG5cbiAgICAvLyBOb3Qgc3VwcG9ydGVkIHVuZGVyIElFXG4gICAgdmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgaWYoIHVhLmluZGV4T2YoXCJNU0lFIFwiKSA+IDAgfHwgISF1YS5tYXRjaCgvVHJpZGVudC4qcnZcXDoxMVxcLi8pICkge1xuICAgICAgJGZzVG9nZ2xlci5hZGRDbGFzcygnaGlkZScpO1xuICAgIH1cblxuICAgIGlmICggISAkZnNUb2dnbGVyLmlzKCc6dmlzaWJsZScpICkgLy8gaGlkZGVuIG9uIG1vYmlsZXMgb3IgSUVcbiAgICAgIHJldHVybjtcblxuICAgICRmc1RvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmIChzY3JlZW5mdWxsLmVuYWJsZWQpIHtcbiAgICAgICAgICBcbiAgICAgICAgICBzY3JlZW5mdWxsLnRvZ2dsZSgpO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIFN3aXRjaCBpY29uIGluZGljYXRvclxuICAgICAgICAgIHRvZ2dsZUZTSWNvbiggJGZzVG9nZ2xlciApO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0Z1bGxzY3JlZW4gbm90IGVuYWJsZWQnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCBzY3JlZW5mdWxsLnJhdyAmJiBzY3JlZW5mdWxsLnJhdy5mdWxsc2NyZWVuY2hhbmdlKVxuICAgICAgJGRvYy5vbihzY3JlZW5mdWxsLnJhdy5mdWxsc2NyZWVuY2hhbmdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdG9nZ2xlRlNJY29uKCRmc1RvZ2dsZXIpO1xuICAgICAgfSk7XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVGU0ljb24oJGVsZW1lbnQpIHtcbiAgICAgIGlmKHNjcmVlbmZ1bGwuaXNGdWxsc2NyZWVuKVxuICAgICAgICAkZWxlbWVudC5jaGlsZHJlbignZW0nKS5yZW1vdmVDbGFzcygnZmEtZXhwYW5kJykuYWRkQ2xhc3MoJ2ZhLWNvbXByZXNzJyk7XG4gICAgICBlbHNlXG4gICAgICAgICRlbGVtZW50LmNoaWxkcmVuKCdlbScpLnJlbW92ZUNsYXNzKCdmYS1jb21wcmVzcycpLmFkZENsYXNzKCdmYS1leHBhbmQnKTtcbiAgICB9XG5cbiAgfSk7XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpO1xuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IGdtYXAuanNcbiAqIEluaXQgR29vZ2xlIE1hcCBwbHVnaW5cbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCl7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1hcCBTdHlsZSBkZWZpbml0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBDdXN0b20gY29yZSBzdHlsZXNcbiAgLy8gR2V0IG1vcmUgc3R5bGVzIGZyb20gaHR0cDovL3NuYXp6eW1hcHMuY29tL3N0eWxlLzI5L2xpZ2h0LW1vbm9jaHJvbWVcbiAgLy8gLSBKdXN0IHJlcGxhY2UgYW5kIGFzc2lnbiB0byAnTWFwU3R5bGVzJyB0aGUgbmV3IHN0eWxlIGFycmF5XG4gIHZhciBNYXBTdHlsZXMgPSBbe2ZlYXR1cmVUeXBlOid3YXRlcicsc3R5bGVyczpbe3Zpc2liaWxpdHk6J29uJ30se2NvbG9yOicjYmRkMWY5J31dfSx7ZmVhdHVyZVR5cGU6J2FsbCcsZWxlbWVudFR5cGU6J2xhYmVscy50ZXh0LmZpbGwnLHN0eWxlcnM6W3tjb2xvcjonIzMzNDE2NSd9XX0se2ZlYXR1cmVUeXBlOidsYW5kc2NhcGUnLHN0eWxlcnM6W3tjb2xvcjonI2U5ZWJmMSd9XX0se2ZlYXR1cmVUeXBlOidyb2FkLmhpZ2h3YXknLGVsZW1lbnRUeXBlOidnZW9tZXRyeScsc3R5bGVyczpbe2NvbG9yOicjYzVjNmM2J31dfSx7ZmVhdHVyZVR5cGU6J3JvYWQuYXJ0ZXJpYWwnLGVsZW1lbnRUeXBlOidnZW9tZXRyeScsc3R5bGVyczpbe2NvbG9yOicjZmZmJ31dfSx7ZmVhdHVyZVR5cGU6J3JvYWQubG9jYWwnLGVsZW1lbnRUeXBlOidnZW9tZXRyeScsc3R5bGVyczpbe2NvbG9yOicjZmZmJ31dfSx7ZmVhdHVyZVR5cGU6J3RyYW5zaXQnLGVsZW1lbnRUeXBlOidnZW9tZXRyeScsc3R5bGVyczpbe2NvbG9yOicjZDhkYmUwJ31dfSx7ZmVhdHVyZVR5cGU6J3BvaScsZWxlbWVudFR5cGU6J2dlb21ldHJ5JyxzdHlsZXJzOlt7Y29sb3I6JyNjZmQ1ZTAnfV19LHtmZWF0dXJlVHlwZTonYWRtaW5pc3RyYXRpdmUnLHN0eWxlcnM6W3t2aXNpYmlsaXR5Oidvbid9LHtsaWdodG5lc3M6MzN9XX0se2ZlYXR1cmVUeXBlOidwb2kucGFyaycsZWxlbWVudFR5cGU6J2xhYmVscycsc3R5bGVyczpbe3Zpc2liaWxpdHk6J29uJ30se2xpZ2h0bmVzczoyMH1dfSx7ZmVhdHVyZVR5cGU6J3JvYWQnLHN0eWxlcnM6W3tjb2xvcjonI2Q4ZGJlMCcsbGlnaHRuZXNzOjIwfV19XTtcblxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ3VzdG9tIFNjcmlwdFxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIG1hcFNlbGVjdG9yID0gJ1tkYXRhLWdtYXBdJztcblxuICBpZigkLmZuLmdNYXApIHtcbiAgICAgIHZhciBnTWFwUmVmcyA9IFtdO1xuICAgICAgXG4gICAgICAkKG1hcFNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgXG4gICAgICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICBhZGRyZXNzZXMgPSAkdGhpcy5kYXRhKCdhZGRyZXNzJykgJiYgJHRoaXMuZGF0YSgnYWRkcmVzcycpLnNwbGl0KCc7JyksXG4gICAgICAgICAgICAgIHRpdGxlcyAgICA9ICR0aGlzLmRhdGEoJ3RpdGxlJykgJiYgJHRoaXMuZGF0YSgndGl0bGUnKS5zcGxpdCgnOycpLFxuICAgICAgICAgICAgICB6b29tICAgICAgPSAkdGhpcy5kYXRhKCd6b29tJykgfHwgMTQsXG4gICAgICAgICAgICAgIG1hcHR5cGUgICA9ICR0aGlzLmRhdGEoJ21hcHR5cGUnKSB8fCAnUk9BRE1BUCcsIC8vIG9yICdURVJSQUlOJ1xuICAgICAgICAgICAgICBtYXJrZXJzICAgPSBbXTtcblxuICAgICAgICAgIGlmKGFkZHJlc3Nlcykge1xuICAgICAgICAgICAgZm9yKHZhciBhIGluIGFkZHJlc3NlcykgIHtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgYWRkcmVzc2VzW2FdID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiAgYWRkcmVzc2VzW2FdLFxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbDogICAgICh0aXRsZXMgJiYgdGl0bGVzW2FdKSB8fCAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwOiAgICB0cnVlICAgLyogQWx3YXlzIHBvcHVwICovXG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBjb250cm9sczoge1xuICAgICAgICAgICAgICAgICAgICAgICBwYW5Db250cm9sOiAgICAgICAgIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgIHpvb21Db250cm9sOiAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgbWFwVHlwZUNvbnRyb2w6ICAgICB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICBzY2FsZUNvbnRyb2w6ICAgICAgIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgIHN0cmVldFZpZXdDb250cm9sOiAgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgb3ZlcnZpZXdNYXBDb250cm9sOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgbWFwdHlwZTogbWFwdHlwZSxcbiAgICAgICAgICAgICAgICBtYXJrZXJzOiBtYXJrZXJzLFxuICAgICAgICAgICAgICAgIHpvb206IHpvb21cbiAgICAgICAgICAgICAgICAvLyBNb3JlIG9wdGlvbnMgaHR0cHM6Ly9naXRodWIuY29tL21hcmlvZXN0cmFkYS9qUXVlcnktZ01hcFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGdNYXAgPSAkdGhpcy5nTWFwKG9wdGlvbnMpO1xuXG4gICAgICAgICAgICB2YXIgcmVmID0gZ01hcC5kYXRhKCdnTWFwLnJlZmVyZW5jZScpO1xuICAgICAgICAgICAgLy8gc2F2ZSBpbiB0aGUgbWFwIHJlZmVyZW5jZXMgbGlzdFxuICAgICAgICAgICAgZ01hcFJlZnMucHVzaChyZWYpO1xuXG4gICAgICAgICAgICAvLyBzZXQgdGhlIHN0eWxlc1xuICAgICAgICAgICAgaWYoJHRoaXMuZGF0YSgnc3R5bGVkJykgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgcmVmLnNldE9wdGlvbnMoe1xuICAgICAgICAgICAgICAgIHN0eWxlczogTWFwU3R5bGVzXG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICB9KTsgLy9lYWNoXG4gIH1cblxufShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpKTtcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IEltYWdlIENyb3BwZXJcclxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblxyXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgJChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgaWYoISAkLmZuLmNyb3BwZXIgKSByZXR1cm47XHJcblxyXG4gICAgICAgIHZhciAkaW1hZ2UgPSAkKCcuaW1nLWNvbnRhaW5lciA+IGltZycpLFxyXG4gICAgICAgICAgICAkZGF0YVggPSAkKCcjZGF0YVgnKSxcclxuICAgICAgICAgICAgJGRhdGFZID0gJCgnI2RhdGFZJyksXHJcbiAgICAgICAgICAgICRkYXRhSGVpZ2h0ID0gJCgnI2RhdGFIZWlnaHQnKSxcclxuICAgICAgICAgICAgJGRhdGFXaWR0aCA9ICQoJyNkYXRhV2lkdGgnKSxcclxuICAgICAgICAgICAgJGRhdGFSb3RhdGUgPSAkKCcjZGF0YVJvdGF0ZScpLFxyXG4gICAgICAgICAgICBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgLy8gZGF0YToge1xyXG4gICAgICAgICAgICAgICAgLy8gICB4OiA0MjAsXHJcbiAgICAgICAgICAgICAgICAvLyAgIHk6IDYwLFxyXG4gICAgICAgICAgICAgICAgLy8gICB3aWR0aDogNjQwLFxyXG4gICAgICAgICAgICAgICAgLy8gICBoZWlnaHQ6IDM2MFxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIC8vIHN0cmljdDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyByZXNwb25zaXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrSW1hZ2VPcmlnaW46IGZhbHNlXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy8gZ3VpZGVzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vIGhpZ2hsaWdodDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyBiYWNrZ3JvdW5kOiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBhdXRvQ3JvcDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyBhdXRvQ3JvcEFyZWE6IDAuNSxcclxuICAgICAgICAgICAgICAgIC8vIGRyYWdDcm9wOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vIG1vdmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy8gcm90YXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vIHpvb21hYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vIHRvdWNoRHJhZ1pvb206IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy8gbW91c2VXaGVlbFpvb206IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy8gY3JvcEJveE1vdmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy8gY3JvcEJveFJlc2l6YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyBkb3VibGVDbGlja1RvZ2dsZTogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbWluQ2FudmFzV2lkdGg6IDMyMCxcclxuICAgICAgICAgICAgICAgIC8vIG1pbkNhbnZhc0hlaWdodDogMTgwLFxyXG4gICAgICAgICAgICAgICAgLy8gbWluQ3JvcEJveFdpZHRoOiAxNjAsXHJcbiAgICAgICAgICAgICAgICAvLyBtaW5Dcm9wQm94SGVpZ2h0OiA5MCxcclxuICAgICAgICAgICAgICAgIC8vIG1pbkNvbnRhaW5lcldpZHRoOiAzMjAsXHJcbiAgICAgICAgICAgICAgICAvLyBtaW5Db250YWluZXJIZWlnaHQ6IDE4MCxcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBidWlsZDogbnVsbCxcclxuICAgICAgICAgICAgICAgIC8vIGJ1aWx0OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgLy8gZHJhZ3N0YXJ0OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgLy8gZHJhZ21vdmU6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAvLyBkcmFnZW5kOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgLy8gem9vbWluOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgLy8gem9vbW91dDogbnVsbCxcclxuXHJcbiAgICAgICAgICAgICAgICBhc3BlY3RSYXRpbzogMTYgLyA5LFxyXG4gICAgICAgICAgICAgICAgcHJldmlldzogJy5pbWctcHJldmlldycsXHJcbiAgICAgICAgICAgICAgICBjcm9wOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGRhdGFYLnZhbChNYXRoLnJvdW5kKGRhdGEueCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICRkYXRhWS52YWwoTWF0aC5yb3VuZChkYXRhLnkpKTtcclxuICAgICAgICAgICAgICAgICAgICAkZGF0YUhlaWdodC52YWwoTWF0aC5yb3VuZChkYXRhLmhlaWdodCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICRkYXRhV2lkdGgudmFsKE1hdGgucm91bmQoZGF0YS53aWR0aCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICRkYXRhUm90YXRlLnZhbChNYXRoLnJvdW5kKGRhdGEucm90YXRlKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICRpbWFnZS5vbih7XHJcbiAgICAgICAgICAgICdidWlsZC5jcm9wcGVyJzogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS50eXBlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2J1aWx0LmNyb3BwZXInOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLnR5cGUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnZHJhZ3N0YXJ0LmNyb3BwZXInOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLnR5cGUsIGUuZHJhZ1R5cGUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnZHJhZ21vdmUuY3JvcHBlcic6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudHlwZSwgZS5kcmFnVHlwZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdkcmFnZW5kLmNyb3BwZXInOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLnR5cGUsIGUuZHJhZ1R5cGUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnem9vbWluLmNyb3BwZXInOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLnR5cGUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnem9vbW91dC5jcm9wcGVyJzogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS50eXBlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2NoYW5nZS5jcm9wcGVyJzogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS50eXBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLmNyb3BwZXIob3B0aW9ucyk7XHJcblxyXG5cclxuICAgICAgICAvLyBNZXRob2RzXHJcbiAgICAgICAgJChkb2N1bWVudC5ib2R5KS5vbignY2xpY2snLCAnW2RhdGEtbWV0aG9kXScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9ICQodGhpcykuZGF0YSgpLFxyXG4gICAgICAgICAgICAgICAgJHRhcmdldCxcclxuICAgICAgICAgICAgICAgIHJlc3VsdDtcclxuXHJcbiAgICAgICAgICAgIGlmICghJGltYWdlLmRhdGEoJ2Nyb3BwZXInKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF0YS5tZXRob2QpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSAkLmV4dGVuZCh7fSwgZGF0YSk7IC8vIENsb25lIGEgbmV3IG9uZVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS50YXJnZXQgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRhcmdldCA9ICQoZGF0YS50YXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEub3B0aW9uID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5vcHRpb24gPSBKU09OLnBhcnNlKCR0YXJnZXQudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9ICRpbWFnZS5jcm9wcGVyKGRhdGEubWV0aG9kLCBkYXRhLm9wdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEubWV0aG9kID09PSAnZ2V0Q3JvcHBlZENhbnZhcycpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjZ2V0Q3JvcHBlZENhbnZhc01vZGFsJykubW9kYWwoKS5maW5kKCcubW9kYWwtYm9keScpLmh0bWwocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHJlc3VsdCkgJiYgJHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0YXJnZXQudmFsKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkub24oJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoISRpbWFnZS5kYXRhKCdjcm9wcGVyJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChlLndoaWNoKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM3OlxyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAkaW1hZ2UuY3JvcHBlcignbW92ZScsIC0xLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDM4OlxyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAkaW1hZ2UuY3JvcHBlcignbW92ZScsIDAsIC0xKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDM5OlxyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAkaW1hZ2UuY3JvcHBlcignbW92ZScsIDEsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgNDA6XHJcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICRpbWFnZS5jcm9wcGVyKCdtb3ZlJywgMCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvLyBJbXBvcnQgaW1hZ2VcclxuICAgICAgICB2YXIgJGlucHV0SW1hZ2UgPSAkKCcjaW5wdXRJbWFnZScpLFxyXG4gICAgICAgICAgICBVUkwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkwsXHJcbiAgICAgICAgICAgIGJsb2JVUkw7XHJcblxyXG4gICAgICAgIGlmIChVUkwpIHtcclxuICAgICAgICAgICAgJGlucHV0SW1hZ2UuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZpbGVzID0gdGhpcy5maWxlcyxcclxuICAgICAgICAgICAgICAgICAgICBmaWxlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghJGltYWdlLmRhdGEoJ2Nyb3BwZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZmlsZXMgJiYgZmlsZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZSA9IGZpbGVzWzBdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoL15pbWFnZVxcL1xcdyskLy50ZXN0KGZpbGUudHlwZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvYlVSTCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRpbWFnZS5vbmUoJ2J1aWx0LmNyb3BwZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwoYmxvYlVSTCk7IC8vIFJldm9rZSB3aGVuIGxvYWQgY29tcGxldGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkuY3JvcHBlcigncmVzZXQnKS5jcm9wcGVyKCdyZXBsYWNlJywgYmxvYlVSTCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRpbnB1dEltYWdlLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ1BsZWFzZSBjaG9vc2UgYW4gaW1hZ2UgZmlsZS4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRpbnB1dEltYWdlLnBhcmVudCgpLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8vIE9wdGlvbnNcclxuICAgICAgICAkKCcuZG9jcy1vcHRpb25zIDpjaGVja2JveCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghJGltYWdlLmRhdGEoJ2Nyb3BwZXInKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBvcHRpb25zWyR0aGlzLnZhbCgpXSA9ICR0aGlzLnByb3AoJ2NoZWNrZWQnKTtcclxuICAgICAgICAgICAgJGltYWdlLmNyb3BwZXIoJ2Rlc3Ryb3knKS5jcm9wcGVyKG9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLy8gVG9vbHRpcHNcclxuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xyXG5cclxuICAgIH0pO1xyXG5cclxufSkod2luZG93LCBkb2N1bWVudCwgd2luZG93LmpRdWVyeSk7IiwiLy8gTE9BRCBDVVNUT00gQ1NTXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQsIHVuZGVmaW5lZCl7XG5cbiAgJChmdW5jdGlvbigpe1xuXG4gICAgJCgnW2RhdGEtbG9hZC1jc3NdJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgXG4gICAgICB2YXIgZWxlbWVudCA9ICQodGhpcyk7XG5cbiAgICAgIGlmKGVsZW1lbnQuaXMoJ2EnKSlcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgXG4gICAgICB2YXIgdXJpID0gZWxlbWVudC5kYXRhKCdsb2FkQ3NzJyksXG4gICAgICAgICAgbGluaztcblxuICAgICAgaWYodXJpKSB7XG4gICAgICAgIGxpbmsgPSBjcmVhdGVMaW5rKHVyaSk7XG4gICAgICAgIGlmICggIWxpbmsgKSB7XG4gICAgICAgICAgJC5lcnJvcignRXJyb3IgY3JlYXRpbmcgc3R5bGVzaGVldCBsaW5rIGVsZW1lbnQuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAkLmVycm9yKCdObyBzdHlsZXNoZWV0IGxvY2F0aW9uIGRlZmluZWQuJyk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gY3JlYXRlTGluayh1cmkpIHtcbiAgICB2YXIgbGlua0lkID0gJ2F1dG9sb2FkZWQtc3R5bGVzaGVldCcsXG4gICAgICAgIG9sZExpbmsgPSAkKCcjJytsaW5rSWQpLmF0dHIoJ2lkJywgbGlua0lkICsgJy1vbGQnKTtcblxuICAgICQoJ2hlYWQnKS5hcHBlbmQoJCgnPGxpbmsvPicpLmF0dHIoe1xuICAgICAgJ2lkJzogICBsaW5rSWQsXG4gICAgICAncmVsJzogICdzdHlsZXNoZWV0JyxcbiAgICAgICdocmVmJzogdXJpXG4gICAgfSkpO1xuXG4gICAgaWYoIG9sZExpbmsubGVuZ3RoICkge1xuICAgICAgb2xkTGluay5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJCgnIycrbGlua0lkKTtcbiAgfVxuXG5cbn0pKHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpO1xuIiwiLy8gVFJBTlNMQVRJT05cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKXtcblxuICB2YXIgcHJlZmVycmVkTGFuZyA9ICdlbic7XG4gIHZhciBwYXRoUHJlZml4ICAgID0gJ2kxOG4nOyAvLyBmb2xkZXIgb2YganNvbiBmaWxlc1xuICB2YXIgcGFja05hbWUgICAgICA9ICdzaXRlJztcbiAgdmFyIHN0b3JhZ2VLZXkgICAgPSAnanEtYXBwTGFuZyc7XG5cbiAgJChmdW5jdGlvbigpe1xuXG4gICAgaWYgKCAhICQuZm4ubG9jYWxpemUgKSByZXR1cm47XG5cbiAgICAvLyBkZXRlY3Qgc2F2ZWQgbGFuZ3VhZ2Ugb3IgdXNlIGRlZmF1bHRcbiAgICB2YXIgY3VyckxhbmcgPSAkLmxvY2FsU3RvcmFnZS5nZXQoc3RvcmFnZUtleSkgfHwgcHJlZmVycmVkTGFuZztcbiAgICAvLyBzZXQgaW5pdGlhbCBvcHRpb25zXG4gICAgdmFyIG9wdHMgPSB7XG4gICAgICAgIGxhbmd1YWdlOiBjdXJyTGFuZyxcbiAgICAgICAgcGF0aFByZWZpeDogcGF0aFByZWZpeCxcbiAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGRhdGEsIGRlZmF1bHRDYWxsYmFjayl7XG4gICAgICAgICAgJC5sb2NhbFN0b3JhZ2Uuc2V0KHN0b3JhZ2VLZXksIGN1cnJMYW5nKTsgLy8gc2F2ZSB0aGUgbGFuZ3VhZ2VcbiAgICAgICAgICBkZWZhdWx0Q2FsbGJhY2soZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAvLyBTZXQgaW5pdGlhbCBsYW5ndWFnZVxuICAgIHNldExhbmd1YWdlKG9wdHMpO1xuXG4gICAgLy8gTGlzdGVuIGZvciBjaGFuZ2VzXG4gICAgJCgnW2RhdGEtc2V0LWxhbmddJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblxuICAgICAgY3VyckxhbmcgPSAkKHRoaXMpLmRhdGEoJ3NldExhbmcnKTtcblxuICAgICAgaWYgKCBjdXJyTGFuZyApIHtcbiAgICAgICAgXG4gICAgICAgIG9wdHMubGFuZ3VhZ2UgPSBjdXJyTGFuZztcblxuICAgICAgICBzZXRMYW5ndWFnZShvcHRzKTtcblxuICAgICAgICBhY3RpdmF0ZURyb3Bkb3duKCQodGhpcykpO1xuICAgICAgfVxuXG4gICAgfSk7XG4gICAgXG5cbiAgICBmdW5jdGlvbiBzZXRMYW5ndWFnZShvcHRpb25zKSB7XG4gICAgICAkKFwiW2RhdGEtbG9jYWxpemVdXCIpLmxvY2FsaXplKHBhY2tOYW1lLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIGN1cnJlbnQgY2xpY2tlZCB0ZXh0IGFzIHRoZSBhY3RpdmUgZHJvcGRvd24gdGV4dFxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlRHJvcGRvd24oZWxlbSkge1xuICAgICAgdmFyIG1lbnUgPSBlbGVtLnBhcmVudHMoJy5kcm9wZG93bi1tZW51Jyk7XG4gICAgICBpZiAoIG1lbnUubGVuZ3RoICkge1xuICAgICAgICB2YXIgdG9nZ2xlID0gbWVudS5wcmV2KCdidXR0b24sIGEnKTtcbiAgICAgICAgdG9nZ2xlLnRleHQgKCBlbGVtLnRleHQoKSApO1xuICAgICAgfVxuICAgIH1cblxuICB9KTtcblxufSkod2luZG93LCBkb2N1bWVudCwgd2luZG93LmpRdWVyeSk7XG4iLCIvLyBKVkVDVE9SIE1BUCBcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcblxyXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKXtcclxuXHJcbiAgd2luZG93LmRlZmF1bHRDb2xvcnMgPSB7XHJcbiAgICAgIG1hcmtlckNvbG9yOiAgJyMyM2I3ZTUnLCAgICAgIC8vIHRoZSBtYXJrZXIgcG9pbnRzXHJcbiAgICAgIGJnQ29sb3I6ICAgICAgJ3RyYW5zcGFyZW50JywgICAgICAvLyB0aGUgYmFja2dyb3VuZFxyXG4gICAgICBzY2FsZUNvbG9yczogIFsnIzg3OGM5YSddLCAgICAvLyB0aGUgY29sb3Igb2YgdGhlIHJlZ2lvbiBpbiB0aGUgc2VyaWVcclxuICAgICAgcmVnaW9uRmlsbDogICAnI2JiYmVjNicgICAgICAgLy8gdGhlIGJhc2UgcmVnaW9uIGNvbG9yXHJcbiAgfTtcclxuXHJcbiAgd2luZG93LlZlY3Rvck1hcCA9IGZ1bmN0aW9uKGVsZW1lbnQsIHNlcmllc0RhdGEsIG1hcmtlcnNEYXRhKSB7XHJcbiAgICBcclxuICAgIGlmICggISBlbGVtZW50IHx8ICFlbGVtZW50Lmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgIHZhciBhdHRycyAgICAgICA9IGVsZW1lbnQuZGF0YSgpLFxyXG4gICAgICAgIG1hcEhlaWdodCAgID0gYXR0cnMuaGVpZ2h0IHx8ICczMDAnLFxyXG4gICAgICAgIG9wdGlvbnMgICAgID0ge1xyXG4gICAgICAgICAgbWFya2VyQ29sb3I6ICBhdHRycy5tYXJrZXJDb2xvciAgfHwgZGVmYXVsdENvbG9ycy5tYXJrZXJDb2xvcixcclxuICAgICAgICAgIGJnQ29sb3I6ICAgICAgYXR0cnMuYmdDb2xvciAgICAgIHx8IGRlZmF1bHRDb2xvcnMuYmdDb2xvcixcclxuICAgICAgICAgIHNjYWxlOiAgICAgICAgYXR0cnMuc2NhbGUgICAgICAgIHx8IDEsXHJcbiAgICAgICAgICBzY2FsZUNvbG9yczogIGF0dHJzLnNjYWxlQ29sb3JzICB8fCBkZWZhdWx0Q29sb3JzLnNjYWxlQ29sb3JzLFxyXG4gICAgICAgICAgcmVnaW9uRmlsbDogICBhdHRycy5yZWdpb25GaWxsICAgfHwgZGVmYXVsdENvbG9ycy5yZWdpb25GaWxsLFxyXG4gICAgICAgICAgbWFwTmFtZTogICAgICBhdHRycy5tYXBOYW1lICAgICAgfHwgJ3dvcmxkX21pbGxfZW4nXHJcbiAgICAgICAgfTtcclxuICAgIFxyXG4gICAgZWxlbWVudC5jc3MoJ2hlaWdodCcsIG1hcEhlaWdodCk7XHJcbiAgICBcclxuICAgIGluaXQoIGVsZW1lbnQgLCBvcHRpb25zLCBzZXJpZXNEYXRhLCBtYXJrZXJzRGF0YSk7XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIGluaXQoJGVsZW1lbnQsIG9wdHMsIHNlcmllcywgbWFya2Vycykge1xyXG4gICAgICAgIFxyXG4gICAgICAgICRlbGVtZW50LnZlY3Rvck1hcCh7XHJcbiAgICAgICAgICBtYXA6ICAgICAgICAgICAgIG9wdHMubWFwTmFtZSxcclxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogb3B0cy5iZ0NvbG9yLFxyXG4gICAgICAgICAgem9vbU1pbjogICAgICAgICAxLFxyXG4gICAgICAgICAgem9vbU1heDogICAgICAgICA4LFxyXG4gICAgICAgICAgem9vbU9uU2Nyb2xsOiAgICBmYWxzZSxcclxuICAgICAgICAgIHJlZ2lvblN0eWxlOiB7XHJcbiAgICAgICAgICAgIGluaXRpYWw6IHtcclxuICAgICAgICAgICAgICAnZmlsbCc6ICAgICAgICAgICBvcHRzLnJlZ2lvbkZpbGwsXHJcbiAgICAgICAgICAgICAgJ2ZpbGwtb3BhY2l0eSc6ICAgMSxcclxuICAgICAgICAgICAgICAnc3Ryb2tlJzogICAgICAgICAnbm9uZScsXHJcbiAgICAgICAgICAgICAgJ3N0cm9rZS13aWR0aCc6ICAgMS41LFxyXG4gICAgICAgICAgICAgICdzdHJva2Utb3BhY2l0eSc6IDFcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaG92ZXI6IHtcclxuICAgICAgICAgICAgICAnZmlsbC1vcGFjaXR5JzogMC44XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlbGVjdGVkOiB7XHJcbiAgICAgICAgICAgICAgZmlsbDogJ2JsdWUnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlbGVjdGVkSG92ZXI6IHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZvY3VzT246eyB4OjAuNCwgeTowLjYsIHNjYWxlOiBvcHRzLnNjYWxlfSxcclxuICAgICAgICAgIG1hcmtlclN0eWxlOiB7XHJcbiAgICAgICAgICAgIGluaXRpYWw6IHtcclxuICAgICAgICAgICAgICBmaWxsOiBvcHRzLm1hcmtlckNvbG9yLFxyXG4gICAgICAgICAgICAgIHN0cm9rZTogb3B0cy5tYXJrZXJDb2xvclxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgb25SZWdpb25MYWJlbFNob3c6IGZ1bmN0aW9uKGUsIGVsLCBjb2RlKSB7XHJcbiAgICAgICAgICAgIGlmICggc2VyaWVzICYmIHNlcmllc1tjb2RlXSApXHJcbiAgICAgICAgICAgICAgZWwuaHRtbChlbC5odG1sKCkgKyAnOiAnICsgc2VyaWVzW2NvZGVdICsgJyB2aXNpdG9ycycpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1hcmtlcnM6IG1hcmtlcnMsXHJcbiAgICAgICAgICBzZXJpZXM6IHtcclxuICAgICAgICAgICAgICByZWdpb25zOiBbe1xyXG4gICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlcmllcyxcclxuICAgICAgICAgICAgICAgICAgc2NhbGU6IG9wdHMuc2NhbGVDb2xvcnMsXHJcbiAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZUZ1bmN0aW9uOiAncG9seW5vbWlhbCdcclxuICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIH0vLyBlbmQgaW5pdFxyXG4gIH07XHJcblxyXG59KSh3aW5kb3csIGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5KTtcclxuIiwiLy8gTW9ycmlzXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG5cclxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQsIHVuZGVmaW5lZCl7XHJcblxyXG4gICQoZnVuY3Rpb24oKXtcclxuXHJcbiAgICBpZiAoIHR5cGVvZiBNb3JyaXMgPT09ICd1bmRlZmluZWQnICkgcmV0dXJuO1xyXG5cclxuICAgIHZhciBjaGFydGRhdGEgPSBbXHJcbiAgICAgICAgeyB5OiBcIjIwMDZcIiwgYTogMTAwLCBiOiA5MCB9LFxyXG4gICAgICAgIHsgeTogXCIyMDA3XCIsIGE6IDc1LCAgYjogNjUgfSxcclxuICAgICAgICB7IHk6IFwiMjAwOFwiLCBhOiA1MCwgIGI6IDQwIH0sXHJcbiAgICAgICAgeyB5OiBcIjIwMDlcIiwgYTogNzUsICBiOiA2NSB9LFxyXG4gICAgICAgIHsgeTogXCIyMDEwXCIsIGE6IDUwLCAgYjogNDAgfSxcclxuICAgICAgICB7IHk6IFwiMjAxMVwiLCBhOiA3NSwgIGI6IDY1IH0sXHJcbiAgICAgICAgeyB5OiBcIjIwMTJcIiwgYTogMTAwLCBiOiA5MCB9XHJcbiAgICBdO1xyXG5cclxuICAgIHZhciBkb251dGRhdGEgPSBbXHJcbiAgICAgIHtsYWJlbDogXCJEb3dubG9hZCBTYWxlc1wiLCB2YWx1ZTogMTJ9LFxyXG4gICAgICB7bGFiZWw6IFwiSW4tU3RvcmUgU2FsZXNcIix2YWx1ZTogMzB9LFxyXG4gICAgICB7bGFiZWw6IFwiTWFpbC1PcmRlciBTYWxlc1wiLCB2YWx1ZTogMjB9XHJcbiAgICBdO1xyXG5cclxuICAgIC8vIExpbmUgQ2hhcnRcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG5cclxuICAgIG5ldyBNb3JyaXMuTGluZSh7XHJcbiAgICAgIGVsZW1lbnQ6ICdtb3JyaXMtbGluZScsXHJcbiAgICAgIGRhdGE6IGNoYXJ0ZGF0YSxcclxuICAgICAgeGtleTogJ3knLFxyXG4gICAgICB5a2V5czogW1wiYVwiLCBcImJcIl0sXHJcbiAgICAgIGxhYmVsczogW1wiU2VyaWUgQVwiLCBcIlNlcmllIEJcIl0sXHJcbiAgICAgIGxpbmVDb2xvcnM6IFtcIiMzMUMwQkVcIiwgXCIjN2E5MmEzXCJdLFxyXG4gICAgICByZXNpemU6IHRydWVcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIERvbnV0IENoYXJ0XHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuICAgIG5ldyBNb3JyaXMuRG9udXQoe1xyXG4gICAgICBlbGVtZW50OiAnbW9ycmlzLWRvbnV0JyxcclxuICAgICAgZGF0YTogZG9udXRkYXRhLFxyXG4gICAgICBjb2xvcnM6IFsgJyNmMDUwNTAnLCAnI2ZhZDczMicsICcjZmY5MDJiJyBdLFxyXG4gICAgICByZXNpemU6IHRydWVcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEJhciBDaGFydFxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcbiAgICBuZXcgTW9ycmlzLkJhcih7XHJcbiAgICAgIGVsZW1lbnQ6ICdtb3JyaXMtYmFyJyxcclxuICAgICAgZGF0YTogY2hhcnRkYXRhLFxyXG4gICAgICB4a2V5OiAneScsXHJcbiAgICAgIHlrZXlzOiBbXCJhXCIsIFwiYlwiXSxcclxuICAgICAgbGFiZWxzOiBbXCJTZXJpZXMgQVwiLCBcIlNlcmllcyBCXCJdLFxyXG4gICAgICB4TGFiZWxNYXJnaW46IDIsXHJcbiAgICAgIGJhckNvbG9yczogWyAnIzIzYjdlNScsICcjZjA1MDUwJyBdLFxyXG4gICAgICByZXNpemU6IHRydWVcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEFyZWEgQ2hhcnRcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG4gICAgbmV3IE1vcnJpcy5BcmVhKHtcclxuICAgICAgZWxlbWVudDogJ21vcnJpcy1hcmVhJyxcclxuICAgICAgZGF0YTogY2hhcnRkYXRhLFxyXG4gICAgICB4a2V5OiAneScsXHJcbiAgICAgIHlrZXlzOiBbXCJhXCIsIFwiYlwiXSxcclxuICAgICAgbGFiZWxzOiBbXCJTZXJpZSBBXCIsIFwiU2VyaWUgQlwiXSxcclxuICAgICAgbGluZUNvbG9yczogWyAnIzcyNjZiYScsICcjMjNiN2U1JyBdLFxyXG4gICAgICByZXNpemU6IHRydWVcclxuICAgIH0pO1xyXG5cclxuICB9KTtcclxuXHJcbn0pKHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpO1xyXG4iLCIvLyBOQVZCQVIgU0VBUkNIXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKXtcblxuICAkKGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgdmFyIG5hdlNlYXJjaCA9IG5ldyBuYXZiYXJTZWFyY2hJbnB1dCgpO1xuICAgIFxuICAgIC8vIE9wZW4gc2VhcmNoIGlucHV0IFxuICAgIHZhciAkc2VhcmNoT3BlbiA9ICQoJ1tkYXRhLXNlYXJjaC1vcGVuXScpO1xuXG4gICAgJHNlYXJjaE9wZW5cbiAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkgeyBlLnN0b3BQcm9wYWdhdGlvbigpOyB9KVxuICAgICAgLm9uKCdjbGljaycsIG5hdlNlYXJjaC50b2dnbGUpO1xuXG4gICAgLy8gQ2xvc2Ugc2VhcmNoIGlucHV0XG4gICAgdmFyICRzZWFyY2hEaXNtaXNzID0gJCgnW2RhdGEtc2VhcmNoLWRpc21pc3NdJyk7XG4gICAgdmFyIGlucHV0U2VsZWN0b3IgPSAnLm5hdmJhci1mb3JtIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJztcblxuICAgICQoaW5wdXRTZWxlY3RvcilcbiAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkgeyBlLnN0b3BQcm9wYWdhdGlvbigpOyB9KVxuICAgICAgLm9uKCdrZXl1cCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAyNykgLy8gRVNDXG4gICAgICAgICAgbmF2U2VhcmNoLmRpc21pc3MoKTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgLy8gY2xpY2sgYW55d2hlcmUgY2xvc2VzIHRoZSBzZWFyY2hcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCBuYXZTZWFyY2guZGlzbWlzcyk7XG4gICAgLy8gZGlzbWlzc2FibGUgb3B0aW9uc1xuICAgICRzZWFyY2hEaXNtaXNzXG4gICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgfSlcbiAgICAgIC5vbignY2xpY2snLCBuYXZTZWFyY2guZGlzbWlzcyk7XG5cbiAgfSk7XG5cbiAgdmFyIG5hdmJhclNlYXJjaElucHV0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5hdmJhckZvcm1TZWxlY3RvciA9ICdmb3JtLm5hdmJhci1mb3JtJztcbiAgICByZXR1cm4ge1xuICAgICAgdG9nZ2xlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBuYXZiYXJGb3JtID0gJChuYXZiYXJGb3JtU2VsZWN0b3IpO1xuXG4gICAgICAgIG5hdmJhckZvcm0udG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBpc09wZW4gPSBuYXZiYXJGb3JtLmhhc0NsYXNzKCdvcGVuJyk7XG4gICAgICAgIFxuICAgICAgICBuYXZiYXJGb3JtLmZpbmQoJ2lucHV0JylbaXNPcGVuID8gJ2ZvY3VzJyA6ICdibHVyJ10oKTtcblxuICAgICAgfSxcblxuICAgICAgZGlzbWlzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICQobmF2YmFyRm9ybVNlbGVjdG9yKVxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnb3BlbicpICAgICAgLy8gQ2xvc2UgY29udHJvbFxuICAgICAgICAgIC5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpLmJsdXIoKSAvLyByZW1vdmUgZm9jdXNcbiAgICAgICAgICAudmFsKCcnKSAgICAgICAgICAgICAgICAgICAgLy8gRW1wdHkgaW5wdXRcbiAgICAgICAgICA7XG4gICAgICB9XG4gICAgfTtcblxuICB9XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpOyIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiBub3RpZnkuanNcbiAqIENyZWF0ZSB0b2dnbGVhYmxlIG5vdGlmaWNhdGlvbnMgdGhhdCBmYWRlIG91dCBhdXRvbWF0aWNhbGx5LlxuICogQmFzZWQgb24gTm90aWZ5IGFkZG9uIGZyb20gVUlLaXQgKGh0dHA6Ly9nZXR1aWtpdC5jb20vZG9jcy9hZGRvbnNfbm90aWZ5Lmh0bWwpXG4gKiBbZGF0YS10b2dnbGU9XCJub3RpZnlcIl1cbiAqIFtkYXRhLW9wdGlvbnM9XCJvcHRpb25zIGluIGpzb24gZm9ybWF0XCIgXVxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50KXtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBTZWxlY3RvciA9ICdbZGF0YS1ub3RpZnldJyxcbiAgICAgIGF1dG9sb2FkU2VsZWN0b3IgPSAnW2RhdGEtb25sb2FkXScsXG4gICAgICBkb2MgPSAkKGRvY3VtZW50KTtcblxuXG4gICQoZnVuY3Rpb24oKSB7XG5cbiAgICAkKFNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKCl7XG5cbiAgICAgIHZhciAkdGhpcyAgPSAkKHRoaXMpLFxuICAgICAgICAgIG9ubG9hZCA9ICR0aGlzLmRhdGEoJ29ubG9hZCcpO1xuXG4gICAgICBpZihvbmxvYWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgbm90aWZ5Tm93KCR0aGlzKTtcbiAgICAgICAgfSwgODAwKTtcbiAgICAgIH1cblxuICAgICAgJHRoaXMub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBub3RpZnlOb3coJHRoaXMpO1xuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICB9KTtcblxuICBmdW5jdGlvbiBub3RpZnlOb3coJGVsZW1lbnQpIHtcbiAgICAgIHZhciBtZXNzYWdlID0gJGVsZW1lbnQuZGF0YSgnbWVzc2FnZScpLFxuICAgICAgICAgIG9wdGlvbnMgPSAkZWxlbWVudC5kYXRhKCdvcHRpb25zJyk7XG5cbiAgICAgIGlmKCFtZXNzYWdlKVxuICAgICAgICAkLmVycm9yKCdOb3RpZnk6IE5vIG1lc3NhZ2Ugc3BlY2lmaWVkJyk7XG4gICAgIFxuICAgICAgJC5ub3RpZnkobWVzc2FnZSwgb3B0aW9ucyB8fCB7fSk7XG4gIH1cblxuXG59KGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCkpO1xuXG5cbi8qKlxuICogTm90aWZ5IEFkZG9uIGRlZmluaXRpb24gYXMgalF1ZXJ5IHBsdWdpblxuICogQWRhcHRlZCB2ZXJzaW9uIHRvIHdvcmsgd2l0aCBCb290c3RyYXAgY2xhc3Nlc1xuICogTW9yZSBpbmZvcm1hdGlvbiBodHRwOi8vZ2V0dWlraXQuY29tL2RvY3MvYWRkb25zX25vdGlmeS5odG1sXG4gKi9cblxuKGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQpe1xuXG4gICAgdmFyIGNvbnRhaW5lcnMgPSB7fSxcbiAgICAgICAgbWVzc2FnZXMgICA9IHt9LFxuXG4gICAgICAgIG5vdGlmeSAgICAgPSAgZnVuY3Rpb24ob3B0aW9ucyl7XG5cbiAgICAgICAgICAgIGlmICgkLnR5cGUob3B0aW9ucykgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0geyBtZXNzYWdlOiBvcHRpb25zIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhcmd1bWVudHNbMV0pIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQob3B0aW9ucywgJC50eXBlKGFyZ3VtZW50c1sxXSkgPT0gJ3N0cmluZycgPyB7c3RhdHVzOmFyZ3VtZW50c1sxXX0gOiBhcmd1bWVudHNbMV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gKG5ldyBNZXNzYWdlKG9wdGlvbnMpKS5zaG93KCk7XG4gICAgICAgIH0sXG4gICAgICAgIGNsb3NlQWxsICA9IGZ1bmN0aW9uKGdyb3VwLCBpbnN0YW50bHkpe1xuICAgICAgICAgICAgaWYoZ3JvdXApIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGlkIGluIG1lc3NhZ2VzKSB7IGlmKGdyb3VwPT09bWVzc2FnZXNbaWRdLmdyb3VwKSBtZXNzYWdlc1tpZF0uY2xvc2UoaW5zdGFudGx5KTsgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGlkIGluIG1lc3NhZ2VzKSB7IG1lc3NhZ2VzW2lkXS5jbG9zZShpbnN0YW50bHkpOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICB2YXIgTWVzc2FnZSA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuXG4gICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIE1lc3NhZ2UuZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgICAgIHRoaXMudXVpZCAgICA9IFwiSURcIisobmV3IERhdGUoKS5nZXRUaW1lKCkpK1wiUkFORFwiKyhNYXRoLmNlaWwoTWF0aC5yYW5kb20oKSAqIDEwMDAwMCkpO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKFtcbiAgICAgICAgICAgIC8vIGFsZXJ0LWRpc21pc3NhYmxlIGVuYWJsZXMgYnMgY2xvc2UgaWNvblxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ1ay1ub3RpZnktbWVzc2FnZSBhbGVydC1kaXNtaXNzYWJsZVwiPicsXG4gICAgICAgICAgICAgICAgJzxhIGNsYXNzPVwiY2xvc2VcIj4mdGltZXM7PC9hPicsXG4gICAgICAgICAgICAgICAgJzxkaXY+Jyt0aGlzLm9wdGlvbnMubWVzc2FnZSsnPC9kaXY+JyxcbiAgICAgICAgICAgICc8L2Rpdj4nXG5cbiAgICAgICAgXS5qb2luKCcnKSkuZGF0YShcIm5vdGlmeU1lc3NhZ2VcIiwgdGhpcyk7XG5cbiAgICAgICAgLy8gc3RhdHVzXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RhdHVzKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoJ2FsZXJ0IGFsZXJ0LScrdGhpcy5vcHRpb25zLnN0YXR1cyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRzdGF0dXMgPSB0aGlzLm9wdGlvbnMuc3RhdHVzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ncm91cCA9IHRoaXMub3B0aW9ucy5ncm91cDtcblxuICAgICAgICBtZXNzYWdlc1t0aGlzLnV1aWRdID0gdGhpcztcblxuICAgICAgICBpZighY29udGFpbmVyc1t0aGlzLm9wdGlvbnMucG9zXSkge1xuICAgICAgICAgICAgY29udGFpbmVyc1t0aGlzLm9wdGlvbnMucG9zXSA9ICQoJzxkaXYgY2xhc3M9XCJ1ay1ub3RpZnkgdWstbm90aWZ5LScrdGhpcy5vcHRpb25zLnBvcysnXCI+PC9kaXY+JykuYXBwZW5kVG8oJ2JvZHknKS5vbihcImNsaWNrXCIsIFwiLnVrLW5vdGlmeS1tZXNzYWdlXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5kYXRhKFwibm90aWZ5TWVzc2FnZVwiKS5jbG9zZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAkLmV4dGVuZChNZXNzYWdlLnByb3RvdHlwZSwge1xuXG4gICAgICAgIHV1aWQ6IGZhbHNlLFxuICAgICAgICBlbGVtZW50OiBmYWxzZSxcbiAgICAgICAgdGltb3V0OiBmYWxzZSxcbiAgICAgICAgY3VycmVudHN0YXR1czogXCJcIixcbiAgICAgICAgZ3JvdXA6IGZhbHNlLFxuXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50LmlzKFwiOnZpc2libGVcIikpIHJldHVybjtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcblxuICAgICAgICAgICAgY29udGFpbmVyc1t0aGlzLm9wdGlvbnMucG9zXS5zaG93KCkucHJlcGVuZCh0aGlzLmVsZW1lbnQpO1xuXG4gICAgICAgICAgICB2YXIgbWFyZ2luYm90dG9tID0gcGFyc2VJbnQodGhpcy5lbGVtZW50LmNzcyhcIm1hcmdpbi1ib3R0b21cIiksIDEwKTtcblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7XCJvcGFjaXR5XCI6MCwgXCJtYXJnaW4tdG9wXCI6IC0xKnRoaXMuZWxlbWVudC5vdXRlckhlaWdodCgpLCBcIm1hcmdpbi1ib3R0b21cIjowfSkuYW5pbWF0ZSh7XCJvcGFjaXR5XCI6MSwgXCJtYXJnaW4tdG9wXCI6IDAsIFwibWFyZ2luLWJvdHRvbVwiOm1hcmdpbmJvdHRvbX0sIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICBpZiAoJHRoaXMub3B0aW9ucy50aW1lb3V0KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNsb3NlZm4gPSBmdW5jdGlvbigpeyAkdGhpcy5jbG9zZSgpOyB9O1xuXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsb3NlZm4sICR0aGlzLm9wdGlvbnMudGltZW91dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZWxlbWVudC5ob3ZlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyBjbGVhclRpbWVvdXQoJHRoaXMudGltZW91dCk7IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHsgJHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoY2xvc2VmbiwgJHRoaXMub3B0aW9ucy50aW1lb3V0KTsgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBjbG9zZTogZnVuY3Rpb24oaW5zdGFudGx5KSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyAgICA9IHRoaXMsXG4gICAgICAgICAgICAgICAgZmluYWxpemUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5lbGVtZW50LnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKCFjb250YWluZXJzWyR0aGlzLm9wdGlvbnMucG9zXS5jaGlsZHJlbigpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyc1skdGhpcy5vcHRpb25zLnBvc10uaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG1lc3NhZ2VzWyR0aGlzLnV1aWRdO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmKHRoaXMudGltZW91dCkgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG5cbiAgICAgICAgICAgIGlmKGluc3RhbnRseSkge1xuICAgICAgICAgICAgICAgIGZpbmFsaXplKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hbmltYXRlKHtcIm9wYWNpdHlcIjowLCBcIm1hcmdpbi10b3BcIjogLTEqIHRoaXMuZWxlbWVudC5vdXRlckhlaWdodCgpLCBcIm1hcmdpbi1ib3R0b21cIjowfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgZmluYWxpemUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjb250ZW50OiBmdW5jdGlvbihodG1sKXtcblxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuZWxlbWVudC5maW5kKFwiPmRpdlwiKTtcblxuICAgICAgICAgICAgaWYoIWh0bWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGFpbmVyLmh0bWwoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29udGFpbmVyLmh0bWwoaHRtbCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN0YXR1czogZnVuY3Rpb24oc3RhdHVzKSB7XG5cbiAgICAgICAgICAgIGlmKCFzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50c3RhdHVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2FsZXJ0IGFsZXJ0LScrdGhpcy5jdXJyZW50c3RhdHVzKS5hZGRDbGFzcygnYWxlcnQgYWxlcnQtJytzdGF0dXMpO1xuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRzdGF0dXMgPSBzdGF0dXM7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBNZXNzYWdlLmRlZmF1bHRzID0ge1xuICAgICAgICBtZXNzYWdlOiBcIlwiLFxuICAgICAgICBzdGF0dXM6IFwibm9ybWFsXCIsXG4gICAgICAgIHRpbWVvdXQ6IDUwMDAsXG4gICAgICAgIGdyb3VwOiBudWxsLFxuICAgICAgICBwb3M6ICd0b3AtY2VudGVyJ1xuICAgIH07XG5cblxuICAgICRbXCJub3RpZnlcIl0gICAgICAgICAgPSBub3RpZnk7XG4gICAgJFtcIm5vdGlmeVwiXS5tZXNzYWdlICA9IE1lc3NhZ2U7XG4gICAgJFtcIm5vdGlmeVwiXS5jbG9zZUFsbCA9IGNsb3NlQWxsO1xuXG4gICAgcmV0dXJuIG5vdGlmeTtcblxufShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpKTtcbiIsIi8vIE5PVyBUSU1FUlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG5cbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCAkLCB1bmRlZmluZWQpe1xuXG4gICQoZnVuY3Rpb24oKXtcblxuICAgICQoJ1tkYXRhLW5vd10nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgZWxlbWVudCA9ICQodGhpcyksXG4gICAgICAgICAgZm9ybWF0ID0gZWxlbWVudC5kYXRhKCdmb3JtYXQnKTtcblxuICAgICAgZnVuY3Rpb24gdXBkYXRlVGltZSgpIHtcbiAgICAgICAgdmFyIGR0ID0gbW9tZW50KCBuZXcgRGF0ZSgpICkuZm9ybWF0KGZvcm1hdCk7XG4gICAgICAgIGVsZW1lbnQudGV4dChkdCk7XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZVRpbWUoKTtcbiAgICAgIHNldEludGVydmFsKHVwZGF0ZVRpbWUsIDEwMDApO1xuICAgIFxuICAgIH0pO1xuICB9KTtcblxufSkod2luZG93LCBkb2N1bWVudCwgd2luZG93LmpRdWVyeSk7XG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogcGFuZWwtdG9vbHMuanNcbiAqIERpc21pc3MgcGFuZWxzXG4gKiBbZGF0YS10b29sPVwicGFuZWwtZGlzbWlzc1wiXVxuICpcbiAqIFJlcXVpcmVzIGFuaW1vLmpzXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbihmdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50KXtcbiAgJ3VzZSBzdHJpY3QnO1xuICBcbiAgdmFyIHBhbmVsU2VsZWN0b3IgPSAnW2RhdGEtdG9vbD1cInBhbmVsLWRpc21pc3NcIl0nLFxuICAgICAgcmVtb3ZlRXZlbnQgICA9ICdwYW5lbC5yZW1vdmUnLFxuICAgICAgcmVtb3ZlZEV2ZW50ICA9ICdwYW5lbC5yZW1vdmVkJztcblxuICAkKGRvY3VtZW50KS5vbignY2xpY2snLCBwYW5lbFNlbGVjdG9yLCBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgLy8gZmluZCB0aGUgZmlyc3QgcGFyZW50IHBhbmVsXG4gICAgdmFyIHBhcmVudCA9ICQodGhpcykuY2xvc2VzdCgnLnBhbmVsJyk7XG4gICAgdmFyIGRlZmVycmVkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuICAgIC8vIFRyaWdnZXIgdGhlIGV2ZW50IGFuZCBmaW5hbGx5IHJlbW92ZSB0aGUgZWxlbWVudFxuICAgIHBhcmVudC50cmlnZ2VyKHJlbW92ZUV2ZW50LCBbcGFyZW50LCBkZWZlcnJlZF0pO1xuICAgIC8vIG5lZWRzIHJlc29sdmUoKSB0byBiZSBjYWxsZWRcbiAgICBkZWZlcnJlZC5kb25lKHJlbW92ZUVsZW1lbnQpO1xuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRWxlbWVudCgpIHtcbiAgICAgIGlmKCQuc3VwcG9ydC5hbmltYXRpb24pIHtcbiAgICAgICAgcGFyZW50LmFuaW1vKHthbmltYXRpb246ICdib3VuY2VPdXQnfSwgZGVzdHJveVBhbmVsKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgZGVzdHJveVBhbmVsKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveVBhbmVsKCkge1xuICAgICAgdmFyIGNvbCA9IHBhcmVudC5wYXJlbnQoKTtcbiAgICAgIFxuICAgICAgJC53aGVuKHBhcmVudC50cmlnZ2VyKHJlbW92ZWRFdmVudCwgW3BhcmVudF0pKVxuICAgICAgIC5kb25lKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcGFyZW50LnJlbW92ZSgpO1xuICAgICAgICAgIC8vIHJlbW92ZSB0aGUgcGFyZW50IGlmIGl0IGlzIGEgcm93IGFuZCBpcyBlbXB0eSBhbmQgbm90IGEgc29ydGFibGUgKHBvcnRsZXQpXG4gICAgICAgICAgY29sXG4gICAgICAgICAgICAudHJpZ2dlcihyZW1vdmVkRXZlbnQpIC8vIEFuIGV2ZW50IHRvIGNhdGNoIHdoZW4gdGhlIHBhbmVsIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSBET01cbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZWwgPSAkKHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIChlbC5pcygnW2NsYXNzKj1cImNvbC1cIl06bm90KC5zb3J0YWJsZSknKSAmJiBlbC5jaGlsZHJlbignKicpLmxlbmd0aCA9PT0gMCk7XG4gICAgICAgICAgfSkucmVtb3ZlKCk7XG4gICAgICAgfSk7XG5cbiAgICAgIFxuXG4gICAgfVxuXG4gIH0pO1xuXG59KGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCkpO1xuXG5cbi8qKlxuICogQ29sbGFwc2UgcGFuZWxzXG4gKiBbZGF0YS10b29sPVwicGFuZWwtY29sbGFwc2VcIl1cbiAqXG4gKiBBbHNvIHVzZXMgYnJvd3NlciBzdG9yYWdlIHRvIGtlZXAgdHJhY2tcbiAqIG9mIHBhbmVscyBjb2xsYXBzZWQgc3RhdGVcbiAqL1xuKGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgcGFuZWxTZWxlY3RvciA9ICdbZGF0YS10b29sPVwicGFuZWwtY29sbGFwc2VcIl0nLFxuICAgICAgc3RvcmFnZUtleU5hbWUgPSAnanEtcGFuZWxTdGF0ZSc7XG5cbiAgLy8gUHJlcGFyZSB0aGUgcGFuZWwgdG8gYmUgY29sbGFwc2FibGUgYW5kIGl0cyBldmVudHNcbiAgJChwYW5lbFNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgIC8vIGZpbmQgdGhlIGZpcnN0IHBhcmVudCBwYW5lbFxuICAgIHZhciAkdGhpcyAgICAgICAgPSAkKHRoaXMpLFxuICAgICAgICBwYXJlbnQgICAgICAgPSAkdGhpcy5jbG9zZXN0KCcucGFuZWwnKSxcbiAgICAgICAgd3JhcHBlciAgICAgID0gcGFyZW50LmZpbmQoJy5wYW5lbC13cmFwcGVyJyksXG4gICAgICAgIGNvbGxhcHNlT3B0cyA9IHt0b2dnbGU6IGZhbHNlfSxcbiAgICAgICAgaWNvbkVsZW1lbnQgID0gJHRoaXMuY2hpbGRyZW4oJ2VtJyksXG4gICAgICAgIHBhbmVsSWQgICAgICA9IHBhcmVudC5hdHRyKCdpZCcpO1xuICAgIFxuICAgIC8vIGlmIHdyYXBwZXIgbm90IGFkZGVkLCBhZGQgaXRcbiAgICAvLyB3ZSBuZWVkIGEgd3JhcHBlciB0byBhdm9pZCBqdW1waW5nIGR1ZSB0byB0aGUgcGFkZGluZ3NcbiAgICBpZiggISB3cmFwcGVyLmxlbmd0aCkge1xuICAgICAgd3JhcHBlciA9XG4gICAgICAgIHBhcmVudC5jaGlsZHJlbignLnBhbmVsLWhlYWRpbmcnKS5uZXh0QWxsKCkgLy9maW5kKCcucGFuZWwtYm9keSwgLnBhbmVsLWZvb3RlcicpXG4gICAgICAgICAgLndyYXBBbGwoJzxkaXYvPicpXG4gICAgICAgICAgLnBhcmVudCgpXG4gICAgICAgICAgLmFkZENsYXNzKCdwYW5lbC13cmFwcGVyJyk7XG4gICAgICBjb2xsYXBzZU9wdHMgPSB7fTtcbiAgICB9XG5cbiAgICAvLyBJbml0IGNvbGxhcHNlIGFuZCBiaW5kIGV2ZW50cyB0byBzd2l0Y2ggaWNvbnNcbiAgICB3cmFwcGVyXG4gICAgICAuY29sbGFwc2UoY29sbGFwc2VPcHRzKVxuICAgICAgLm9uKCdoaWRlLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHNldEljb25IaWRlKCBpY29uRWxlbWVudCApO1xuICAgICAgICBzYXZlUGFuZWxTdGF0ZSggcGFuZWxJZCwgJ2hpZGUnICk7XG4gICAgICAgIHdyYXBwZXIucHJldignLnBhbmVsLWhlYWRpbmcnKS5hZGRDbGFzcygncGFuZWwtaGVhZGluZy1jb2xsYXBzZWQnKTtcbiAgICAgIH0pXG4gICAgICAub24oJ3Nob3cuYnMuY29sbGFwc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc2V0SWNvblNob3coIGljb25FbGVtZW50ICk7XG4gICAgICAgIHNhdmVQYW5lbFN0YXRlKCBwYW5lbElkLCAnc2hvdycgKTtcbiAgICAgICAgd3JhcHBlci5wcmV2KCcucGFuZWwtaGVhZGluZycpLnJlbW92ZUNsYXNzKCdwYW5lbC1oZWFkaW5nLWNvbGxhcHNlZCcpO1xuICAgICAgfSk7XG5cbiAgICAvLyBMb2FkIHRoZSBzYXZlZCBzdGF0ZSBpZiBleGlzdHNcbiAgICB2YXIgY3VycmVudFN0YXRlID0gbG9hZFBhbmVsU3RhdGUoIHBhbmVsSWQgKTtcbiAgICBpZihjdXJyZW50U3RhdGUpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHdyYXBwZXIuY29sbGFwc2UoIGN1cnJlbnRTdGF0ZSApOyB9LCAwKTtcbiAgICAgIHNhdmVQYW5lbFN0YXRlKCBwYW5lbElkLCBjdXJyZW50U3RhdGUgKTtcbiAgICB9XG5cbiAgfSk7XG5cbiAgLy8gZmluYWxseSBjYXRjaCBjbGlja3MgdG8gdG9nZ2xlIHBhbmVsIGNvbGxhcHNlXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHBhbmVsU2VsZWN0b3IsIGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgcGFyZW50ID0gJCh0aGlzKS5jbG9zZXN0KCcucGFuZWwnKTtcbiAgICB2YXIgd3JhcHBlciA9IHBhcmVudC5maW5kKCcucGFuZWwtd3JhcHBlcicpO1xuXG4gICAgd3JhcHBlci5jb2xsYXBzZSgndG9nZ2xlJyk7XG5cbiAgfSk7XG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vIENvbW1vbiB1c2UgZnVuY3Rpb25zIGZvciBwYW5lbCBjb2xsYXBzZSAvL1xuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgZnVuY3Rpb24gc2V0SWNvblNob3coaWNvbkVsKSB7XG4gICAgaWNvbkVsLnJlbW92ZUNsYXNzKCdmYS1wbHVzJykuYWRkQ2xhc3MoJ2ZhLW1pbnVzJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRJY29uSGlkZShpY29uRWwpIHtcbiAgICBpY29uRWwucmVtb3ZlQ2xhc3MoJ2ZhLW1pbnVzJykuYWRkQ2xhc3MoJ2ZhLXBsdXMnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNhdmVQYW5lbFN0YXRlKGlkLCBzdGF0ZSkge1xuICAgIHZhciBkYXRhID0gJC5sb2NhbFN0b3JhZ2UuZ2V0KHN0b3JhZ2VLZXlOYW1lKTtcbiAgICBpZighZGF0YSkgeyBkYXRhID0ge307IH1cbiAgICBkYXRhW2lkXSA9IHN0YXRlO1xuICAgICQubG9jYWxTdG9yYWdlLnNldChzdG9yYWdlS2V5TmFtZSwgZGF0YSk7XG4gIH1cblxuICBmdW5jdGlvbiBsb2FkUGFuZWxTdGF0ZShpZCkge1xuICAgIHZhciBkYXRhID0gJC5sb2NhbFN0b3JhZ2UuZ2V0KHN0b3JhZ2VLZXlOYW1lKTtcbiAgICBpZihkYXRhKSB7XG4gICAgICByZXR1cm4gZGF0YVtpZF0gfHwgZmFsc2U7XG4gICAgfVxuICB9XG5cblxufShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpKTtcblxuXG4vKipcbiAqIFJlZnJlc2ggcGFuZWxzXG4gKiBbZGF0YS10b29sPVwicGFuZWwtcmVmcmVzaFwiXVxuICogW2RhdGEtc3Bpbm5lcj1cInN0YW5kYXJkXCJdXG4gKi9cbihmdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50KXtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgcGFuZWxTZWxlY3RvciAgPSAnW2RhdGEtdG9vbD1cInBhbmVsLXJlZnJlc2hcIl0nLFxuICAgICAgcmVmcmVzaEV2ZW50ICAgPSAncGFuZWwucmVmcmVzaCcsXG4gICAgICB3aGlybENsYXNzICAgICA9ICd3aGlybCcsXG4gICAgICBkZWZhdWx0U3Bpbm5lciA9ICdzdGFuZGFyZCc7XG5cbiAgLy8gbWV0aG9kIHRvIGNsZWFyIHRoZSBzcGlubmVyIHdoZW4gZG9uZVxuICBmdW5jdGlvbiByZW1vdmVTcGlubmVyKCl7XG4gICAgdGhpcy5yZW1vdmVDbGFzcyh3aGlybENsYXNzKTtcbiAgfVxuXG4gIC8vIGNhdGNoIGNsaWNrcyB0byB0b2dnbGUgcGFuZWwgcmVmcmVzaFxuICAkKGRvY3VtZW50KS5vbignY2xpY2snLCBwYW5lbFNlbGVjdG9yLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcyksXG4gICAgICAgICAgcGFuZWwgICA9ICR0aGlzLnBhcmVudHMoJy5wYW5lbCcpLmVxKDApLFxuICAgICAgICAgIHNwaW5uZXIgPSAkdGhpcy5kYXRhKCdzcGlubmVyJykgfHwgZGVmYXVsdFNwaW5uZXJcbiAgICAgICAgICA7XG5cbiAgICAgIC8vIHN0YXJ0IHNob3dpbmcgdGhlIHNwaW5uZXJcbiAgICAgIHBhbmVsLmFkZENsYXNzKHdoaXJsQ2xhc3MgKyAnICcgKyBzcGlubmVyKTtcblxuICAgICAgLy8gYXR0YWNoIGFzIHB1YmxpYyBtZXRob2RcbiAgICAgIHBhbmVsLnJlbW92ZVNwaW5uZXIgPSByZW1vdmVTcGlubmVyO1xuXG4gICAgICAvLyBUcmlnZ2VyIHRoZSBldmVudCBhbmQgc2VuZCB0aGUgcGFuZWwgb2JqZWN0XG4gICAgICAkdGhpcy50cmlnZ2VyKHJlZnJlc2hFdmVudCwgW3BhbmVsXSk7XG5cbiAgfSk7XG5cblxufShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpKTtcbiIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kdWxlOiBwbGF5LWFuaW1hdGlvbi5qc1xuICogUHJvdmlkZXMgYSBzaW1wbGUgd2F5IHRvIHJ1biBhbmltYXRpb24gd2l0aCBhIHRyaWdnZXJcbiAqIFRhcmdldGVkIGVsZW1lbnRzIG11c3QgaGF2ZSBcbiAqICAgW2RhdGEtYW5pbWF0ZVwiXVxuICogICBbZGF0YS10YXJnZXQ9XCJUYXJnZXQgZWxlbWVudCBhZmZlY3RlZCBieSB0aGUgYW5pbWF0aW9uXCJdIFxuICogICBbZGF0YS1wbGF5PVwiQW5pbWF0aW9uIG5hbWUgKGh0dHA6Ly9kYW5lZGVuLmdpdGh1Yi5pby9hbmltYXRlLmNzcy8pXCJdXG4gKlxuICogUmVxdWlyZXMgYW5pbW8uanNcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuIFxuKGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQpe1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIFNlbGVjdG9yID0gJ1tkYXRhLWFuaW1hdGVdJztcblxuICAkKGZ1bmN0aW9uKCkge1xuICAgIFxuICAgIHZhciAkc2Nyb2xsZXIgPSAkKHdpbmRvdykuYWRkKCdib2R5LCAud3JhcHBlcicpO1xuXG4gICAgLy8gUGFyc2UgYW5pbWF0aW9ucyBwYXJhbXMgYW5kIGF0dGFjaCB0cmlnZ2VyIHRvIHNjcm9sbFxuICAgICQoU2VsZWN0b3IpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJHRoaXMgICAgID0gJCh0aGlzKSxcbiAgICAgICAgICBvZmZzZXQgICAgPSAkdGhpcy5kYXRhKCdvZmZzZXQnKSxcbiAgICAgICAgICBkZWxheSAgICAgPSAkdGhpcy5kYXRhKCdkZWxheScpICAgICB8fCAxMDAsIC8vIG1pbGxpc2Vjb25kc1xuICAgICAgICAgIGFuaW1hdGlvbiA9ICR0aGlzLmRhdGEoJ3BsYXknKSAgICAgIHx8ICdib3VuY2UnO1xuICAgICAgXG4gICAgICBpZih0eXBlb2Ygb2Zmc2V0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBcbiAgICAgICAgLy8gdGVzdCBpZiB0aGUgZWxlbWVudCBzdGFydHMgdmlzaWJsZVxuICAgICAgICB0ZXN0QW5pbWF0aW9uKCR0aGlzKTtcbiAgICAgICAgLy8gdGVzdCBvbiBzY3JvbGxcbiAgICAgICAgJHNjcm9sbGVyLnNjcm9sbChmdW5jdGlvbigpe1xuICAgICAgICAgIHRlc3RBbmltYXRpb24oJHRoaXMpO1xuICAgICAgICB9KTtcblxuICAgICAgfVxuXG4gICAgICAvLyBUZXN0IGFuIGVsZW1lbnQgdmlzaWJpbHR5IGFuZCB0cmlnZ2VyIHRoZSBnaXZlbiBhbmltYXRpb25cbiAgICAgIGZ1bmN0aW9uIHRlc3RBbmltYXRpb24oZWxlbWVudCkge1xuICAgICAgICAgIGlmICggIWVsZW1lbnQuaGFzQ2xhc3MoJ2FuaW0tcnVubmluZycpICYmXG4gICAgICAgICAgICAgICQuVXRpbHMuaXNJblZpZXcoZWxlbWVudCwge3RvcG9mZnNldDogb2Zmc2V0fSkpIHtcbiAgICAgICAgICBlbGVtZW50XG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2FuaW0tcnVubmluZycpO1xuXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAgICAgLmFkZENsYXNzKCdhbmltLWRvbmUnKVxuICAgICAgICAgICAgICAuYW5pbW8oIHsgYW5pbWF0aW9uOiBhbmltYXRpb24sIGR1cmF0aW9uOiAwLjd9ICk7XG4gICAgICAgICAgfSwgZGVsYXkpO1xuXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgLy8gUnVuIGNsaWNrIHRyaWdnZXJlZCBhbmltYXRpb25zXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgU2VsZWN0b3IsIGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgJHRoaXMgICAgID0gJCh0aGlzKSxcbiAgICAgICAgICB0YXJnZXRTZWwgPSAkdGhpcy5kYXRhKCd0YXJnZXQnKSxcbiAgICAgICAgICBhbmltYXRpb24gPSAkdGhpcy5kYXRhKCdwbGF5JykgfHwgJ2JvdW5jZScsXG4gICAgICAgICAgdGFyZ2V0ICAgID0gJCh0YXJnZXRTZWwpO1xuXG4gICAgICBpZih0YXJnZXQgJiYgdGFyZ2V0Lmxlbmd0aCkge1xuICAgICAgICB0YXJnZXQuYW5pbW8oIHsgYW5pbWF0aW9uOiBhbmltYXRpb24gfSApO1xuICAgICAgfVxuICAgICAgXG4gICAgfSk7XG5cbiAgfSk7XG5cbn0oalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KSk7XG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogcG9ydGxldC5qc1xuICogRHJhZyBhbmQgZHJvcCBhbnkgcGFuZWwgdG8gY2hhbmdlIGl0cyBwb3NpdGlvblxuICogVGhlIFNlbGVjdG9yIHNob3VsZCBjb3VsZCBiZSBhcHBsaWVkIHRvIGFueSBvYmplY3QgdGhhdCBjb250YWluc1xuICogcGFuZWwsIHNvIC5jb2wtKiBlbGVtZW50IGFyZSBpZGVhbC5cbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCl7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBDb21wb25lbnQgaXMgb3B0aW9uYWxcbiAgaWYoISQuZm4uc29ydGFibGUpIHJldHVybjtcblxuICB2YXIgU2VsZWN0b3IgPSAnW2RhdGEtdG9nZ2xlPVwicG9ydGxldFwiXScsXG4gICAgICBzdG9yYWdlS2V5TmFtZSA9ICdqcS1wb3J0bGV0U3RhdGUnO1xuXG4gICQoZnVuY3Rpb24oKXtcblxuICAgICQoIFNlbGVjdG9yICkuc29ydGFibGUoe1xuICAgICAgY29ubmVjdFdpdGg6ICAgICAgICAgIFNlbGVjdG9yLFxuICAgICAgaXRlbXM6ICAgICAgICAgICAgICAgICdkaXYucGFuZWwnLFxuICAgICAgaGFuZGxlOiAgICAgICAgICAgICAgICcucG9ydGxldC1oYW5kbGVyJyxcbiAgICAgIG9wYWNpdHk6ICAgICAgICAgICAgICAwLjcsXG4gICAgICBwbGFjZWhvbGRlcjogICAgICAgICAgJ3BvcnRsZXQgYm94LXBsYWNlaG9sZGVyJyxcbiAgICAgIGNhbmNlbDogICAgICAgICAgICAgICAnLnBvcnRsZXQtY2FuY2VsJyxcbiAgICAgIGZvcmNlUGxhY2Vob2xkZXJTaXplOiB0cnVlLFxuICAgICAgaWZyYW1lRml4OiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgdG9sZXJhbmNlOiAgICAgICAgICAgICdwb2ludGVyJyxcbiAgICAgIGhlbHBlcjogICAgICAgICAgICAgICAnb3JpZ2luYWwnLFxuICAgICAgcmV2ZXJ0OiAgICAgICAgICAgICAgIDIwMCxcbiAgICAgIGZvcmNlSGVscGVyU2l6ZTogICAgICB0cnVlLFxuICAgICAgdXBkYXRlOiAgICAgICAgICAgICAgIHNhdmVQb3J0bGV0T3JkZXIsXG4gICAgICBjcmVhdGU6ICAgICAgICAgICAgICAgbG9hZFBvcnRsZXRPcmRlclxuICAgIH0pXG4gICAgLy8gb3B0aW9uYWxseSBkaXNhYmxlcyBtb3VzZSBzZWxlY3Rpb25cbiAgICAvLy5kaXNhYmxlU2VsZWN0aW9uKClcbiAgICA7XG5cbiAgfSk7XG5cbiAgZnVuY3Rpb24gc2F2ZVBvcnRsZXRPcmRlcihldmVudCwgdWkpIHtcbiAgICBcbiAgICB2YXIgZGF0YSA9ICQubG9jYWxTdG9yYWdlLmdldChzdG9yYWdlS2V5TmFtZSk7XG4gICAgXG4gICAgaWYoIWRhdGEpIHsgZGF0YSA9IHt9OyB9XG5cbiAgICBkYXRhW3RoaXMuaWRdID0gJCh0aGlzKS5zb3J0YWJsZSgndG9BcnJheScpO1xuXG4gICAgaWYoZGF0YSkge1xuICAgICAgJC5sb2NhbFN0b3JhZ2Uuc2V0KHN0b3JhZ2VLZXlOYW1lLCBkYXRhKTtcbiAgICB9XG4gICAgXG4gIH1cblxuICBmdW5jdGlvbiBsb2FkUG9ydGxldE9yZGVyKCkge1xuICAgIFxuICAgIHZhciBkYXRhID0gJC5sb2NhbFN0b3JhZ2UuZ2V0KHN0b3JhZ2VLZXlOYW1lKTtcblxuICAgIGlmKGRhdGEpIHtcbiAgICAgIFxuICAgICAgdmFyIHBvcmxldElkID0gdGhpcy5pZCxcbiAgICAgICAgICBwYW5lbHMgICA9IGRhdGFbcG9ybGV0SWRdO1xuXG4gICAgICBpZihwYW5lbHMpIHtcbiAgICAgICAgdmFyIHBvcnRsZXQgPSAkKCcjJytwb3JsZXRJZCk7XG4gICAgICAgIFxuICAgICAgICAkLmVhY2gocGFuZWxzLCBmdW5jdGlvbihpbmRleCwgdmFsdWUpIHtcbiAgICAgICAgICAgJCgnIycrdmFsdWUpLmFwcGVuZFRvKHBvcnRsZXQpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH1cblxuICB9XG5cbn0oalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KSk7XG5cbiIsIi8vIFJpY2tzaGF3XHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG5cclxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQsIHVuZGVmaW5lZCl7XHJcblxyXG4gICQoZnVuY3Rpb24oKXtcclxuICAgIFxyXG4gICAgaWYgKCB0eXBlb2YgUmlja3NoYXcgPT09ICd1bmRlZmluZWQnICkgcmV0dXJuO1xyXG5cclxuICAgIHZhciBzZXJpZXNEYXRhID0gWyBbXSwgW10sIFtdIF07XHJcbiAgICB2YXIgcmFuZG9tID0gbmV3IFJpY2tzaGF3LkZpeHR1cmVzLlJhbmRvbURhdGEoMTUwKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDE1MDsgaSsrKSB7XHJcbiAgICAgIHJhbmRvbS5hZGREYXRhKHNlcmllc0RhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBzZXJpZXMxID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgY29sb3I6IFwiI2MwNTAyMFwiLFxyXG4gICAgICAgIGRhdGE6IHNlcmllc0RhdGFbMF0sXHJcbiAgICAgICAgbmFtZTogJ05ldyBZb3JrJ1xyXG4gICAgICB9LCB7XHJcbiAgICAgICAgY29sb3I6IFwiIzMwYzAyMFwiLFxyXG4gICAgICAgIGRhdGE6IHNlcmllc0RhdGFbMV0sXHJcbiAgICAgICAgbmFtZTogJ0xvbmRvbidcclxuICAgICAgfSwge1xyXG4gICAgICAgIGNvbG9yOiBcIiM2MDYwYzBcIixcclxuICAgICAgICBkYXRhOiBzZXJpZXNEYXRhWzJdLFxyXG4gICAgICAgIG5hbWU6ICdUb2t5bydcclxuICAgICAgfVxyXG4gICAgXTtcclxuXHJcbiAgICB2YXIgZ3JhcGgxID0gbmV3IFJpY2tzaGF3LkdyYXBoKCB7XHJcbiAgICAgICAgZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyaWNrc2hhdzFcIiksIFxyXG4gICAgICAgIHNlcmllczpzZXJpZXMxLFxyXG4gICAgICAgIHJlbmRlcmVyOiAnYXJlYSdcclxuICAgIH0pO1xyXG4gICAgIFxyXG4gICAgZ3JhcGgxLnJlbmRlcigpO1xyXG5cclxuXHJcbiAgICAvLyBHcmFwaCAyXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuXHJcbiAgICB2YXIgZ3JhcGgyID0gbmV3IFJpY2tzaGF3LkdyYXBoKCB7XHJcbiAgICAgIGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmlja3NoYXcyXCIpLFxyXG4gICAgICByZW5kZXJlcjogJ2FyZWEnLFxyXG4gICAgICBzdHJva2U6IHRydWUsXHJcbiAgICAgIHNlcmllczogWyB7XHJcbiAgICAgICAgZGF0YTogWyB7IHg6IDAsIHk6IDQwIH0sIHsgeDogMSwgeTogNDkgfSwgeyB4OiAyLCB5OiAzOCB9LCB7IHg6IDMsIHk6IDMwIH0sIHsgeDogNCwgeTogMzIgfSBdLFxyXG4gICAgICAgIGNvbG9yOiAnI2YwNTA1MCdcclxuICAgICAgfSwge1xyXG4gICAgICAgIGRhdGE6IFsgeyB4OiAwLCB5OiA0MCB9LCB7IHg6IDEsIHk6IDQ5IH0sIHsgeDogMiwgeTogMzggfSwgeyB4OiAzLCB5OiAzMCB9LCB7IHg6IDQsIHk6IDMyIH0gXSxcclxuICAgICAgICBjb2xvcjogJyNmYWQ3MzInXHJcbiAgICAgIH0gXVxyXG4gICAgfSApO1xyXG5cclxuICAgIGdyYXBoMi5yZW5kZXIoKTtcclxuXHJcbiAgICAvLyBHcmFwaCAzXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuXHJcblxyXG4gICAgdmFyIGdyYXBoMyA9IG5ldyBSaWNrc2hhdy5HcmFwaCh7XHJcbiAgICAgIGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmlja3NoYXczXCIpLFxyXG4gICAgICByZW5kZXJlcjogJ2xpbmUnLFxyXG4gICAgICBzZXJpZXM6IFt7XHJcbiAgICAgICAgZGF0YTogWyB7IHg6IDAsIHk6IDQwIH0sIHsgeDogMSwgeTogNDkgfSwgeyB4OiAyLCB5OiAzOCB9LCB7IHg6IDMsIHk6IDMwIH0sIHsgeDogNCwgeTogMzIgfSBdLFxyXG4gICAgICAgIGNvbG9yOiAnIzcyNjZiYSdcclxuICAgICAgfSwge1xyXG4gICAgICAgIGRhdGE6IFsgeyB4OiAwLCB5OiAyMCB9LCB7IHg6IDEsIHk6IDI0IH0sIHsgeDogMiwgeTogMTkgfSwgeyB4OiAzLCB5OiAxNSB9LCB7IHg6IDQsIHk6IDE2IH0gXSxcclxuICAgICAgICBjb2xvcjogJyMyM2I3ZTUnXHJcbiAgICAgIH1dXHJcbiAgICB9KTtcclxuICAgIGdyYXBoMy5yZW5kZXIoKTtcclxuXHJcblxyXG4gICAgLy8gR3JhcGggNFxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcblxyXG5cclxuICAgIHZhciBncmFwaDQgPSBuZXcgUmlja3NoYXcuR3JhcGgoIHtcclxuICAgICAgZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyaWNrc2hhdzRcIiksXHJcbiAgICAgIHJlbmRlcmVyOiAnYmFyJyxcclxuICAgICAgc2VyaWVzOiBbIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGRhdGE6IFsgeyB4OiAwLCB5OiA0MCB9LCB7IHg6IDEsIHk6IDQ5IH0sIHsgeDogMiwgeTogMzggfSwgeyB4OiAzLCB5OiAzMCB9LCB7IHg6IDQsIHk6IDMyIH0gXSxcclxuICAgICAgICAgIGNvbG9yOiAnI2ZhZDczMidcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICBkYXRhOiBbIHsgeDogMCwgeTogMjAgfSwgeyB4OiAxLCB5OiAyNCB9LCB7IHg6IDIsIHk6IDE5IH0sIHsgeDogMywgeTogMTUgfSwgeyB4OiA0LCB5OiAxNiB9IF0sXHJcbiAgICAgICAgICBjb2xvcjogJyNmZjkwMmInXHJcblxyXG4gICAgICB9IF1cclxuICAgIH0gKTtcclxuICAgIGdyYXBoNC5yZW5kZXIoKTtcclxuXHJcblxyXG4gIH0pO1xyXG5cclxufSkod2luZG93LCBkb2N1bWVudCwgd2luZG93LmpRdWVyeSk7XHJcbiIsIi8vIFNlbGVjdDJcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCAkLCB1bmRlZmluZWQpe1xyXG5cclxuICAkKGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgaWYgKCAhJC5mbi5zZWxlY3QyICkgcmV0dXJuO1xyXG5cclxuICAgIC8vIFNlbGVjdCAyXHJcblxyXG4gICAgJCgnI3NlbGVjdDItMScpLnNlbGVjdDIoe1xyXG4gICAgICAgIHRoZW1lOiAnYm9vdHN0cmFwJ1xyXG4gICAgfSk7XHJcbiAgICAkKCcjc2VsZWN0Mi0yJykuc2VsZWN0Mih7XHJcbiAgICAgICAgdGhlbWU6ICdib290c3RyYXAnXHJcbiAgICB9KTtcclxuICAgICQoJyNzZWxlY3QyLTMnKS5zZWxlY3QyKHtcclxuICAgICAgICB0aGVtZTogJ2Jvb3RzdHJhcCdcclxuICAgIH0pO1xyXG4gICAgJCgnI3NlbGVjdDItNCcpLnNlbGVjdDIoe1xyXG4gICAgICAgIHBsYWNlaG9sZGVyOiAnU2VsZWN0IGEgc3RhdGUnLFxyXG4gICAgICAgIGFsbG93Q2xlYXI6IHRydWUsXHJcbiAgICAgICAgdGhlbWU6ICdib290c3RyYXAnXHJcbiAgICB9KTtcclxuXHJcbiAgfSk7XHJcblxyXG59KSh3aW5kb3csIGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5KTtcclxuXHJcbiIsIi8vIFNJREVCQVJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuXG5cbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCAkLCB1bmRlZmluZWQpe1xuXG4gIHZhciAkd2luO1xuICB2YXIgJGh0bWw7XG4gIHZhciAkYm9keTtcbiAgdmFyICRzaWRlYmFyO1xuICB2YXIgbXE7XG5cbiAgJChmdW5jdGlvbigpe1xuXG4gICAgJHdpbiAgICAgPSAkKHdpbmRvdyk7XG4gICAgJGh0bWwgICAgPSAkKCdodG1sJyk7XG4gICAgJGJvZHkgICAgPSAkKCdib2R5Jyk7XG4gICAgJHNpZGViYXIgPSAkKCcuc2lkZWJhcicpO1xuICAgIG1xICAgICAgID0gQVBQX01FRElBUVVFUlk7XG4gICAgXG4gICAgLy8gQVVUT0NPTExBUFNFIElURU1TIFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuXG4gICAgdmFyIHNpZGViYXJDb2xsYXBzZSA9ICRzaWRlYmFyLmZpbmQoJy5jb2xsYXBzZScpO1xuICAgIHNpZGViYXJDb2xsYXBzZS5vbignc2hvdy5icy5jb2xsYXBzZScsIGZ1bmN0aW9uKGV2ZW50KXtcblxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAoICQodGhpcykucGFyZW50cygnLmNvbGxhcHNlJykubGVuZ3RoID09PSAwIClcbiAgICAgICAgc2lkZWJhckNvbGxhcHNlLmZpbHRlcignLmluJykuY29sbGFwc2UoJ2hpZGUnKTtcblxuICAgIH0pO1xuICAgIFxuICAgIC8vIFNJREVCQVIgQUNUSVZFIFNUQVRFIFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuICAgIFxuICAgIC8vIEZpbmQgY3VycmVudCBhY3RpdmUgaXRlbVxuICAgIHZhciBjdXJyZW50SXRlbSA9ICQoJy5zaWRlYmFyIC5hY3RpdmUnKS5wYXJlbnRzKCdsaScpO1xuXG4gICAgLy8gaG92ZXIgbW9kZSBkb24ndCB0cnkgdG8gZXhwYW5kIGFjdGl2ZSBjb2xsYXBzZVxuICAgIGlmICggISB1c2VBc2lkZUhvdmVyKCkgKVxuICAgICAgY3VycmVudEl0ZW1cbiAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKSAgICAgLy8gYWN0aXZhdGUgdGhlIHBhcmVudFxuICAgICAgICAuY2hpbGRyZW4oJy5jb2xsYXBzZScpICAvLyBmaW5kIHRoZSBjb2xsYXBzZVxuICAgICAgICAuY29sbGFwc2UoJ3Nob3cnKTsgICAgICAvLyBhbmQgc2hvdyBpdFxuXG4gICAgLy8gcmVtb3ZlIHRoaXMgaWYgeW91IHVzZSBvbmx5IGNvbGxhcHNpYmxlIHNpZGViYXIgaXRlbXNcbiAgICAkc2lkZWJhci5maW5kKCdsaSA+IGEgKyB1bCcpLm9uKCdzaG93LmJzLmNvbGxhcHNlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmKCB1c2VBc2lkZUhvdmVyKCkgKSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSk7XG5cbiAgICAvLyBTSURFQkFSIENPTExBUFNFRCBJVEVNIEhBTkRMRVJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuXG4gICAgdmFyIGV2ZW50TmFtZSA9IGlzVG91Y2goKSA/ICdjbGljaycgOiAnbW91c2VlbnRlcicgO1xuICAgIHZhciBzdWJOYXYgPSAkKCk7XG4gICAgJHNpZGViYXIub24oIGV2ZW50TmFtZSwgJy5uYXYgPiBsaScsIGZ1bmN0aW9uKCkge1xuXG4gICAgICBpZiggaXNTaWRlYmFyQ29sbGFwc2VkKCkgfHwgdXNlQXNpZGVIb3ZlcigpICkge1xuXG4gICAgICAgIHN1Yk5hdi50cmlnZ2VyKCdtb3VzZWxlYXZlJyk7XG4gICAgICAgIHN1Yk5hdiA9IHRvZ2dsZU1lbnVJdGVtKCAkKHRoaXMpICk7XG5cbiAgICAgICAgLy8gVXNlZCB0byBkZXRlY3QgY2xpY2sgYW5kIHRvdWNoIGV2ZW50cyBvdXRzaWRlIHRoZSBzaWRlYmFyICAgICAgICAgIFxuICAgICAgICBzaWRlYmFyQWRkQmFja2Ryb3AoKTtcbiAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgdmFyIHNpZGViYXJBbnljbGlja0Nsb3NlID0gJHNpZGViYXIuZGF0YSgnc2lkZWJhckFueWNsaWNrQ2xvc2UnKTtcblxuICAgIC8vIEFsbG93cyB0byBjbG9zZVxuICAgIGlmICggdHlwZW9mIHNpZGViYXJBbnljbGlja0Nsb3NlICE9PSAndW5kZWZpbmVkJyApIHtcblxuICAgICAgJCgnLndyYXBwZXInKS5vbignY2xpY2suc2lkZWJhcicsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAvLyBkb24ndCBjaGVjayBpZiBzaWRlYmFyIG5vdCB2aXNpYmxlXG4gICAgICAgIGlmKCAhICRib2R5Lmhhc0NsYXNzKCdhc2lkZS10b2dnbGVkJykpIHJldHVybjtcblxuICAgICAgICB2YXIgJHRhcmdldCA9ICQoZS50YXJnZXQpO1xuICAgICAgICBpZiggISAkdGFyZ2V0LnBhcmVudHMoJy5hc2lkZScpLmxlbmd0aCAmJiAvLyBpZiBub3QgY2hpbGQgb2Ygc2lkZWJhclxuICAgICAgICAgICAgISAkdGFyZ2V0LmlzKCcjdXNlci1ibG9jay10b2dnbGUnKSAmJiAvLyB1c2VyIGJsb2NrIHRvZ2dsZSBhbmNob3JcbiAgICAgICAgICAgICEgJHRhcmdldC5wYXJlbnQoKS5pcygnI3VzZXItYmxvY2stdG9nZ2xlJykgLy8gdXNlciBibG9jayB0b2dnbGUgaWNvblxuICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICRib2R5LnJlbW92ZUNsYXNzKCdhc2lkZS10b2dnbGVkJyk7ICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgIH0pO1xuICAgIH1cblxuICB9KTtcblxuICBmdW5jdGlvbiBzaWRlYmFyQWRkQmFja2Ryb3AoKSB7XG4gICAgdmFyICRiYWNrZHJvcCA9ICQoJzxkaXYvPicsIHsgJ2NsYXNzJzogJ2Ryb3Bkb3duLWJhY2tkcm9wJ30gKTtcbiAgICAkYmFja2Ryb3AuaW5zZXJ0QWZ0ZXIoJy5hc2lkZScpLm9uKFwiY2xpY2sgbW91c2VlbnRlclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZW1vdmVGbG9hdGluZ05hdigpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gT3BlbiB0aGUgY29sbGFwc2Ugc2lkZWJhciBzdWJtZW51IGl0ZW1zIHdoZW4gb24gdG91Y2ggZGV2aWNlcyBcbiAgLy8gLSBkZXNrdG9wIG9ubHkgb3BlbnMgb24gaG92ZXJcbiAgZnVuY3Rpb24gdG9nZ2xlVG91Y2hJdGVtKCRlbGVtZW50KXtcbiAgICAkZWxlbWVudFxuICAgICAgLnNpYmxpbmdzKCdsaScpXG4gICAgICAucmVtb3ZlQ2xhc3MoJ29wZW4nKVxuICAgICAgLmVuZCgpXG4gICAgICAudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgfVxuXG4gIC8vIEhhbmRsZXMgaG92ZXIgdG8gb3BlbiBpdGVtcyB1bmRlciBjb2xsYXBzZWQgbWVudVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcbiAgZnVuY3Rpb24gdG9nZ2xlTWVudUl0ZW0oJGxpc3RJdGVtKSB7XG5cbiAgICByZW1vdmVGbG9hdGluZ05hdigpO1xuXG4gICAgdmFyIHVsID0gJGxpc3RJdGVtLmNoaWxkcmVuKCd1bCcpO1xuICAgIFxuICAgIGlmKCAhdWwubGVuZ3RoICkgcmV0dXJuICQoKTtcbiAgICBpZiggJGxpc3RJdGVtLmhhc0NsYXNzKCdvcGVuJykgKSB7XG4gICAgICB0b2dnbGVUb3VjaEl0ZW0oJGxpc3RJdGVtKTtcbiAgICAgIHJldHVybiAkKCk7XG4gICAgfVxuXG4gICAgdmFyICRhc2lkZSA9ICQoJy5hc2lkZScpO1xuICAgIHZhciAkYXNpZGVJbm5lciA9ICQoJy5hc2lkZS1pbm5lcicpOyAvLyBmb3IgdG9wIG9mZnNldCBjYWxjdWxhdGlvblxuICAgIC8vIGZsb2F0IGFzaWRlIHVzZXMgZXh0cmEgcGFkZGluZyBvbiBhc2lkZVxuICAgIHZhciBtYXIgPSBwYXJzZUludCggJGFzaWRlSW5uZXIuY3NzKCdwYWRkaW5nLXRvcCcpLCAwKSArIHBhcnNlSW50KCAkYXNpZGUuY3NzKCdwYWRkaW5nLXRvcCcpLCAwKTtcblxuICAgIHZhciBzdWJOYXYgPSB1bC5jbG9uZSgpLmFwcGVuZFRvKCAkYXNpZGUgKTtcbiAgICBcbiAgICB0b2dnbGVUb3VjaEl0ZW0oJGxpc3RJdGVtKTtcblxuICAgIHZhciBpdGVtVG9wID0gKCRsaXN0SXRlbS5wb3NpdGlvbigpLnRvcCArIG1hcikgLSAkc2lkZWJhci5zY3JvbGxUb3AoKTtcbiAgICB2YXIgdndIZWlnaHQgPSAkd2luLmhlaWdodCgpO1xuXG4gICAgc3ViTmF2XG4gICAgICAuYWRkQ2xhc3MoJ25hdi1mbG9hdGluZycpXG4gICAgICAuY3NzKHtcbiAgICAgICAgcG9zaXRpb246IGlzRml4ZWQoKSA/ICdmaXhlZCcgOiAnYWJzb2x1dGUnLFxuICAgICAgICB0b3A6ICAgICAgaXRlbVRvcCxcbiAgICAgICAgYm90dG9tOiAgIChzdWJOYXYub3V0ZXJIZWlnaHQodHJ1ZSkgKyBpdGVtVG9wID4gdndIZWlnaHQpID8gMCA6ICdhdXRvJ1xuICAgICAgfSk7XG5cbiAgICBzdWJOYXYub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcbiAgICAgIHRvZ2dsZVRvdWNoSXRlbSgkbGlzdEl0ZW0pO1xuICAgICAgc3ViTmF2LnJlbW92ZSgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHN1Yk5hdjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUZsb2F0aW5nTmF2KCkge1xuICAgICQoJy5zaWRlYmFyLXN1Ym5hdi5uYXYtZmxvYXRpbmcnKS5yZW1vdmUoKTtcbiAgICAkKCcuZHJvcGRvd24tYmFja2Ryb3AnKS5yZW1vdmUoKTtcbiAgICAkKCcuc2lkZWJhciBsaS5vcGVuJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzVG91Y2goKSB7XG4gICAgcmV0dXJuICRodG1sLmhhc0NsYXNzKCd0b3VjaCcpO1xuICB9XG4gIGZ1bmN0aW9uIGlzU2lkZWJhckNvbGxhcHNlZCgpIHtcbiAgICByZXR1cm4gJGJvZHkuaGFzQ2xhc3MoJ2FzaWRlLWNvbGxhcHNlZCcpO1xuICB9XG4gIGZ1bmN0aW9uIGlzU2lkZWJhclRvZ2dsZWQoKSB7XG4gICAgcmV0dXJuICRib2R5Lmhhc0NsYXNzKCdhc2lkZS10b2dnbGVkJyk7XG4gIH1cbiAgZnVuY3Rpb24gaXNNb2JpbGUoKSB7XG4gICAgcmV0dXJuICR3aW4ud2lkdGgoKSA8IG1xLnRhYmxldDtcbiAgfVxuICBmdW5jdGlvbiBpc0ZpeGVkKCl7XG4gICAgcmV0dXJuICRib2R5Lmhhc0NsYXNzKCdsYXlvdXQtZml4ZWQnKTtcbiAgfVxuICBmdW5jdGlvbiB1c2VBc2lkZUhvdmVyKCkge1xuICAgIHJldHVybiAkYm9keS5oYXNDbGFzcygnYXNpZGUtaG92ZXInKTtcbiAgfVxuXG59KSh3aW5kb3csIGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5KTsiLCIvLyBTS1lDT05TXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQsIHVuZGVmaW5lZCl7XG5cbiAgJChmdW5jdGlvbigpe1xuXG4gICAgJCgnW2RhdGEtc2t5Y29uXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgIHZhciBlbGVtZW50ID0gJCh0aGlzKSxcbiAgICAgICAgICBza3ljb25zID0gbmV3IFNreWNvbnMoeydjb2xvcic6IChlbGVtZW50LmRhdGEoJ2NvbG9yJykgfHwgJ3doaXRlJyl9KTtcbiAgICAgIFxuICAgICAgZWxlbWVudC5odG1sKCc8Y2FudmFzIHdpZHRoPVwiJyArIGVsZW1lbnQuZGF0YSgnd2lkdGgnKSArICdcIiBoZWlnaHQ9XCInICsgZWxlbWVudC5kYXRhKCdoZWlnaHQnKSArICdcIj48L2NhbnZhcz4nKTtcblxuICAgICAgc2t5Y29ucy5hZGQoZWxlbWVudC5jaGlsZHJlbigpWzBdLCBlbGVtZW50LmRhdGEoJ3NreWNvbicpKTtcblxuICAgICAgc2t5Y29ucy5wbGF5KCk7XG4gICAgfSk7XG5cbiAgfSk7XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpOyIsIi8vIFNMSU1TQ1JPTExcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKXtcblxuICAkKGZ1bmN0aW9uKCl7XG5cbiAgICAkKCdbZGF0YS1zY3JvbGxhYmxlXScpLmVhY2goZnVuY3Rpb24oKXtcblxuICAgICAgdmFyIGVsZW1lbnQgPSAkKHRoaXMpLFxuICAgICAgICAgIGRlZmF1bHRIZWlnaHQgPSAyNTA7XG4gICAgICBcbiAgICAgIGVsZW1lbnQuc2xpbVNjcm9sbCh7XG4gICAgICAgICAgaGVpZ2h0OiAoZWxlbWVudC5kYXRhKCdoZWlnaHQnKSB8fCBkZWZhdWx0SGVpZ2h0KVxuICAgICAgfSk7XG4gICAgICBcbiAgICB9KTtcbiAgfSk7XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpO1xuIiwiLy8gU1BBUktMSU5FXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQsIHVuZGVmaW5lZCl7XG5cbiAgJChmdW5jdGlvbigpe1xuXG4gICAgJCgnW2RhdGEtc3BhcmtsaW5lXScpLmVhY2goaW5pdFNwYXJrTGluZSk7XG5cbiAgICBmdW5jdGlvbiBpbml0U3BhcmtMaW5lKCkge1xuICAgICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKSxcbiAgICAgICAgICBvcHRpb25zID0gJGVsZW1lbnQuZGF0YSgpLFxuICAgICAgICAgIHZhbHVlcyAgPSBvcHRpb25zLnZhbHVlcyAmJiBvcHRpb25zLnZhbHVlcy5zcGxpdCgnLCcpO1xuXG4gICAgICBvcHRpb25zLnR5cGUgPSBvcHRpb25zLnR5cGUgfHwgJ2Jhcic7IC8vIGRlZmF1bHQgY2hhcnQgaXMgYmFyXG4gICAgICBvcHRpb25zLmRpc2FibGVIaWRkZW5DaGVjayA9IHRydWU7XG5cbiAgICAgICRlbGVtZW50LnNwYXJrbGluZSh2YWx1ZXMsIG9wdGlvbnMpO1xuXG4gICAgICBpZihvcHRpb25zLnJlc2l6ZSkge1xuICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJGVsZW1lbnQuc3BhcmtsaW5lKHZhbHVlcywgb3B0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpO1xuIiwiLy8gU3dlZXQgQWxlcnRcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcblxyXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKXtcclxuXHJcbiAgJChmdW5jdGlvbigpe1xyXG5cclxuICAgICQoJyNzd2FsLWRlbW8xJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgc3dhbChcIkhlcmUncyBhIG1lc3NhZ2UhXCIpXHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgJCgnI3N3YWwtZGVtbzInKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBzd2FsKFwiSGVyZSdzIGEgbWVzc2FnZSFcIiwgXCJJdCdzIHByZXR0eSwgaXNuJ3QgaXQ/XCIpXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcjc3dhbC1kZW1vMycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHN3YWwoXCJHb29kIGpvYiFcIiwgXCJZb3UgY2xpY2tlZCB0aGUgYnV0dG9uIVwiLCBcInN1Y2Nlc3NcIilcclxuICAgIH0pO1xyXG5cclxuICAgICQoJyNzd2FsLWRlbW80Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgdGl0bGUgOiBcIkFyZSB5b3Ugc3VyZT9cIixcclxuICAgICAgICB0ZXh0IDogXCJZb3Ugd2lsbCBub3QgYmUgYWJsZSB0byByZWNvdmVyIHRoaXMgaW1hZ2luYXJ5IGZpbGUhXCIsXHJcbiAgICAgICAgdHlwZSA6IFwid2FybmluZ1wiLFxyXG4gICAgICAgIHNob3dDYW5jZWxCdXR0b24gOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpcm1CdXR0b25Db2xvciA6IFwiI0RENkI1NVwiLFxyXG4gICAgICAgIGNvbmZpcm1CdXR0b25UZXh0IDogXCJZZXMsIGRlbGV0ZSBpdCFcIixcclxuICAgICAgICBjbG9zZU9uQ29uZmlybSA6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHN3YWwoXCJEZWxldGVkIVwiLCBcIllvdXIgaW1hZ2luYXJ5IGZpbGUgaGFzIGJlZW4gZGVsZXRlZC5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcjc3dhbC1kZW1vNScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIHRpdGxlIDogXCJBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgdGV4dCA6IFwiWW91IHdpbGwgbm90IGJlIGFibGUgdG8gcmVjb3ZlciB0aGlzIGltYWdpbmFyeSBmaWxlIVwiLFxyXG4gICAgICAgIHR5cGUgOiBcIndhcm5pbmdcIixcclxuICAgICAgICBzaG93Q2FuY2VsQnV0dG9uIDogdHJ1ZSxcclxuICAgICAgICBjb25maXJtQnV0dG9uQ29sb3IgOiBcIiNERDZCNTVcIixcclxuICAgICAgICBjb25maXJtQnV0dG9uVGV4dCA6IFwiWWVzLCBkZWxldGUgaXQhXCIsXHJcbiAgICAgICAgY2FuY2VsQnV0dG9uVGV4dCA6IFwiTm8sIGNhbmNlbCBwbHghXCIsXHJcbiAgICAgICAgY2xvc2VPbkNvbmZpcm0gOiBmYWxzZSxcclxuICAgICAgICBjbG9zZU9uQ2FuY2VsIDogZmFsc2VcclxuICAgICAgfSwgZnVuY3Rpb24gKGlzQ29uZmlybSkge1xyXG4gICAgICAgIGlmIChpc0NvbmZpcm0pIHtcclxuICAgICAgICAgIHN3YWwoXCJEZWxldGVkIVwiLCBcIllvdXIgaW1hZ2luYXJ5IGZpbGUgaGFzIGJlZW4gZGVsZXRlZC5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzd2FsKFwiQ2FuY2VsbGVkXCIsIFwiWW91ciBpbWFnaW5hcnkgZmlsZSBpcyBzYWZlIDopXCIsIFwiZXJyb3JcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgfSk7XHJcblxyXG59KSh3aW5kb3csIGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5KTtcclxuIiwiLy8gQ3VzdG9tIGpRdWVyeVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG5cblxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQsIHVuZGVmaW5lZCl7XG5cbiAgJChmdW5jdGlvbigpe1xuXG4gICAgJCgnW2RhdGEtY2hlY2stYWxsXScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgaW5kZXg9ICR0aGlzLmluZGV4KCkgKyAxLFxuICAgICAgICAgIGNoZWNrYm94ID0gJHRoaXMuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyksXG4gICAgICAgICAgdGFibGUgPSAkdGhpcy5wYXJlbnRzKCd0YWJsZScpO1xuICAgICAgLy8gTWFrZSBzdXJlIHRvIGFmZmVjdCBvbmx5IHRoZSBjb3JyZWN0IGNoZWNrYm94IGNvbHVtblxuICAgICAgdGFibGUuZmluZCgndGJvZHkgPiB0ciA+IHRkOm50aC1jaGlsZCgnK2luZGV4KycpIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpXG4gICAgICAgIC5wcm9wKCdjaGVja2VkJywgY2hlY2tib3hbMF0uY2hlY2tlZCk7XG5cbiAgICB9KTtcblxuICB9KTtcblxufSkod2luZG93LCBkb2N1bWVudCwgd2luZG93LmpRdWVyeSk7XG5cbiIsIi8vIFRPR0dMRSBTVEFURVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQsIHVuZGVmaW5lZCl7XG5cbiAgJChmdW5jdGlvbigpe1xuXG4gICAgdmFyICRib2R5ID0gJCgnYm9keScpO1xuICAgICAgICB0b2dnbGUgPSBuZXcgU3RhdGVUb2dnbGVyKCk7XG5cbiAgICAkKCdbZGF0YS10b2dnbGUtc3RhdGVdJylcbiAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHZhciBlbGVtZW50ID0gJCh0aGlzKSxcbiAgICAgICAgICAgIGNsYXNzbmFtZSA9IGVsZW1lbnQuZGF0YSgndG9nZ2xlU3RhdGUnKSxcbiAgICAgICAgICAgIHRhcmdldCA9IGVsZW1lbnQuZGF0YSgndGFyZ2V0JyksXG4gICAgICAgICAgICBub1BlcnNpc3QgPSAoZWxlbWVudC5hdHRyKCdkYXRhLW5vLXBlcnNpc3QnKSAhPT0gdW5kZWZpbmVkKTtcblxuICAgICAgICAvLyBTcGVjaWZ5IGEgdGFyZ2V0IHNlbGVjdG9yIHRvIHRvZ2dsZSBjbGFzc25hbWVcbiAgICAgICAgLy8gdXNlIGJvZHkgYnkgZGVmYXVsdFxuICAgICAgICB2YXIgJHRhcmdldCA9IHRhcmdldCA/ICQodGFyZ2V0KSA6ICRib2R5O1xuXG4gICAgICAgIGlmKGNsYXNzbmFtZSkge1xuICAgICAgICAgIGlmKCAkdGFyZ2V0Lmhhc0NsYXNzKGNsYXNzbmFtZSkgKSB7XG4gICAgICAgICAgICAkdGFyZ2V0LnJlbW92ZUNsYXNzKGNsYXNzbmFtZSk7XG4gICAgICAgICAgICBpZiggISBub1BlcnNpc3QpXG4gICAgICAgICAgICAgIHRvZ2dsZS5yZW1vdmVTdGF0ZShjbGFzc25hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICR0YXJnZXQuYWRkQ2xhc3MoY2xhc3NuYW1lKTtcbiAgICAgICAgICAgIGlmKCAhIG5vUGVyc2lzdClcbiAgICAgICAgICAgICAgdG9nZ2xlLmFkZFN0YXRlKGNsYXNzbmFtZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgLy8gc29tZSBlbGVtZW50cyBtYXkgbmVlZCB0aGlzIHdoZW4gdG9nZ2xlZCBjbGFzcyBjaGFuZ2UgdGhlIGNvbnRlbnQgc2l6ZVxuICAgICAgICAvLyBlLmcuIHNpZGViYXIgY29sbGFwc2VkIG1vZGUgYW5kIGpxR3JpZFxuICAgICAgICAkKHdpbmRvdykucmVzaXplKCk7XG5cbiAgICB9KTtcblxuICB9KTtcblxuICAvLyBIYW5kbGUgc3RhdGVzIHRvL2Zyb20gbG9jYWxzdG9yYWdlXG4gIHdpbmRvdy5TdGF0ZVRvZ2dsZXIgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBzdG9yYWdlS2V5TmFtZSAgPSAnanEtdG9nZ2xlU3RhdGUnO1xuXG4gICAgLy8gSGVscGVyIG9iamVjdCB0byBjaGVjayBmb3Igd29yZHMgaW4gYSBwaHJhc2UgLy9cbiAgICB2YXIgV29yZENoZWNrZXIgPSB7XG4gICAgICBoYXNXb3JkOiBmdW5jdGlvbiAocGhyYXNlLCB3b3JkKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVnRXhwKCcoXnxcXFxccyknICsgd29yZCArICcoXFxcXHN8JCknKS50ZXN0KHBocmFzZSk7XG4gICAgICB9LFxuICAgICAgYWRkV29yZDogZnVuY3Rpb24gKHBocmFzZSwgd29yZCkge1xuICAgICAgICBpZiAoIXRoaXMuaGFzV29yZChwaHJhc2UsIHdvcmQpKSB7XG4gICAgICAgICAgcmV0dXJuIChwaHJhc2UgKyAocGhyYXNlID8gJyAnIDogJycpICsgd29yZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICByZW1vdmVXb3JkOiBmdW5jdGlvbiAocGhyYXNlLCB3b3JkKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc1dvcmQocGhyYXNlLCB3b3JkKSkge1xuICAgICAgICAgIHJldHVybiBwaHJhc2UucmVwbGFjZShuZXcgUmVnRXhwKCcoXnxcXFxccykqJyArIHdvcmQgKyAnKFxcXFxzfCQpKicsICdnJyksICcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBSZXR1cm4gc2VydmljZSBwdWJsaWMgbWV0aG9kc1xuICAgIHJldHVybiB7XG4gICAgICAvLyBBZGQgYSBzdGF0ZSB0byB0aGUgYnJvd3NlciBzdG9yYWdlIHRvIGJlIHJlc3RvcmVkIGxhdGVyXG4gICAgICBhZGRTdGF0ZTogZnVuY3Rpb24oY2xhc3NuYW1lKXtcbiAgICAgICAgdmFyIGRhdGEgPSAkLmxvY2FsU3RvcmFnZS5nZXQoc3RvcmFnZUtleU5hbWUpO1xuXG4gICAgICAgIGlmKCFkYXRhKSAge1xuICAgICAgICAgIGRhdGEgPSBjbGFzc25hbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZGF0YSA9IFdvcmRDaGVja2VyLmFkZFdvcmQoZGF0YSwgY2xhc3NuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQubG9jYWxTdG9yYWdlLnNldChzdG9yYWdlS2V5TmFtZSwgZGF0YSk7XG4gICAgICB9LFxuXG4gICAgICAvLyBSZW1vdmUgYSBzdGF0ZSBmcm9tIHRoZSBicm93c2VyIHN0b3JhZ2VcbiAgICAgIHJlbW92ZVN0YXRlOiBmdW5jdGlvbihjbGFzc25hbWUpe1xuICAgICAgICB2YXIgZGF0YSA9ICQubG9jYWxTdG9yYWdlLmdldChzdG9yYWdlS2V5TmFtZSk7XG4gICAgICAgIC8vIG5vdGhpbmcgdG8gcmVtb3ZlXG4gICAgICAgIGlmKCFkYXRhKSByZXR1cm47XG5cbiAgICAgICAgZGF0YSA9IFdvcmRDaGVja2VyLnJlbW92ZVdvcmQoZGF0YSwgY2xhc3NuYW1lKTtcblxuICAgICAgICAkLmxvY2FsU3RvcmFnZS5zZXQoc3RvcmFnZUtleU5hbWUsIGRhdGEpO1xuICAgICAgfSxcblxuICAgICAgLy8gTG9hZCB0aGUgc3RhdGUgc3RyaW5nIGFuZCByZXN0b3JlIHRoZSBjbGFzc2xpc3RcbiAgICAgIHJlc3RvcmVTdGF0ZTogZnVuY3Rpb24oJGVsZW0pIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkLmxvY2FsU3RvcmFnZS5nZXQoc3RvcmFnZUtleU5hbWUpO1xuXG4gICAgICAgIC8vIG5vdGhpbmcgdG8gcmVzdG9yZVxuICAgICAgICBpZighZGF0YSkgcmV0dXJuO1xuICAgICAgICAkZWxlbS5hZGRDbGFzcyhkYXRhKTtcbiAgICAgIH1cblxuICAgIH07XG4gIH07XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpO1xuIiwiLy8gQm9vdHN0cmFwIFRvdXJcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcblxyXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKXtcclxuXHJcbiAgJChmdW5jdGlvbigpe1xyXG5cclxuICAgIC8vIFByZXBhcmUgc3RlcHNcclxuICAgIHZhciB0b3VyU3RlcHMgPSBbXTtcclxuICAgICQoJy50b3VyLXN0ZXAnKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBzdGVwc09wdGlvbnMgPSAkKHRoaXMpLmRhdGEoKTtcclxuICAgICAgc3RlcHNPcHRpb25zLmVsZW1lbnQgPSAnIycrdGhpcy5pZDtcclxuICAgICAgdG91clN0ZXBzLnB1c2goIHN0ZXBzT3B0aW9ucyApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCB0b3VyU3RlcHMubGVuZ3RoICkge1xyXG4gICAgICAvLyBJbnN0YW5jZSB0aGUgdG91clxyXG4gICAgICB2YXIgdG91ciA9IG5ldyBUb3VyKHtcclxuICAgICAgICAgIGJhY2tkcm9wOiB0cnVlLFxyXG4gICAgICAgICAgb25TaG93bjogZnVuY3Rpb24odG91cikge1xyXG4gICAgICAgICAgICAvLyBCb290c3RyYXBUb3VyIGlzIG5vdCBjb21wYXRpYmxlIHdpdGggei1pbmRleCBiYXNlZCBsYXlvdXRcclxuICAgICAgICAgICAgLy8gc28gYWRkaW5nIHBvc2l0aW9uOnN0YXRpYyBmb3IgdGhpcyBjYXNlIG1ha2VzIHRoZSBicm93c2VyXHJcbiAgICAgICAgICAgIC8vIHRvIGlnbm9yZSB0aGUgcHJvcGVydHlcclxuICAgICAgICAgICAgJCgnLndyYXBwZXIgPiBzZWN0aW9uJykuY3NzKHsncG9zaXRpb24nOiAnc3RhdGljJ30pO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG9uSGlkZTogZnVuY3Rpb24gKHRvdXIpIHtcclxuICAgICAgICAgICAgLy8gZmluYWxseSByZXN0b3JlIG9uIGRlc3Ryb3kgYW5kIHJldXNlIHRoZSB2YWx1ZSBkZWNsYXJlZCBpbiBzdHlsZXNoZWV0XHJcbiAgICAgICAgICAgICQoJy53cmFwcGVyID4gc2VjdGlvbicpLmNzcyh7J3Bvc2l0aW9uJzogJyd9KTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzdGVwczogdG91clN0ZXBzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBJbml0aWFsaXplIHRoZSB0b3VyXHJcbiAgICAgIHRvdXIuaW5pdCgpO1xyXG5cclxuICAgICAgXHJcbiAgICAgICQoJyNzdGFydC10b3VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyBTdGFydCB0aGUgdG91clxyXG4gICAgICAgIHRvdXIucmVzdGFydCgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgfSk7XHJcblxyXG59KSh3aW5kb3csIGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5KTtcclxuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IHV0aWxzLmpzXG4gKiBqUXVlcnkgVXRpbGl0eSBmdW5jdGlvbnMgbGlicmFyeSBcbiAqIGFkYXB0ZWQgZnJvbSB0aGUgY29yZSBvZiBVSUtpdFxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigkLCB3aW5kb3csIGRvYyl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHZhciAkaHRtbCA9ICQoXCJodG1sXCIpLCAkd2luID0gJCh3aW5kb3cpO1xuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gPSAoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHRyYW5zaXRpb25FbmQgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jLmJvZHkgfHwgZG9jLmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgICAgICAgICB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFdlYmtpdFRyYW5zaXRpb246ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICAgICAgICAgICAgICAgICAgTW96VHJhbnNpdGlvbjogJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAgICAgICAgICAgICBPVHJhbnNpdGlvbjogJ29UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ3RyYW5zaXRpb25lbmQnXG4gICAgICAgICAgICAgICAgfSwgbmFtZTtcblxuICAgICAgICAgICAgZm9yIChuYW1lIGluIHRyYW5zRW5kRXZlbnROYW1lcykge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHJldHVybiB0cmFuc0VuZEV2ZW50TmFtZXNbbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0oKSk7XG5cbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25FbmQgJiYgeyBlbmQ6IHRyYW5zaXRpb25FbmQgfTtcbiAgICB9KSgpO1xuXG4gICAgJC5zdXBwb3J0LmFuaW1hdGlvbiA9IChmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgYW5pbWF0aW9uRW5kID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvYy5ib2R5IHx8IGRvYy5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgYW5pbUVuZEV2ZW50TmFtZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFdlYmtpdEFuaW1hdGlvbjogJ3dlYmtpdEFuaW1hdGlvbkVuZCcsXG4gICAgICAgICAgICAgICAgICAgIE1vekFuaW1hdGlvbjogJ2FuaW1hdGlvbmVuZCcsXG4gICAgICAgICAgICAgICAgICAgIE9BbmltYXRpb246ICdvQW5pbWF0aW9uRW5kIG9hbmltYXRpb25lbmQnLFxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246ICdhbmltYXRpb25lbmQnXG4gICAgICAgICAgICAgICAgfSwgbmFtZTtcblxuICAgICAgICAgICAgZm9yIChuYW1lIGluIGFuaW1FbmRFdmVudE5hbWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIGFuaW1FbmRFdmVudE5hbWVzW25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KCkpO1xuXG4gICAgICAgIHJldHVybiBhbmltYXRpb25FbmQgJiYgeyBlbmQ6IGFuaW1hdGlvbkVuZCB9O1xuICAgIH0pKCk7XG5cbiAgICAkLnN1cHBvcnQucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IGZ1bmN0aW9uKGNhbGxiYWNrKXsgd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAvNjApOyB9O1xuICAgICQuc3VwcG9ydC50b3VjaCAgICAgICAgICAgICAgICAgPSAoXG4gICAgICAgICgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9tb2JpbGV8dGFibGV0LykpIHx8XG4gICAgICAgICh3aW5kb3cuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIHdpbmRvdy5Eb2N1bWVudFRvdWNoKSAgfHxcbiAgICAgICAgKHdpbmRvdy5uYXZpZ2F0b3JbJ21zUG9pbnRlckVuYWJsZWQnXSAmJiB3aW5kb3cubmF2aWdhdG9yWydtc01heFRvdWNoUG9pbnRzJ10gPiAwKSB8fCAvL0lFIDEwXG4gICAgICAgICh3aW5kb3cubmF2aWdhdG9yWydwb2ludGVyRW5hYmxlZCddICYmIHdpbmRvdy5uYXZpZ2F0b3JbJ21heFRvdWNoUG9pbnRzJ10gPiAwKSB8fCAvL0lFID49MTFcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgICQuc3VwcG9ydC5tdXRhdGlvbm9ic2VydmVyICAgICAgPSAod2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIgfHwgd2luZG93LldlYktpdE11dGF0aW9uT2JzZXJ2ZXIgfHwgd2luZG93Lk1vek11dGF0aW9uT2JzZXJ2ZXIgfHwgbnVsbCk7XG5cbiAgICAkLlV0aWxzID0ge307XG5cbiAgICAkLlV0aWxzLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgICAgIHZhciB0aW1lb3V0O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgICAgICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAkLlV0aWxzLnJlbW92ZUNzc1J1bGVzID0gZnVuY3Rpb24oc2VsZWN0b3JSZWdFeCkge1xuICAgICAgICB2YXIgaWR4LCBpZHhzLCBzdHlsZXNoZWV0LCBfaSwgX2osIF9rLCBfbGVuLCBfbGVuMSwgX2xlbjIsIF9yZWY7XG5cbiAgICAgICAgaWYoIXNlbGVjdG9yUmVnRXgpIHJldHVybjtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBfcmVmID0gZG9jdW1lbnQuc3R5bGVTaGVldHM7XG4gICAgICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgICAgIHN0eWxlc2hlZXQgPSBfcmVmW19pXTtcbiAgICAgICAgICAgICAgICBpZHhzID0gW107XG4gICAgICAgICAgICAgICAgc3R5bGVzaGVldC5jc3NSdWxlcyA9IHN0eWxlc2hlZXQuY3NzUnVsZXM7XG4gICAgICAgICAgICAgICAgZm9yIChpZHggPSBfaiA9IDAsIF9sZW4xID0gc3R5bGVzaGVldC5jc3NSdWxlcy5sZW5ndGg7IF9qIDwgX2xlbjE7IGlkeCA9ICsrX2opIHtcbiAgICAgICAgICAgICAgICAgIGlmIChzdHlsZXNoZWV0LmNzc1J1bGVzW2lkeF0udHlwZSA9PT0gQ1NTUnVsZS5TVFlMRV9SVUxFICYmIHNlbGVjdG9yUmVnRXgudGVzdChzdHlsZXNoZWV0LmNzc1J1bGVzW2lkeF0uc2VsZWN0b3JUZXh0KSkge1xuICAgICAgICAgICAgICAgICAgICBpZHhzLnVuc2hpZnQoaWR4KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChfayA9IDAsIF9sZW4yID0gaWR4cy5sZW5ndGg7IF9rIDwgX2xlbjI7IF9rKyspIHtcbiAgICAgICAgICAgICAgICAgIHN0eWxlc2hlZXQuZGVsZXRlUnVsZShpZHhzW19rXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHt9XG4gICAgICAgIH0sIDApO1xuICAgIH07XG5cbiAgICAkLlV0aWxzLmlzSW5WaWV3ID0gZnVuY3Rpb24oZWxlbWVudCwgb3B0aW9ucykge1xuXG4gICAgICAgIHZhciAkZWxlbWVudCA9ICQoZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKCEkZWxlbWVudC5pcygnOnZpc2libGUnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHdpbmRvd19sZWZ0ID0gJHdpbi5zY3JvbGxMZWZ0KCksXG4gICAgICAgICAgICB3aW5kb3dfdG9wICA9ICR3aW4uc2Nyb2xsVG9wKCksXG4gICAgICAgICAgICBvZmZzZXQgICAgICA9ICRlbGVtZW50Lm9mZnNldCgpLFxuICAgICAgICAgICAgbGVmdCAgICAgICAgPSBvZmZzZXQubGVmdCxcbiAgICAgICAgICAgIHRvcCAgICAgICAgID0gb2Zmc2V0LnRvcDtcblxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoe3RvcG9mZnNldDowLCBsZWZ0b2Zmc2V0OjB9LCBvcHRpb25zKTtcblxuICAgICAgICBpZiAodG9wICsgJGVsZW1lbnQuaGVpZ2h0KCkgPj0gd2luZG93X3RvcCAmJiB0b3AgLSBvcHRpb25zLnRvcG9mZnNldCA8PSB3aW5kb3dfdG9wICsgJHdpbi5oZWlnaHQoKSAmJlxuICAgICAgICAgICAgbGVmdCArICRlbGVtZW50LndpZHRoKCkgPj0gd2luZG93X2xlZnQgJiYgbGVmdCAtIG9wdGlvbnMubGVmdG9mZnNldCA8PSB3aW5kb3dfbGVmdCArICR3aW4ud2lkdGgoKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkLlV0aWxzLm9wdGlvbnMgPSBmdW5jdGlvbihzdHJpbmcpIHtcblxuICAgICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHN0cmluZykpIHJldHVybiBzdHJpbmc7XG5cbiAgICAgICAgdmFyIHN0YXJ0ID0gKHN0cmluZyA/IHN0cmluZy5pbmRleE9mKFwie1wiKSA6IC0xKSwgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgIGlmIChzdGFydCAhPSAtMSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gKG5ldyBGdW5jdGlvbihcIlwiLCBcInZhciBqc29uID0gXCIgKyBzdHJpbmcuc3Vic3RyKHN0YXJ0KSArIFwiOyByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShqc29uKSk7XCIpKSgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH07XG5cbiAgICAkLlV0aWxzLmV2ZW50cyAgICAgICA9IHt9O1xuICAgICQuVXRpbHMuZXZlbnRzLmNsaWNrID0gJC5zdXBwb3J0LnRvdWNoID8gJ3RhcCcgOiAnY2xpY2snO1xuXG4gICAgJC5sYW5nZGlyZWN0aW9uID0gJGh0bWwuYXR0cihcImRpclwiKSA9PSBcInJ0bFwiID8gXCJyaWdodFwiIDogXCJsZWZ0XCI7XG5cbiAgICAkKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIGRvbSBtb2RpZmljYXRpb25zXG4gICAgICAgIGlmKCEkLnN1cHBvcnQubXV0YXRpb25vYnNlcnZlcikgcmV0dXJuO1xuXG4gICAgICAgIC8vIEluc3RhbGwgYW4gb2JzZXJ2ZXIgZm9yIGN1c3RvbSBuZWVkcyBvZiBkb20gY2hhbmdlc1xuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgJC5zdXBwb3J0Lm11dGF0aW9ub2JzZXJ2ZXIoJC5VdGlscy5kZWJvdW5jZShmdW5jdGlvbihtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICQoZG9jKS50cmlnZ2VyKFwiZG9tcmVhZHlcIik7XG4gICAgICAgIH0sIDMwMCkpO1xuXG4gICAgICAgIC8vIHBhc3MgaW4gdGhlIHRhcmdldCBub2RlLCBhcyB3ZWxsIGFzIHRoZSBvYnNlcnZlciBvcHRpb25zXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG5cbiAgICB9KTtcblxuICAgIC8vIGFkZCB0b3VjaCBpZGVudGlmaWVyIGNsYXNzXG4gICAgJGh0bWwuYWRkQ2xhc3MoJC5zdXBwb3J0LnRvdWNoID8gXCJ0b3VjaFwiIDogXCJuby10b3VjaFwiKTtcblxufShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpKTsiLCIvLyBDdXN0b20galF1ZXJ5XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKXtcblxuICAkKGZ1bmN0aW9uKCl7XG5cbiAgICAvLyBkb2N1bWVudCByZWFkeVxuXG4gIH0pO1xuXG59KSh3aW5kb3csIGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=<