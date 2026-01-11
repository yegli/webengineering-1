const taskList = document.getElementById('taskList');
let input = document.getElementById('taskInput');
function completeTask(event) {
    const target = event.target;
    // Add class completed to clicked element
}

// Register event handler on the task list

function addNewTask(event) {
    event.preventDefault();
    console.log(input.value);
    // Check if enter key was pressed
    // Get content in input field
    // Create new li-Element and attach it to the task list
    // Reset input field
}

// Attach event listener to input field

// Selektiere das Dropdown-Menü und das Div-Element
const colorSelect = document.getElementById("color-select");
const colorBox = document.querySelector("#color-box");

// Event-Listener für Änderungen im Dropdown-Menü
colorSelect.addEventListener("change", function() {
    colorBox.style.backgroundColor = colorSelect.value;
});

