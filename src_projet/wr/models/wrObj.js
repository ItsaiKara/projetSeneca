exports.wrObj = function wrObj(applicant, work, dc_date, state, compl_date) {
    applicant: applicant
    work: work
    dc_date: dc_date
    state: state
    compl_date: compl_date
    return 
}

//to string
exports.toString = function () {
    return "WR: " + this.applicant + " " + this.work + " " + this.dc_date;
}

//getters
exports.getApplicant = function () {
    return this.applicant;
}
exports.getWork = function () {
    return this.work;
}
exports.getDc_date = function () {
    return this.dc_date;
}
exports.getState = function () {
    return this.state;
}
exports.getCompl_date = function () {
    return this.compl_date;
}
exports.getId = function () {
    return this.id;
}

//setters
exports.setApplicant = function (applicant) {
    this.applicant = applicant;
}
exports.setWork = function (work) {
    this.work = work;
}
exports.setDc_date = function (dc_date) {
    this.dc_date = dc_date;
}
exports.setState = function (state) {
    this.state = state;
}
exports.setCompl_date = function (compl_date) {
    this.compl_date = compl_date;
}
exports.setId = function (id) {
    this.id = id;
}
