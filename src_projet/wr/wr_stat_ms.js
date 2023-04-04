const Seneca = require('seneca')
const SenecaWeb = require('seneca-web')

var wrs = [] // liste des work requests


// build current date
function currentDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}


// definition d'un plugin (constituant ici le microservice)
var plugStatWr = function (options) {
    var seneca = this
    seneca.add('role:stats,cmd:getWrStats', async (msg, respond) => {
        console.log("ICI")
        // Appel à wr_ms.js pour récupérer les données
        //respond(null, result = {success: true, data : null})
        seneca.act('role:wr,cmd:getWrStatss', async function(err, result) {
            if (err) {
              console.error(err)
            } else {
              console.log(result)
              // ici, vous pouvez traiter le résultat obtenu avec seneca.act()
              await respond(null, result = {success: true, data : [1,1,1]})
            }
          })
          
      })
      
    return {name : 'stats'} // nom du plugin
}

var seneca = Seneca()
seneca.use(plugStatWr) // enregistrement du plugin ds Seneca

seneca.listen(4001) // ecoute sur le port 3000