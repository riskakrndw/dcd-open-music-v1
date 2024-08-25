const MapAlbum = ({ id, name, year }) => ({
  id,
  name,
  year,
});

const MapSong = ({ id, title, year, performer, genre, duration, albumId }) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
});

module.exports = { MapAlbum, MapSong };
