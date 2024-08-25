class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    console.log("h1");

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongHandler = this.putSongHandler.bind(this);
    this.deleteSongHandler = this.deleteSongHandler.bind(this);
    console.log("h2");
  }

  async postSongHandler(request, h) {
    this._validator.validateSong(request.payload);

    const { title, year, genre, performer, duration, albumId } =
      request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    const response = h.response({
      status: "success",
      message: "Song berhasil ditambahkan",
      data: {
        songId,
      },
    });

    response.code(201);
    return response;
  }

  async getSongsHandler(request, h) {
    const { title = "" } = request.query;
    const { performer = "" } = request.query;
    let songs = [];

    console.log("g2");

    songs = await this._service.getSongs(title, performer);

    console.log("g3===", songs);

    return {
      status: "success",
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return {
      status: "success",
      data: {
        song,
      },
    };
  }

  async putSongHandler(request, h) {
    console.log("masuk 1");
    this._validator.validateSong(request.payload);
    console.log("masuk 2");

    const { id } = request.params;
    await this._service.editSong(id, request.payload);

    console.log("masuk 3");

    return {
      status: "success",
      message: "Song berhasil diperbarui",
    };
  }

  async deleteSongHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSong(id);

    return {
      status: "success",
      message: "Song berhasil dihapus",
    };
  }
}

module.exports = SongHandler;
