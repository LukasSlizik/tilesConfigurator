var tiles = ["tile1.png", "tile2.png", "tile3.png"];

var tilesBasePath = "tiles/"
var selectedTile = tiles[0];
var currentConfigurations = [];

// classes and IDs
const dimensionSelectorClass = "dimensionSelector";
const tileSelectorId = "tileSelector";
const widthSelectorId = "widthSelector";
const heightSelectorId = "heightSelector";
const gridId = "grid";
const tileClass = "tile";
const tileSetClass = "tileSet";
const tileFormName = "tileForm"
const formSelectorId = "formSelector";

var supportedForms = ['square', 'arabesque'];

document.addEventListener("DOMContentLoaded", function (event) {
    var selectors = document.getElementsByClassName(dimensionSelectorClass);

    generateFormSelector();

    for (let selector of selectors) {
        selector.addEventListener("click", function (event) {
            generateGrid();
        });
    }

    populateTiles();
});

function generateFormSelector() {
    var grid = document.getElementById(tileSelectorId);

    var formSelectorDiv = document.createElement("div");
    formSelectorDiv.id = formSelectorId;

    supportedForms.forEach(function (form) {
        formSelectorDiv.appendChild(createOneTileFormDiv(form));
    });

    grid.appendChild(formSelectorDiv);
    document.getElementById(supportedForms[0]).checked = true;  // checks the firsts supported form
}

function createOneTileFormDiv(form) {
    var tileFormDiv = document.createElement("div");

    // input
    var inputDiv = document.createElement("input");
    inputDiv.type = "radio";
    inputDiv.id = form;
    inputDiv.value = form;
    inputDiv.name = tileFormName;

    // label
    var labelDiv = document.createElement("label");
    labelDiv.innerText = form;

    // append to the tileFormDiv
    tileFormDiv.appendChild(inputDiv);
    tileFormDiv.appendChild(labelDiv);

    return tileFormDiv;
}

function generateGrid() {
    switch (getSelectedTileForm()) {
        case 'square':
            generateSquareGrid();
            break;
        case 'arabesque':
            generateArabesqueGrid();
            break;
        default:
            console.error('unknown tile form');
    }
}

function getSelectedTileForm() {
    var allTileForms = document.getElementsByName(tileFormName);
    for (var i = 0; i < allTileForms.length; i++) {
        if (allTileForms[i].checked)
            return allTileForms[i].value;
    }
}

function populateTiles() {
    var tileSelector = document.getElementById(tileSelectorId);

    for (index in tiles) {
        var div = document.createElement("div");
        div.classList.add(tileClass);

        div.id = tiles[index];
        div.style.backgroundImage = `url('${tilesBasePath}${tiles[index]}')`;
        div.onclick = function (event) {
            selectedTile = (event.target).id;
        }

        tileSelector.appendChild(div);
    }
}

function generateArabesqueGrid() {
    saveCurrentConfiguration();
    clearGrid();

    var height = document.getElementById(heightSelectorId).value;
    var width = document.getElementById(widthSelectorId).value;

    var grid = document.getElementById(gridId);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            var node = document.createElement("img");
            node.src = 'tiles/arabesque.png'
            node.classList.add(tileClass);

            node.dataset.i = i;
            node.dataset.j = j;
            node.addEventListener("click", function (event) {
                var url = `url('${tilesBasePath}${selectedTile}')`;
                event.target.style.backgroundImage = url;
                event.target.classList.add(tileSetClass);
            });

            // restore selected configuration
            var existingConfiguration = currentConfigurations.filter(function (configuration) {
                return (configuration.i == i) && (configuration.j == j);
            });
            if (existingConfiguration.length == 1) {
                node.style.backgroundImage = existingConfiguration[0].image;
                node.classList.add(tileSetClass);
            }

            grid.appendChild(node);
        }
        grid.appendChild(document.createElement("br"));
    }
}

function generateSquareGrid() {
    saveCurrentConfiguration();
    clearGrid();

    var height = document.getElementById(heightSelectorId).value;
    var width = document.getElementById(widthSelectorId).value;

    var grid = document.getElementById(gridId);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            var node = document.createElement("div");
            node.classList.add(tileClass);

            node.dataset.i = i;
            node.dataset.j = j;
            node.addEventListener("click", function (event) {
                var url = `url('${tilesBasePath}${selectedTile}')`;
                event.target.style.backgroundImage = url;
                event.target.classList.add(tileSetClass);
            });

            var existingConfiguration = currentConfigurations.filter(function (configuration) {
                return (configuration.i == i) && (configuration.j == j);
            });
            if (existingConfiguration.length == 1) {
                node.style.backgroundImage = existingConfiguration[0].image;
                node.classList.add(tileSetClass);
            }

            grid.appendChild(node);
        }
        grid.appendChild(document.createElement("br"));
    }
}

function Configuration(i, j, image) {
    this.i = i;
    this.j = j;
    this.image = image;
}

function saveCurrentConfiguration() {
    currentConfigurations = [];

    var allTilesWithBackground = document.getElementsByClassName(tileSetClass);
    for (tile of allTilesWithBackground) {
        var i = tile.dataset.i;
        var j = tile.dataset.j;
        var image = tile.style.backgroundImage;

        currentConfigurations.push(new Configuration(i, j, image));
    }
}

function clearGrid() {
    var grid = document.getElementById(gridId);
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
}
