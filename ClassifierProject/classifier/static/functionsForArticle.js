function getArticleId() {
    let pathUrl = document.location.pathname;
    return parseInt(pathUrl.slice(pathUrl.lastIndexOf('/') + 1));
}

async function deleteArticle() {
    let articleId = getArticleId();
    let urlForFetch = '/api/articles/' + articleId.toString();
    let elemContent = document.getElementById("content");
    let elemDeleteError = document.getElementById("deleteError");

    elemDeleteError.hidden = true;

    let response = await fetch(urlForFetch, {
        method: 'DELETE',
    });

    if (response.ok) {
        elemContent.textContent = "Новостная статья удалена";
    }
    else {
        if (response.status == 400) {
            elemContent.textContent = "Новостная статья уже была удалена";
        }
        else {
            elemDeleteError.hidden = false;
            elemDeleteError.textContent = "Не получилось удалить новостную статью. Попробуйте ещё раз";
        }
    }
}

async function updateArticle() {
    let articleId = getArticleId();

    let source = document.getElementById("source").value;
    let category = document.getElementById("category").value;
    let datetime = document.getElementById("datetime").value;
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let text = document.getElementById("text").value;
    let tags = document.getElementById("tags").value;

    let elemSourceError = document.getElementById("sourceError");
    let elemDatetimeError = document.getElementById("datetimeError");
    let elemTitleError = document.getElementById("titleError");
    let elemDescriptionError = document.getElementById("descriptionError");
    let elemTextError = document.getElementById("textError");
    let elemTagsError = document.getElementById("tagsError");

    let elemUpdateResult = document.getElementById("updateResult");
    let elemContent = document.getElementById("content");
    elemUpdateResult.textContent = "";

    elemSourceError.hidden = true;
    elemDatetimeError.hidden = true;
    elemTitleError.hidden = true;
    elemDescriptionError.hidden = true;
    elemTextError.hidden = true;
    elemTagsError.hidden = true;

    let flagSuccess = true;

    if (source.trim() != '') {
        if (source.length <= 200) {
            let regExpSource = /^(?:(?:https?|ftp|telnet):\/\/(?:[a-z0-9_-]{1,32}(?::[a-z0-9_-]{1,32})?@)?)?(?:(?:[a-z0-9-]{1,128}\.)+(?:com|net|org|mil|edu|arpa|ru|gov|biz|info|aero|inc|name|[a-z]{2})|(?!0)(?:(?!0[^.]|255)[0-9]{1,3}\.){3}(?!0|255)[0-9]{1,3})(?:\/[a-z0-9.,_@%&?+=\~\/-]*)?(?:#[^ \'\"&<>]*)?$/i;
            if (!regExpSource.test(source)) {
                elemSourceError.hidden = false;
                elemSourceError.textContent = "Это не ссылка";
                flagSuccess = false;
            }
        }
        else {
            elemSourceError.hidden = false;
            elemSourceError.textContent = "Поле переполнено. Макс кол-во символов - 200";
            flagSuccess = false;
        }
    }
    else {
        elemSourceError.hidden = false;
        elemSourceError.textContent = "Это поле является обязательным";
        flagSuccess = false;
    }

    if (datetime.trim() != '') {
        let regExpForDatetime = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$/i;
        if (regExpForDatetime.test(datetime)) {
            let dateObject = new Date(datetime);
            let dateStrNew = dateObject.getFullYear() + '-' + ('0' + (dateObject.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObject.getDate()).slice(-2) + " " + ('0' + dateObject.getHours()).slice(-2) + ":" + ('0' + dateObject.getMinutes()).slice(-2);
            if (dateStrNew != datetime) {
                elemDatetimeError.hidden = false;
                elemDatetimeError.textContent = "Дата некорректна";
                flagSuccess = false;
            }
        }
        else {
            elemDatetimeError.hidden = false;
            elemDatetimeError.textContent = "Формат даты некорректен";
            flagSuccess = false;
        }
    }
    else {
        elemDatetimeError.hidden = false;
        elemDatetimeError.textContent = "Это поле является обязательным";
        flagSuccess = false;
    }

    if (title.trim() != '') {
        if (title.length > 1000) {
            elemTitleError.hidden = false;
            elemTitleError.textContent = "Поле переполнено. Макс кол-во символов - 1000";
            flagSuccess = false;
        }
    }
    else {
        elemTitleError.hidden = false;
        elemTitleError.textContent = "Это поле является обязательным";
        flagSuccess = false;
    }

    if (text.trim() != '') {
        if (text.length > 20000) {
            elemTextError.hidden = false;
            elemTextError.textContent = "Поле переполнено. Макс кол-во символов - 20000";
            flagSuccess = false;
        }
    }
    else {
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

    if (tags.trim() != '') {
        let tagsList = tags.split(',');
        let flagEmptyTag = false;
        let flagMaxChTag = false;

        if (tagsList.length <= 10) {
            for (let i = 0; i < tagsList.length; i++) {
                tagsList[i] = tagsList[i].trim();
                if (tagsList[i] != '') {
                    if (tagsList[i].length > 50) {
                        flagMaxChTag = true;
                    }
                }
                else {
                    flagEmptyTag = true;
                }
            }

            if (flagEmptyTag) {
                elemTagsError.hidden = false;
                elemTagsError.textContent = "Пустой тег";
                flagSuccess = false;
            }
            else {
                if (flagMaxChTag) {
                    elemTagsError.hidden = false;
                    elemTagsError.textContent = "Тег слишком длинный. Макс кол-во символов - 50";
                    flagSuccess = false;
                }
                else {
                    tags = tagsList;
                }
            }
        }
        else {
            elemTagsError.hidden = false;
            elemTagsError.textContent = "Слишком много тегов. Макс кол-во тегов - 10";
            flagSuccess = false;
        }
    }
    else {
        tags = null;
    }

    if (flagSuccess) {
        let data = {
            source: source,
            category: category,
            datetime: datetime,
            title: title,
            description: description,
            text: text,
            tags: tags
        };

        let urlForFetch = '/api/articles/' + articleId.toString();

        let response = await fetch(urlForFetch, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            elemUpdateResult.textContent = "Новостная статья успешна обновлена";
        }
        else {
            if (response.status == 400) {
                elemContent.textContent = "Новостная статья уже удалена";
            }
            else {
                elemUpdateResult.textContent = "Новостную статью не удалось обновить. Попробуйте ещё раз";
            }
        }
    }
}

async function showArticle() {
    let articleId = getArticleId();

    let elemArticleId = document.getElementById("articleId");
    let elemSource = document.getElementById("source");
    let elemCategory = document.getElementById("category");
    let elemDatetime = document.getElementById("datetime");
    let elemTitle = document.getElementById("title");
    let elemDescription = document.getElementById("description");
    let elemText = document.getElementById("text");
    let elemTags = document.getElementById("tags");

    let elemContent = document.getElementById("content");

    let urlForFetch = '/api/articles/' + articleId.toString();
    let response = await fetch(urlForFetch, {
        method: 'GET'
    });

    if (response.ok) {
        let articleInformation = await response.json();

        elemArticleId.textContent = "№ " + articleId.toString();
        elemSource.value = articleInformation["source"];
        elemCategory.value = articleInformation["category"];
        elemDatetime.value = articleInformation["datetime"].slice(0, 16);
        elemTitle.value = articleInformation["title"];
        if (articleInformation["description"] != 'None') {
            elemDescription.value = articleInformation["description"];
        }
        elemText.value = articleInformation["text"];

        let tagsStr = "";
        for (let i = 0; i < articleInformation["tags"].length; i++) {
            tagsStr = tagsStr + articleInformation["tags"][i];
            if (i != articleInformation["tags"].length - 1) {
                tagsStr = tagsStr + ",";
            }
        }
        elemTags.value = tagsStr;
    }
    else {
        elemContent.textContent = "Такой статьи не существует";
    }
}