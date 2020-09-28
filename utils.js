function createElement(type, attributes, content) {
    var element = document.createElement(type);

    for (var key in attributes) {
        if (key == "class") {
            element.classList.add(attributes[key]);
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
        ? { class: "completed", id: 'ui-item-id_' + item.id }
        : { id: 'ui-item-id_' + item.id };
    var li = createElement("li", liConfig);
    var input = createElement("input", {
        type: "text",
        value: item.title,
        readOnly: "1",
        tabindex: "-1",
    });
    var checkmark = createElement("span", {
        class: "checkmark",
        tabindex: "0",
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
    var id = li.getAttribute('id');
    return id.replace("ui-item-id_", "");
}
