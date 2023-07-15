function setAlbumLink(albumLink, elm) {
  elm.href = "/album.html";
  elm.addEventListener("mousedown", (ev) => {
    ev.stopPropagation();
    localStorage.setItem("albumLink", albumLink);
  });
}

function renderTracks(tracks, clean = false) {
  if (clean) infoGrid.innerHTML = "";

  tracks.forEach((track) => {
    const div = document.createElement("a");
    const imgUrl = track.album.images[0].url;
    const artistName = track.artists[0].name;
    const trackName = track.name;
    const trackUrl = track.external_urls.spotify;
    const albumLink = track.album.href;
    div.href = trackUrl;
    track.preview_url && setAudio(div, track.preview_url, 1000);
    div.title = trackName;
    div.innerHTML = `
      <div class="imgBox">
          <img
            class="img-fluid"
            src="${imgUrl}"
            alt="${trackName}"
          />
      </div>
      <div class="track-info p-4">
          <a title="${trackName}" class="track-name text-ellipsis pb-2 h3">${trackName}</a>
          <h5 title="${artistName}" class="artist-name text-ellipsis">${artistName}</h5>
      </div>
  `;
    setAlbumLink(albumLink, div.querySelector(".track-name"));
    infoGrid.append(div);
  });
}

async function searchTracks(track = null, limit = 50, offset = 0) {
  loadBtn.classList.add("load-hidden");
  if (!track) {
    track = getRandLetter();
    offset = getRandInt(1, 949);
  }
  let tracks;
  try {
    ({ tracks } = await getDataParams("search", {
      q: track,
      type: ["track"],
      limit,
      offset,
      include_external: "audio",
    }));
  } catch (error) {
    console.log(error);
    return;
  }
  const { items } = tracks;
  renderTracks(items, offset === 0);
  if (offset < tracks.total) {
    loadBtn.classList.remove("load-hidden");
    loadBtn.addEventListener(
      "click",
      () => {
        searchTracks(track, limit, offset + 50);
      },
      { once: true }
    );
  }
}

window.onload = () => {
  const infoGrid = document.getElementById("infoGrid");
  const loadBtn = document.getElementById("loadBtn");

  searchTracks();
  document.getElementById("searchInpt").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const {
      searchKey: { value: searchKey },
      filter: { value: filter },
    } = ev.target;
    console.log(filter, searchKey);
    searchTracks(filter ? `${filter}:${searchKey}` : searchKey);
  });
};
