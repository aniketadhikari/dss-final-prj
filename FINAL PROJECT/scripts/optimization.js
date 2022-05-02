let model = {};
model.modelName = "Transportation";
model.modelType = "optimization";

async function btnClick() {
    await buildModel();

    let results = await Optimize();

    displayResults(results);

}

function getRoutes() {

    let routes = Array.from(document.getElementsByClassName("route"));
    return routes;
}

function getStores() {

    let stores = Array.from(document.getElementsByClassName("store"));
    return stores;
}

function getStoreName(id) {

    return document.getElementById("store" + id).value;
}

function getWarehouse() {

    let warehouses = Array.from(document.getElementsByClassName("warehouse"));
    return warehouses;
}

function getNextStoreId() {

    let stores = getStores();
    let lastStore = stores[stores.length - 1];

    let lastStoreId = lastStore.dataset.store;

    let nextStoreId = "S" + (Number(lastStoreId.substring(1)) + 1);

    return nextStoreId;

}

function getNextWarehouseId() {

    let warehouses = getWarehouse();
    let lastWarehouse = warehouses[warehouses.length - 1];

    let lastWarehouseId = lastWarehouse.dataset.warehouse;

    let nextWarehouseId = "W" + (Number(lastWarehouseId.substring(1)) + 1);

    return nextWarehouseId;

}

function getLastWarehouseId() {
    
    let warehouses = getWarehouse();
    let lastWarehouse = warehouses[warehouses.length - 1];

    let lastWarehouseId = lastWarehouse.dataset.warehouse;

    let nextWarehouseId = "W" + (Number(lastWarehouseId.substring(1)));

    return nextWarehouseId;

}

function AddStore() {

    let newStoreId = getNextStoreId(); 
 
    let store = document.createElement("tr"); 
    let storeHeader = document.createElement("th"); 
    storeHeader.setAttribute("scope", "row"); 
    storeHeader.innerHTML = "<input type='text' class='store' id='store" + newStoreId + "' data-store='" + newStoreId + "'>";
    store.appendChild(storeHeader); 
 
    let storeDemand = document.createElement("td"); 
 
    storeDemand.innerHTML = "<input type='number' class='demand' id='demand" + newStoreId + "' data-store='" + newStoreId + "'>"; 
    store.appendChild(storeDemand); 
 
    let warehouses = getWarehouse(); 
    for (let step = 0; step < warehouses.length; step++) { 
        let route = document.createElement("td"); 
        let warehouseId = warehouses[step].dataset.warehouse; 
        route.innerHTML = "<input type='number' class='route' id='" + newStoreId + warehouseId + "' data-store='" + newStoreId + "' data-warehouse='" + warehouseId + "'>"; 
        store.appendChild(route); 
    } 
 
    document.getElementById("storesList").append(store); 

}

function AddWarehouse() {

    let newWarehouseId = getNextWarehouseId();


    let warehouseHeader = document.createElement("th"); 
    warehouseHeader.setAttribute("scope", "col"); 
    warehouseHeader.innerHTML = "<input type='text' onchange='updateTable()' class='warehouse' id='warehouse" + newWarehouseId + "' data-warehouse='" + newWarehouseId + "'>";


    document.getElementById("warehousesList").append(warehouseHeader);

    let warehouseSupply = document.createElement("td"); 
 
    warehouseSupply.innerHTML = "<input type='number' class='supply' id='supply" + newWarehouseId + "' data-warehouse='" + newWarehouseId + "'>"; 
    document.getElementById("warehousesSupply").append(warehouseSupply);


    let stores = getStores(); 
    for (let step = 0; step < stores.length; step++) { 
        let warehouseCost = document.createElement("td");
        let storeId = stores[step].dataset.store;  
        warehouseCost.innerHTML = "<input type='number' class='route' id='" + storeId + newWarehouseId + "' data-store='" + storeId + "' data-warehouse='" + newWarehouseId + "'>"; 
        document.getElementById("store" + storeId).parentNode.parentNode.append(warehouseCost);


    }


}

function updateTable(){
    let newWarehouseId = getLastWarehouseId();

    let warecolumn = document.createElement("div");
    warecolumn.setAttribute("class", "col");
    warecolumn.innerHTML = "<h4>" + document.getElementById("warehouse" + newWarehouseId).value + "</h4>" + "<ul id='deliveries" + newWarehouseId + "'>" + "" + "</ul>" + "<p id='total" + newWarehouseId + "'>" + "</p>";

    document.getElementById("warecolumn").append(warecolumn);
}

function displayResults(results) {

    let routes = getRoutes(); 
 
    for (let step = 0; step < routes.length; step++) { 
        let routeId = routes[step].id; 
        let warehouseId = routes[step].dataset.warehouse; 
        let storeId = routes[step].dataset.store; 
        let routeAmount = Number(results[routeId].data[0][0]); 
 
 
        if (routeAmount > 0) { 
            let delivery = document.createElement("li"); 
            delivery.innerHTML = getStoreName(storeId) + " - " + routeAmount; 
            document.getElementById("deliveries" + warehouseId).appendChild(delivery); 
        } 
    }

    let warehouses = getWarehouse(); 
    console.log(warehouses); 
    for (let step = 0; step < warehouses.length; step++) { 
        let warehouseId = warehouses[step].dataset.warehouse; 
        document.getElementById("total" + warehouseId).innerHTML = "Total Quantity: " + (Number(results[warehouseId].data[0][0])); 
    } 

    document.getElementById("cost").innerHTML = results.obj.data[0][0];

}

async function Optimize() {
    let apiUrl = 'https://prod-74.eastus.logic.azure.com:443/workflows/3778e31037f34c1e84abc1e6221e5e23/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=K_7ecOlH6o702oziichcB0kOflE0m_ugjl36Cm1q_NI'
    let data = model;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const results = await response.json();

    return results;

}

function buildModel() {


    let variables = getRoutes(); 
 
    for (let step = 0; step < variables.length; step++) { 
        addVariable(variables[step].id, "lower", 0, true); 
    } 


    let warehouseConstraints = getWarehouse(); 
 
    for (let step = 0; step < warehouseConstraints.length; step++) { 
        let warehouseId = warehouseConstraints[step].dataset.warehouse; 
        let value = document.getElementById("supply" + warehouseId).value 
 
        let relatedRoutes = variables.filter(variable => variable.dataset.warehouse == warehouseId); 
        let formula = ""; 
        for (let step = 0; step < relatedRoutes.length; step++) { 
            formula += relatedRoutes[step].id; 
            if (step !== (relatedRoutes.length - 1)) { 
                formula += " + " 
            } 
        } 
        addConstraint(warehouseId, "upper", value, formula); 
 
    }

    let storesConstraints = getStores(); 
 
    for (let step = 0; step < storesConstraints.length; step++) { 
        let storeId = storesConstraints[step].dataset.store; 
        let value = document.getElementById("demand" + storeId).value; 
 
        let relatedRoutes = variables.filter(variable => variable.dataset.store == storeId); 
        let formula = ""; 
        for (let step = 0; step < relatedRoutes.length; step++) { 
            formula += relatedRoutes[step].id; 
            if (step !== (relatedRoutes.length - 1)) { 
                formula += " + " 
            } 
        } 
        addConstraint(storeId, "equal", value, formula); 
 
    }


    let objformula = ""; 
    for (let step = 0; step < variables.length; step++) { 
        let coef = document.getElementById(variables[step].id).value; 
        objformula += coef + " * " + variables[step].id; 
        if (step !== (variables.length - 1)) { 
            objformula += " + " 
        } 
    } 
    addObjective("minimize", objformula);

}


function addVariable(name, opperator, value, integer = true) {


    let variable = {};

    variable.name = name;

    if (opperator == "upper") {
        variable.upper = Number(value);
    } else {
        variable.lower = Number(value);
    }

 
    if (integer) {
        variable.type = "int";
    }

    variable.finalValue = [];


    if (model.variables === undefined) {
        model.variables = {};
    }

    model.variables[name] = variable;

}

function addConstraint(name, opperator = "upper", value, formula) {

    let constraint = {};

    constraint.name = name;

    if (opperator == "upper") {
        constraint.upper = Number(value);
    } else if (opperator == "lower") {
        constraint.lower = Number(value);
    } else {
        constraint.equal = Number(value);
    }

    constraint.formula = formula;


    constraint.finalValue = [];


    if (model.constraints === undefined) {
        model.constraints = {};
    }

    model.constraints[name] = constraint;
}

function addObjective(type = "maximize", formula) {

    model.objective = {};
    model.objective.obj = {};
    model.objective.obj.type = type;
    model.objective.obj.formula = formula;
    model.objective.obj.finalValue = [];
}

