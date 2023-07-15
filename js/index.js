function setAlbumLink(albumLink, elm) {
  elm.href = "/album.html";
  elm.addEventListener("mousedown", (ev) => {
    ev.stopPropagation();
    localStorage.setItem("albumLink", albumLink);
  });
}

function renderTracks(tracks) {
  infoGrid.innerHTML = "";

  tracks.forEach((track) => {
    const div = document.createElement("a");
    const imgUrl = track.album.images[0].url;
    const artistName = track.artists[0].name;
    const trackName = track.name;
    const trackUrl = track.external_urls.spotify;
    const albumLink = track.album.href;
    div.href = trackUrl;
    track.preview_url && setAudio(div, track.preview_url, 1000);
    div.innerHTML = `
      <div class="imgBox">
          <img
            class="img-fluid"
            src="${imgUrl}"
            alt="${trackName}"
          />
      </div>
      <div class="track-info p-4">
          <a class="track-name text-ellipsis pb-2 h3">${trackName}</a>
          <h5 class="artist-name text-ellipsis">${artistName}</h5>
      </div>
  `;
    setAlbumLink(albumLink, div.querySelector(".track-name"));
    infoGrid.append(div);
  });
}

async function searchTracks(track = null) {
  let offset = 0;
  if (!track) {
    track = getRandLetter();
    offset = getRandInt(1, 949);
  }
  let items;
  try {
    ({
      tracks: { items },
    } = await getDataParams("search", {
      q: track,
      type: ["track"],
      limit: 50,
      offset,
      include_external: "audio",
    }));
  } catch (error) {
    console.log(error);
    return;
  }
  renderTracks(items);
}

window.onload = () => {
  const infoGrid = document.getElementById("infoGrid");

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
