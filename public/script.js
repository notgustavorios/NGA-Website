

function addNewRoutine() {
  var templateTable = document.getElementById("routine-table-template");
  var newTable = templateTable.cloneNode(true);
  var timestamp = new Date().getTime();
  var newTableID = "routine-table-" + timestamp;
  newTable.setAttribute("id", newTableID);

  // Reset text content to empty for all cells in the new table
  var cells = newTable.querySelectorAll("td");
  cells.forEach(function (cell) {
    cell.textContent = ""; // Reset text content to empty string
  });

  document.getElementById("routine-tables-container").appendChild(newTable);

  // Add event listeners to the cells for text input
  var cells = newTable.querySelectorAll("td");
  cells.forEach(function (cell) {
    cell.addEventListener("click", function () {
      var newText = prompt("Enter a skill:");
      if (newText !== null) {
        this.textContent = newText;
      }
    });
  });
  var headings = newTable.querySelectorAll("th");
  headings.forEach(function (headings) {
    headings.addEventListener("click", function () {
      var newText = prompt("Change Event: ");
      if (newText !== null) {
        this.textContent = newText;
      }
    });
  });
}

function deleteLastRoutine() {
  var routineTablesContainer = document.getElementById(
    "routine-tables-container"
  );
  var routineTables =
    routineTablesContainer.querySelectorAll(".editable-table");

  // Check if there is only one routine table left
  if (routineTables.length <= 1) {
    alert(
      "You must have at least one routine created. You cannot delete all tables."
    );
    return; // Exit the function to prevent deletion
  }

  var lastTable = routineTables[routineTables.length - 1];
  if (lastTable.id !== "routine-table-template") {
    routineTablesContainer.removeChild(lastTable);
  }
}
function addEventListenersToTables() {
var tables = document.querySelectorAll(".editable-table");
  tables.forEach(function (table) {
    var cells = table.querySelectorAll("td");
    cells.forEach(function (cell) {
      cell.addEventListener("click", function () {
        window.location.href = "skill.html";
      });
    });
  });
}

// Call the function when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  addEventListenersToTables();
});

const elementToHover = document.getElementById("elementToHover");
const elementToPopup = document.getElementById("elementToPopup");


class Skill{
  constructor(_name,_elementGroup,_difficulty,_direction){
      this.name = _name;
      this.elementGroup = _elementGroup;
      this.difficulty = _difficulty;
      this.direction = _direction;
  }
}
function redirectToIndex(element) {
  var skillHeadingText = element.querySelector('.skill-heading').textContent;
  console.log(skillHeadingText); 
  // window.location.href = "index.html";
  
}
