
function $model(data) {

    this.data = data;
    this.facts = [];
    this.measures = [];
    this.time = [];
    this.customFields = [];
    this.risks = [];
    this.issues = [];
    this.tasks = [];
    this.tasksTimephased = [];
    this.team = [];
    this.teamAssignments = [];
}


// Core functions

$model.prototype.clearProjectData = function () {
    // only clear the project related data and leave the common data
    this.data = [];
    this.risks = [];
    this.issues = [];
    this.tasks = [];
    this.tasksTimephased = [];
    this.team = [];
    this.teamAssignments = [];
    
}
$model.prototype.sumBy = function (fact, measure) {

    var groups = _(this.data).groupBy(fact);

    var out = [];


    _(groups).map(function (g, key) {

        var el = {};
        el[fact] = key;
        $.each(measure, function (i, r) {

            el[r] = _(g).reduce(function (m, x) {
                return m + parseInt(x[r]);
            }, 0);

        })

        out.push(el)

    });



    return out;

}

$model.prototype.countBy = function (fact, measure) {

    var groups = _(this.data).groupBy(fact);

    var out = [];


    _(groups).map(function (g, key) {

        var el = {};
        el[fact] = key;
        $.each(measure, function (i, r) {

            el[r] = _(g).reduce(function (m, x) {
                return m + 1;
            }, 0);

        })

        out.push(el)

    });



    return out;

}

$model.prototype.avgOf = function (measure) {


    var measureArr = _(this.data).map(function (obj, inx) {

        return parseInt(obj[measure]);

    })

    var measureSum = _(measureArr).reduce(function (mem, num) {

        return mem + num;

    })

    var avg = measureSum / measureArr.length;
    avg = avg.toFixed(2);
    return avg;

}

$model.prototype.maxOf = function (measure) {

    var measureArr = _(this.data).map(function (obj, inx) {

        return parseInt(obj[measure]);

    })
    var max = _(measureArr).max();

    return max;

}

$model.prototype.minOf = function (measure) {

    var measureArr = _(this.data).map(function (obj, inx) {

        return parseInt(obj[measure]);

    })
    var min = _(measureArr).min();

    return min;

}

$model.prototype.uniq = function (fact) {

    var valueArr = _(this.data).map(function (obj, key) {
        return obj[fact];
    })

    valueArr = _(valueArr).reject(function (o) {
        return o == null;

    })
    var uniq = _(valueArr).uniq();

    return uniq;

}

$model.prototype.formatDate = function (date) {

    var _date = new moment(date);
    return _date.format('MM/DD/YYYY');
}

// Dashboard Specific Functions

$model.prototype.getProjectInformation = function () {

    var o = this.data[0];

  

        return {

            ProjectName: o.ProjectName,
            ProjectOwner: o.ProjectOwnerName,
            ProjectStartDate: this.formatDate(o.ProjectStartDate),
            ProjectFinishDate: this.formatDate(o.ProjectFinishDate),
            ProjectStatusDate: this.formatDate(o.ProjectStatusDate),
            ProjectModifiedDate: this.formatDate(o.ProjectModifiedDate),
            ProjectCalendarDuration: o.ProjectCalendarDuration,
            EnterpriseProjectTypeName: o.EnterpriseProjectTypeName

            
        }


}

$model.prototype.getProjectKpi = function () {



    var durationVariance = parseInt(this.data[0].ProjectDurationVariance) || 0;
    var duration = parseInt(this.data[0].ProjectDuration) || 0 ;
    var costVariance = parseInt(this.data[0].ProjectCostVariance) || 0;
    var cost = parseInt(this.data[0].ProjectCost) || 0;
    var risksCount;
    var health;

    var ProjectKpi = {

        Schedule: { status: 'UNKNOWN', class: 'c-kpi-value-gray', icon: 'fa fa-exclamation-circle', title: 'Schedule' },
        Cost: { status: 'UNKNOWN', class: 'c-kpi-value-gray', icon: 'fa fa-exclamation-circle', title: 'Cost' },
        Health: { status: 'UNKNOWN', class: 'c-kpi-value-gray', icon: 'fa fa-exclamation-circle', title: 'Health' },
        Risk: { status: 'UNKNOWN', class: 'c-kpi-value-gray', icon: 'fa fa-exclamation-circle', title: 'Risk' }

    }


    // Schedule KPI

    var durationThreshold   = durationVariance / duration * 100;
 

  

    if (durationThreshold <= 0) {

        ProjectKpi.Schedule.class = 'c-kpi-value-green';
        ProjectKpi.Schedule.icon = 'fa fa-check-circle';
        ProjectKpi.Schedule.status = 'GREEN';
        
    } else if (durationThreshold > 0 && durationThreshold <= 10) {

        ProjectKpi.Schedule.class = 'c-kpi-value-yellow';
        ProjectKpi.Schedule.icon = 'fa fa-exclamation-triangle';
        ProjectKpi.Schedule.status = 'YELLOW';

    } else if (durationThreshold > 10 && durationThreshold < 100) {

        ProjectKpi.Schedule.class = 'c-kpi-value-red';
        ProjectKpi.Schedule.icon = 'fa fa-minus-circle';
        ProjectKpi.Schedule.status = 'RED';

    } else {

        ProjectKpi.Schedule.class = 'c-kpi-value-gray';
        ProjectKpi.Schedule.icon = 'fa fa-exclamation-circle';
        ProjectKpi.Schedule.status = 'UNKNOWN';

    }


    //Cost KPI

    var costThreshold = costVariance / cost * 100;

    if (costThreshold <= 0) {

        ProjectKpi.Cost.class = 'c-kpi-value-green';
        ProjectKpi.Cost.icon = 'fa fa-check-circle';
        ProjectKpi.Cost.status = 'GREEN';

    } else if (costThreshold > 0 && costThreshold <= 10) {

        ProjectKpi.Cost.class = 'c-kpi-value-yellow';
        ProjectKpi.Cost.icon = 'fa fa-exclamation-triangle';
        ProjectKpi.Cost.status = 'YELLOW';

    } else if (costThreshold > 10 && costThreshold < 100) {

        ProjectKpi.Cost.class = 'c-kpi-value-red';
        ProjectKpi.Cost.icon = 'fa fa-minus-circle';
        ProjectKpi.Cost.status = 'RED';

    } else {

        ProjectKpi.Cost.class = 'c-kpi-value-gray';
        ProjectKpi.Cost.icon = 'fa fa-exclamation-circle';
        ProjectKpi.Cost.status = 'UNKNOWN';
    }

    //Health KPI

    //Risk KPI








    return ProjectKpi;



}

$model.prototype.getProjectSummaryTaskID = function () {

    var tasks = this.tasks;

    var summarytaskObject = _.find(tasks, function (o) {
        return o.TaskIsProjectSummary == true;
    })

    var taskID = summarytaskObject.TaskId;
return taskID
}