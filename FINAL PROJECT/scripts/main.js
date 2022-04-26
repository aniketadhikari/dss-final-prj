// gets the current merchandise available for purchase 
async function getMerch() {
    let apiUrl = "https://prod-111.westus.logic.azure.com:443/workflows/1534371306244c1b945bb81bae6eb421/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Y3hYg4NhaQV96q85Obfj0lKV5V1Gtx_RzGIQj7Cfx28";
    const response = await fetch(apiUrl);
    const result = await response.json();
    console.log(result);
    return result;
}

function createSelectOption(product) {
    let newOption = document.createElement("option");
    newOption.setAttribute("value", product.ItemInternalID)
    newOption.innerHTML = product.category + ": " + product.product;
    return newOption;
}

async function fillDropdown() {
    let data = await getMerch();
    for (let step = 0; step < data.length; step++) {
        let product = data[step];
        let option = createSelectOption(product);
        document.getElementById("merch").appendChild(option);
    }
}