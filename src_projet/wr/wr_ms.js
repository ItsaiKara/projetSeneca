const Seneca = require('seneca')
const SenecaWeb = require('seneca-web')
const fs = require('fs');
const { application } = require('express');

var wrs = [] // liste des wr 
var wrs_deleted_by_applicant = {} // liste des work requests deleted by applicant

//statistiques globales
var global_stats_wr_created = 0 
var global_stats_wr_closed = 0
var global_stats_wr_opened = 0
var global_stats_wr_deleted = 0 

//flush all the files at startup
function flushFiles() {
    fs.writeFile('wrs.json', JSON.stringify({}), (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
    fs.writeFile('stats.json', JSON.stringify({}), (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
    fs.writeFile('stat_del.json', JSON.stringify({}), (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
    console.log('[INFO]. all files flushed')
}
flushFiles()

//save number of wrs deleted by applicant to file
function saveWrDeletedByApplicantToJson() {
    fs.writeFile('stat_del.json', JSON.stringify(wrs_deleted_by_applicant), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('stat_del.json file has been saved successfully.');
    });
}
//save wrs to file
function saveWrsToJson(wrs) { 
    fs.writeFile('wrs.json', JSON.stringify(wrs), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('wrs.json file has been saved successfully.');
    });
}

//function to save stats to file
function saveStatsToJson(global_stats_wr_created, global_stats_wr_closed, global_stats_wr_opened) {
    let stats = {global_stats_wr_created: global_stats_wr_created, global_stats_wr_closed: global_stats_wr_closed, global_stats_wr_opened: global_stats_wr_opened, global_stats_wr_deleted: global_stats_wr_deleted}
    fs.writeFile('stats.json', JSON.stringify(stats), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('stats.json file has been saved successfully.');
    });
} 

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
    /**
     * @role : wr
     * @cmd : create
     * @param : body les données du wr à créer
     * @return : success, data (l'obj créé)
     * @description : créer un wr et l'ajoute à la liste des wrs
     */
    seneca.add('role:wr,cmd:create', async function (msg, done) {
        if (msg.args.body.applicant == undefined || msg.args.body.dc_date == undefined) {
            await done(null, result = {success: false, msg : `missing data`})
        }
        //wr temporaire
        let tmpWr = {id: wrs.length+1, applicant : msg.args.body.applicant, work : msg.args.body.work, dc_date : msg.args.body.dc_date, state: "created", compl_date: null} // initialiser à null au lieu de ne pas initialiser}
        //ajout du wr à la liste des wrs
        wrs.push(tmpWr)
        //mise à jour des stats
        global_stats_wr_created++
        global_stats_wr_opened++
        //sauvegarde des données
        saveWrsToJson(wrs)
        saveStatsToJson(global_stats_wr_created, global_stats_wr_closed, global_stats_wr_opened)
        await done(null, result = {success: true, data : [tmpWr]})
    })
    /**
     * @role : wr
     * @cmd : getById
     * @param : id l'id du wr à récupérer (optionnel)
     * @return : success, data
     * @description : récupère un wr par son id si spécifié sinon récupère tous les wrs
     * */
    seneca.add('role:wr,cmd:getById', async function (msg, done) {
        //récupération de l'id du wr dans le message
        let l_id = msg.args.params.id
        if (l_id) {
            //recherche de l'objet wr correspondant à l'id
            for (let i = 0; i < wrs.length; i++) {
                if (wrs[i].id == l_id) { //si trouvé ...
                    return await done(null, result = {success: true, data : [wrs[i]]})
                }
            }
            //si pas trouvé y'a un problème
            await done(null, result = {success: false, msg : `wr not found`})
        } else {
            //si pas d'id spécifié on renvoie tous les wrs
           await done(null, result = {success: true, data : wrs})
        }
    })
    /**
     * @role : wr
     * @cmd : updateWr
     * @param : id l'id du wr à mettre à jour
     * @param : body les données du wr à mettre à jour
     * @return : success, data (l'obj mis à jour)
     * @description : met à jour un wr
     * */
    seneca.add('role:wr,cmd:updateWr', async function (msg, done) {
        //récupération de l'id du wr dans le message
        let l_id = msg.args.params.id
        if (l_id) {
            //recherche de l'objet wr correspondant à l'id
            for (let i = 0; i < wrs.length; i++) { 
                if (wrs[i].id == l_id) { //si trouvé ...
                    if (msg.args.body.hasOwnProperty('work') && wrs[i].state != "closed") { //si on a un champ work et que le wr n'est pas closed on met à jour le work
                        wrs[i].work = msg.args.body.work
                        //sauvegarde des données
                        saveWrsToJson(wrs)
                        saveStatsToJson(global_stats_wr_created, global_stats_wr_closed, global_stats_wr_opened)
                        return await done(null, result = {success: true, data : [wrs[i]]})
                    } 
                    if (msg.args.body.hasOwnProperty('state')) { //si on a un champ state on met à jour le state
                        wrs[i].state = msg.args.body.state
                        wrs[i].compl_date = currentDate()
                        //met à jours les stats
                        global_stats_wr_closed++
                        global_stats_wr_opened--
                        //sauvegarde des données
                        saveWrsToJson(wrs)
                        saveStatsToJson(global_stats_wr_created, global_stats_wr_closed, global_stats_wr_opened)
                        return await done(null, result = {success: true, data : [wrs[i]]})
                    } //si on a un champ state et que le wr est closed on ne fait rien
                    return await done(null, result = {success: false, data : [wrs[i]], msg : "wr is already closed"})
                }
            } //si pas trouvé y'a un problème
            await done(null, result = {success: false, msg : `wr not found`})
        } else { //si pas d'id spécifié y'a un problème
            await done(null , result = {success: false, msg : `wr id not provided`});
        }
    })
    /**
     * @role : wr
     * @cmd : deleteWr
     * @param : id l'id du wr à supprimer
     * @return : success, data (l'obj supprimé)
     * @description : supprime un wr
     * */
    seneca.add('role:wr,cmd:deleteWr', async function (msg, done) { 
        //récupération de l'id du wr dans le message
        let l_id = msg.args.params.id
        if (l_id) {
            //recherche de l'objet wr correspondant à l'id
            for (let i = 0; i < wrs.length; i++) {
                if (wrs[i].id == l_id) { //si trouvé ...
                    if (wrs[i].state == "closed") { //si le wr est closed on ne fait rien
                        // y'a un problème
                        return await done(null, result = {success: false, msg : `wr is already closed`})
                    }
                    //sinon on supprime le wr de la liste
                    //on met à jour les stats
                    //on sauvegarde les données
                    global_stats_wr_deleted++
                    wrs_deleted_by_applicant[wrs[i].applicant] = wrs_deleted_by_applicant[wrs[i].applicant] ? wrs_deleted_by_applicant[wrs[i].applicant] + 1 : 1
                    saveWrDeletedByApplicantToJson()
                    el = wrs[i]
                    wrs.splice(i, 1)
                    global_stats_wr_opened--
                    saveWrsToJson(wrs)
                    saveStatsToJson(global_stats_wr_created, global_stats_wr_closed, global_stats_wr_opened)
                    return await done(null, result = {success: true, data : [el]})
                }
            } //si pas trouvé y'a un problème
            return await done(null, result = {success: false, msg : `wr not found`})
        } else {
            //si pas d'id spécifié y'a un problème d'ailleur ce code est unreachable
        }
    })  
    /**
     * @role : wr
     * @cmd : deleteAllWr
     * 
     * @return : success, data (les obj supprimés)
     * @description : supprime tous les wrs non closed
     * */
    seneca.add('role:wr,cmd:deleteAllWr', async function (msg, done) {
        //drop all wr not closed
        for (let i = 0; i < wrs.length; i++) { //on parcourt la liste des wrs
            if (wrs[i].state != "closed") {  //si le wr n'est pas closed on le supprime
                //on met à jour les stats
                //on supprime le wr de la liste
                //on sauvegarde les données
                global_stats_wr_deleted++
                wrs_deleted_by_applicant[wrs[i].applicant] = wrs_deleted_by_applicant[wrs[i].applicant] ? wrs_deleted_by_applicant[wrs[i].applicant] + 1 : 1
                saveWrDeletedByApplicantToJson()
                el = wrs[i]
                wrs.splice(i, 1)
                global_stats_wr_opened--
                saveWrsToJson(wrs)
                saveStatsToJson(global_stats_wr_created, global_stats_wr_closed, global_stats_wr_opened)
                console.log(wrs)
            }
        }
        return await done(null, result = {success: true, data : wrs})
    })    
    return {name : 'wr'} // nom du plugin
}

var seneca = Seneca()
seneca.use(plugWr) // enregistrement du plugin ds Seneca

seneca.listen(4000) // ecoute sur le port 3000