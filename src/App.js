import wind from './icon/wind.svg';
import hPa from './icon/hPa.svg';
import sunset_icon from './icon/sunset.png';
import sunrise_icon from './icon/sunrise.png';
// danh sách img bacjkground
import {Background} from './dataBackground';

import {useEffect, useRef, useState} from 'react'
import './App.css';

function Weather({data}) {
  console.log(data)
  // lấy ra các giá trị
  const w_main = data.weather[0].main;
  const w_description = data.weather[0].description;
  const w_icon = data.weather[0].icon;

  const w_visibility = ((data.visibility)/1000).toFixed(1);

  const m_temp = KtoC(data.main.temp);
  const m_feels_like = KtoC(data.main.feels_like);
  const m_pressure = data.main.pressure;
  const m_humidity = data.main.humidity;
  const m_sea_level = data.main.sea_level;

  const w_wind_speed = data.wind.speed;

  const sys_country = data.sys.country;
  const sys_sunrise = formartDate((data.sys.sunrise) * 1000);
  const sys_sunset = formartDate((data.sys.sunset) * 1000);
  const sys_timezone = formartDate( (new Date().getTime() - 25200*1000) + (data.timezone)* 1000);
  // const current_date = new Date();
  const sys_city = data.name;
  return (
    <div className='Weather bgr_layer'>
      {/* <div>{current_date}</div> */}
    <h1 style={{color:"#36AE7C",}}>{sys_city}, {sys_country}</h1>
    <div>Current time: {sys_timezone}</div>
    <h2 style={{color:"#36AE7C",}}>
        <img src={`https://openweathermap.org/img/wn/${w_icon}@2x.png`} />
        {m_temp}°C 
        <img src={`https://openweathermap.org/img/wn/${w_icon}@2x.png`} />
    </h2>
   {/* <div style="color:orange;">Max temperature: ${temp_max}°C  </div>
    <div style="color:#1363DF;">Min temperature: ${temp_min}°C  </div> */}
    <div style={{color:"tomato",}}>Feels like: {m_feels_like}°C  </div>

    <div >{w_main}, {w_description}</div>  
    <div>
      <img src={wind} className="icon" alt='wind' />
      {w_wind_speed}m/s E 
    </div>
    <div>
      <img src={hPa} className="icon" alt='hPa' />
      {m_sea_level}hPa
    </div>
    <div>
      Humidity: {m_humidity}%
    </div>
    <div>Visibility: {w_visibility}km</div>
    <div>Sun rise: {sys_sunrise}      
      <img src={sunrise_icon} className="icon" alt="sunrise_icon" />
    </div>
    <div>Sun set: {sys_sunset}     
      <img src={sunset_icon} className="icon" alt="sunset_icon" />
    </div>
</div>
  )
}
// chuyển từ độ K thành độ C
function KtoC(K) {
  return Math.floor(K - 273.15);
}
// convert Date về dạng ngày và giờ 

function formartDate(date){
  var d = new Date(date);
  var minute = d.getMinutes();
  if (minute < 10) {
    minute = "0"+minute
  }
  var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +d.getHours() + ":" + minute;
  return datestring;
}


function App() {
  const city_value = useRef();
// set background
  const  [bgrImg, setBgrImg] = useState(Background[0])
  const [city_check, setCity_check] = useState(false)
  const [respData, setRespData] = useState({})
  const url =(city)=> (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3265874a2c77ae4a04bb96236a642d2f`)
  async function getWeatherByLocation(city) {
      // get api 
      const resp = await fetch(url(city), {origin: "cors"});
      const respDt = await resp.json();
   
      // hiển thị lên giao diện
      if(respDt.cod === 200) {
        setCity_check(true);
        setRespData(respDt);
        if (Background.indexOf(bgrImg) === (Background.length - 1)) {
          setBgrImg(Background[0])
        }else {
          const i = Background.indexOf(bgrImg)
          setBgrImg(Background[i+1])
        } 
      }else {
        window.alert('city is wrong!')
        city_value.current.value = ""
        city_value.current.focus()
        setCity_check(false)
      }
      console.log(respData);
  }

//  useEffect(()=>{
//   console.log("useEffect:" , respData)
//  },[respData])

  return (
    <div className={`App conttainer ${city_check?"bgr_layer":""}`}
    style={{backgroundImage:`url(${bgrImg})`, height:'600px', width:'400px', color:'white'}}
    >
       {/* <div className="modal container" style={{backgroundImage:`url(${Background})`, height:'600px', width:'400px'}} >hi</div> */}
       <div className="input-group" style={{width:"300px"}}>
          <input 
          ref={city_value} 
          type="text button" 
          className="form-control" 
          placeholder="enter city name" 
          aria-label="Recipient's username" 
          aria-describedby="button-addon2" 
          onKeyDown={(e)=>{
            if (e.key === "Enter"){
              getWeatherByLocation(city_value.current.value)
            }
          }}
          />
          <button 
          className="btn btn-outline-secondary" 
          type="button" 
          id="button-addon1"
          onClick={()=>getWeatherByLocation(city_value.current.value)}
          
          >
          <i className="fa fa-search" aria-hidden="true"></i>
          </button>
      </div>
      {city_check && <Weather data={respData} />}
     
    </div>
  );
}

export default App;
 