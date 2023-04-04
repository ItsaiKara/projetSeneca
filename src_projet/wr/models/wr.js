let wrs = [];
exports.wrObj = function wrObj(applicant, work, dc_date) {
    applicant: applicant
    work: work
    dc_date: dc_date
    state: "open"
    compl_date: ""
    id: wrs.length + 1
}

//to string
exports.toString = function () {
    return "WR: " + this.applicant + " " + this.work + " " + this.dc_date;
}

exports.add = function (wr) {
    wrs.push(wr)
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

exports.update = function (id, wr) {
    if (id) {
        //recherche de l'objet wr correspondant à l'id
        for (let i = 0; i < wrs.length; i++) {
            if (wrs[i].id == id) {
                if (wr.hasOwnProperty('work') && wrs[i].state != "closed") {
                    wrs[i].work = wr.work
                    return wrs[i]
                }
                if (wr.hasOwnProperty('state')) {
                    wrs[i].state = wr.state
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

exports.delete = function (id) {
    if (id) {
        //recherche de l'objet wr correspondant à l'id
        for (let i = 0; i < wrs.length; i++) {
            if (wrs[i].id == id) {
                //if closed don't delete
                if (wrs[i].state == "closed") {
                    return null
                }
                wrs.splice(i, 1)
                return true
            }
        }
        return null
    } else {
        return null
    }
}

