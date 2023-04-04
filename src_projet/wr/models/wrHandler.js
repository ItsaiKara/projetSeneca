// a class that will store and handle the list of WRs

// import the WR class
var wrObj = require('./wrObj').wrObj;

// build current date
function currentDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}

exports.wrHandler = function () {
    return this
}

exports.length = function () {
    return wrs.length
}

exports.add = function (applicant, work, dc_date) {
    wrObj = new wrObj(wrs.length+1, applicant, work, dc_date, "created", null)
    wrs.push(tmpWr)
    return tmpWr
}

exports.getById = function (id) {
    if (id) {
        //recherche de l'objet wr correspondant à l'id
        for (let i = 0; i < wrs.length; i++) {
            if (wrs[i].id == id) {
                return wrs[i]
            }
        }
        return null
    } else {
        return wrs
    }
}

exports.updateWr = function (id, body) {
    if (id) {
        //recherche de l'objet wr correspondant à l'id
        for (let i = 0; i < wrs.length; i++) {
            if (wrs[i].id == id) {
                if (body.hasOwnProperty('work') && wrs[i].state != "closed") {
                    wrs[i].work = body.work
                    return wrs[i]
                } 
                if (body.hasOwnProperty('state')) {
                    wrs[i].state = body.state
                    wrs[i].compl_date = currentDate()
                    return wrs[i]
                }
                return null
            }
        }
        return null
    } else {
        return null
    }
}

//get wrs
exports.getWrs = function () {
    return wrs
}
