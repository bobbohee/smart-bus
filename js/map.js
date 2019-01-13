//  Google map 처음 불러오는 부분
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 37.5531748, lng: 126.97260940000001 },
    scrollwheel: true,
    zoom: 15
  });
}; // initMap

// 불러온 이후 시작하는 함수 
function lookUp() {
  $("#bus_pos").empty();
  var code = $('#num').val();
  if (code.length == 5) { url = 'bus.php'; }
  else {
    url = "";
    alert("버스정류장 고유번호 5자리를 입력해주세요.");
  }

  // API 호출
  $.ajax({
    url: url,
    datatype: 'xml',
    type: 'get',
    data: $('form').serialize(),
    success: function (res) {
      var bus_arr = [];
      var bus_time1 = [];
      var bus_time2 = [];
      var bus_color = [];

      var Xpos;
      var Ypos;

      var name = $(res).find('stNm:first').text();
      var contentString = '<div id="content">' +
                            '<h5>' + name + '</h5>' + '<hr>' +
                          '</div>';

      $(res).find('itemList').each(function (i) {
        var bus_num = $(this).find('rtNm').text();
        var time1 = $(this).find('arrmsg1').text();
        var time2 = $(this).find('arrmsg2').text();

        bus_arr[i] = bus_num;
        bus_time1[i] = time1;
        bus_time2[i] = time2;

        Xpos = $(this).find('gpsX').text();
        Xpos = parseFloat(Xpos);

        Ypos = $(this).find('gpsY').text();
        Ypos = parseFloat(Ypos);

        // 버스 색깔 구별하기
        var num_char = Number(bus_arr[i].charAt(0));
        if (bus_arr[i].length == 3) {
          if (Number.isInteger(num_char) == false) { bus_color[i] = "green_bus.png"; }
          else if (Number.isInteger(num_char) == true) { bus_color[i] = "blue_bus.png"; }
        } else if (bus_arr[i].length == 4 || bus_arr[i].length == 5) {
          if (num_char == 9) { bus_color[i] = "red_bus.png"; }
          else { bus_color[i] = "green_bus.png"; }
        } else { bus_color[i] = "red_bus.png"; }

        $("#bus_pos").append('<div class="buses">' +
                              '<img src="image/' + bus_color[i] + '" alt="bus">' +
                              '<h5>' + bus_arr[i] + '</h5>' +
                             '</div>');

        contentString += '<h6 class="bus_arr">' + bus_arr[i] + '</h6>' +
                            '<img src="image/' + bus_color[i] + '" alt="bus" id="imgSize">' +
                            '<p>도착 예정 시간 : ' + bus_time1[i] + '</p>' +
                            '<p>도착 예정 시간 : ' + bus_time2[i] + '</p>' + '<hr>';
        setinitMap(Xpos, Ypos, contentString);
      }); // find itemList

      $(".buses").click(function () {
        var index = $(".buses").index(this);
        console.log(index);
        console.log(bus_arr[index]);
        console.log(bus_time1[index]);

        contentString = '<div id="content">' +
                          '<h5>' + name + '</h5>' + '<hr>' +
                        '</div>';
        contentString += '<h6 class="bus_arr">' + bus_arr[index] + '</h6>' +
                           '<img src="image/' + bus_color[index] + '" alt="bus" id="imgSize">' +
                           '<p>도착 예정 시간 : ' + bus_time1[index] + '<br/>' +
                         '도착 예정 시간 : ' + bus_time2[index] + '</p>' + '<hr>';
        setinitMap(Xpos, Ypos, contentString);
      }); // .buses click
    } // ajax success
  }); // ajax
} // lookup()

function enterKey() {
  if (event.keyCode == 13) {
    lookUp();
    return false;
  }
  return true;
} // enterKey()

// 값을 받은 위치를 보여줌 
function setinitMap(px, py, contentString) {
  var center = new google.maps.LatLng(py, px);

  var map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    scrollwheel: false,
    zoom: 15
  });

  var marker = new google.maps.Marker({
    position: center,
    map: map,
    title: 'Hello World!'
  });

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  infowindow.open(map, marker);

  marker.addListener('click', function () {
    infowindow.open(map, marker);
  });
} // setinitMap
