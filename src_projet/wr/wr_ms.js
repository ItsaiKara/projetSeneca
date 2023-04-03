const Seneca = require('seneca')
const SenecaWeb = require('seneca-web')

let wrs = [] // liste des work requests


// definition d'un plugin (constituant ici le microservice)
var plugWr = function (options) {
    var seneca = this
    seneca.add('role:wr, cmd:wr', async function (msg, done) {
        // console.log(msg)
        let tmpWr = {id: wrs.length, applicant : msg.data.applicant, work : msg.data.work, dc_date : msg.data.dc_date, state: "created", compl_date: null} // initialiser à null au lieu de ne pas initialiser}
        // tmpWr = {id: 1, applicant: "paul", work: "PC update", dc_date: "05/06/2021"}
        wrs.push(tmpWr)
        await done(null, result = {success: true, data : [tmpWr]})
    })
    seneca.add('role:wr, cmd:getById', async function (msg, done) {
        console.log("----------------------------------------------")
        if (msg.id) {
            const wr = wrs.find(wr => wr.id === msg.id);
            if (!wr) {
                await done(new Error(`Work request with ID ${msg.id} not found`));
            }
            await done(null, result = { success: true, data: [wr] });
        }
    })
    return 'wr' // nom du plugin

}

var seneca = Seneca()
seneca.use(plugWr) // enregistrement du plugin ds Seneca

seneca.listen(3000) // ecoute sur le port 3000