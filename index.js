import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://shopping-cart-7146b-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const itemsInDB = new Set()

inputFieldEl.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        let inputValue = inputFieldEl.value
        if (inputValue === "") {
            return
        }
        if (itemsInDB.has(inputValue)) {
            alert("Item already in shopping list");
            clearInputFieldEl()
            return
        }
        push(shoppingListInDB, inputValue)

        clearInputFieldEl()
    }
})

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    if (inputValue === "") {
        return
    }
    if (itemsInDB.has(inputValue)) {
        alert("Item already in shopping list");
        clearInputFieldEl()
        return
    }
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
    itemsInDB.clear()
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        itemsArray.forEach(item => {
            itemsInDB.add(item[1])
        })
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        itemsInDB.delete(itemValue)
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}