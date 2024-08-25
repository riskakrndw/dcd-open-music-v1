require("dotenv").config();

const ClientError = require("./exceptions/ClientError");

const Hapi = require("@hapi/hapi");
const album = require("./api/album");
const song = require("./api/song");
const AlbumService = require("./services/postgres/album");
const SongService = require("./services/postgres/song");
const AlbumValidator = require("./validator/album");
const SongValidator = require("./validator/song");

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();

  console.log("coba 1");

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,

    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  console.log("coba 2");

  await server.register({
    plugin: album,
    options: {
      service: albumService,
      validator: AlbumValidator,
    },
  });

  console.log("coba 3");

  await server.register({
    plugin: song,
    options: {
      service: songService,
      validator: SongValidator,
    },
  });

  console.log("coba 4");

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  console.log("coba 5");

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
