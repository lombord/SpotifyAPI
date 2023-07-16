import { getRandLetter, getRandInt, setAudio, getDataParams } from "./main.js";

function setItemLink(elm, link, path, key) {
  elm.href = path;
  elm.addEventListener("mousedown", (ev) => {
    ev.stopPropagation();
    localStorage.setItem(key, link);
  });
}

function renderTracks(tracks) {
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
    div.classList.add("track-div");
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
    setItemLink(
      div.querySelector(".track-name"),
      albumLink,
      "/album.html",
      "albumLink"
    );
    infoGrid.append(div);
  });
}

function renderPlaylists(playlists) {
  playlists.forEach((playlist) => {
    const {
      images: {
        0: { url: imgUrl },
      },
      name,
      owner: {
        display_name: ownerName,
        external_urls: { spotify },
      },
      href,
      external_urls: { spotify: playlist_url },
    } = playlist;

    const div = document.createElement("a");
    div.classList.add("playlist-div");
    div.href = playlist_url;
    div.title = name;

    div.innerHTML = `
    <div class="playlist-imgbox imgBox">
      <img
        class="img-fluid"
        src="${imgUrl}"
        alt="${name}"
      />
    </div>
    <div class="track-info p-4">
      <a href="#" class="playlist-name text-ellipsis pb-2 h3">
        ${name}
      </a>
      <h5 class="playlist-owner text-ellipsis">
        By <a href="${spotify}">${ownerName}</a>
      </h5>
    </div>
    `;
    setItemLink(
      div.querySelector(".playlist-name"),
      href,
      "/playlist.html",
      "playlistLink"
    );

    infoGrid.append(div);
  });
}

async function searchItems(
  type = "track",
  query = null,
  renderFunc = renderTracks,
  limit = 50,
  offset = 0
) {
  loadBtn.classList.add("load-hidden");
  if (!query) {
    query = getRandLetter();
    offset = getRandInt(1, 949);
    infoGrid.innerHTML = "";
  }
  let data;
  try {
    data = (
      await getDataParams("search", {
        q: query,
        type,
        limit,
        offset,
        include_external: "audio",
      })
    )[type + "s"];
  } catch (error) {
    console.log(error);
    return;
  }
  const { items } = data;
  if (offset === 0) infoGrid.innerHTML = "";
  renderFunc(items);
  if (offset < data.total) {
    loadBtn.classList.remove("load-hidden");
    loadBtn.addEventListener(
      "click",
      () => {
        searchItems(type, query, renderFunc, limit, offset + limit);
      },
      { once: true }
    );
  }
}

window.onload = () => {
  const infoGrid = document.getElementById("infoGrid");
  const loadBtn = document.getElementById("loadBtn");

  searchItems();
  document.getElementById("searchInpt").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const {
      searchKey: { value: searchKey },
      filter: { value: filter },
    } = ev.target;
    console.log(`filter:${filter}`, `searchQuery:${searchKey}`);
    if (filter) {
      searchItems(undefined, searchKey ? `${filter}:${searchKey}` : "");
    } else {
      searchItems("playlist", searchKey, renderPlaylists);
    }
  });
};

export { setItemLink };
