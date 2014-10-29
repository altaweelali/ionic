function $projects() {

    this.authorizedProjects = [];
    this.projectList = [];

}

$projects.prototype.getProjectList = function () {

    var that = this;
    var colors = [

        '#85D6FF', '#9999FF', '#C285FF', '#80E680', '#FFB84D', '#FF70B8', '#6685E0', '#4DB8B8', '#E06666'
    ];

    var projects = _.map(this.projectList, function (o) {

        var startDate = that.formatDate(o.ProjectStartDate);
        var finishDate = that.formatDate(o.ProjectFinishDate); 
        var color = { 'background-color': colors[_.random(0,colors.length -1)] }
        var initial = o.ProjectName;

        initial = initial.substring(0,1)
        var cost = numeral(parseFloat(o.ProjectCost)).format('($0.00 a)');

        return {
            Name: o.ProjectName,
            Initial: initial,
            Start: startDate,
            Finish: finishDate,
            PercentComplete: o.ProjectPercentCompleted,
            Color: color,
            Owner: o.ProjectOwnerName,
            Cost: cost
        }
    })
    return projects;

}

$projects.prototype.getAuhorizedProjectList = function () {

    var uids = _.map(this.authorizedProjects, function (o) {
        return o.Id;
    })

    return uids;
}

$projects.prototype.formatDate = function (date) {

    var _date = new moment(date);
    return _date.format('MM/DD/YY');
}
