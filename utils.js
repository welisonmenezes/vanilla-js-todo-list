function createElement(type, attributes, content) {
    var element = document.createElement(type);

    for (var key in attributes) {
        if (key == "class") {
            attributes[key].split(" ").map((cls) => {
                element.classList.add(cls);
            });
        } else {
            element[key] = attributes[key];
        }
    }

    if (content) {
        if (isElement(content)) {
            element.appendChild(content);
        } else {
            element.innerHTML = content;
        }
    }

    return element;
}

function createTodoItem(item) {
    var liConfig = item.completed
        ? { class: "completed", id: "ui-item-id_" + item.id }
        : { id: "ui-item-id_" + item.id };
    var li = createElement("li", liConfig);
    var input = createElement("input", {
        type: "text",
        value: item.title,
        readOnly: "1",
        tabIndex: -1,
    });
    var checkmark = createElement("span", {
        class: "checkmark",
        tabIndex: "0",
    });
    var iconEdit = createElement(
        "i",
        {
            class: "material-icons",
        },
        "edit"
    );
    var buttonEdit = createElement(
        "button",
        {
            type: "button",
            class: "btn-edit",
        },
        iconEdit
    );
    var iconDelete = createElement(
        "i",
        {
            class: "material-icons",
        },
        "delete"
    );
    var buttonDelete = createElement(
        "button",
        {
            type: "button",
            class: "btn-delete",
        },
        iconDelete
    );

    li.appendChild(checkmark);
    li.appendChild(input);
    li.appendChild(buttonEdit);
    li.appendChild(buttonDelete);

    return li;
}

function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;
}

function uniqueID() {
    return "_" + Math.random().toString(36).substr(2, 9);
}

function getItemIDfromUI(li) {
    var id = li.getAttribute("id");
    return id.replace("ui-item-id_", "");
}

function updateItem(newItem) {
    todoItems.map((item) => {
        if (item.id === newItem.id) {
            item.title = newItem.title;
            item.completed = newItem.completed;
        }
    });
}

function getItemByID(id) {
    var theItem = todoItems.filter((item) => {
        return item.id === id;
    });
    return theItem[0];
}

function getItemsCompleted() {
    return todoItems.filter((item) => {
        return item.completed;
    });
}

function getItemsActive() {
    return todoItems.filter((item) => {
        return !item.completed;
    });
}

function getTotalItems() {
    return todoItems.length;
}

function getTotalCompletedItems() {
    return getItemsCompleted().length;
}

function getPercentage() {
    var total = todoItems.length;
    var totalCompleted = getTotalCompletedItems();
    return 100 / (total / totalCompleted);
}

function getFilteredItems(items, title) {
    return items.filter((item) => {
        return item.title.toLowerCase().includes(title.toLowerCase());
    });
}
