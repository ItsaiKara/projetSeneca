const Seneca = require('seneca')
const SenecaWeb = require('seneca-web')
const Express = require('express')
const seneca = Seneca()
const BodyParser = require('body-parser')

var Routes = [{
  pin: 'role:wr,cmd:*', // type de message créé à la réception d'une requête HTTP
  prefix : '/api',
  map: {
    create : {POST : true , name :"", suffix : "/wr"},
    getById: {GET: true, name: "", suffix: "/wr/:id?"},
    updateWr: {PUT: true, name: "", suffix: "/wr/:id"},
    deleteWr : {DELETE: true, name: "", suffix: "/wr/:id"}
  }
}]

seneca.client({port: 4000, pin: 'role:wr'})

seneca.use(SenecaWeb, {
  options: { parseBody: false }, // désactive l'analyseur JSON de Seneca
  routes: Routes,
  context: Express().use(BodyParser.json()),     // utilise le parser d'Express pour lire les données 
  adapter: require('seneca-web-adapter-express') // des requêtes PUT
})

seneca.ready(() => {
  const app = seneca.export('web/context')()
  app.listen(3000)
})
