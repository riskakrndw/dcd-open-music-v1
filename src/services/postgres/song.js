const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { MapSong } = require("../../utils/index");

const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = nanoid(16);

    if (albumId == undefined || duration == undefined) {
      albumId = null;
    }

    const query = {
      text: "INSERT INTO song VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, albumId, title, year, genre, performer, duration],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Song gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    console.log("pg5===", title, performer);

    let query = "SELECT id, title, performer FROM song";

    console.log("pg6");

    if (title != "" && performer != "") {
      console.log("msk1");
      query = {
        text: "SELECT id, title, performer FROM song WHERE title = $1 AND performer = $2",
        values: [title, performer],
      };
    } else if (title != "") {
      console.log("msk2");
      query = {
        text: "SELECT id, title, performer FROM song WHERE title = $1",
        values: [title != ""],
      };
    } else if (performer != "") {
      console.log("msk3");
      query = {
        text: "SELECT id, title, performer FROM song WHERE performer = $1",
        values: [performer],
      };
    }

    console.log("5.2");
    try {
      const result = await this._pool.query(query);
      console.log("pg6===", result);
      return result.rows.map(MapSong);
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Failed to fetch songs from the database.");
    }
  }

  async getSongById(id) {
    console.log("pg7");
    const query = {
      text: "SELECT * FROM song WHERE id = $1",
      values: [id],
    };
    console.log("pg8");
    const result = await this._pool.query(query);

    console.log("pg9");

    if (!result.rows.length) {
      throw new NotFoundError("Song tidak ditemukan");
    }

    console.log("pg10");

    return result.rows.map(MapSong)[0];
  }

  async editSong(id, { title, year, performer, genre, duration, albumId }) {
    if (albumId === undefined) {
      albumId = null;
    }

    console.log("pg11===", title, year, performer, genre, duration, albumId);
    const query = {
      text: 'UPDATE song SET "albumId" = $1, title = $2, year = $3, genre = $4, performer = $5, duration = $6 WHERE id = $7 RETURNING id',
      values: [albumId, title, year, genre, performer, duration, id],
    };

    console.log("pg12");

    // const result = await this._pool.query(query);
    let result;
    try {
      result = await this._pool.query(query);
    } catch (error) {
      console.error("Database error:", error);
      throw new InvariantError(
        "Song gagal ditambahkan karena masalah pada database."
      );
    }

    console.log("pg13");

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui song. Id tidak ditemukan");
    }

    console.log("pg14");
  }

  async deleteSong(id) {
    console.log("pg15");
    const query = {
      text: "DELETE FROM song WHERE id = $1 RETURNING id",
      values: [id],
    };
    console.log("pg16");

    const result = await this._pool.query(query);

    console.log("pg17");

    if (!result.rows.length) {
      throw new NotFoundError("Song gagal dihapus. Id tidak ditemukan");
    }

    console.log("pg18");
  }
}

module.exports = SongService;
