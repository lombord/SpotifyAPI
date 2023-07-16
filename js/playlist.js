import { setAudio, getData } from "./main.js";
import { getLinks, getCorrectTime, getArtistImage } from "./album.js";
import { setItemLink } from "./index.js";

const defaultUrl =
  "https://api.spotify.com/v1/playlists/37i9dQZF1DZ06evO2O09Hg";

async function renderHeader(playlist) {
  const {
    images: {
      0: { url: albumImgUrl },
    },
    type,
    name,
    description,
    owner,
    followers: { total: likes },
    tracks: { total: tracks },
  } = playlist;

  const ownerImgUrl = await getArtistImage(owner.href);

  const albumImgElm = document.getElementById("albumImg");
  const albumTypeElm = document.getElementById("albumType");
  const albumNameElm = document.getElementById("albumName");
  const descriptionElm = document.getElementById("description");
  const artistImgElm = document.getElementById("artistImg");
  const albumInfoElm = document.getElementById("albumInfo");

  albumImgElm.src = albumImgUrl;
  albumImgElm.alt = name;
  albumImgElm.title = name;

  albumTypeElm.innerText = `${playlist.public ? "Public" : "Private"} ${type}`;

  albumNameElm.innerText = name;

  descriptionElm.innerText = description;

  artistImgElm.src = ownerImgUrl;
  artistImgElm.alt = owner.display_name;

  albumInfoElm.innerHTML = `
  <a class="fw-bold artist-link" href="${owner.external_urls.spotify}">${
    owner.display_name
  }</a> &#183;
  ${likes.toLocaleString("en-US")} likes &#183; ${tracks} songs
  `;
}

function fillTrackHtml(div, track, i, links, added_at, add_format, time) {
  div.innerHTML = `
  <h5 class="track-num">
    <span>${i + 1}</span><i class="fa-solid fa-play"></i>
  </h5>
  <div class="row gx-3 align-items-center text-ellipsis">
    <div class="col-md-2 col-sm-3 col-4">
      <img
        class="img-fluid"
        src="${track.album.images[0].url}"
        alt="${track.name}"
      />
    </div>
    <div class="col text-ellipsis">
      <h5 class="text-ellipsis">${track.name}</h5>
      <div class="singers-links text-ellipsis">
        ${links}
      </div>
    </div>
  </div>
  <a class="fw-light col-link text-ellipsis added-by-link">${
    track.album.name
  }</a>
  <p class="fw-light text-ellipsis">
    ${add_format.format(new Date(added_at))}
  </p>
  <h6 class="fw-light">${time}</h6>`;
}

function renderTracks(tracks) {
  const tracksGrid = document.getElementById("tracksGrid");
  tracksGrid.innerHTML = "";
  const add_format = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  tracks.forEach((data, i) => {
    const { track, added_at } = data;

    const div = document.createElement("a");
    div.classList.add("track-grid", "playlist-grid", "align-items-center");

    const links = getLinks(track.artists);
    const time = getCorrectTime(track.duration_ms);

    track.preview_url && setAudio(div, track.preview_url, 500);

    fillTrackHtml(div, track, i, links, added_at, add_format, time);

    setItemLink(
      div.querySelector(".added-by-link"),
      track.album.href,
      "/album.html",
      "albumLink"
    );

    tracksGrid.append(div);
  });
}

async function renderPage() {
  const playlist = await getData(
    localStorage.getItem("playlistLink") || defaultUrl
  );
  document.title = playlist.name;
  await renderHeader(playlist);
  renderTracks(playlist.tracks.items);
}

window.onload = async () => {
  await renderPage();
};
