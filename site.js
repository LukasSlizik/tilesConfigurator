var tiles = ["tile1.png", "tile2.png", "tile3.png"];
var tilesBasePath = "tiles/"
var selectedTile = tiles[0];
var currentConfigurations = [];
var supportedForms = ['square', 'arabesque'];
const dimensionSelectorClass = "dimensionSelector";
const tileSelectorId = "tileSelector";
const widthSelectorId = "widthSelector";
const heightSelectorId = "heightSelector";
const gridId = "grid";
const tileClass = "tile";
const tileSetClass = "tileSet";
const tileFormName = "tileForm"
const formSelectorId = "formSelector";
const dimensionsId = "dimensions"

document.addEventListener("DOMContentLoaded", function (event) {
    generateConfigurator();
    refresh();
});

function generateConfigurator() {
    var tileConfigurator = document.querySelector("tileConfigurator");
    tileConfigurator.appendChild(createDimensionSelectors());
    tileConfigurator.appendChild(createFormSelector());
    tileConfigurator.appendChild(createTiles());
    tileConfigurator.appendChild(createGrid());
}

function createGrid() {
    var grid = document.createElement("div");
    grid.id = gridId;

    return grid;
}

function createDimensionSelectors() {
    var dimensionsDiv = document.createElement('div');
    dimensionsDiv.id = dimensionsId;

    var heightSelector = createDimensionSelector('Height', 'heightSelector', 1, 10, 1);
    var widthSelector = createDimensionSelector('Width', 'widthSelector', 1, 20, 1)

    dimensionsDiv.appendChild(heightSelector);
    dimensionsDiv.appendChild(widthSelector);

    return dimensionsDiv;
}

function createDimensionSelector(innerText, id, min, max, value) {
    var divElement = document.createElement("div");

    var labelElement = document.createElement("label");
    labelElement.innerText = innerText;

    var inputElement = document.createElement("input");
    inputElement.type = "number";
    inputElement.id = id;
    inputElement.value = value;
    inputElement.min = min;
    inputElement.max = max;

    inputElement.addEventListener("change", function (event) {
        refresh();
    });

    divElement.appendChild(labelElement);
    divElement.appendChild(inputElement);

    return divElement;
}

function createFormSelector() {
    var formSelectorDiv = document.createElement("div");
    formSelectorDiv.id = formSelectorId;

    supportedForms.forEach(function (form) {
        formSelectorDiv.appendChild(createOneTileFormDiv(form));
    });

    // select first radio button
    formSelectorDiv.querySelector(`input[name=${tileFormName}]`).checked = true;
    return formSelectorDiv;
}

function createOneTileFormDiv(form) {
    var tileFormDiv = document.createElement("div");

    // input
    var inputDiv = document.createElement("input");
    inputDiv.type = "radio";
    inputDiv.id = form;
    inputDiv.value = form;
    inputDiv.name = tileFormName;

    inputDiv.addEventListener("click", function (event) {
        refresh();
    });

    // label
    var labelDiv = document.createElement("label");
    labelDiv.innerText = form;

    // append to the tileFormDiv
    tileFormDiv.appendChild(inputDiv);
    tileFormDiv.appendChild(labelDiv);

    return tileFormDiv;
}

function refresh() {
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

function createTiles() {
    var tileSelector = document.createElement("div");
    tileSelector.id = tileSelectorId;

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

    return tileSelector;
}

function generateArabesqueGrid() {
    saveCurrentConfiguration();
    clearGrid();

    var height = document.getElementById(heightSelectorId).value;
    var width = document.getElementById(widthSelectorId).value;

    var grid = document.getElementById(gridId);

    for (let i = 0; i < height; i++) {
        var row = document.createElement("div");
        row.classList.add("row");

        let nobrElement = document.createElement("nobr");
        row.appendChild(nobrElement);

        for (let j = 0; j < width; j++) {
            var node = document.createElement("div");
            node.classList.add(tileClass);
            node.classList.add('arabesque')
            if (i % 2 == 1) {
                if (j == 0)
                    node.classList.add('firstInOddRow');
            }
            node.classList.add('tileRow');

            node.dataset.i = i;
            node.dataset.j = j;
            node.addEventListener("click", function (event) {
                var url = `url('${tilesBasePath}/arabesque/fill.png')`;
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

            nobrElement.appendChild(node);
        }
        grid.appendChild(row);
    }

    // set the max width of the grid to drop the tiles
    // magic
    let m = 8;
    let w = ((width * 100) - 50) + ((width * 2) - 1) * m;
    let h = ((height-1) * 50) + ((height-1) * m);
    grid.setAttribute("style", `width: ${w}px; height: ${h}px`);
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
