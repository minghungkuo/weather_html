$(document).ready(function() {   

  var apiKey = 'CWB-27AB0577-FC97-4B2F-8021-6DC6988C5E15';
  
  $(function() {
  
    $.ajax({
      url: "https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-001?Authorization=" + apiKey +
        "&format=JSON",
      type: "GET",
      cache: false,
      success: function(data) {
        var cityData = data.cwbopendata.dataset.location;
  
        var option = '';
        $.each(cityData, function(key, value) {
          //console.log(key, value.locationName);
          option += "<option value=" + key + ">" + value.locationName + "</option>";
          $('#city').html(option);
        });
  
      },
      complete: function(data) {
  
        var cityCode = $('#city').val();
  
        today(cityCode, apiKey); // 一般天氣預報-今明36小時天氣預報
        week(cityCode, apiKey); // 一般天氣預報-一週縣市天氣預報
      }
    });
  });
  
  
  $(document).on('change', '#city', function() {
  
    $('.overlay').removeClass('d-none');
  
    var cityCode = $('#city').val();
    today(cityCode, apiKey);
    week(cityCode, apiKey);
  
  
  });
  
  // F-C0032-001 一般天氣預報-今明36小時天氣預報 desc Wx(天氣現象)、MaxT(最高溫度)、MinT(最低溫度)、CI(舒適度)、PoP(降雨機率)	
  function today(cityCode, apiKey) {
  
    $.ajax({
  
      url: "https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-001?Authorization=" + apiKey +
        "&format=JSON",
      type: "GET",
      cache: false,
      success: function(data) {
  
        var weatherElement = data.cwbopendata.dataset.location[cityCode].weatherElement; // 城市天氣概況  
        var cityName = data.cwbopendata.dataset.location[cityCode].locationName; // 城市名稱
        var length = weatherElement[0].time.length; // 時段筆數 (每 12 小時)
        var WxElement = weatherElement[0].time; // Wx 	天氣描述
        var MaxTElement = weatherElement[1].time; // MaxT 最高溫度
        var MinTElement = weatherElement[2].time; // MinT 最低溫度
        var CIElement = weatherElement[3].time; // CI 	舒適度
        var PoPElement = weatherElement[4].time; // Pop 	降雨機率            
  
        var today_list = '';
  
        for (index = 0; index < length; index++) {
          var timeSlot = WxElement[index].startTime.substr(11, 5) + ' - ' + WxElement[index].endTime.substr(11,
          5);
          var temp = MinTElement[index].parameter.parameterName + ' - ' + MaxTElement[index].parameter
            .parameterName;
          var Wx = WxElement[index].parameter.parameterName;
          var CI = CIElement[index].parameter.parameterName;
          var PoP = PoPElement[index].parameter.parameterName;
  
          today_list += '<tr>';
          today_list += '<td>' + timeSlot + '</td>';
          today_list += '<td>' + temp + '℃</td>';
          today_list += '<td>' + Wx + '</td>';
          today_list += '<td>' + CI + '</td>';
          today_list += '<td>' + PoP + '%</td>';
          today_list += '</tr>';
        }
  
        $('#today').html(today_list);
        $('#cityName').html(cityName);
      }
    });
  }
  
  
  // F-C0032-005 一般天氣預報-一週縣市天氣預報 desc Wx(天氣現象)、MaxT(最高溫度)、MinT(最低溫度)
  function week(cityCode, apiKey) {
  
    $.ajax({
      url: "https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-005?Authorization=" + apiKey +
        "&format=JSON",
      type: "GET",
      cache: false,
      success: function(data) {
        
        var location = data.cwbopendata.dataset.location[cityCode];
        var weatherElement = data.cwbopendata.dataset.location[cityCode].weatherElement; // 城市天氣一週概況
        var weekCityName = data.cwbopendata.dataset.location[cityCode].locationName; // 城市名稱
        var length = weatherElement[0].time.length; // 時段筆數 (每 12 小時)
  
        var WxElement = weatherElement[0].time; // Wx 天氣現象
        var MaxTElement = weatherElement[1].time; // MaxT 最高溫度
        var MinTElement = weatherElement[2].time; // MinT 最低溫度	
  
        var dateList = '';
        var day = 0;
        var dayList = '';
        var night = 1;
        var nightList = '';
        var step = 2;
  
  
        while (day < 14) {
  
          dateList += '<th width="11%">' + WxElement[day].startTime.substr(5, 5).replace('-', '/') + '</th>';
  
          dayList += '<td>'
          dayList += '<p class="text-truncate">' + WxElement[day].parameter.parameterName + '</p>';
          dayList += '<p>' + MinTElement[day].parameter.parameterName + ' - ' + MaxTElement[day].parameter
            .parameterName + '℃</p>';
          dayList += '</td>';
  
          day = day + 2;
  
        }
  
        while (night < 14) {
  
          nightList += '<td>'
          nightList += '<p>' + WxElement[night].parameter.parameterName + '</p>';
          nightList += '<p>' + MinTElement[night].parameter.parameterName + ' - ' + MaxTElement[night].parameter
            .parameterName + '℃</p>';
          nightList += '</td>';
  
          night = night + 2;
        }
  
        $('#weekCityName').html(weekCityName);
        $('#weekDate').replaceWith(dateList);
        $('#weekDay').replaceWith(dayList);
        $('#weekNight').replaceWith(nightList);
  
        setTimeout(function() {$('.overlay').addClass('d-none');} , 600)
      }
    });
  
  } 
  
  
  });  