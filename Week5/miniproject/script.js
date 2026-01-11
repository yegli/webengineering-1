// Selektiere das Dropdown-Menü und das Div-Element
const colorSelect = document.getElementById("color-select");
const colorBox = document.querySelector("#color-box");

// Event-Listener für Änderungen im Dropdown-Menü
colorSelect.addEventListener("change", function() {
    colorBox.style.backgroundColor = colorSelect.value;
});
