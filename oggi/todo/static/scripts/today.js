

// ----------MODEL---------
var model = {

  // events: [],
  // completes: [],
  // upcoming: [],

};


// ---------UPDATE MODEL------
function getEvents() {
  $.ajax({
    url: "/today",

    success: function(response) {

      model = JSON.parse(response);


      }

  });
}

// --------------get CSFR cookie function---------
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


// ----------VIEW----------
function render() {

  $('#instructions').empty();
  $('#events').empty();

  // render todo items
  model.forEach(function(item) {

    if(item.fields.day == "today") {

      var delButton = $('<button></button>')
        .attr('class', 'btn btn-danger')
        .click(function() {
          var index = item.pk;

          // get the CSRF token for validation
          var csrftoken = getCookie('csrftoken');

          function csrfSafeMethod(method) {
          // these HTTP methods do not require CSRF protection
          return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
          }

          // sets up ajax to send the CSRF token
          $.ajaxSetup({
              beforeSend: function(xhr, settings) {
                  if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                      xhr.setRequestHeader("X-CSRFToken", csrftoken);
                  }
              }
          });

          // sends the event to the DB
          $.ajax({
            method: "POST",
            url: "/delete/",
            dataType: "json",
            data: {
              key: index
            },

            success: function(response) {
              console.log(response);
              console.log("event deleted from the DB")
            },
              error(err) {
                console.log(err);
              },
          });

          getEvents()
          render();
        });

      var trashSpan = $('<span></span')
        .attr('class', 'glyphicon glyphicon-trash')
        .attr('aria-hidden', 'true');

      delButton.append(trashSpan);

      // creates each ToDo item element
      var eventElement = $('<li></li>')
        .attr('class', 'btn-group btn-block');
      var buttonElement = $('<button></button>')
        .text(item.fields.title)
        .attr('class', 'btn btn-default')
        .click(function() {
          var index = model.events.indexOf(event);
          var done = model.events.splice(index, 1);
          model.completes.push(done[0]);
          render();
        });

      // creates the 'done' checkmark
      var checkButton = $('<button></button>')
        .attr('class', 'btn btn-success')
        .click(function() {
          var index = model.events.indexOf(event);
          var done = model.events.splice(index, 1);
          model.completes.push(done[0]);
          render();
        });

      var checkSpan = $('<span></span>')
        .attr('class', 'glyphicon glyphicon-ok')
        .attr('aria-hidden', 'true');

      checkButton.append(checkSpan);

      eventElement.append(delButton, buttonElement, checkButton);

      $('#events').append(eventElement);
    }
  });

  // clears the eventbox
  $('#eventbox').val('');

  // gives focus to the eventbox
  $('#eventbox').focus();

  // clears the complete area
  $('#completes').empty();

  // renders complete items
  model.forEach(function(item) {
    if(item.fields.day == "done") {

      // creates each complete item element
      var completeElement = $('<li></li>')
        .attr('class', 'btn-group btn-block');

      var delButton = $('<button></button>')
        .attr('class', 'btn btn-danger')
        .click(function() {
          var index = model.completes.indexOf(complete);
          model.completes.splice(index, 1);
          render();
        });

      var trashSpan = $('<span></span')
        .attr('class', 'glyphicon glyphicon-trash')
        .attr('aria-hidden', 'true');

      delButton.append(trashSpan);

      var btnElement = $('<button></button>')
        .text(item.fields.title)
        .attr('class', 'btn btn-default')
        .click(function() {
          var idx = model.completes.indexOf(complete);
          var did = model.completes.splice(idx, 1);
          model.events.push(did[0]);
          render();
        })

      // creates the 'redo' glyphicon
      var redoButton = $('<button></button>')
        .attr('class', 'btn btn-success')
        .click(function() {
          var index = model.completes.indexOf(complete);
          var done = model.completes.splice(index, 1);
          model.events.push(done[0]);
          render();
        });
      var redoSpan = $('<span></span>')
        .attr('class', 'glyphicon glyphicon-refresh')
        .attr('aria-hidden', 'true');

      redoButton.append(redoSpan);

      completeElement.append(delButton, btnElement, redoButton);

      $('#completes').append(completeElement);
    }
  });

  var clearButton = $('<button></button>')
    .text('Finito')
    .attr('class', 'btn btn-primary')
    .click(function() {
      model.completes = [];
      render();
    });
  $('#clearall').empty();
  $('#clearall').append(clearButton);

  // clears the upcoming area
  $('#upcomings').empty();

  // renders upcoming items
  model.forEach(function(item) {
    if(item.fields.day == "soon") {

      // creates the delete upcoming event button
      var delButton = $('<button></button>')
        .attr('class', 'btn btn-danger')
        .click(function() {
          var index = model.upcoming.indexOf(event);
          model.upcoming.splice(index, 1);
          render();
        });

      var trashSpan = $('<span></span')
        .attr('class', 'glyphicon glyphicon-trash')
        .attr('aria-hidden', 'true');

      delButton.append(trashSpan);

      // creates each upcoming item element
      var upcomingElement = $('<li></li>')
        .attr('class', 'btn-group btn-block');

      var btnElement = $('<button></button>')
        .text(item.fields.title)
        .attr('class', 'btn btn-default')
        .click(function() {
          var idx = model.upcoming.indexOf(upcoming);
          var did = model.upcoming.splice(idx, 1);
          model.events.push(did[0]);
          render();
        });

      // creates each add event to inbox button
      var inboxButton = $('<button></button>')
        .attr('class', 'btn btn-success')
        .click(function() {
          var index = model.upcoming.indexOf(upcoming);
          var done = model.upcoming.splice(index, 1);
          model.events.push(done[0]);
          render();
        });
      var inboxSpan = $('<span></span>')
        .attr('class', 'glyphicon glyphicon-inbox')
        .attr('aria-hidden', 'true');

      inboxButton.append(inboxSpan);

      upcomingElement.append(delButton, btnElement, inboxButton);
      $('#upcomings').append(upcomingElement);
    }
  });

}

// adds a new event
function addNewEvent(event){
  // model.events.push({event});
}

function addUpcomingEvent(event){
  // model.upcoming.push({event});
}


// ---------DOM EVENT HANDLERS---------
$(document).ready(() => {
  // update model for todo items
  getEvents();

  // when the textbox content changes, updates the .currentEvent
  // property of the model
  $('#eventbox').on('input', () => {
    model.currentEvent = $('#eventbox').val();
  });

  $('#comingupbox').on('input', () => {
    model.currentEvent = $('#comingupbox').val();
  })

  // when the add event form is submitted
  $('#add-event-form').submit((evt) => {
    // don't refresh the page
    evt.preventDefault();

    // get the CSRF token for validation
    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    // sets up ajax to send the CSRF token
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    // sends the event to the DB
    $.ajax({
      method: "POST",
      url: "/add/",
      dataType: "json",
      data: {
        model: "todo.item",
        day: "today",
        title: model.currentEvent
      },

      success: function(response) {
        console.log(response);
        console.log("today event added to the DB")
      },
        error(err) {
          console.log(err);
        },
    });

    getEvents();

    // renders page
    render();

  });

  // when the add upcoming event form is submitted
  $('#add-upcoming-form').submit((evt) => {
    // don't refresh the page
    evt.preventDefault();

    // get the CSRF token for validation
    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    // sets up ajax to send the CSRF token
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    // sends the event to the DB
    $.ajax({
      method: "POST",
      url: "/add/",
      dataType: "json",
      data: {
        model: "todo.item",
        day: "soon",
        title: model.currentEvent
      },

      success: function(response) {
        console.log(response);
        console.log("soon event added to the DB")
      },
        error(err) {
          console.log(err);
        },
    });

    getEvents();

    // renders page
    render();

    // clears the eventbox and focuses it
    $('#comingupbox').val('');
    $('#comingupbox').focus();
  });

  // Makes Events and Completes and Upcoming Sortable
  var el = document.getElementById('events');
  var sortable = Sortable.create(el);
  var ell = document.getElementById('completes');
  var sortable = Sortable.create(ell);
  var elll = document.getElementById('upcomings');
  var sortable = Sortable.create(elll);
})
