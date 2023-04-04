const Seneca = require('seneca')
const SenecaWeb = require('seneca-web')

let wrs = [] // liste des work requests

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
var plugWr = function (options) {
    var seneca = this
    seneca.add('role:wr,cmd:create', async function (msg, done) {
        // console.log(msg)
        let tmpWr = {id: wrs.length+1, applicant : msg.args.body.applicant, work : msg.args.body.work, dc_date : msg.args.body.dc_date, state: "created", compl_date: null} // initialiser à null au lieu de ne pas initialiser}
        // tmpWr = {id: 1, applicant: "paul", work: "PC update", dc_date: "05/06/2021"}
        wrs.push(tmpWr)
        await done(null, result = {success: true, data : [tmpWr]})
    })
    seneca.add('role:wr,cmd:getById', async function (msg, done) {
        console.log(msg.args.params)
        let l_id = msg.args.params.id
        if (l_id) {
            //recherche de l'objet wr correspondant à l'id
            for (let i = 0; i < wrs.length; i++) {
                if (wrs[i].id == l_id) {
                    await done(null, result = {success: true, data : [wrs[i]]})
                }
            }
            await done(null, result = {success: false, msg : `wr with id ${l_id} not found`})
        } else {
            await done(new Error(`ID is required`));
        }
    })
    seneca.add('role:wr,cmd:updateWr', async function (msg, done) {
        console.log(msg.args)
        let l_id = msg.args.params.id
        if (l_id) {
            //recherche de l'objet wr correspondant à l'id
            for (let i = 0; i < wrs.length; i++) {
                if (wrs[i].id == l_id) {
                    if (msg.args.body.hasOwnProperty('work')) {
                        wrs[i].work = msg.args.body.work
                    } 
                    if (msg.args.body.hasOwnProperty('state')) {
                        wrs[i].state = msg.args.body.state
                        wrs[i].compl_date = currentDate()
                    }
                    await done(null, result = {success: true, data : [wrs[i]]})
                }
            }
            await done(null, result = {success: false, msg : `wr with id ${l_id} not found`})
        } else {
            await done(new Error(`ID is required`));
        }
    })
    return {name : 'wr'} // nom du plugin

}

var seneca = Seneca()
seneca.use(plugWr) // enregistrement du plugin ds Seneca

seneca.listen(4000) // ecoute sur le port 3000