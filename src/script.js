let currentRoutineTable = null;

// Function to add a skill row to the current routine table
function addSkill(_name, _difficulty, _elementGroup) {
    const rowCount = currentRoutineTable.find("tr:not(.header-row)").length;
    const skillRowClass = rowCount % 2 !== 0 ? "skill-even-row" : "skill-odd-row";
    const skillId = "skill-" + Date.now();
    const newRow = $("<tr></tr>").addClass(skillRowClass).attr("id", skillId);
    newRow.append(`<td>${_name}</td>`);
    newRow.append(`<td>${_difficulty}</td>`);
    newRow.append(`<td>${_elementGroup}</td>`);
    currentRoutineTable.find(".add-row").before(newRow);
}

// Function to convert an integer to a Roman numeral
function toRomanNumeral(integer) {
    if (integer === 1) {
        return "I";
    }
    if (integer === 2) {
        return "II";
    }
    if (integer === 3) {
        return "III";
    }
    return "IV";
}

// Function to create a new skill table
function createTable(event, elementGroup) {
    var newTable = $("<table class='skill-table'></table>");
    newTable.append(
        "<tr><th colspan='3'>" +
        event +
        " -- Super Skills Chart -- GRP " +
        toRomanNumeral(elementGroup) +
        "</th></tr>"
    );
    newTable.append(
        "<tr><th>Skill</th><th>Difficulty</th><th>Element Group</th></tr>"
    );
    $("#skill-table-container").append(newTable);
    return newTable;
}

function display_score(routineTable, execution, difficulty, scoreString) {
    // Define a class name for the score row
    var scoreClass = "score-row";

    // Check if a row with the scoreClass already exists
    if (routineTable.find("tr." + scoreClass).length === 0) {
        // Find the last row in the routineTable
        var lastRow = routineTable.find("tr:last");

        // Insert the new row after the last row with the specified class and colspan 3
        lastRow.after(
            "<tr class='" +
            scoreClass +
            "'><td colspan='3'>" +
            "Difficulty: " + difficulty + "<br>" +
            "Execution: " + execution + "<br>" +
            "Start Value: " + (parseFloat(difficulty) + parseFloat(execution)) + "<br>" +
            scoreString +
            "</td></tr>"
        );
    } else {
        var sv = parseFloat(execution) + parseFloat(difficulty);

        // Update the text of the existing row with the scoreClass and set colspan 3
        routineTable
            .find("tr." + scoreClass)
            .find("td")
            .attr("colspan", "3")
            .html("Difficulty: " + difficulty + "<br>" +
            "Execution: " + execution + "<br>" +
            "Start Value: " + sv + "<br>" +
            scoreString);
    }
}


// Function to calculate score for level 1-6 routines
function calculate_NGA(routineTable, _level) {
    var skills = routineTable.find(
        "tr:not(.header-row):not(.add-row):not(.score-row)"
    ); // only the skills
    var execution = 10.0;
    var difficulty = 0.0;
    var scoreString = "";
    const elementGroups = new Set();
    let skill_names = [];
    _level = Number(_level);

    skills.each(function () {
        skill_names.push($(this).find("td").eq(0).text());
        elementGroups.add($(this).find("td").eq(2).text());

        var difficultyText = $(this).find("td").eq(1).text();
        difficulty += parseFloat(difficultyText) || 0.0; // Ensure difficultyText is parsed correctly
    });

    scoreString += "Calculating score for level " + _level + " routine.<br>";

    switch (elementGroups.size) {
        case 0:
            scoreString += "Missing 4 element groups. Routine has no value.<br>";
            break;
        case 1:
            execution -= 0.5;
            scoreString += "Missing 3 element groups. -1.5 deduction applied.<br>";
            break;
        case 2:
            execution -= 1.0;
            scoreString += "Missing 2 element groups. -1.0 deduction applied.<br>";
            break;
        case 3:
            execution -= 1.5;
            scoreString += "Missing 1 element group. -0.5 deduction applied.<br>";
            break;
        default:
            scoreString += "Element groups satisfied.<br>";
    }

    // short routine deductions
    switch (skill_names.length) {
        case 0:
            execution = 0;
            scoreString += "Short routine (-10) deduction applied.<br>";
            break;
        case 1:
            execution -= 7.0;
            scoreString += "Short routine (-7.0) deduction applied.<br>";
            break;
        case 2:
            execution -= 6.0;
            scoreString += "Short routine (-6.0) deduction applied.<br>";
            break;
        case 3:
            execution -= 5.0;
            scoreString += "Short routine (-5.0) deduction applied.<br>";
            break;
        case 4:
            execution -= 4.0;
            scoreString += "Short routine (-4.0) deduction applied.<br>";
            break;
        case 5:
            execution -= 3.0;
            scoreString += "Short routine (-3.0) deduction applied.<br>";
            break;
        default:
            scoreString += "Met minimum 6 skills requirement.<br>";
            break;
    }

    // check for missing FIG values
    switch (_level) {
        case 1:
        case 2:
        case 3:
            scoreString += "FIG requirement met.<br>";
            break;
        case 4:
            if (difficulty < 0.1) {
                execution -= 0.5;
                scoreString += "Missing FIG 'A' requirement.<br>";
            } else {
                scoreString += "FIG requirement met.<br>";
            }
            break;
        case 5:
            if (difficulty < 0.2) {
                execution -= 0.5;
                scoreString += "Missing FIG 'A' requirement.<br>";
            } else {
                scoreString += "FIG requirement met.<br>";
            }
            break;
        default:
            scoreString += "Level not supported yet! Updates coming soon..<br>";
            break;
    }

    // Ensure floating-point precision is handled correctly
    execution = parseFloat(execution.toFixed(2));
    difficulty = parseFloat(difficulty.toFixed(2));

    display_score(routineTable, execution, difficulty, scoreString);
}


// Function to calculate score based on level
function calculateScore(_event, _level, routineTable) {
    calculate_NGA(routineTable, _level);
}

// Function to create a new routine table
function createRoutineTable(level, event) {
    const tableHTML = `
                    <table class="routine-table">
                        <tr class="header-row">
                            <th colspan="3">${level} ${event} Routine</th>
                        </tr>
                        <tr class="header-row" id="subheader">
                            <th>Skills</th>
                            <th>Difficulty Value</th>
                            <th>Element Group</th>
                        </tr>
                        <tr class="add-row">
                            <td>
                                <button class="add-skill-button">Add a Skill</button>
                            </td>
                            <td>
                                <button class="delete-skill-button">Delete last skill</button>
                            </td>
                            <td>
                                <button class="calculate-score-button">Calculate score</button>
                            </td>
                        </tr>
                    </table>
                `;
    $("#routine-tables-container").append(tableHTML);
    attachEventListeners();
}

// Function to attach event listeners to buttons
function attachEventListeners() {
    $(".add-skill-button")
        .off()
        .on("click", function () {
            
            currentRoutineTable = $(this).closest("table");
            // $("#routine-tables-container").hide();
            $("#skill-table-container").show();

            const table = $(this).closest(".routine-table");
            const headerText = table.find("th").first().text();
            const event = headerText.split(" ")[2]; // Assuming the format is "Level Event Routine"
            console.log(`Add skill button clicked in event: ${event}`);
            switch (event) {
                case "FX":
                    console.log("ran");
                    $("#floor").show();
                    $("#pommel").hide();
                    $("#mushroom").hide();
                    $("#rings").hide();
                    $("#vault").hide();
                    $("#pbars").hide();
                    $("#highbar").hide();
                    break;
                case "PH":
                    $("#floor").hide();
                    $("#pommel").show();
                    $("#mushroom").hide();
                    $("#rings").hide();
                    $("#vault").hide();
                    $("#pbars").hide();
                    $("#highbar").hide();
                    break;
                case "mushroom":
                    $("#floor").hide();
                    $("#pommel").hide();
                    $("#mushroom").show();
                    $("#rings").hide();
                    $("#vault").hide();
                    $("#pbars").hide();
                    $("#highbar").hide();
                    break;
                case "SR":
                    $("#floor").hide();
                    $("#pommel").hide();
                    $("#mushroom").hide();
                    $("#rings").show();
                    $("#vault").hide();
                    $("#pbars").hide();
                    $("#highbar").hide();
                    break;
                case "VT":
                    $("#floor").hide();
                    $("#pommel").hide();
                    $("#mushroom").hide();
                    $("#rings").hide();
                    $("#vault").show();
                    $("#pbars").hide();
                    $("#highbar").hide();
                    break;
                case "PB":
                    $("#floor").hide();
                    $("#pommel").hide();
                    $("#mushroom").hide();
                    $("#rings").hide();
                    $("#vault").hide();
                    $("#pbars").show();
                    $("#highbar").hide();
                    break;
                case "HB":
                    $("#floor").hide();
                    $("#pommel").hide();
                    $("#mushroom").hide();
                    $("#rings").hide();
                    $("#vault").hide();
                    $("#pbars").hide();
                    $("#highbar").show();
                    break;
                default:
                    break;
            }
            $("#skill-box").show();
            $(".item").css("flex", "1");
        });
        $('#close-button').click(function(){
            $("#skill-box").hide();
            $("#floor").hide();
            $("#mushroom").hide();
            $("#pommel").hide();
            $("#rings").hide();
            $("#vault").hide();
            $("#pbars").hide();
            $("#highbar").hide();
            $("#item-1").css("flex", "0 0 90%");
        });

    $(".delete-skill-button")
        .off()
        .on("click", function () {
            var rowCount = $(this)
                .closest("table")
                .find("tr:not(.header-row):not(.score-row)").length;
            if (rowCount >= 2) {
                $(this)
                    .closest("table")
                    .find("tr:not(.header-row)")
                    .eq(rowCount - 2)
                    .remove();
            } else {
                console.log("No row to delete");
            }
        });

    $(".calculate-score-button")
        .off()
        .on("click", function () {
            var headerText = $(this)
                .closest("table")
                .find(".header-row:first-child th")
                .text();
            var parts = headerText.split(" ");
            var level = parts[1];
            var event = parts[2];
            var routineTable = $(this).closest("table");
            calculateScore(event, level, routineTable);
        });

    $(document)
        .off("click", ".skill-entry")
        .on("click", ".skill-entry", function () {
            const skillName = $(this).find("td").eq(0).text();
            const skillDifficulty = $(this).find("td").eq(1).text();
            const skillElementGroup = $(this).find("td").eq(2).text();
            addSkill(skillName, skillDifficulty, skillElementGroup);
            // $("#skill-table-container").hide();
            $("#routine-tables-container").show();
            

            

        });
}

// Function to reset button colors
function resetButtonColors() {
    $(".level-button").removeClass("active");
    $(".event-button").removeClass("active");
    selectedLevel = null;
    selectedEvent = null;
    $("#submit-routine-request").hide();
}

$(document).ready(function () {
    console.log("JQuery loaded");

    // Event listener for CSV file input
    $("#csvFileInput").on("change", function (event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var csvData = e.target.result;
                parseCSV(csvData);
            };
            reader.readAsText(file);
        }
    });

    // Event listener for add routine button
    $("#add-routine-button").on("click", function () {
        $("#routine-tables-container").hide();
        $("#add-routine-table-container").show();
    });

    let selectedLevel = null;
    let selectedEvent = null;

    // Function to update the submit button text
    function updateSubmitButton() {
        if (selectedLevel && selectedEvent) {
            $("#submit-routine-request").text(
                `Create Level ${selectedLevel} ${selectedEvent} routine table`
            );
            $("#submit-routine-request").show();
        }
    }

    // Event listener for level buttons
    $(".level-button").click(function () {
        $(".level-button").removeClass("active");
        $(this).addClass("active");
        selectedLevel = $(this).text();
        updateSubmitButton();
    });

    // Event listener for event buttons
    $(".event-button").click(function () {
        $(".event-button").removeClass("active");
        $(this).addClass("active");
        selectedEvent = $(this).text();
        updateSubmitButton();
    });

    // Event listener for submit routine request button
    $("#submit-routine-request").click(function () {
        if (selectedLevel && selectedEvent) {
             console.log(selectedEvent);
             console.log(selectedLevel);
            if(selectedEvent=="PH"&&(selectedLevel=="Level 4" || selectedLevel=="Level 5")){
                createRoutineTable(selectedLevel,"mushroom");      
            }
            else{
                createRoutineTable(selectedLevel, selectedEvent);
            }
            $("#routine-tables-container").show();
            $("#add-routine-table-container").hide();
            resetButtonColors();
        }
    });

    // Event listener for delete routine button
    $("#delete-routine-button").click(function () {
        let first = $("#routine-tables-container table:first");
        let last = $("#routine-tables-container table:last");
        if (first[0] !== last[0]) {
            last.remove();
        } else {
            console.log("Cannot delete the last routine table.");
        }
    });
    attachEventListeners();
});
