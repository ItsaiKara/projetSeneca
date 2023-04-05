const MiniSearch = require('minisearch')
const miniSearch = new MiniSearch({ fields: ['applicant', 'compl_date', 'dc_date', 'id', 'state', 'work']})
const Seneca = require('seneca')
const SenecaWeb = require('seneca-web')
const fs = require('fs');
const { application } = require('express');



// definition d'un plugin (constituant ici le microservice)
var plugSearchWr = function (options) {
    var seneca = this
    seneca.add('role:search,cmd:searchAll', async function (msg, done) {
        miniSearch.addAll(readWrsFromFile())
        console.log("miniSearch")
        let l_search = msg.args.params.search
        if (l_search) {
            let results = miniSearch.search(l_search)
            return await done(null, result = {success: true, data : results})
        }
    })
    return {name : 'wrSearch'} // nom du plugin
}

var seneca = Seneca()
seneca.use(plugSearchWr) // enregistrement du plugin ds Seneca

seneca.listen(4002) // ecoute sur le port 3000