var $listComponent = document.querySelector(".list");
var $emptyComponent = document.querySelector(".empty");
var $statusComponent = document.querySelector(".status");
var $filterComponent = document.querySelector(".filter");
var $todoItems = document.querySelector("#todo-items");
var $newItem = document.querySelector("#newItem");
var $handleNewItem = document.querySelector("#handleNewItem");

var todoItems = [
    {
        id: "1",
        title: "Item 1",
        completed: false,
    },
    {
        id: "2",
        title: "Item 2",
        completed: true,
    },
    {
        id: "3",
        title: "Item 3",
        completed: false,
    },
    {
        id: "4",
        title: "Item 4",
        completed: true,
    },
    {
        id: "5",
        title: "Item 5",
        completed: false,
    },
];

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
    $todoItems.innerHTML = "";
    todoItems.forEach((item, index) => {
        var li = createTodoItem(item, true);
        $todoItems.appendChild(li);
        setTimeout(() => li.classList.add("animate-in"), (index * 100));
        addItemEventListeners(li);
    });
    toogleEmptyItemsComponents();
    updateTheStatus();
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

function addItemEventListeners(li) {
    var btnDelete = li.querySelector(".btn-delete");
    var btnEdit = li.querySelector(".btn-edit");
    var checkmark = li.querySelector(".checkmark");

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
        var li = createTodoItem(newItem);
        $todoItems.prepend(li);
        setTimeout(() => li.classList.add("animate-in"), 1);
        addItemEventListeners(li);
        toogleEmptyItemsComponents();
        updateTheStatus();
        $newItem.value = "";
        $newItem.focus();
    }
}

function deleteItem(event) {
    var li = event.currentTarget.parentElement;
    var id = getItemIDfromUI(li);

    // apply out animetion
    li.classList.add("animate-out");
    setTimeout(() => {
        // update state todoItems
        todoItems = todoItems.filter((item) => {
            return item.id !== id;
        });

        // update the ui
        li.parentElement.removeChild(li);
        toogleEmptyItemsComponents();
        updateTheStatus();
    }, 500);
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

    updateTheStatus();
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

function updateTheStatus() {
    var bar = $statusComponent.querySelector(".status-bar");
    var span = $statusComponent.querySelector("span");
    var textStatus = getTotalCompletedItems() + " of " + todoItems.length;

    // update the ui
    bar.style.width = getPercentage() + "%";
    span.innerHTML = textStatus;
}
