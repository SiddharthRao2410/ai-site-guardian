require("dotenv").config();

/*
 LOGGER
*/
function logSection(title) {
    console.log("\n");
    console.log("====================================");
    console.log(title);
    console.log("====================================");
}

/*
 GLOBAL ERROR HANDLERS
*/
process.on(
    "uncaughtException",
    err => {

        console.error(
            "UNCAUGHT EXCEPTION:"
        );

        console.error(err);

    }
);

process.on(
    "unhandledRejection",
    err => {

        console.error(
            "UNHANDLED REJECTION:"
        );

        console.error(err);

    }
);

const express =
    require("express");

const cors =
    require("cors");

const fs =
    require("fs");

const path =
    require("path");

/*
 CRAWLER
*/
const {
    crawlWebsite
} = require("./crawler");

/*
 AI ANALYSIS
*/
const {
    analyzeWebsite
} = require(
    "./websiteAnalyzer"
);

/*
 LOGIN TESTING
*/
const {
    testLoginFlow
} = require("./tester");

/*
 BROKEN LINK TESTING
*/
const {
    testBrokenLinks
} = require(
    "./linkTester"
);

/*
 BUTTON TESTING
*/
const {
    testButtons
} = require(
    "./buttonTester"
);

/*
 FORM TESTING
*/
const {
    testForms
} = require(
    "./formTester"
);

/*
 CONSOLE TESTING
*/
const {
    testConsoleErrors
} = require(
    "./consoleTester"
);

/*
 ACCESSIBILITY TESTING
*/
const {
    testAccessibility
} = require(
    "./accessibilityTester"
);

/*
 PERFORMANCE TESTING
*/
const {
    testPerformance
} = require(
    "./performanceTester"
);

/*
 AI BUG REPORT
*/
const {
    generateBugReport
} = require(
    "./bugReporter"
);

/*
 PLAYWRIGHT SCRIPT GENERATOR
*/
const {
    generatePlaywrightScripts
} = require(
    "./scriptGenerator"
);

/*
 REGRESSION ANALYZER
*/
const {
    analyzeRegression
} = require(
    "./regressionAnalyzer"
);

/*
 MONITORING AGENT
*/
const {
    createMonitoringEntry
} = require(
    "./monitoringAgent"
);

/*
 FIX SUGGESTION ENGINE
*/
const {
    generateFixSuggestions
} = require(
    "./fixSuggestionEngine"
);

const app =
    express();

/*
 MIDDLEWARE
*/
app.use(cors());

app.use(express.json());

/*
 ROOT ROUTE
*/
app.get("/", (req, res) => {

    res.send(
        "Backend is working"
    );

});

/*
 GET REPORT HISTORY
*/
app.get(
    "/reports",
    (req, res) => {

        try {

            const reportsDir =
                path.join(
                    __dirname,
                    "reports"
                );

            if (
                !fs.existsSync(
                    reportsDir
                )
            ) {
                return res.json([]);
            }

            const files =
                fs.readdirSync(
                    reportsDir
                );

            const reportFiles =
                files.filter(
                    file =>
                        file.endsWith(".json") &&
                        file !== "latest-report.json" &&
                        file !== "monitoring-log.json"
                );

            const reports =
                reportFiles.map(
                    file => {
                        const raw =
                            fs.readFileSync(
                                path.join(
                                    reportsDir,
                                    file
                                ),
                                "utf-8"
                            );
                        return JSON.parse(raw);
                    }
                );

            reports.sort(
                (a, b) =>
                    new Date(b.timestamp) -
                    new Date(a.timestamp)
            );

            res.json(reports);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                error: "Failed to load reports"
            });

        }

    }
);

/*
 GET SINGLE REPORT
*/
app.get(
    "/reports/:id",
    (req, res) => {

        try {

            const { id } =
                req.params;

            const reportPath =
                path.join(
                    __dirname,
                    "reports",
                    `${id}.json`
                );

            if (
                !fs.existsSync(
                    reportPath
                )
            ) {
                return res
                    .status(404)
                    .json({
                        error: "Report not found"
                    });
            }

            const raw =
                fs.readFileSync(
                    reportPath,
                    "utf-8"
                );

            const report =
                JSON.parse(raw);

            res.json(report);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                error: "Failed to load report"
            });

        }

    }
);

/*
 MAIN ANALYZE ROUTE
*/
app.post(
    "/analyze",
    async (req, res) => {

        try {

            /*
             URL
            */
            const { url } =
                req.body;

            logSection("NEW SCAN STARTED");
            console.log(`URL: ${url}`);

            if (!url) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        error:
                            "URL is required"

                    });

            }

            /*
             WEBSITE CRAWL
            */
            logSection("WEBSITE CRAWL");
            console.time("Crawl");

            const data =
                await crawlWebsite(
                    url
                );

            console.timeEnd("Crawl");
            console.log(`Pages discovered: ${data?.pages?.length || 0}`);

            /*
             AI ANALYSIS
            */
            logSection("AI WEBSITE ANALYSIS");
            console.time("AI Analysis");

            const aiAnalysis =
                await analyzeWebsite(
                    data
                ) || {};

            console.timeEnd("AI Analysis");

            /*
             BROKEN LINK TESTING
            */
            logSection("BROKEN LINK TESTING");
            console.time("Broken Links");

            const brokenLinkResults =
                await testBrokenLinks(
                    data?.pages || []
                );

            console.timeEnd("Broken Links");
            console.log(`Links tested: ${brokenLinkResults?.length || 0}`);

            /*
             BUTTON TESTING
            */
            logSection("BUTTON TESTING");
            console.time("Buttons");

            const buttonTestResults =
                await testButtons(
                    data?.pages || []
                );

            console.timeEnd("Buttons");
            console.log(`Buttons tested: ${buttonTestResults?.length || 0}`);

            /*
             FORM TESTING
            */
            logSection("FORM TESTING");
            console.time("Forms");

            const formTestResults =
                await testForms(
                    data?.pages || []
                );

            console.timeEnd("Forms");
            console.log(`Forms tested: ${formTestResults?.length || 0}`);

            /*
             CONSOLE TESTING
            */
            logSection("CONSOLE ERROR TESTING");
            console.time("Console");

            const consoleTestResults =
                await testConsoleErrors(
                    data?.pages || []
                );

            console.timeEnd("Console");

            /*
             ACCESSIBILITY TESTING
            */
            logSection("ACCESSIBILITY TESTING");
            console.time("Accessibility");

            const accessibilityResults =
                await testAccessibility(
                    data?.pages || []
                );

            console.timeEnd("Accessibility");
            console.log(`Accessibility reports: ${accessibilityResults?.length || 0}`);

            /*
             PERFORMANCE TESTING
            */
            logSection("PERFORMANCE TESTING");
            console.time("Performance");

            const performanceResults =
                await testPerformance(
                    data?.pages || []
                );

            console.timeEnd("Performance");
            console.log(`Performance reports: ${performanceResults?.length || 0}`);

            /*
             LOGIN TESTING
            */
            let loginTestResults =
                null;

            const loginPage =
                (
                    aiAnalysis
                        ?.importantPages || []
                ).find(
                    page =>

                        page?.type
                            ?.toLowerCase()
                            ?.includes(
                                "login"
                            )
                );

            logSection("LOGIN TESTING");

            if (loginPage) {

                console.log(`Login page detected: ${loginPage.url}`);
                console.time("Login");

                loginTestResults =
                    await testLoginFlow(
                        loginPage.url
                    );

                console.timeEnd("Login");

            } else {

                console.log("No login page found");

            }

            /*
             AI BUG REPORT
            */
            logSection("AI BUG REPORT");
            console.time("Bug Report");

            const aiBugReport =
                await generateBugReport({

                    aiAnalysis,

                    brokenLinkResults,

                    buttonTestResults,

                    formTestResults,

                    consoleTestResults,

                    accessibilityResults,

                    performanceResults,

                    loginTestResults

                });

            console.timeEnd("Bug Report");
            console.log(`Critical issues: ${aiBugReport?.criticalIssues?.length || 0}`);
            console.log("AI Summary:");
            console.log(aiBugReport?.summary);

            /*
             AI FIX SUGGESTIONS
            */
            logSection("AI FIX SUGGESTIONS");
            console.time("Fix Suggestions");

            const aiFixSuggestions =
                await generateFixSuggestions({

                    aiBugReport,

                    brokenLinkResults,

                    buttonTestResults,

                    formTestResults,

                    consoleTestResults,

                    accessibilityResults,

                    performanceResults

                });

            console.timeEnd("Fix Suggestions");
            console.log(`Fix suggestions: ${aiFixSuggestions?.fixSuggestions?.length || 0}`);
            console.log("First AI Fix Suggestion:");
            console.log(aiFixSuggestions?.fixSuggestions?.[0]);

            /*
             PLAYWRIGHT SCRIPT GENERATION
            */
            logSection("PLAYWRIGHT SCRIPT GENERATION");
            console.time("Script Gen");

            const generatedScripts =
                await generatePlaywrightScripts({

                    aiAnalysis,

                    loginTestResults,

                    brokenLinkResults,

                    buttonTestResults,

                    formTestResults,

                    consoleTestResults,

                    accessibilityResults,

                    performanceResults,

                    aiBugReport

                });

            console.timeEnd("Script Gen");

            /*
             CURRENT REPORT
            */
            const currentReport = {

                aiAnalysis,

                loginTestResults,

                brokenLinkResults,

                buttonTestResults,

                formTestResults,

                consoleTestResults,

                accessibilityResults,

                performanceResults,

                aiBugReport

            };

            /*
             REPORT PATH
            */
            const reportsDir =
                path.join(
                    __dirname,
                    "reports"
                );

            /*
             ENSURE REPORTS DIR
            */
            if (
                !fs.existsSync(
                    reportsDir
                )
            ) {

                fs.mkdirSync(
                    reportsDir
                );

            }

            const reportPath =
                path.join(

                    reportsDir,

                    "latest-report.json"

                );

            /*
             PREVIOUS REPORT
            */
            let previousReport =
                null;

            try {

                if (
                    fs.existsSync(
                        reportPath
                    )
                ) {

                    const raw =
                        fs.readFileSync(
                            reportPath,
                            "utf-8"
                        );

                    if (
                        raw &&
                        raw.trim() !== ""
                    ) {

                        previousReport =
                            JSON.parse(raw);

                    }

                }

            } catch (error) {

                console.log(
                    "Previous report corrupted. Ignoring..."
                );

            }

            /*
             REGRESSION ANALYSIS
            */
            const regressionResults =
                analyzeRegression(

                    previousReport,

                    currentReport

                );

            console.log(
                "Regression analysis completed"
            );

            /*
             REPORT ID
            */
            const reportId =
                Date.now().toString();

            /*
             MONITORING ENTRY
            */
            const monitoringEntry =
                createMonitoringEntry({

                    url,

                    performanceResults,

                    accessibilityResults,

                    regressionResults,

                    aiBugReport

                });

            console.log(`Health Score: ${monitoringEntry?.healthScore}`);

            /*
             FULL REPORT OBJECT
            */
            const fullReport = {

                id: reportId,

                timestamp:
                    new Date()
                        .toISOString(),

                url,

                healthScore:
                    monitoringEntry
                        ?.healthScore || 0,

                aiAnalysis,

                loginTestResults,

                brokenLinkResults,

                buttonTestResults,

                formTestResults,

                consoleTestResults,

                accessibilityResults,

                performanceResults,

                aiBugReport,

                aiFixSuggestions,

                generatedScripts,

                regressionResults,

                monitoringEntry

            };

            /*
             SAVE LATEST REPORT
            */
            fs.writeFileSync(

                reportPath,

                JSON.stringify(
                    fullReport,
                    null,
                    2
                )

            );

            /*
             SAVE HISTORICAL REPORT
            */
            const historicalPath =
                path.join(

                    reportsDir,

                    `${reportId}.json`

                );

            fs.writeFileSync(

                historicalPath,

                JSON.stringify(
                    fullReport,
                    null,
                    2
                )

            );

            console.log(
                "Report saved locally"
            );

            logSection("SCAN COMPLETED");
            console.log(`Report saved: ${historicalPath}`);

            /*
             FINAL RESPONSE
            */
            res.json({

                success: true,

                data,

                aiAnalysis,

                loginTestResults,

                brokenLinkResults,

                buttonTestResults,

                formTestResults,

                consoleTestResults,

                accessibilityResults,

                performanceResults,

                aiBugReport,

                generatedScripts,

                regressionResults,

                monitoringEntry,

                aiFixSuggestions

            });

        } catch (error) {

            logSection("SCAN FAILED");

            console.error(error);

            res.status(500).json({

                success: false,

                error:
                    error.message

            });

        }

    }
);

/*
 START SERVER
*/
const PORT = 8000;

const server = app.listen(
    PORT,
    () => {

        console.log(
            `Backend running on port ${PORT}`
        );

    }
);

server.on("error", (err) => {

    if (err.code === "EADDRINUSE") {

        console.error(
            `\n\nERROR: Port ${PORT} is already in use!`
        );

        console.error(
            "Run: lsof -ti :8000 | xargs kill -9"
        );

        process.exit(1);

    } else {

        console.error("Server error:", err);

        process.exit(1);

    }

});