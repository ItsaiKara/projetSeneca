const Seneca = require('seneca')
const SenecaWeb = require('seneca-web')

var wrs = [] // liste des work requests

// definition d'un plugin (constituant ici le microservice)
var plugWrStat = function (options) {
    var seneca = this
   
    seneca.add('role:stat,cmd:stats', async function (msg, done) {
    })

    return {name : 'wrStat'} // nom du plugin

}

var seneca = Seneca()
seneca.use(plugWrStat) // enregistrement du plugin ds Seneca

seneca.listen(4001) 