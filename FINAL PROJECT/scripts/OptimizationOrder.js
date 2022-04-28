function getItemName() {

    document.getElementById("name1").innerHTML = document.getElementById("item1").value;
    document.getElementById("name2").innerHTML = document.getElementById("item2").value;
    document.getElementById("name3").innerHTML = document.getElementById("item3").value;
    document.getElementById("name4").innerHTML = document.getElementById("item4").value;
    document.getElementById("name5").innerHTML = document.getElementById("item5").value;
}

async function Optimize() {

    let tShirtCost = document.getElementById("TSCost").value;
    //Hat
    let hatCost = document.getElementById("HatCost").value;
    //Sweatshirt
    let sweatShirtCost = document.getElementById("SSCost").value;
    //Jersey
    let jerseyCost = document.getElementById("JerseyCost").value;
    //Jacket
    let jacketCost = document.getElementById("JacketCost").value;

    //Use this API for Solving OPTIMIZATION PROBLEMS
    let apiUrl = 'https://prod-74.eastus.logic.azure.com:443/workflows/3778e31037f34c1e84abc1e6221e5e23/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=K_7ecOlH6o702oziichcB0kOflE0m_ugjl36Cm1q_NI'

    let data = buildModel();




    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const results = await response.json();
    console.log(results)
    //This will put the raw JSON output onto the page
    //Display the Model as JSON on page

    //fill the results for number items ordered
    document.getElementById("TS_number").innerHTML = results.TShirt.data[0][0] + " Dozen";
    document.getElementById("hat_number").innerHTML = results.hat.data[0][0] + " Dozen";
    document.getElementById("SS_number").innerHTML = results.sweatShirt.data[0][0] + " Dozen";
    document.getElementById("Jersey_number").innerHTML = results.Jersey.data[0][0] + " Dozen";
    document.getElementById("Jacket_number").innerHTML = results.Jacket.data[0][0] + " Dozen";

    //total number of items ordered
    document.getElementById("total_number").innerHTML = results.TShirt.data[0][0] + results.hat.data[0][0] + results.sweatShirt.data[0][0] + results.Jersey.data[0][0] + results.Jacket.data[0][0] + " Dozen Items Ordered";

    //total cost
    document.getElementById("total_cost").innerHTML = CurrencyFormat(results.TShirt.data[0][0] * tShirtCost + results.hat.data[0][0] * hatCost + results.sweatShirt.data[0][0] * sweatShirtCost + results.Jersey.data[0][0] * jerseyCost + results.Jacket.data[0][0] * jacketCost);

    //total profit
    document.getElementById("profit").innerHTML = CurrencyFormat(results.obj.data[0][0]);


}

function CurrencyFormat(number) {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    return formatter.format(number);
}

function buildModel() {
    let model = {};

    model.modelName = "Order";
    model.modelType = "optimization";

    model.variables = {};

    //t-shirt Variables
    model.variables.TShirt = {};
    model.variables.TShirt.lower = 0;
    model.variables.TShirt.type = "int";
    model.variables.TShirt.finalValue = [];


    //Hat Variables
    model.variables.hat = {};
    model.variables.hat.lower = 0;
    model.variables.hat.type = "int";
    model.variables.hat.finalValue = [];

    //Sweatshirt Variables
    model.variables.sweatShirt = {};
    model.variables.sweatShirt.lower = 0;
    model.variables.sweatShirt.type = "int";
    model.variables.sweatShirt.finalValue = [];

    //Jersey Variables
    model.variables.Jersey = {};
    model.variables.Jersey.lower = 0;
    model.variables.Jersey.type = "int";
    model.variables.Jersey.finalValue = [];

    //Jacket Variables
    model.variables.Jacket = {};
    model.variables.Jacket.lower = 0;
    model.variables.Jacket.type = "int";
    model.variables.Jacket.finalValue = [];

    //add the constraints




    model.constraints = {};

    //amount t-Shirt
    model.constraints.TSamount = {};
    model.constraints.TSamount.formula = "TShirt";
    // model.constraints.TSamount.upper = 75;//document.getElementById("TSAmount").value;
    model.constraints.TSamount.upper = parseInt(document.getElementById("TSAmount").value);

    //amount hat

    model.constraints.HatAmount = {};
    model.constraints.HatAmount.formula = "hat";
    model.constraints.HatAmount.upper = parseInt(document.getElementById("HatAmount").value);

    //amount Sweat Shirt
    model.constraints.SSAmount = {};
    model.constraints.SSAmount.formula = "sweatShirt";
    model.constraints.SSAmount.upper = parseInt(document.getElementById("SSAmount").value);

    //amount Jersey
    model.constraints.JerseyAmount = {};
    model.constraints.JerseyAmount.formula = "Jersey";
    model.constraints.JerseyAmount.upper = parseInt(document.getElementById("JerseyAmount").value);

    //amount Jacket
    model.constraints.JacketAmount = {};
    model.constraints.JacketAmount.formula = "Jacket";
    model.constraints.JacketAmount.upper = parseInt(document.getElementById("JacketAmount").value);

    //cost and profit

    //T-Shirt
    let tShirtCost = document.getElementById("TSCost").value;
    let tShirtProfit = document.getElementById("TSProfit").value;
    //Hat
    let hatCost = document.getElementById("HatCost").value;
    let hatProfit = document.getElementById("HatProfit").value;

    //Sweatshirt
    let sweatShirtCost = document.getElementById("SSCost").value;
    let sweatShirtProfit = document.getElementById("SSProfit").value;

    //Jersey
    let jerseyCost = document.getElementById("JerseyCost").value;
    let jerseyProfit = document.getElementById("JerseyProfit").value;

    //Jacket
    let jacketCost = document.getElementById("JacketCost").value;
    let jacketProfit = document.getElementById("JacketProfit").value;

    //budget value
    let BudgetAmount = document.getElementById("BudgetAmount").value;


    //Desiered Budget
    model.constraints.budget = {};
    model.constraints.budget.formula = "TShirt *" + tShirtCost + "+ hat *" + hatCost + " + sweatShirt *" + sweatShirtCost + "+ Jersey *" + jerseyCost + " + Jacket *" + jacketCost;
    model.constraints.budget.upper = parseInt(document.getElementById("BudgetAmount").value);





    model.objective = {};

    model.objective.obj = {};
    model.objective.obj.type = "maximize";
    model.objective.obj.formula = "TShirt *" + tShirtProfit + "+ hat *" + hatProfit + " + sweatShirt *" + sweatShirtProfit + "+ Jersey *" + jerseyProfit + " + Jacket *" + jacketProfit;
    model.objective.obj.finalValue = [];

    return model;
}

function Reset() {

    document.getElementById("TS_number").innerHTML = "";
    document.getElementById("hat_number").innerHTML = "";
    document.getElementById("SS_number").innerHTML = "";
    document.getElementById("Jersey_number").innerHTML = "";
    document.getElementById("Jacket_number").innerHTML = "";
    document.getElementById("total_number").innerHTML = "";
    document.getElementById("total_cost").innerHTML = "";
    document.getElementById("profit").innerHTML = "";

}