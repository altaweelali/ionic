function $projects() {

    this.authorizedProjects = [];
    this.projectList = [];

}

$projects.prototype.getProjectList = function () { }

$projects.prototype.getAuhorizedProjectList = function () {

    var uids = _.map(this.authorizedProjects, function (o) {
        return o.Id;
    })

    return uids;
}