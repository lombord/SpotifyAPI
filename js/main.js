const baseUrl = "https://accounts.spotify.com/api";
const apiUrl = "https://api.spotify.com/v1";
const clientId = "17e9f2b4f43f43e7b3e538b363373553";
const clientSecret = "16a652d1e0b0453a887fb150ff598e83";

let prevAudio;

const loadElm = document.getElementById("loadAnimation");

function getRandInt(a, b) {
  return Math.floor(Math.random() * (b - a) + a);
}

function getRandLetter() {
  return "abcdefghijklmnopqrstuvwxyz".charAt(getRandInt(0, 26));
}

async function updateToken() {
  let data;
  try {
    data = await (
      await fetch(`${baseUrl}/token`, {
        signal: AbortSignal.timeout(5000),
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(clientId + ":" + clientSecret)}`,
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
        }),
        json: true,
      })
    ).json();
  } catch (error) {
    console.log(error);
  }
  localStorage.setItem("token", data.access_token);
  console.log("Token has been updated");
  setTimeout(updateToken, (data.expires_in - 10) * 1000);
  return data.access_token;
}

async function getData(url, signal) {
  loadElm.classList.remove("hide-animation");
  let data;
  try {
    const response = await fetch(url, {
      method: "GET",
      signal,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.status === 401) {
      throw new Error("token");
    }
    data = await response.json();
    console.log(data);
    loadElm.classList.add("hide-animation");
    return data;
  } catch (error) {
    if (error.message === "token") {
      await updateToken();
      return getData(url);
    }
    throw error;
  }
}

function getDataParams(subUrl, params, signal) {
  params = new URLSearchParams(params);
  return getData(`${apiUrl}/${subUrl}?` + params, signal);
}

function setAudio(div, preview_url, timeout) {
  // prevAudio.volume = 1;
  let timeId;
  div.addEventListener("mouseenter", () => {
    if (!prevAudio || prevAudio.src !== preview_url) {
      prevAudio = new Audio(preview_url);
      prevAudio.volume = 0.1;
      prevAudio.addEventListener("ended", () => {
        prevAudio.play();
      });
    }
    timeId = setTimeout(() => {
      prevAudio.play();
    }, timeout);
  });
  div.addEventListener("mouseleave", () => {
    clearTimeout(timeId);
    prevAudio.pause();
  });
}

export { getRandLetter, getRandInt, setAudio, getData, getDataParams };
