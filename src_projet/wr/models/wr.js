let wrs = [];
exports.wr = function wr(applicant, work, dc_date) {
    applicant: applicant
    work: work
    dc_date: dc_date
}

//to string
exports.toString = function () {
    return "WR: " + this.applicant + " " + this.work + " " + this.dc_date;
}

