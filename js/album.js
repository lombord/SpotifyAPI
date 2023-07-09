const defaultUrl = "https://api.spotify.com/v1/albums/1typPCwqyXMfFpvDZAyKew";

async function getArtistImage(link) {
  return (await getData(link)).images[0].url;
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
  tracks.forEach((track) => {
    const div = document.createElement("div");
    div.classList.add("track-grid");

    setExternalLink(div, track.external_urls.spotify);

    track.preview_url && setAudio(div, track.preview_url, 500);

    let links = "";
    track.artists.forEach((artist) => {
      const link = artist.external_urls.spotify;
      links += ` <a href="${link}" class="fw-light singer-link">${artist.name}</a>`;
    });

    const date = new Date(0, 0, 0, 0, 0, 0, track.duration_ms);
    const time = `${date.getMinutes()}:${date.getSeconds()}`;

    div.innerHTML = `
    <h5 class="track-num">
      <span>${track.track_number}</span><i class="fa-solid fa-play"></i>
    </h5>
    <div>
      <h5>${track.name}</h5>
      <div class="singers-links">
        ${links}
      </div>
    </div>
    <p class="fw-light">44,115,316</p>
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
