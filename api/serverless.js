import fetch from "node-fetch";

export default async function handler(request, response) {
  const apiKey = process.env.API_KEY; //환경변수 불러오기
  const city = request.query.city;

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=kr`;
  const res = await fetch(apiUrl);
  const json = await res.json();
  response.status(200).json(json);
}
