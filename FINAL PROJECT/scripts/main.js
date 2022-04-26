async function updateTable() {

    let container = document.getElementById("addressTableBody");

    container.innerHTML = "";

    let addresses = await getAddresses();

    for (let index = 0; index < addresses.length; index++) {

        let row = createAddressRow(addresses[index]);
        container.appendChild(row);
    }

}


async function buttonSubmit() {

    let container = document.getElementById("addressTableBody");
    container.classList.add("spinner");
    await addAddress();
    await updateTable();
    container.classList.remove("spinner");
    document.getElementById("submitForm").reset();
}


async function addAddress() {

    let apiUrl = 'https://prod-55.westus.logic.azure.com:443/workflows/9fff316400484b47be85c7aa8c4a8212/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=I5hbeZRLCFD8SK2ck86hWxmNvTysRab-oZtcWgNQw0A';

    let product = document.getElementById("product").value;
    let price = document.getElementById("price").value;
    let category = document.getElementById("category").value;
    let photoURL = document.getElementById("photoURL").value;



    let data = {
        "category": category,
        "product": product,
        "price": price,
        "photoURL": photoURL
    }

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

async function getAddresses() {


    let apiUrl = 'https://prod-153.westus.logic.azure.com:443/workflows/4a0245250a15435e971659c7ef70dd73/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=adirpWQNgHFQdWf8TeDqHVTApzlb4A_Uxd_wyQxIT0w';

    const response = await fetch(apiUrl);

    const results = await response.json();

    return results;

}

//Public Function deleteAddresss(Id As String)
async function deleteAddress(id) {
    let apiUrl = 'https://prod-179.westus.logic.azure.com:443/workflows/081dee161ace4e2cb0518ed9a9ef46d6/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=FOkadweIAtUuGG6Bro8JUf3RZ1oO_Sd0MwsmDIodN_M';
    
    let x = apiUrl + '&id=' + id;
    const response = await fetch(x, {method: 'DELETE'});

    const results = await response.json();

    await updateTable();
    
    return results;

}
function createAddressRow(item) {

    let itemRow = document.createElement("tr");
    itemRow.setAttribute("data-powerappsid", item.ItemInternalId);
    itemRow.setAttribute("data-name", item.product);

    let itemRowName = document.createElement('th');
    itemRowName.setAttribute("scope", "row");
    itemRowName.innerHTML = item.category;

    let itemProduct = document.createElement('td');
    itemProduct.innerHTML = item.product;

    let itemPrice = document.createElement('td');
    itemPrice.innerHTML = item.price;

    let itemPhoto = document.createElement('td');
    var image = document.createElement('img');
    image.setAttribute('src', item.photoURL);
    itemPhoto.appendChild(image);

    let itemRowActions = document.createElement('td');
    let dbutton = document.createElement("a");
    dbutton.innerText = "Order";
    let IDItem = item.ItemInternalId;
    dbutton.setAttribute("href", "purchase.html");
    dbutton.setAttribute("class", "btn btn-danger");

    itemRow.appendChild(itemRowName);
    itemRow.appendChild(itemProduct);
    itemRow.appendChild(itemPrice);
    itemRow.appendChild(itemPhoto);
    itemRow.appendChild(itemRowActions);
    itemRowActions.appendChild(dbutton);

    return itemRow;

}

async function getMerch() {
    let apiUrl = "https://prod-153.westus.logic.azure.com:443/workflows/4a0245250a15435e971659c7ef70dd73/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=adirpWQNgHFQdWf8TeDqHVTApzlb4A_Uxd_wyQxIT0w";
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