/// <reference path="c:\project insight\sp app with breeze\spa with angular\spa with angular\scripts\moment.js" />
/// <reference path="c:\project insight\sp app with breeze\spa with angular\spa with angular\scripts\numeral.min.js" />
function $model(data) {

    this.data = data;
    this.baseline = [{
        ProjectBaselineBudgetCost: 0,
        ProjectBaselineBudgetWork: 0,
        ProjectBaselineCost: 0,
        ProjectBaselineDuration: 0,
        ProjectBaselineFinishDate: null,
        ProjectBaselineFixedCost: 0,
        ProjectBaselineStartDate: null,
        ProjectBaselineWork: 0
    }];
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
    this.baseline = [{
        ProjectBaselineBudgetCost: 0,
        ProjectBaselineBudgetWork: 0,
        ProjectBaselineCost: 0,
        ProjectBaselineDuration: 0,
        ProjectBaselineFinishDate: null,
        ProjectBaselineFixedCost: 0,
        ProjectBaselineStartDate: null,
        ProjectBaselineWork: 0
    }];
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

$model.prototype.countBy = function (data, fact, measure) {

    var groups = _(data).groupBy(fact);

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

$model.prototype.fixUtcDate = function (date) {

    var newDate = parseInt(date.match(/\/Date\(([0-9]+)(?:.*)\)\//)[1])
    return newDate;
};

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
        ProjectCalendarDuration: parseInt(o.ProjectCalendarDuration / 24),
        ProjectRemainingDuration: parseInt(o.ProjectRemainingDuration / 24),
        EnterpriseProjectTypeName: o.EnterpriseProjectTypeName,
        ProjectPercentCompleted: parseInt(o.ProjectPercentCompleted),
        ProjectPercentWorkCompleted: parseInt(o.ProjectPercentWorkCompleted),
        ProjectWork: parseInt(o.ProjectWork),
        ProjectActualWork: parseInt(o.ProjectActualWork)



    }


}

$model.prototype.getProjectKpi = function () {



    var durationVariance = parseInt(this.data[0].ProjectDurationVariance) || 0;
    var duration = parseInt(this.data[0].ProjectDuration) || 0;
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

    var durationThreshold = durationVariance / duration * 100;




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

$model.prototype.getWorkScurveData = function () {

    var data = this.tasksTimephased;
    var that = this;
    // clean the data 

    var cumulativeWork = 0;
    var planned = _.map(data, function (o) {
        var date = o.TimeByDay;
        date = that.fixUtcDate(date)
        var plannedWork = parseInt(o.TaskWork);
        cumulativeWork = cumulativeWork + plannedWork;


        return [date, cumulativeWork];

    });

    var cumulativeActualWork = 0;
    var actual = _.map(data, function (o) {
        var date = o.TimeByDay;
        date = that.fixUtcDate(date)
        var actualWork = parseInt(o.TaskActualWork);
        cumulativeActualWork = cumulativeActualWork + actualWork;
        return [date, cumulativeActualWork];

    })



    var plannedSeries = {

        name: 'Planned Work',
        color: '#0489B1',
        data: planned

    };

    var actualSeries = {
        name: 'Actual Work',
        color: '#B40404',
        data: actual
    }

    var chartData = [];

    chartData.push(plannedSeries, actualSeries)

    return chartData;
}
$model.prototype.getCostScurveData = function () {

    var data = this.tasksTimephased;
    var that = this;
    // clean the data 

    var cumulativeCost = 0;
    var planned = _.map(data, function (o) {
        var date = o.TimeByDay;
        date = that.fixUtcDate(date)
        var plannedCost = parseInt(o.TaskCost);
        cumulativeCost = cumulativeCost + plannedCost;


        return [date, cumulativeCost];

    });

    var cumulativeActualCost = 0;
    var actual = _.map(data, function (o) {
        var date = o.TimeByDay;
        date = that.fixUtcDate(date)
        var actualCost = parseInt(o.TaskActualCost);
        cumulativeActualCost = cumulativeActualCost + actualCost;
        return [date, cumulativeActualCost];

    })



    var plannedSeries = {

        name: 'Planned Cost',
        color: '#7401DF',
        data: planned

    };

    var actualSeries = {
        name: 'Actual Cost',
        color: '#B4045F',
        data: actual
    }

    var chartData = [];

    chartData.push(plannedSeries, actualSeries)

    return chartData;
}

$model.prototype.getProjectCostInformation = function () {

    var that = this;

    var projectCostInformation = _.map(this.data, function (o) {

        var projectCost = parseFloat(o.ProjectCost);
        var projectActualCost = parseFloat(o.ProjectActualCost);
        var projectBaselineCost = parseFloat(that.baseline[0].ProjectBaselineCost || 0);
        var projectCostStr = numeral(parseFloat(o.ProjectCost)).format('($ 0.00 a)');
        var projectActualCostStr = numeral(parseFloat(o.ProjectActualCost)).format('($ 0.00 a)');
        var projectCostVariance = parseFloat(o.ProjectCostVariance);
        var projectPercentUsed = projectActualCost / projectCost * 100 || 0;

        projectPercentUsed = Math.round(projectPercentUsed);

        var cost = projectCost || 100;
        var midVal = cost * 0.75;
        var nearFarVal = cost * 0.85;
        var endVal = cost;
        var interval = cost * 0.25;

        return {

            ProjectCost: projectCost,
            ProjectActualCost: projectActualCost,
            ProjectBaselineCost: projectBaselineCost,
            ProjectCostStr: projectCostStr,
            ProjectActualCostStr: projectActualCostStr,
            ProjectCostVariance: projectCostVariance,
            ProjectPercentUsed: projectPercentUsed,
            MidVal: midVal,
            NearFarVal: nearFarVal,
            EndVal: endVal,
            Interval: interval

        }


    })
    return projectCostInformation[0];
}

$model.prototype.getPerformanceIndexes = function () {

    var indexes = _.map(this.data, function (o) {

        return {

            ProjectCPI: parseFloat(o.ProjectCPI || 0),
            ProjectSPI: parseFloat(o.ProjectSPI || 0)
        }
    })

    return indexes[0];
}

$model.prototype.getMilestones = function () {

    var tasks = this.tasks;
    var that = this;


    var tasksArray = _.filter(tasks, function (o) {
        return o.TaskIsMilestone == true;
    });


    var milestones = _.map(tasksArray, function (o) {

        var finishDate = that.formatDate(o.TaskFinishDate);

        var actualFinish = null;
        if (o.TaskActualFinishDate) {

            actualFinish = that.formatDate(o.TaskActualFinishDate);
        }

        var status = milestoneStatus(finishDate, actualFinish);

        return [

            o.TaskName,
            finishDate,
            o.TaskIsCritical,
            parseInt(o.TaskPercentCompleted),
            status,
            o.TaskIsCritical


        ]
    })

    function milestoneStatus(finishDate, actualFinish) {

        var today = new Date();

        var finish = new Date(finishDate);
        var actual = null;
        if (actualFinish) {
            actual = new Date(actualFinish)
        }

        if (finish < today && actual == null) {
            return 'Late'
        } else if (finish > today && actual == null) {

            return 'Future'

        } else if (actual) {

            return 'Complete'

        }
    }

    return milestones;

}

$model.prototype.getTeam = function () {


    var groups = _(this.teamAssignments).groupBy('ResourceName');

    var out = _(groups).map(function (g, key) {
        return {
            ResourceName: key,
            Assignments: _(g).reduce(function (m, x) {
                return m + 1;
            }, 0),
            Work: _(g).reduce(function (m, x) {
                return m + parseInt(x.AssignmentWork);
            }, 0),
            ActualWork: _(g).reduce(function (m, x) {
                return m + parseInt(x.AssignmentActualWork);
            }, 0)
        };
    });

    var teamData = _.map(out, function (o) {
        return [
            o.ResourceName,
            o.Assignments,
            o.Work,
            o.ActualWork

        ]
    })

    return teamData;
}

$model.prototype.getProjectCustomFields = function () {

    var that = this;
    var customFields = _.filter(that.customFields, function (o) {
        return o.Type == 'Project'

    })

    customFields = _.map(customFields, function (o) {

        return {

            Name: o.Name,
            ODataName: o.ODataName,
            FieldType: o.FieldType

        }

    })


    customFields = _.map(customFields, function (o) {

        var projectFiledVal = _.pluck(that.data, o.ODataName)

        // return array for the datatable 
        return [

           o.Name,
            formatFileds(o.FieldType, projectFiledVal[0])

        ]

    })

    function formatFileds(type, val) {
        if (val == null) {
            return '-'
        }
        switch (type) {
            // COST 
            case 9:
                return numeral(parseFloat(val)).format('($ 0.00 a)');
                break;
                // Date 
            case 4:
                return that.formatDate(val);
                break;

                // Number 
            case 15:
                return parseInt(val)
                break;
                // Duration 
            case 6:
                return parseInt(val)
                break;

                // Flag 
            case 17:
                return val == true ? "YES" : "NO"
                break;
            default:
                return val;

        }
    }

    return customFields;
}