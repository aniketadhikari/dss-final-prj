async function btnAnalyze() {
    let reviewText = document.getElementById('reviewText').value;
    let results = await analyzeText(reviewText);
    buildResult(results);
}

async function analyzeText(text) {
    let apiUrl = 'https://prod-77.eastus.logic.azure.com:443/workflows/ee5cf20f001343fa98cc4ddf0046096c/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=OUnAgTzySM9zOwIHBxnV2OomR405PCARdZ6z1d_3pFo';


    let data = {
        'text': text
    };

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

function buildResult(result) {

   
    let item = "<h2 class='accordion-header' id='heading@GUID'><button class='accordion-button' type='button' data-bs-toggle='collapse' data-bs-target='#collapse@GUID'><span class='cut-text'>@TEXT</span></button></h2><div id='collapse@GUID' class='accordion-collapse collapse show' data-bs-parent='#results'><div class='accordion-body'><i>@TEXT</i><hr><span class='badge rounded-pill bg-primary'>Positive: @POS</span><span class='badge rounded-pill bg-secondary'>Neutral: @NEU</span><span class='badge rounded-pill bg-danger'>Negative: @NEG</span></div></div>"

 
    let text = result.sentences.map(e => e.text).join(" ");

  
    item = item.replaceAll("@GUID", result.id);
    item = item.replaceAll("@TEXT", text);
    item = item.replaceAll("@POS", result.confidenceScores.positive);
    item = item.replaceAll("@NEU", result.confidenceScores.neutral);
    item = item.replaceAll("@NEG", result.confidenceScores.negative);

    
    
    
    let accordionItem = document.createElement("div");
    accordionItem.classList.add("accordion-item");
    accordionItem.innerHTML = item;


   
    document.getElementById("results").appendChild(accordionItem);


   

}