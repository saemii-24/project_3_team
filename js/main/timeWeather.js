/*Luxon 라이브러리*/
/*호주 시간 계산하기*/
/*버튼 클릭시 각 도시의 시간을 보여준다.
멜버른 / 시드니 / 브리즈번 모두 UTC+10
서머타임 시행시 UTC+11, 브리즈번은 서머타임 미시행이며,
시행시 서머타임 아이콘을 보여준다.*/

const sydneyTimeZone = "Australia/Sydney";
const melbourneTimeZone = "Australia/Melbourne";
const brisbaneTimeZone = "Australia/Brisbane";

//초단위로 업데이트 됨.
//서머타임 시행시 브리즈번 버튼 클릭 이벤트에서 오류 발생으로 수정//
// let timeObj = {};
function callAusTimeObj(cityTimeZone) {
  // function timeUpDate() {
  //도시 시간대(기본정보) 불러오기
  let cityTime = luxon.DateTime.now().setZone(cityTimeZone);
  let cityTimeNow = cityTime.toFormat("HH:mm:ss");

  //오전 오후 확인
  let cityHour = cityTime.toFormat("HH");
  let cityMeridiem = "";
  if (cityHour >= 12 && cityHour <= 24) {
    cityMeridiem = "오후";
  } else {
    cityMeridiem = "오전";
  }
  //날짜 확인
  let cityDate = cityTime.toFormat("yyyy.LL.dd.");

  //요일 확인
  let cityDay = cityTime.toFormat("c");

  //luxon은 월요일 = 1, 일요일 = 7
  switch (cityDay) {
    case "1":
      cityDay = "월요일";
      break;
    case "2":
      cityDay = "화요일";
      break;
    case "3":
      cityDay = "수요일";
      break;
    case "4":
      cityDay = "목요일";
      break;
    case "5":
      cityDay = "금요일";
      break;
    case "6":
      cityDay = "토요일";
      break;
    case "7":
      cityDay = "일요일";
      break;
  }

  /*DST 시행 확인*/
  let isCityDST = luxon.DateTime.now().setZone(cityTimeZone).isInDST;

  if (isCityDST) {
    isCityDST = "sunny";
  } else {
    isCityDST = "";
  }
  let timeObj = { cityTimeNow, cityMeridiem, cityDate, cityDay, isCityDST };
  return timeObj;
  // console.log(timeObj);
  // setTimeout(timeUpDate, 200);
  // }
  // timeUpDate();
}

/*날씨정보 알아오기*/
// const api = config.apikey; //gitignore에서 숨겨짐
//const api = process.env.API_KEY; //apikey

//날씨별 아이콘 이름
async function weather(city) {
  //서버리스 함수에 요청. city는 req.query로 주게 됨
  await fetch(`/api/serverless?city=${city}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      //나라 판별 -> put innerText로 사용될 내용
      let country = data["sys"]["country"];
      switch (country) {
        case "KR":
          country = "korea";
          break;
        case "AU":
          country = "australia";
          break;
      }
      // console.log(country);

      //도시 판별
      let city = data["name"];
      let putCity = document.getElementById(`weather__city--${country}`);
      switch (city) {
        case "Sydney":
          city = "시드니";
          break;
        case "Melbourne":
          city = "멜버른";
          break;
        case "Brisbane":
          city = "브리즈번";
          break;
        case "Seoul":
          city = "서울";
          break;
      }
      putCity.innerText = city;

      //날씨 판별
      let weatherIcon = data["weather"][0]["icon"];
      // console.log(weatherIcon);
      let putIcon = document.querySelector(`.weather__icon--${country}`);

      //날씨 아이콘 선택
      let iconName = "clear_day";
      if (weatherIcon === "01d" || weatherIcon === "01n") {
        iconName = "clear_day";
      } else if (weatherIcon === "02d" || weatherIcon === "02n") {
        iconName = "partly_cloudy_day";
      } else if (weatherIcon === "03d" || weatherIcon === "03n") {
        iconName = "cloud";
      } else if (weatherIcon === "04d" || weatherIcon === "04n") {
        iconName = "cloud";
      } else if (weatherIcon === "09d" || weatherIcon === "09n") {
        iconName = "rainy_light";
      } else if (weatherIcon === "10d" || weatherIcon === "10n") {
        iconName = "rainy";
      } else if (weatherIcon === "11d" || weatherIcon === "11n") {
        iconName = "thunderstorm";
      } else if (weatherIcon === "13d" || weatherIcon === "13n") {
        iconName = "ac_unit";
      } else if (weatherIcon === "50d" || weatherIcon === "50n") {
        iconName = "foggy";
      }
      putIcon.innerText = iconName;
      // console.log(putIcon);

      //온도 넣기
      let temp = data["main"]["temp"].toFixed(1);
      let putTemp = document.getElementById(`weather__now--${country}`);
      putTemp.innerText = temp;
    })
    .catch((error) => {
      console.error("오류가 발생했습니다. 기본값이 출력됩니다.");

      document.querySelector(".weather__error").innerText =
        "현재 기본값이 출력 중입니다.";

      //default값 (20도, 맑음 출력)
      const defaultWeather = document.querySelectorAll(".weather__now");
      const defaultWeatherIcon = document.querySelectorAll(
        ".weather__icon--now"
      );
      const defaultBtnWeather = document.querySelectorAll(
        ".btn__blur--weather"
      );
      const defaultCity = document.querySelector("#weather__city--australia");

      defaultWeather.forEach((weather) => {
        weather.innerText = "20.0";
      });
      defaultWeatherIcon.forEach((weatherIcon) => {
        weatherIcon.innerText = "sunny";
      });

      defaultBtnWeather.forEach((btn) => {
        btn.addEventListener("click", (event) => {
          defaultCity.innerText = event.target.innerText;
        });
      });
    });
}

//button dom요소
const sydneyBtn = document.getElementById("btn__blur--sydney");
const melbourneBtn = document.getElementById("btn__blur--melbourne");
const brisbaneBtn = document.getElementById("btn__blur--brisbane");
const btnAll = document.querySelectorAll(".btn__blur--weather");

//기본 한 번 호출
// let firstCall = putAustraliaTime(sydneyTimeZone);
//weather("seoul");
//weather("sydney");

//버튼 호출
btnAll.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    //btn 1개만 active 되게
    btnAll.forEach((btn) => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");
    console.log(e.target.innerText);

    let timeObj = {};
    if (e.target.innerText === "시드니") {
      timeObj = callAusTimeObj(sydneyTimeZone);
      //멜버른 버튼 클릭
    } else if (e.target.innerText === "멜버른") {
      timeObj = callAusTimeObj(melbourneTimeZone);
      //브리즈번 버튼 클릭
    } else if (e.target.innerText === "브리즈번") {
      timeObj = callAusTimeObj(brisbaneTimeZone);
    }
    console.log(timeObj);

    setInterval(() => {
      console.log(timeObj);
      document.getElementById("time__now--australia").innerText =
        timeObj.cityTimeNow;
      document.getElementById("time__merdiem--australia").innerText =
        timeObj.cityMeridiem;
      document.getElementById("today__now--australia").innerText =
        timeObj.cityDate;
      document.getElementById("today__day--australia").innerText =
        timeObj.cityDay;
      document.querySelector(".weather__icon--australia").innerText =
        timeObj.isCityDST;
    }, 200);
  });
});
// sydneyBtn.addEventListener("click", (event) => {
//   callAusTimeObj(sydneyTimeZone);

//   //weather("Sydney, AU");
//   btnAll.forEach((btn) => {
//     btn.classList.remove("active");
//   });
//   event.target.classList.add("active");
// });
// melbourneBtn.addEventListener("click", (event) => {
//   putAustraliaTime(melbourneTimeZone);
//   //weather("Melbourne, AU");
//   btnAll.forEach((btn) => {
//     btn.classList.remove("active");
//   });
//   event.target.classList.add("active");
// });
// brisbaneBtn.addEventListener("click", (event) => {
//   putAustraliaTime(brisbaneTimeZone);
//   // weather("Brisbane, AU");
//   btnAll.forEach((btn) => {
//     btn.classList.remove("active");
//   });
//   event.target.classList.add("active");
// });

/*시간 계산하기*/
//한국 시간 계산하기
function koreaTime() {
  let koreaDate = new Date();
  let year = koreaDate.getFullYear();
  let month = koreaDate.getMonth() + 1;
  let date = koreaDate.getDate();
  let day = koreaDate.getDay();
  let hour = koreaDate.getHours();

  //요일 판별
  switch (day) {
    case 0:
      day = "일요일";
      break;
    case 1:
      day = "월요일";
      break;
    case 2:
      day = "화요일";
      break;
    case 3:
      day = "수요일";
      break;
    case 4:
      day = "목요일";
      break;
    case 5:
      day = "금요일";
      break;
    case 6:
      day = "토요일";
      break;
  }

  //포맷맞추기
  let dateFormat = `${year}.${month >= 10 ? month : "0" + month}.${
    date >= 10 ? date : "0" + date
  }.`;
  document.getElementById("today__now--korea").innerText = dateFormat;
  document.getElementById("today__day--korea").innerText = day;

  //시간 구하기
  let timeFormat = new Date().toTimeString().split(" ")[0];
  document.getElementById("time__now--korea").innerText = timeFormat;

  //오전 오후 확인
  let putHour = document.getElementById("time__merdiem--korea");
  if (hour >= 12 && hour < 24) {
    putHour.innerText = "오후";
  } else {
    putHour.innerText = "오전";
  }

  setTimeout(koreaTime, 200);
}
koreaTime();