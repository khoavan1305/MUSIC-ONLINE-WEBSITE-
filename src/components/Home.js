import React, { useState, useEffect, useRef } from "react";

function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(new Audio());
  const progressBarRef = useRef(null);
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = async () => {
    try {
      const response = await fetch(`/search/track?q=${searchTerm}&limit=3`);
      const data = await response.json();

      const newSearchResults = data.data.map((track) => ({
        path: track.preview,
        displayName: track.title,
        cover: track.album.cover_medium,
        artist: track.artist.name,
        duration: 30,
      }));
      setSearchResults(newSearchResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  const handleSearchButtonClick = () => {
    handleSearch();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API và chuyển dữ liệu về dạng JSON
        const response = await fetch(`/search/track?q=Sơn%20Tùng&limit=10`);
        const data = await response.json();
        const newSongs = data.data.map((track) => ({
          path: track.preview,
          displayName: track.title,
          cover: track.album.cover_medium,
          artist: track.artist.name,
          duration: 30,
        }));
        setSongs(newSongs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // useEffect sẽ chỉ gọi lại khi [] thay đổi

  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  useEffect(() => {
    loadSong(songs[currentSongIndex]);

    // Kiểm tra xem songs đã được cập nhật chưa
    if (!audioRef.current) {
      // Thiết lập bài hát ban đầu khi component được mount
      loadSong(songs[currentSongIndex]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSongIndex, songs]);
  useEffect(() => {
    if (!audioRef.current) return;

    // Cập nhật thời gian hiện tại và thanh ProgressBar khi có sự kiện timeupdate
    const updateTime = () => {
      setCurrentTime(audioRef.current.currentTime);
      updateProgressBar();
    };

    audioRef.current.addEventListener("timeupdate", updateTime);

    return () => {
      audioRef.current.removeEventListener("timeupdate", updateTime);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime, duration]);

  const playSong = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const loadSong = (song) => {
    if (!song || !song.path) {
      console.error("Invalid song or song path");
      return;
    }
    setCurrentSongIndex(songs.indexOf(song));
    audioRef.current.src = song.path;
    setDuration(song.duration);

    // Thiết lập cover, title, và artist nếu các phần tử tồn tại
    const cover = document.getElementById("cover");
    const title = document.getElementById("music-title");
    const artist = document.getElementById("music-artist");

    if (cover) cover.src = song.cover;
    if (title) title.innerText = song.displayName;
    if (artist) artist.innerText = song.artist;
  };
  const updateProgressBar = () => {
    if (!audioRef.current || !progressBarRef.current) return;

    const progressPercent = (currentTime / duration) * 100;
    progressBarRef.current.style.width = `${progressPercent}%`;
  };
  const nextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
    setIsPlaying(false);
  };
  const prevSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1) % songs.length);
    setIsPlaying(false);
  };

  const formatTime = (time) => String(Math.floor(time)).padStart(2, "0");

  return (
    <>
      <audio ref={audioRef}></audio>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          id="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button id="search-button" onClick={handleSearchButtonClick}>
          <i className="fas fa-search" />
        </button>
        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Kết quả tìm kiếm</h3>
            <ul>
              {searchResults.map((result, index) => (
                <li key={index} onClick={() => loadSong(result)}>
                  {result.displayName} - {result.artist}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="background">
        <img src="assets/1.jpg" id="bg-img" alt="img" />
      </div>
      <div className="container">
        <div className="player-img">
          <img src="" className="active" id="cover" alt="img" />
        </div>
        <h2 className="h2" id="music-title" />
        <h3 className="h3" id="music-artist" />

        <div className="player-progress" id="player-progress">
          <div className="progress" id="progress" ref={progressBarRef} />
          <div className="music-duration">
            <span id="current-time">{`${formatTime(
              currentTime / 60
            )}:${formatTime(currentTime % 60)}`}</span>
            <span id="duration">{`${formatTime(duration / 60)}:${formatTime(
              duration % 60
            )}`}</span>
          </div>
        </div>
        <div className="player-controls">
          <i
            className="fa-solid fa-backward"
            title="Previous"
            id="prev"
            onClick={prevSong}
          />
          <i
            className={`fa-solid ${
              isPlaying ? "fa-pause" : "fa-play"
            } play-button`}
            title={isPlaying ? "Pause" : "Play"}
            id="play"
            onClick={playSong}
          ></i>{" "}
          <i
            className="fa-solid fa-forward"
            title="Next"
            id="next"
            onClick={nextSong}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
