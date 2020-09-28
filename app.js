var $listComponent = document.querySelector(".list");
var $emptyComponent = document.querySelector(".empty");
var $statusComponent = document.querySelector(".status");
var $filterComponent = document.querySelector(".filter");
var $todoItems = document.querySelector("#todo-items");
var $newItem = document.querySelector("#newItem");
var $handleNewItem = document.querySelector("#handleNewItem");

var todoItems = [];

window.addEventListener("load", () => {
    populateTodoList();
});

$handleNewItem.addEventListener("click", () => {
    addNewItem();
});

$newItem.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        addNewItem();
    }
});

function populateTodoList() {
    toogleEmptyItemsComponents();
    todoItems.forEach((item) => {
        $todoItems.appendChild(createTodoItem(item));
        addItemEventListeners();
    });
}

function toogleEmptyItemsComponents() {
    if (todoItems.length > 0) {
        $emptyComponent.classList.remove("show");
        $listComponent.classList.remove("hide");
        $statusComponent.classList.remove("hide");
        $filterComponent.classList.remove("hide");
    } else {
        $emptyComponent.classList.add("show");
        $listComponent.classList.add("hide");
        $statusComponent.classList.add("hide");
        $filterComponent.classList.add("hide");
    }
}

function addItemEventListeners() {
    var btnDelete = document.querySelector(".btn-delete");
    var btnEdit = document.querySelector(".btn-edit");
    var checkmark = document.querySelector(".checkmark");

    btnDelete.addEventListener("click", (event) => {
        deleteItem(event);
    });
    btnEdit.addEventListener("click", (event) => {
        enableEditItem(event);
    });
    checkmark.addEventListener("click", (event) => {
        toogleCheckedItem(event);
    });
}

function addNewItem() {
    var title = $newItem.value;
    if (title && title !== "") {
        // create the new item object
        var newItem = {
            id: uniqueID(),
            title: title,
            completed: false,
        };

        // update state todoItems
        todoItems.unshift(newItem);

        // update the ui
        $todoItems.prepend(createTodoItem(newItem));
        addItemEventListeners();
        toogleEmptyItemsComponents();
        $newItem.value = "";
    }
}

function deleteItem(event) {
    var li = event.currentTarget.parentElement;
    var id = getItemIDfromUI(li);

    // update state todoItems
    todoItems = todoItems.filter((item) => {
        return item.id !== id;
    });

    // update the ui
    li.parentElement.removeChild(li);
    toogleEmptyItemsComponents();
}

function enableEditItem(event) {
    var li = event.currentTarget.parentElement;
    var input = li.querySelector("input");

    // clone input to prevent multiple event listeners
    var new_input = input.cloneNode(true);
    li.replaceChild(new_input, input);
    new_input.removeAttribute("readonly");
    new_input.focus();
    new_input.selectionStart = new_input.selectionEnd = 10000;

    // add event on blur to turn readonly again
    new_input.addEventListener("blur", (event) => {
        editItem(event);
        new_input.setAttribute("readonly", "1");
    });
}

function toogleCheckedItem(event) {
    var li = event.currentTarget.parentElement;
    var id = getItemIDfromUI(li);

    // update the ui
    if (li.classList.contains("completed")) {
        li.classList.remove("completed");
    } else {
        li.classList.add("completed");
    }

    // update the item
    updateItem({
        id: id,
        title: getItemByID(id).title,
        completed: !getItemByID(id).completed,
    });
}

function editItem(event) {
    var li = event.currentTarget.parentElement;
    var id = getItemIDfromUI(li);

    if (event.currentTarget.value === "") {
        // if empty, delete the item
        li.querySelector(".btn-delete").click();
    } else {
        // else, update the item
        if (getItemByID(id).title !== event.currentTarget.value) {
            updateItem({
                id: id,
                title: event.currentTarget.value,
                completed: getItemByID(id).completed,
            });
        }
    }
}
