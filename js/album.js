import { setAudio, getData } from "./main.js";

const defaultUrl = "https://api.spotify.com/v1/albums/1typPCwqyXMfFpvDZAyKew";

async function getArtistImage(link) {
  try {
    return (await getData(link)).images[0].url;
  } catch (error) {
    return "https://i.scdn.co/image/ab6761610000517458efbed422ab46484466822b";
  }
}

function getLinks(artists) {
  let links = "";
  artists.forEach((artist) => {
    const link = artist.external_urls.spotify;
    links += ` <a href="${link}" class="fw-light singer-link">${artist.name}</a>`;
  });
  return links;
}

function getCorrectTime(time_ms) {
  const timeFormat = new Intl.DateTimeFormat(undefined, {
    minute: "numeric",
    second: "2-digit",
  });

  let time = timeFormat.format(time_ms);
  time = time.replace(/^0/, "");
  return time;
}

async function renderHeader(album) {
  let {
    album_type,
    images: {
      0: { url: albumImgUrl },
    },
    artists: { 0: artist },
    release_date,
    total_tracks,
    name,
  } = album;

  const artistImgUrl = await getArtistImage(artist.href);

  const albumImgElm = document.getElementById("albumImg");
  const albumTypeElm = document.getElementById("albumType");
  const albumNameElm = document.getElementById("albumName");
  const artistImgElm = document.getElementById("artistImg");
  const albumInfoElm = document.getElementById("albumInfo");

  albumImgElm.src = albumImgUrl;
  albumImgElm.alt = name;

  albumTypeElm.innerText = album_type;
  albumNameElm.innerText = name;

  artistImgElm.src = artistImgUrl;
  artistImgElm.alt = artist.name;

  document.title = name;

  albumInfoElm.innerHTML = `
  <span class="fw-bold">
  <a class="artist-link" href="${artist.external_urls.spotify}">
    ${artist.name}
  </a>
   &#183; ${new Date(release_date).getFullYear()} &#183; ${total_tracks} songs
  </span>
  `;
}

function fillTracks(tracks, tracksGrid) {
  tracks.forEach((track, i) => {
    const div = document.createElement("a");
    div.classList.add("track-grid");
    div.href = track.external_urls.spotify;

    track.preview_url && setAudio(div, track.preview_url, 500);

    const links = getLinks(track.artists);

    const time = getCorrectTime(track.duration_ms);

    div.innerHTML = `
    <h5 class="track-num">
      <span>${i + 1}</span><i class="fa-solid fa-play"></i>
    </h5>
    <div class="text-ellipsis">
      <h5 class="text-ellipsis">${track.name}</h5>
      <div class="singers-links text-ellipsis">
        ${links}
      </div>
    </div>
    <p class="fw-light">${track.explicit ? "Yes" : "No"}</p>
    <h6>${time}</h6>
    `;

    tracksGrid.append(div);
  });
}

function renderTracks(album) {
  const tracks = album.tracks.items;
  const tracksGrid = document.getElementById("tracksGrid");
  tracksGrid.innerHTML = "";
  fillTracks(tracks, tracksGrid);
}

async function renderPage() {
  const album = await getData(localStorage.getItem("albumLink") || defaultUrl);
  await renderHeader(album);
  renderTracks(album);
}

window.onload = async () => {
  await renderPage();
};

export { getLinks, getCorrectTime, getArtistImage };
