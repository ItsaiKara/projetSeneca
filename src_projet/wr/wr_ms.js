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
var plugWr = function (options) {
    var seneca = this
    seneca.add('role:wr,cmd:create', async function (msg, done) {
        if (msg.args.body.applicant == undefined || msg.args.body.dc_date == undefined) {
            await done(null, result = {success: false, msg : `missing data`})
        }
        // console.log(msg)
        let tmpWr = {id: wrs.length+1, applicant : msg.args.body.applicant, work : msg.args.body.work, dc_date : msg.args.body.dc_date, state: "created", compl_date: null} // initialiser à null au lieu de ne pas initialiser}
        // tmpWr = {id: 1, applicant: "paul", work: "PC update", dc_date: "05/06/2021"}
        wrs.push(tmpWr)
        //print size
        // console.log("lengh : " + wrs.length)
        // console.log(wrs)
        await done(null, result = {success: true, data : [tmpWr]})
    })
    seneca.add('role:wr,cmd:getById', async function (msg, done) {
        // console.log(msg.args.params)
        let l_id = msg.args.params.id
        // console.log(l_id)
        if (l_id) {
            //recherche de l'objet wr correspondant à l'id
            for (let i = 0; i < wrs.length; i++) {
                if (wrs[i].id == l_id) {
                    return await done(null, result = {success: true, data : [wrs[i]]})
                }
            }
            await done(null, result = {success: false, msg : `wr not found`})
        } else {
           await done(null, result = {success: true, data : wrs})
        }
    })
    seneca.add('role:wr,cmd:updateWr', async function (msg, done) {
        // console.log(msg.args)
        let l_id = msg.args.params.id
        if (l_id) {
            //recherche de l'objet wr correspondant à l'id
            for (let i = 0; i < wrs.length; i++) {
                if (wrs[i].id == l_id) {
                    if (msg.args.body.hasOwnProperty('work') && wrs[i].state != "closed") {
                        wrs[i].work = msg.args.body.work
                        return await done(null, result = {success: true, data : [wrs[i]]})
                    } 
                    if (msg.args.body.hasOwnProperty('state')) {
                        wrs[i].state = msg.args.body.state
                        wrs[i].compl_date = currentDate()
                        return await done(null, result = {success: true, data : [wrs[i]]})
                    }
                    return await done(null, result = {success: false, data : [wrs[i]], msg : "wr is already closed"})
                }
            }
            await done(null, result = {success: false, msg : `wr not found`})
        } else {
            await done(null , result = {success: false, msg : `wr id not provided`});
        }
    })
    seneca.add('role:wr,cmd:deleteWr', async function (msg, done) { 
        // console.log(msg.args)
        let l_id = msg.args.params.id
        console.log(l_id)
        console.log(wrs)
        if (l_id) {
            //recherche de l'objet wr correspondant à l'id
            for (let i = 0; i < wrs.length; i++) {
                if (wrs[i].id == l_id) {
                    //if closed don't delete
                    if (wrs[i].state == "closed") {
                        return await done(null, result = {success: false, msg : `wr is already closed`})
                    }
                    el = wrs[i]
                    wrs.splice(i, 1)
                    return await done(null, result = {success: true, data : [el]})
                }
            }
            return await done(null, result = {success: false, msg : `wr not found`})
        } else {
            return await done(new Error(`ID is required`));
        }
    })
    return {name : 'wr'} // nom du plugin

}

var seneca = Seneca()
seneca.use(plugWr) // enregistrement du plugin ds Seneca

seneca.listen(4000) // ecoute sur le port 3000