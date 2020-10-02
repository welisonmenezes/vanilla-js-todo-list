/*************************************************************************
 * SELECT THE HTML ELEMENTS
 *************************************************************************/

var $listComponent = document.querySelector(".list");
var $emptyComponent = document.querySelector(".empty");
var $statusComponent = document.querySelector(".status");
var $filterComponent = document.querySelector(".filter");
var $todoItems = document.querySelector("#todo-items");
var $newItem = document.querySelector("#newItem");
var $handleNewItem = document.querySelector("#handleNewItem");

/*************************************************************************
 * THE GLOBAL STATE
 *************************************************************************/

var todoItems = [];
var filterStatus = "";
var filterQuery = "";

/*************************************************************************
 * ADD EVENTS
 *************************************************************************/

window.addEventListener("load", () => {
    setStateFromLocalStorage();
    populateTodoList();

    // set the current filter status on UI
    var $currentLI = $filterComponent.querySelector(
        '[data-status="' + filterStatus + '"]'
    );
    if ($currentLI) {
        setActiveFilterStatusBtn($currentLI);
    }
});

document.querySelector('body').addEventListener('click', (event) => {
    addEventsToAccessibility(event);
});

document.querySelector('body').addEventListener('keyup', (event) => {
    addEventsToAccessibility(event);
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

$filterComponent.querySelectorAll("li").forEach(($li) => {
    $li.addEventListener("click", (event) => {
        filterListByStatus(event);
    });

    $li.addEventListener("keydown", (event) => {
        if (event.key === 'Enter') {
            filterListByStatus(event);
        }
    });
});

$filterComponent.querySelector("input").addEventListener("input", (event) => {
    filterListByTitle(event);
});

/*************************************************************************
 * METHODS
 *************************************************************************/

// POPULATE THE UI LIST
function populateTodoList(onload = true) {
    $todoItems.innerHTML = "";
    var items = [];

    switch (filterStatus) {
        case "active":
            items = getItemsActive();
            break;
        case "completed":
            items = getItemsCompleted();
            break;
        default:
            items = todoItems;
            break;
    }

    if (filterQuery.trim() !== "") {
        items = getFilteredItems(items, filterQuery);
    }

    items.forEach((item, index) => {
        var $li = createTodoItem(item, true);
        $todoItems.appendChild($li);
        if (onload) {
            setTimeout(() => $li.classList.add("animate-in"), index * 100);
        } else {
            setTimeout(() => $li.classList.add("filtered"), 1);
        }
        addItemEventListeners($li);
    });

    toogleEmptyItemsComponents();
    updateTheStatus();
}

// SHOW/HIDE SOME ELEMENTS ACCORDING IF TODO ITEMS HAS ELEMENT
function toogleEmptyItemsComponents() {
    if (getTotalItems() > 0) {
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

// ADD EVENTS TO THE TODO ITEMS ACTIONS
function addItemEventListeners($li) {
    var $btnDelete = $li.querySelector(".btn-delete");
    var $btnEdit = $li.querySelector(".btn-edit");
    var $checkmark = $li.querySelector(".checkmark");

    $btnDelete.addEventListener("click", (event) => {
        deleteItem(event);
    });
    $btnEdit.addEventListener("click", (event) => {
        enableEditItem(event);
    });
    $checkmark.addEventListener("click", (event) => {
        toogleCheckedItem(event);
    });
    $checkmark.addEventListener("keydown", (event) => {
        if (event.key === 'Enter') {
            toogleCheckedItem(event);
        }
    });
    $checkmark.addEventListener("focus", (event) => {
        addAccessibilityToCheckmark(event);
    });
}

// ADD NEW ITEM TO THE TODO LIST
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
        var $li = createTodoItem(newItem);
        $todoItems.prepend($li);
        setTimeout(() => $li.classList.add("animate-in"), 1);
        addItemEventListeners($li);
        toogleEmptyItemsComponents();
        updateTheStatus();
        $newItem.value = "";
        $newItem.focus();

        // update the storage
        localStorage["todoItems"] = JSON.stringify(todoItems);
    }
}

// DELETE AN ITEM FROM THE TODO LIST
function deleteItem(event) {
    var $li = event.currentTarget.parentElement;
    var id = getItemIDfromUI($li);

    // apply out animetion
    $li.classList.add("animate-out");
    $li.classList.remove("filtered");
    setTimeout(() => {
        // update state todoItems
        todoItems = todoItems.filter((item) => {
            return item.id !== id;
        });

        // update the ui
        $li.parentElement.removeChild($li);
        toogleEmptyItemsComponents();
        updateTheStatus();

        // update the storage
        localStorage["todoItems"] = JSON.stringify(todoItems);
    }, 500);
}

// TURN THE TODO ITEM EDITABLE
function enableEditItem(event) {
    var $li = event.currentTarget.parentElement;
    var $input = $li.querySelector("input");

    // clone input to prevent multiple event listeners
    var $new_input = $input.cloneNode(true);
    $li.replaceChild($new_input, $input);
    $new_input.removeAttribute("readonly");
    $new_input.focus();
    $new_input.selectionStart = $new_input.selectionEnd = 10000;

    // add event on blur to turn readonly again
    $new_input.addEventListener("blur", (event) => {
        editItem(event);
        $new_input.setAttribute("readonly", "1");
    });
}

// CHECK/UNCHECK THE TODO LIST ITEM
function toogleCheckedItem(event) {
    var $li = event.currentTarget.parentElement;
    var id = getItemIDfromUI($li);

    // update the ui
    if ($li.classList.contains("completed")) {
        $li.classList.remove("completed");
    } else {
        $li.classList.add("completed");
    }

    // update the item
    updateItem({
        id: id,
        title: getItemByID(id).title,
        completed: !getItemByID(id).completed,
    });

    // update the storage
    localStorage["todoItems"] = JSON.stringify(todoItems);

    updateTheStatus();
}

// EDIT THE TODO LIST ITEM
function editItem(event) {
    var $li = event.currentTarget.parentElement;
    var id = getItemIDfromUI($li);

    if (event.currentTarget.value === "") {
        // if empty, delete the item
        $li.querySelector(".btn-delete").click();
    } else {
        // else, update the item
        if (getItemByID(id).title !== event.currentTarget.value) {
            updateItem({
                id: id,
                title: event.currentTarget.value,
                completed: getItemByID(id).completed,
            });
            populateTodoList(false);

            // update the storage
            localStorage["todoItems"] = JSON.stringify(todoItems);
        }
    }
}

// UPDATE THE STATUS BAR
function updateTheStatus() {
    var $bar = $statusComponent.querySelector(".status-bar");
    var $span = $statusComponent.querySelector("span");
    var textStatus = getTotalCompletedItems() + " of " + getTotalItems();

    // update the ui
    $bar.style.width = getPercentage() + "%";
    $span.innerHTML = textStatus;
}

// FILTER THE TODO LIST BY STATUS
function filterListByStatus(event) {
    filterStatus = event.currentTarget.getAttribute("data-status");
    populateTodoList(false);
    setActiveFilterStatusBtn(event.currentTarget);

    // update the storage
    localStorage["filterStatus"] = filterStatus;
}

// FILTER THE TODO LIST BY TITLE
function filterListByTitle(event) {
    filterQuery = event.currentTarget.value;
    populateTodoList(false);
}

// SET THE CURRENT FILTER STATUS SELECTED ON UI
function setActiveFilterStatusBtn($theActive) {
    $filterComponent.querySelectorAll("li").forEach(($li) => {
        $li.classList.remove("active");
    });
    $theActive.classList.add("active");
}

// SET THE STATE FROM LOCAL STORAGE
function setStateFromLocalStorage() {
    if (localStorage["todoItems"]) {
        todoItems = JSON.parse(localStorage["todoItems"]);
    }

    if (localStorage["filterStatus"]) {
        filterStatus = localStorage["filterStatus"];
    }
}

// ADD EVENTS TO THE BODY TO APPLY ACCESSIBILITY
function addEventsToAccessibility() {
    document.querySelector('body').addEventListener('click', function(event) {
        removeActiveClassFromItemUI(event);
    });
    document.querySelector('body').addEventListener('keyup', function(event) {
        if (event.key === 'Tab') {
            removeActiveClassFromItemUI(event);
        }
    });
}

// ADD ACCESSIBILITY BY REMOVING active CLASS THAT SHOW BUTTONS ON FOCUSED ITEM
function removeActiveClassFromItemUI(event) {
    if (event.target.parentElement) {
        if(event.target.parentElement.classList.contains('list-item')) return;
        if (event.target.parentElement.parentElement) {
            if(event.target.parentElement.parentElement.classList.contains('list-item')) return;
        }
    }
    if (document.querySelector('.list li.active')) {
        document.querySelectorAll('.list li').forEach(item => {
            item.classList.remove('active');
        });
    }
}

// ADD ACCESSIBILITY BY SHOWING BUTTONS ON FOCUSED ITEM
function addAccessibilityToCheckmark(event) {
    document.querySelectorAll('.list li').forEach(item => {
        item.classList.remove('active');
    });
    const parent = event.currentTarget.parentElement;
    setTimeout(() => {
        parent.classList.add('active');
    }, 100);
}
