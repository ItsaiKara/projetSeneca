const Seneca = require('seneca')
const SenecaWeb = require('seneca-web')
const fs = require('fs');
const { application } = require('express');

//function to read stats from file
function readStatsFromFile() {
  const rawData = fs.readFileSync('stats.json');
  const stats = JSON.parse(rawData);
  return stats;
}

//function to read wrs from file
function readWrsFromFile() {
  const rawData = fs.readFileSync('wrs.json');
  const wrs = JSON.parse(rawData);
  return wrs;
}

//read the number of wrs deleted by applicant from file
function readWrDeletedByApplicantFromFile() {
	  const rawData = fs.readFileSync('stat_del.json');
	  const wrs_deleted_by_applicant = JSON.parse(rawData);
	  return wrs_deleted_by_applicant;
}

//get number of deleted wrs from this applicant
function getNbWrDeletedByApplicant(applicant) {
	let wrs_deleted_by_applicant = readWrDeletedByApplicantFromFile()
	let nb_wr_deleted = 0
	if (wrs_deleted_by_applicant[applicant]) {
		nb_wr_deleted = wrs_deleted_by_applicant[applicant]
	}
	return nb_wr_deleted
}


// definition d'un plugin (constituant ici le microservice)
var plugStatWr = function (options) {
    var seneca = 
	/**
	 * @role stats
	 * @cmd getWrStats
	 * @param applicant optional
	 * @return {Object} - Statistiques + message de succès
	 * @description get stats for all wrs or for wrs from a specific applicant
	 * */
    seneca.add('role:stats,cmd:getWrStats', async (msg, respond) => {
		//l'applicant est optionnel
		let l_applicant = msg.args.params.applicant
		if (l_applicant) { // si l'applicant est renseigné, on renvoie les stats pour les wrs de cet applicant
			let wrs = readWrsFromFile()
			let wrs_from_applicant = []
			// pour chaque wr, on vérifie si l'applicant correspond à l'applicant de la wr fait une liste des wrs de cet applicant
			wrs.forEach(wr => {
				if (wr.applicant == l_applicant) {
					wrs_from_applicant.push(wr)
				}
			})
			// le nombre de wrs supprimées par cet applicant est dans le fichier stat_del.json
			let wrs_deleted = 0
			
			//stats  pour cet applicant : nombre de wrs créées, nombre de wrs ouvertes, nombre de wrs fermées
			// créer = state + closed
			let stats = {applicant_stats_wr_created: wrs_from_applicant.length + getNbWrDeletedByApplicant(l_applicant), applicant_stats_wr_closed: 0, applicant_stats_wr_opened: 0}
			//met a jours les stats pour les wrs de cet applicant : nombre de wrs ouvertes, nombre de wrs fermées
			wrs_from_applicant.forEach(wr => {
				if (wr.state == 'closed') {
					stats.applicant_stats_wr_closed++
				} else {
					stats.applicant_stats_wr_opened++
				}
			})
			await respond(null, result = { 
				data:  { 
					stats_wr_created : stats.applicant_stats_wr_created,
					stats_wr_closed : stats.applicant_stats_wr_closed,
					stats_wr_opened : stats.applicant_stats_wr_opened,
					applicant : l_applicant 
				}, success: true})
		} else {
			let stats = readStatsFromFile()
			let data = {global_stats_wr_created: stats.global_stats_wr_created, global_stats_wr_closed: stats.global_stats_wr_closed, global_stats_wr_opened: stats.global_stats_wr_opened}
			await respond(null, {data: data, success: true})
		}
    })

    return {name : 'stats'} // nom du plugin
}

var seneca = Seneca()
seneca.use(plugStatWr) // enregistrement du plugin ds Seneca

seneca.listen(4001) // ecoute sur le port 3000