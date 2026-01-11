const colorsArray = [
    {color: "red", active: true, hexCode: "#FF0000"},
    {color: "blue", active: true, hexCode: "#0000FF"},
    {color: "yellow", active: false, hexCode: "#FFFF00"}
];

// Hol das Dropdown und das Vorschau-Element
const colorSelect = document.getElementById("colors"); // ID angepasst an das HTML
const colorBox = document.getElementById("colorPreview");

// Erstelle die Optionen für das Dropdown
function createColorsSelectHTMLString(colorsArray) {
    let colorsDropdown = "";
    colorsArray.forEach(color => {
        if (color.active) {
            colorsDropdown += `<option value="${color.hexCode}">${color.color}</option>`;
        }
    });
    return colorsDropdown;
}

// Füge die Optionen beim Laden der Seite ein
colorSelect.innerHTML += createColorsSelectHTMLString(colorsArray);

// Event-Listener für Änderungen im Dropdown-Menü
colorSelect.addEventListener("change", function() {
    colorBox.style.backgroundColor = colorSelect.value;
});
