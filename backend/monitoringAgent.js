const fs =
    require("fs");

const path =
    require("path");

/*
 MONITORING STORAGE
*/
const monitoringPath =
    path.join(
        __dirname,
        "reports",
        "monitoring-log.json"
    );

/*
 LOAD MONITORING LOG
*/
function loadMonitoringLog() {

    if (
        fs.existsSync(
            monitoringPath
        )
    ) {

        return JSON.parse(
            fs.readFileSync(
                monitoringPath,
                "utf-8"
            )
        );

    }

    return [];

}

/*
 SAVE MONITORING LOG
*/
function saveMonitoringLog(
    logs
) {

    fs.writeFileSync(

        monitoringPath,

        JSON.stringify(
            logs,
            null,
            2
        )

    );

}

/*
 CREATE MONITORING ENTRY
*/
function createMonitoringEntry({

    url,

    performanceResults,

    accessibilityResults,

    regressionResults,

    aiBugReport

}) {

    const logs =
        loadMonitoringLog();

    /*
     CALCULATE HEALTH SCORE
    */
    let healthScore = 100;

    /*
     REGRESSION PENALTY
    */
    healthScore -=
        (regressionResults
            ?.length || 0) * 5;

    /*
     ACCESSIBILITY PENALTY
    */
    accessibilityResults
        ?.forEach(result => {

            healthScore -=
                result.imagesWithoutAlt || 0;

            healthScore -=
                result.unlabeledInputs || 0;

        });

    /*
     PERFORMANCE PENALTY
    */
    performanceResults
        ?.forEach(result => {

            if (
                result.performanceRating ===
                "poor"
            ) {

                healthScore -= 10;

            }

        });

    /*
     LIMIT SCORE
    */
    if (healthScore < 0) {

        healthScore = 0;

    }

    /*
     CREATE ENTRY
    */
    const entry = {

        timestamp:
            new Date()
                .toISOString(),

        url,

        healthScore,

        regressionCount:
            regressionResults
                ?.length || 0,

        summary:
            aiBugReport
                ?.summary || "",

        criticalIssues:
            aiBugReport
                ?.criticalIssues
                ?.length || 0

    };

    /*
     SAVE
    */
    logs.push(entry);

    saveMonitoringLog(logs);

    return entry;

}

module.exports = {
    createMonitoringEntry
};