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
    newTable.append("<tr><th colspan='3'>" + event + " -- Super Skills Chart -- GRP " + toRomanNumeral(elementGroup) + "</th></tr>");
    newTable.append("<tr><th>Skill</th><th>Difficulty</th><th>Element Group</th></tr>");
    $("#skill-table-container").append(newTable);
    return newTable;
}

function display_score(routineTable, scoreString) {

    // Find the last row in the routineTable
    var lastRow = routineTable.find("tr:last");

    // Insert the new row before the last row
    lastRow.before("<tr><td>" + scoreString);
}


// Function to calculate score for level 1-6 routines
function calculate_NGA(routineTable, _level) {
    var skills = routineTable.find("tr:not(.header-row):not(.add-row)"); // only the skills
    var score = 10.0;
    var difficulty = 0.0;
    const elementGroups = new Set();
    const skill_names = new Set();
    _level = Number(_level);

    skills.each(function () {
        skill_names.add($(this).find("td").eq(0).text());
        elementGroups.add($(this).find("td").eq(2).text());
        var difficultyText = $(this).find("td").eq(1).text();
        difficulty += parseFloat(difficultyText);
    });

    console.log("Calculating score for level " + _level + " routine");

    // missing element group deductions
    switch (elementGroups.size) {
        case 0:
            console.log("Missing 4 element groups. Routine has no value");
            score = 0;
            break;
        case 1:
            score = score - 1.5;
            console.log("Missing 3 element groups. -1.5 deduction applied");
            break;
        case 2:
            score = score - 1.0;
            console.log("Missing 2 element groups. -1.0 deduction applied");
            break;
        case 3:
            score = score - 0.5;
            console.log("Missing 1 element group. -0.5 deduction applied");
            break;
        default:
            console.log("Element groups satisfied");
    }

    // short routine deductions
    switch (skill_names.size) {
        case 0:
            score = 0;
            console.log("Short routine deduction applied");
            break;
        case 1:
            score -= 7.0;
            console.log("Short routine deduction applied");
            break;
        case 2:
            score -= 6.0;
            console.log("Short routine deduction applied");
            break;
        case 3:
            score -= 5.0;
            console.log("Short routine deduction applied");
            break;
        case 4:
            score -= 4.0;
            console.log("Short routine deduction applied");
            break;
        case 5:
            score -= 3.0;
            console.log("Short routine deduction applied");
            break;
        default:
            console.log("Met minimum 6 skills requirement");
            break;
    }
    // check for missing FIG values
    switch (_level) {
        case 1:
            console.log("FIG requirement met");
            break;
        case 2:
            console.log("FIG requirement met");
            break;
        case 3:
            console.log("FIG requirement met");
            break;
        case 4:
            if (difficulty < 0.1) {
                score -= 0.5;
                console.log("Missing FIG 'A' requirement");
            }
            break;
        case 5:
            if (difficulty < 0.2) {
                score -= 0.5;
                console.log("Missing FIG 'A' requirement");
            }
            break;
        default:
            console.log("Level not supported yet! Updates coming soon..");
            break;
    }
    console.log("Total Difficulty:", difficulty);
    score += difficulty;
    console.log(score);
    display_score(routineTable, score);
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
    $('#routine-tables-container').append(tableHTML);
    attachEventListeners();
}

// Function to attach event listeners to buttons
function attachEventListeners() {
    $(".add-skill-button").off().on("click", function () {
        currentRoutineTable = $(this).closest('table');
        $("#routine-tables-container").hide();
        $("#skill-table-container").show();
    });

    $(".delete-skill-button").off().on("click", function () {
        var rowCount = $(this).closest('table').find("tr:not(.header-row)").length;
        if (rowCount >= 2) {
            $(this).closest('table').find("tr:not(.header-row)").eq(rowCount - 2).remove();
        } else {
            console.log("No row to delete");
        }
    });

    $(".calculate-score-button").off().on("click", function () {
        var headerText = $(this).closest('table').find(".header-row:first-child th").text();
        var parts = headerText.split(" ");
        var level = parts[1];
        var event = parts[2];
        var routineTable = $(this).closest('table');
        calculateScore(event, level, routineTable);
    });

    $(document).off("click", ".skill-entry").on("click", ".skill-entry", function () {
        const skillName = $(this).find("td").eq(0).text();
        const skillDifficulty = $(this).find("td").eq(1).text();
        const skillElementGroup = $(this).find("td").eq(2).text();
        addSkill(skillName, skillDifficulty, skillElementGroup);
        $("#skill-table-container").hide();
        $("#routine-tables-container").show();
    });
}


// Function to reset button colors
function resetButtonColors() {
    $('.level-button').removeClass('active');
    $('.event-button').removeClass('active');
    selectedLevel = null;
    selectedEvent = null;
    $('#submit-routine-request').hide();
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
        if(selectedLevel){
            switch(selectedEvent){
                case 'FX':
                    $('#floor').css("display", "block");
                    break;
                case 'PH':
                    $('#pommel').css("display", "block");
                    break;
                case 'SR':
                    $('#rings').css("display", "block");
                    break;
                case 'VT':
                    $('#vault').css("display", "block");
                    break;
                case 'PB':
                    $('#pbars').css("display", "block");
                    break;
                case 'HB':
                    $('#highbar').css("display", "block");
                    break;
                default:
                    break;
            }
        }
        if (selectedLevel && selectedEvent) {
            $('#submit-routine-request').text(`Create Level ${selectedLevel} ${selectedEvent} routine table`);
            $('#submit-routine-request').show();
        }
    }

    // Event listener for level buttons
    $('.level-button').click(function () {
        $('.level-button').removeClass('active');
        $(this).addClass('active');
        selectedLevel = $(this).text();
        updateSubmitButton();
    });

    // Event listener for event buttons
    $('.event-button').click(function () {
        $('.event-button').removeClass('active');
        $(this).addClass('active');
        selectedEvent = $(this).text();
        updateSubmitButton();
    });

    // Event listener for submit routine request button
    $('#submit-routine-request').click(function () {
        if (selectedLevel && selectedEvent) {
            createRoutineTable(selectedLevel, selectedEvent);
            $("#routine-tables-container").show();
            $("#add-routine-table-container").hide();
            resetButtonColors();
        }
    });

    // Event listener for delete routine button
    $('#delete-routine-button').click(function () {
        let first = $('#routine-tables-container table:first');
        let last = $('#routine-tables-container table:last');
        if (first[0] !== last[0]) {
            last.remove();
        } else {
            console.log("Cannot delete the last routine table.");
        }
    });
    attachEventListeners();
});

