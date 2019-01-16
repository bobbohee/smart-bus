function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 37.5531748, lng: 126.97260940000001 },
    scrollwheel: true,
    zoom: 15
  });
}; // initMap

function setBus(res) {
  var Xpos; var Ypos;

  var bus_arr = [];
  var bus_time1 = [];
  var bus_time2 = [];
  var bus_color = [];

  var name = $(res).find('stNm:first').text();
  var busContent = '<div id="content">' +
                      '<h5>' + name + '</h5>' + '<hr>' +
                    '</div>';

  $(res).find('itemList').each(function (i) {
    bus_arr[i] = $(this).find('rtNm').text();
    bus_time1[i] = $(this).find('arrmsg1').text();
    bus_time2[i] = $(this).find('arrmsg2').text();

    Xpos = parseFloat($(this).find('gpsX').text());
    Ypos = parseFloat($(this).find('gpsY').text());

    var num_char = Number(bus_arr[i].charAt(0));
    if (bus_arr[i].length == 3) {
      if (Number.isInteger(num_char) == false) { bus_color[i] = "green_bus.png"; }
      else if (Number.isInteger(num_char) == true) { bus_color[i] = "blue_bus.png"; }
    } else if (bus_arr[i].length == 4 || bus_arr[i].length == 5) {
      if (num_char == 9) { bus_color[i] = "red_bus.png"; }
      else { bus_color[i] = "green_bus.png"; }
    } else { bus_color[i] = "red_bus.png"; }

    var busColor = '<div class="buses">' +
                      '<img src="image/' + bus_color[i] + '" alt="bus">' +
                      '<h5>' + bus_arr[i] + '</h5>' +
                    '</div>';

    $("#bus_pos").append(busColor);

    busContent += '<div class="contentBus">' + 
                    '<h6>' + bus_arr[i] + '</h6>' +
                    '<img src="image/' + bus_color[i] + '" alt="bus">' +
                    '<p>도착 예정 시간 : ' + bus_time1[i] + '<br/>' +
                    '도착 예정 시간 : ' + bus_time2[i] + '</p><hr>' + 
                  '</div>';

    setinitMap(Xpos, Ypos, busContent);
  });

  $("#bus_pos").on("click", ".buses", function () {
    var index = $(".buses").index(this);
    busContent = '<div id="content">' +
                    '<h5>' + name + '</h5>' + '<hr>' +
                  '</div>';
    busContent += '<div class="contentBus">' + 
                    '<h6>' + bus_arr[index] + '</h6>' +
                    '<img src="image/' + bus_color[index] + '" alt="bus">' +
                    '<p>도착 예정 시간 : ' + bus_time1[index] + '<br/>' +
                    '도착 예정 시간 : ' + bus_time2[index] + '</p>' + 
                  '</div>';
    setinitMap(Xpos, Ypos, busContent);
  }); // .buses click
} // setBus()


function lookUp() {
  $("#bus_pos").empty();
  var code = $('#code').val();
  
  if (code.length != 5) {
    alert("버스정류장 고유번호 5자리를 입력해주세요");
    return;
  }

  $.ajax({
    url: 'bus.php?code=' + code,
    datatype: 'xml',
    type: 'get',
    success: function (res) {
      setBus(res);
    }
  }); // ajax
} // lookUp()

function enterKey() {
  if (event.keyCode == 13) {
    lookUp();
    return false;
  }
  return true;
} // enterKey()

function setinitMap(px, py, busContent) {
  var center = new google.maps.LatLng(py, px);

  var map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    scrollwheel: false,
    zoom: 15
  });

  var marker = new google.maps.Marker({
    position: center,
    map: map
  });

  var infowindow = new google.maps.InfoWindow({
    content: busContent
  });
  infowindow.open(map, marker);

  marker.addListener('click', function () {
    infowindow.open(map, marker);
  });
} // setinitMap