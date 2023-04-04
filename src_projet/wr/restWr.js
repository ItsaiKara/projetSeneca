const Seneca = require('seneca')
const SenecaWeb = require('seneca-web')
const Express = require('express')
const seneca = Seneca()
const BodyParser = require('body-parser')

var Routes = [{
  pin: 'role:stats,cmd:getWrStats', // type de message créé à la réception d'une requête HTTP
  prefix: '/api/wr',
  map: {
    getWrStats: { GET: true, name: "", suffix: "/stats/:applicant?" }
  }
},{
  pin: 'role:wr,cmd:*', // type de message créé à la réception d'une requête HTTP
  prefix : '/api',
  map: {
    create : {POST : true , name :"", suffix : "/wr"},
    getById: {GET: true, name: "", suffix: "/wr/:id?"},
    updateWr: {PUT: true, name: "", suffix: "/wr/:id?"},
    deleteWr : {DELETE: true, name: "", suffix: "/wr/:id"},
<<<<<<< HEAD
    getWrStatss: { GET: true, name: '', suffix: 'wr/stats/:applicant?'}
=======
    stats: {GET: true, name: "", suffix: "/wr/stats"}
  }
},
{
  pin: 'role:stat,cmd:*', // type de message créé à la réception d'une requête HTTP
  prefix : '/api',
  map: {
    stats: {GET: true, name: "", suffix: "/wr/stats/:applicant?"}
>>>>>>> 8ebb2fc2dccbb33070b77aa7b321e83f05bb7397
  }
}
]


seneca.client({port: 4000, pin: 'role:wr'})
<<<<<<< HEAD
seneca.client({port: 4001, pin: 'role:stats'})
=======
seneca.client({port: 4001, pin: 'role:stat'})
>>>>>>> 8ebb2fc2dccbb33070b77aa7b321e83f05bb7397

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
