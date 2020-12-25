async function addArticle()
{
    let elemSource = document.getElementById("sourceAdd");
    let elemCategory = document.getElementById("categoryAdd");
    let elemDatetime = document.getElementById("datetimeAdd");
    let elemTitle = document.getElementById("titleAdd");
    let elemDescription = document.getElementById("descriptionAdd");
    let elemText = document.getElementById("textAdd");
    let elemTags = document.getElementById("tagsAdd");

    let elemSourceError = document.getElementById("sourceAddError");
    let elemCategoryError = document.getElementById("categoryAddError");
    let elemDatetimeError = document.getElementById("datetimeAddError");
    let elemTitleError = document.getElementById("titleAddError");
    let elemDescriptionError = document.getElementById("descriptionAddError");
    let elemTextError = document.getElementById("textAddError");
    let elemTagsError = document.getElementById("tagsAddError");

    let elemResultAdd = document.getElementById("resultAdd");
    elemResultAdd.textContent = "";

    elemSourceError.hidden = true;
    elemCategoryError.hidden = true;
    elemDatetimeError.hidden = true;
    elemTitleError.hidden = true;
    elemDescriptionError.hidden = true;
    elemTextError.hidden = true;
    elemTagsError.hidden = true;

    let source = elemSource.value;
    let category = elemCategory.value;
    let datetime = elemDatetime.value;
    let title = elemTitle.value;
    let description = elemDescription.value;
    let text = elemText.value;
    let tags = elemTags.value;

    let flagSuccess = true;

    if (source.trim() != '')
    {
        if (source.length <= 200)
        {
            let regExpSource = /^(?:(?:https?|ftp|telnet):\/\/(?:[a-z0-9_-]{1,32}(?::[a-z0-9_-]{1,32})?@)?)?(?:(?:[a-z0-9-]{1,128}\.)+(?:com|net|org|mil|edu|arpa|ru|gov|biz|info|aero|inc|name|[a-z]{2})|(?!0)(?:(?!0[^.]|255)[0-9]{1,3}\.){3}(?!0|255)[0-9]{1,3})(?:\/[a-z0-9.,_@%&?+=\~\/-]*)?(?:#[^ \'\"&<>]*)?$/i;
            if (!regExpSource.test(source))
            {
                elemSourceError.hidden = false;
                elemSourceError.textContent = "Это не ссылка";
                flagSuccess = false;
            }
        }
        else
        {
            elemSourceError.hidden = false;
            elemSourceError.textContent = "Поле переполнено. Макс кол-во символов - 200";
            flagSuccess = false;
        }
    }
    else
    {
        elemSourceError.hidden = false;
        elemSourceError.textContent = "Это поле является обязательным";
        flagSuccess = false;
    }

    if (datetime.trim() != '')
    {
        let regExpForDatetime = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$/i;
        if (regExpForDatetime.test(datetime))
        {
            let dateObject = new Date(datetime);
            let dateStrNew = dateObject.getFullYear() + '-' + ('0' + (dateObject.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObject.getDate()).slice(-2) + " " + ('0' + dateObject.getHours()).slice(-2) + ":" + ('0' + dateObject.getMinutes()).slice(-2);
            if (dateStrNew != datetime)
            {
                elemDatetimeError.hidden = false;
                elemDatetimeError.textContent = "Дата некорректна";
                flagSuccess = false;
            }
        }
        else
        {
            elemDatetimeError.hidden = false;
            elemDatetimeError.textContent = "Формат даты некорректен";
            flagSuccess = false;
        }
    }
    else
    {
        elemDatetimeError.hidden = false;
        elemDatetimeError.textContent = "Это поле является обязательным";
        flagSuccess = false;
    }

    if (title.trim() != '')
    {
        if (title.length > 1000)
        {
            elemTitleError.hidden = false;
            elemTitleError.textContent = "Поле переполнено. Макс кол-во символов - 1000";
            flagSuccess = false;
        }
    }
    else
    {
        elemTitleError.hidden = false;
        elemTitleError.textContent = "Это поле является обязательным";
        flagSuccess = false;
    }

    if (text.trim() != '')
    {
        if (text.length > 20000)
        {
            elemTextError.hidden = false;
            elemTextError.textContent = "Поле переполнено. Макс кол-во символов - 20000";
            flagSuccess = false;
        }
    }
    else
    {
        elemTextError.hidden = false;
        elemTextError.textContent = "Это поле является обязательным";
        flagSuccess = false;
    }

    if (description.trim() != '') {
        if (description.length > 1000) {
            elemDescriptionError.hidden = false;
            elemDescriptionError.textContent = "Поле переполнено. Макс кол-во символов - 1000";
            flagSuccess = false;
        }
    }
    else {
        description = null;
    }

    if (tags.trim() != '')
    {
        let tagsList = tags.split(',');
        let flagEmptyTag = false;
        let flagMaxChTag = false;

        if (tagsList.length <= 10)
        {
            for (let i = 0; i < tagsList.length; i++)
            {
                tagsList[i] = tagsList[i].trim();
                if (tagsList[i] != '')
                {
                    if (tagsList[i].length > 50)
                    {
                        flagMaxChTag = true;
                    }
                }
                else
                {
                    flagEmptyTag = true;
                }
            }

            if (flagEmptyTag)
            {
                elemTagsError.hidden = false;
                elemTagsError.textContent = "Пустой тег";
                flagSuccess = false;
            }
            else
            {
                if (flagMaxChTag)
                {
                    elemTagsError.hidden = false;
                    elemTagsError.textContent = "Тег слишком длинный. Макс кол-во символов - 50";
                    flagSuccess = false;
                }
                else
                {
                    tags = tagsList;
                }
            }
        }
        else
        {
            elemTagsError.hidden = false;
            elemTagsError.textContent = "Слишком много тегов. Макс кол-во тегов - 10";
            flagSuccess = false;
        }
    }
    else
    {
        tags = null;
    }

    if (flagSuccess)
    {
        let data = {
            source: source,
            category: category,
            datetime: datetime,
            title: title,
            description: description,
            text: text,
            tags: tags
        };

        let response = await fetch('/api/articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok)
        {
            elemResultAdd.textContent = "Новостная статья добавлена";
        }
        else
        {
            elemResultAdd.textContent = "Новостная статья не добавилась. Попробуйте ещё раз";
        }
    }
}

function generatePageElementStr(page, text, data)
{
    let elemStr = "<button onclick='showArticlesOnPage(" + page.toString() + "," + JSON.stringify(data) + ")'>" + text + "</button>";
    return elemStr;
}

function generatePagesButton(page, pageLimit, countArticles, data)
{
    let elemDivPages = document.getElementById("pagesElements");

    let lastPage = Math.ceil(countArticles / pageLimit);

    let firtsPageElemStr = generatePageElementStr(1, '1', data);
    let lastPageElemStr = generatePageElementStr(lastPage, lastPage.toString(), data);
    let prevPageElemStr = generatePageElementStr(page - 1, 'Предыдущая', data);
    let nextPageElemStr = generatePageElementStr(page + 1, 'Следующая', data);

    let buttonsStr = "";

    if (page != 1)
    {
        buttonsStr = buttonsStr + firtsPageElemStr + prevPageElemStr;
    }

    if (page != lastPage)
    {
        buttonsStr = buttonsStr + nextPageElemStr + lastPageElemStr;
    }

    elemDivPages.innerHTML = buttonsStr;
}

async function showArticlesOnPage(page, data)
{
    let category;
    let dateStart;
    let dateEnd;
    let sort;
    let sortType;
    let pageLimit;

    let dataSave;

    if (data === null)
    {
        dataSave = false;
    }
    else
    {
        dataSave = true;
    }

    if (!dataSave)
    {
        category = document.getElementById("categoryFilter").value;
        dateStart = document.getElementById("dateStartFilter").value;
        dateEnd = document.getElementById("dateEndFilter").value;
        sort = document.getElementById("sortFilter").value;
        sortType = document.getElementById("sortTypeFilter").value;
        pageLimit = document.getElementById("pageLimitFilter").value;

        elemGetResult = document.getElementById("articlesPreview");
        elemLenResult = document.getElementById("countElements");
        elemPagination = document.getElementById("pagesElements");

        elemGetResult.textContent = "";
        elemLenResult.textContent = "";
        elemPagination.textContent = "";

        elemDateStartError = document.getElementById("dateStartFilterError");
        elemDateEndError = document.getElementById("dateEndFilterError");
        elemSortError = document.getElementById("sortFilterError");
        elemSortTypeError = document.getElementById("sortTypeFilterError");

        elemDateStartError.hidden = true;
        elemDateEndError.hidden = true;
        elemSortError.hidden = true;
        elemSortTypeError.hidden = true;

        let flagSuccess = true;

        if (category == '')
        {
            category = null;
        }

        if (dateStart != '')
        {
            if ((new Date(dateStart)).getTime() > (new Date("9999-12-29")).getTime() || (new Date(dateStart)).getTime() < (new Date("0001-01-01")).getTime())
            {
                elemDateStartError.hidden = false;
                elemDateStartError.textContent = "Дата вышла из допустимого диапазона";
                flagSuccess = false;
            }
        }

        if (dateEnd != '')
        {
            if ((new Date(dateEnd)).getTime() > (new Date("9999-12-29")).getTime() || (new Date(dateEnd)).getTime() < (new Date("0001-01-01")).getTime())
            {
                elemDateEndError.hidden = false;
                elemDateEndError.textContent = "Дата вышла из допустимого диапазона";
                flagSuccess = false;
            }
        }

        if (dateStart != '' && dateEnd == '')
        {
            dateEnd = '9999-12-29';
        }

        if (dateStart == '' && dateEnd != '')
        {
            dateStart = '0001-01-01';
        }

        if (dateStart != '' && dateEnd != '')
        {
            if ((new Date(dateStart)).getTime() > (new Date(dateEnd)).getTime())
            {
                elemDateStartError.hidden = false;
                elemDateEndError.hidden = false;
                elemDateStartError.textContent = "Некорректный диапазон дат";
                elemDateEndError.textContent = "Некорректный диапазон дат";
                flagSuccess = false;
            }
        }

        if (dateStart == '' && dateEnd == '')
        {
            dateStart = null;
            dateEnd = null;
        }

        if (sort != '' && sortType == '')
        {
            elemSortTypeError.hidden = false;
            elemSortTypeError.textContent = "Необходимо выбрать направление сортировки";
            flagSuccess = false;
        }

        if (sort == '' && sortType != '')
        {
            elemSortError.hidden = false;
            elemSortError.textContent = "Необходимо выбрать поле для сортировки";
            flagSuccess = false;
        }

        if (sort == '' && sortType == '')
        {
            sort = null;
            sortType = null;
        }

        if (sort != '' && sortType != '')
        {
            if (sort == 'Время публикации')
            {
                sort = "datetime";
            }
            else
            {
                if (sort == 'Категория')
                {
                    sort = "category";
                }
            }

            if (sortType == 'По возрастанию')
            {
                sortType = "asc";
            }
            else
            {
                if (sortType == 'По убыванию')
                {
                    sortType = "desc";
                }
            }
        }

        if (flagSuccess)
        {
            let dataForFetch = {
                category: category,
                dateStart: dateStart,
                dateEnd: dateEnd,
                sort: sort,
                sortType: sortType,
                page: page,
                pageLimit: parseInt(pageLimit)
            };

            let dataForPagination = {
                category: category,
                dateStart: dateStart,
                dateEnd: dateEnd,
                sort: sort,
                sortType: sortType,
                pageLimit: parseInt(pageLimit)
            };

            let response = await fetch('/api/articles/filter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataForFetch)
            });

            if (response.ok)
            {
                let articlesInformation = await response.json();
                showArticlesPreview(articlesInformation, elemLenResult, elemGetResult);
                generatePagesButton(page, parseInt(pageLimit), articlesInformation.len, dataForPagination);
            }
            else
            {
                elemGetResult.textContent = "Не удалось получить новостные статьи. Попробуйте ещё раз";
            }
        }

    }
    else
    {
        elemGetResult = document.getElementById("articlesPreview");
        elemLenResult = document.getElementById("countElements");
        elemPagination = document.getElementById("pagesElements");

        elemGetResult.textContent = "";
        elemLenResult.textContent = "";
        elemPagination.textContent = "";

        elemDateStartError = document.getElementById("dateStartFilterError");
        elemDateEndError = document.getElementById("dateEndFilterError");
        elemSortError = document.getElementById("sortFilterError");
        elemSortTypeError = document.getElementById("sortTypeFilterError");

        elemDateStartError.hidden = true;
        elemDateEndError.hidden = true;
        elemSortError.hidden = true;
        elemSortTypeError.hidden = true;

        let saveDataFromPagination = data;
        let saveDataForFetch = {
            category: saveDataFromPagination.category,
            dateStart: saveDataFromPagination.dateStart,
            dateEnd: saveDataFromPagination.dateEnd,
            sort: saveDataFromPagination.sort,
            sortType: saveDataFromPagination.sortType,
            page: page,
            pageLimit: saveDataFromPagination.pageLimit
        };

        let response = await fetch('/api/articles/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(saveDataForFetch)
        });

        if (response.ok)
        {
            let articlesInformation = await response.json();
            showArticlesPreview(articlesInformation, elemLenResult, elemGetResult);
            generatePagesButton(page, saveDataFromPagination.pageLimit, articlesInformation.len, saveDataFromPagination);
        }
        else
        {
            elemGetResult.textContent = "Не удалось получить новостные статьи. Попробуйте ещё раз";
        }
    }
}

function showArticlesPreview(articlesInformation, elemLen, elemArticles)
{
    elemLen.textContent = "Количество статей по запросу: " + articlesInformation.len.toString();
    let articlesStr = "";

    for (let i = 0; i < articlesInformation.articles.length; i++)
    {
        articlesStr = articlesStr + "<div><a href='/articles/" + articlesInformation.articles[i]["id"].toString() + "'>Новостная статья №" + articlesInformation.articles[i]["id"].toString() + "</a>";
        articlesStr = articlesStr + "<p>Заголовок: " + articlesInformation.articles[i]["title"] + "</p>";
        articlesStr = articlesStr + "<p>Дата публикации: " + articlesInformation.articles[i]["datetime"] + "</p>";
        if (articlesInformation.articles[i]["description"] !== 'None')
        {
            articlesStr = articlesStr + "<p>Описание: " + articlesInformation.articles[i]["description"] + "</p>";
        }
        if (articlesInformation.articles[i]["tags"].length != 0)
        {
            articlesStr = articlesStr + "<p>Теги: ";
            for (let j = 0; j < articlesInformation.articles[i]["tags"].length; j++)
            {
                articlesStr = articlesStr + articlesInformation.articles[i]["tags"][j];
                if (j != articlesInformation.articles[i]["tags"].length - 1)
                {
                    articlesStr = articlesStr + ",";
                }
            }
        }
        articlesStr = articlesStr + "</div>";
    }

    elemArticles.innerHTML = articlesStr;
}