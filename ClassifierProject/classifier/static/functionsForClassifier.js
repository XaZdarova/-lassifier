async function getInformationClassifier()
{
    let response = await fetch('/api/classifier', {
        method: 'GET'
    });

    let fitInformation = "Error";

    if (response.ok)
    {
        fitInformation = await response.json();
    }

    return fitInformation;
}

function informationClassifierToTables(fitInformation)
{
    if (fitInformation !== "Error")
    {
        let elemPrecisionMacro = document.getElementById("precisionMacroValue");
        let elemPrecisionMicro = document.getElementById("precisionMicroValue");
        let elemRecallMacro = document.getElementById("recallMacroValue");
        let elemRecallMicro = document.getElementById("recallMicroValue");
        let elemf1ScoreMacro = document.getElementById("f1ScoreMacroValue");
        let elemf1ScoreMicro = document.getElementById("f1ScoreMicroValue");
        let elemAccuracy = document.getElementById("accuracyValue");
        let elemTable = document.getElementById("tableForClassesMetrics");
        let textForTable = "<tr><td>Класс</td><td>Precision</td><td>Recall</td><td>F1 Score</td></tr>";

        let elemError = document.getElementById("informationClassifierError");
        elemError.hidden = true;

        elemPrecisionMacro.textContent = fitInformation.precisionMacro.toFixed(2).toString();
        elemPrecisionMicro.textContent = fitInformation.precisionMicro.toFixed(2).toString();
        elemRecallMacro.textContent = fitInformation.recallMacro.toFixed(2).toString();
        elemRecallMicro.textContent = fitInformation.recallMicro.toFixed(2).toString();
        elemf1ScoreMacro.textContent = fitInformation.f1ScoreMacro.toFixed(2).toString();
        elemf1ScoreMicro.textContent = fitInformation.f1ScoreMicro.toFixed(2).toString();
        elemAccuracy.textContent = fitInformation.accuracy.toFixed(2).toString();

        for (let i = 0; i < fitInformation.categoryList.length; i++)
        {
            textForTable = textForTable +
                "<tr><td>" + fitInformation.categoryList[i] + "</td>" +
                "<td>" + fitInformation.precision[i].toFixed(2).toString() + "</td>" +
                "<td>" + fitInformation.recall[i].toFixed(2).toString() + "</td>" +
                "<td>" + fitInformation.f1Score[i].toFixed(2).toString() + "</td></tr>";
        }

        elemTable.innerHTML = textForTable;
    }
    else
    {
        let elemError = document.getElementById("informationClassifierError");
        elemError.hidden = false;
        elemError.textContent = "Невозможно загрузить информацию о классификаторе";
    }
}

async function recordInformationClassifierToTables()
{
    let fitInformation = await getInformationClassifier();
    informationClassifierToTables(fitInformation);
}

async function classify()
{
    let elemTextForClassifierError = document.getElementById("textForClassifierError");
    let elemResult = document.getElementById("resultOfClassifier");
    let elemTextForClassifier = document.getElementById("textForClassifier");
    let textForClassifier = elemTextForClassifier.value;

    elemTextForClassifierError.hidden = true;
    elemResult.textContent = "";

    if (textForClassifier.trim() != '')
    {
        if (textForClassifier.length <= 20000)
        {
            let data = {
                text: textForClassifier
            };

            let response = await fetch('/api/classifier', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok)
            {
                let resultClassifier = await response.json();
                elemResult.textContent = resultClassifier.category;
            }
            else
            {
                elemResult.textContent = "Запрос не удался";
            }
        }
        else
        {
            elemTextForClassifierError.hidden = false;
            elemTextForClassifierError.textContent = "Текст слишком большой. Максимум 20000 символов";
        }
    }
    else
    {
        elemTextForClassifierError.hidden = false;
        elemTextForClassifierError.textContent = "Текст не заполнен";
    }
}
