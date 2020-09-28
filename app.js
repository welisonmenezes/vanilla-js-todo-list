var $listComponent = document.querySelector(".list");
var $emptyComponent = document.querySelector(".empty");
var $statusComponent = document.querySelector(".status");
var $filterComponent = document.querySelector(".filter");
var $todoItems = document.querySelector("#todo-items");
var $newItem = document.querySelector("#newItem");
var $handleNewItem = document.querySelector("#handleNewItem");

var todoItems = [];

window.addEventListener("load", function () {
    populateTodoList();
});

$handleNewItem.addEventListener("click", function () {
    addNewItem();
});

$newItem.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        addNewItem();
    }
});

function populateTodoList() {
    toogleEmptyItemsComponents();
    todoItems.forEach(function (item) {
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

    btnDelete.addEventListener("click", deleteItem);
    btnEdit.addEventListener("click", enableEditItem);
    checkmark.addEventListener("click", toogleCheckedItem);
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

function deleteItem() {
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

function enableEditItem() {
    console.log(event.currentTarget);
}

function toogleCheckedItem() {
    console.log(event.currentTarget);
}
