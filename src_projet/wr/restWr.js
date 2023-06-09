const Seneca = require("seneca");
const SenecaWeb = require("seneca-web");
const Express = require("express");
const seneca = Seneca();
const BodyParser = require("body-parser");


/**
 * Routes de l'API REST
 * @type {Array}
 * @property {string} pin - type de message créé à la réception d'une requête HTTP
 * @property {string} prefix - préfixe de l'URL
 * @property {Object} map - mappe les méthodes HTTP sur les actions
 */
var Routes = [
  {
    pin: "role:stats,cmd:getWrStats", // type de message créé à la réception d'une requête HTTP
    prefix: "/api/wr",
    map: {
      getWrStats: { GET: true, name: "", suffix: "/stats/:applicant?" },
    },
  },
  {
    pin: "role:search,cmd:searchAll", // type de message créé à la réception d'une requête HTTP
    prefix: "/api/wr/search",
    map: {
      searchAll: { GET: true, name: "", suffix: "" },
    },
  },
  {
    pin: "role:wr,cmd:*", // type de message créé à la réception d'une requête HTTP
    prefix: "/api",
    map: {
      create: { POST: true, name: "", suffix: "/wr" },
      getById: { GET: true, name: "", suffix: "/wr/:id?" },
      updateWr: { PUT: true, name: "", suffix: "/wr/:id?" },
      deleteAllWr: { DELETE: true, name: "", suffix: "/wr" },
      deleteWr: { DELETE: true, name: "", suffix: "/wr/:id" },
    },
  },
];

// connexion aux microservices
seneca.client({ port: 4000, pin: "role:wr" });
seneca.client({ port: 4001, pin: "role:stats" });
seneca.client({ port: 4002, pin: "role:search" });

seneca.use(SenecaWeb, {
  options: { parseBody: false }, // désactive l'analyseur JSON de Seneca
  routes: Routes,
  context: Express().use(BodyParser.json()), // utilise le parser d'Express pour lire les données
  adapter: require("seneca-web-adapter-express"), // des requêtes PUT
});

seneca.ready(() => {
  const app = seneca.export("web/context")();
  app.listen(3000);
});
