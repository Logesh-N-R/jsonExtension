document.addEventListener('DOMContentLoaded', () => {
    loadJsons();

    // Attach event listener for save button
    document.getElementById('saveButton').addEventListener('click', saveJson);
    document.getElementById('saveChangesButton').addEventListener('click', saveChanges);

    // Highlight.js initialization
    hljs.highlightAll();
});

let currentKey = null;

function saveJson() {
    const jsonTitle = document.getElementById('jsonTitle').value;
    const jsonInput = document.getElementById('jsonInput').value;
    try {
        const jsonObject = JSON.parse(jsonInput);
        localStorage.setItem(jsonTitle, JSON.stringify(jsonObject));
        loadJsons();
        document.getElementById('jsonTitle').value = '';
        document.getElementById('jsonInput').value = '';
    } catch (error) {
        alert('Invalid JSON. Please check your input.');
    }
}

function loadJsons() {
    const jsonList = document.getElementById('jsonList');
    jsonList.innerHTML = '';

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const json = localStorage.getItem(key);

        try {
            const jsonObject = JSON.parse(json);
            const title = key;
            const formattedJson = JSON.stringify(jsonObject, null, 2);

            const li = document.createElement('li');
            li.dataset.key = key;

            li.innerHTML = `
    <div class='listCont'>
        <p title=${title}>${title}</p>
        <div>
            <button class="view-btn" data-key="${key}">View</button>
            <button class="delete-btn" data-key="${key}">Delete</button>
        </div>
    </div>
    `;
            jsonList.appendChild(li);
        } catch (error) {
            console.error('Error parsing JSON', error);
        }
    }

    // Attach event listeners to dynamically added buttons
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            viewJson(event.target.dataset.key);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            deleteJson(event.target.dataset.key);
        });
    });
}

function viewJson(key) {
    const jsonContentArea = document.getElementById('jsonContentArea');
    const jsonTitleInput = document.getElementById('viewJsonTitle');
    const json = localStorage.getItem(key);

    try {
        const jsonObject = JSON.parse(json);
        const formattedJson = JSON.stringify(jsonObject, null, 2);
        jsonContentArea.innerHTML = `<pre><code class="json">${formattedJson}</code></pre>`;
        jsonTitleInput.value = key;
        currentKey = key;
        document.getElementById('saveChangesButton').style.display = 'block'; // Show the save button

        // Highlight JSON content
        hljs.highlightElement(jsonContentArea.querySelector('code'));
    } catch (error) {
        jsonContentArea.innerHTML = 'Error displaying JSON content.';
    }
}

function deleteJson(key) {
    localStorage.removeItem(key);
    loadJsons();
    document.getElementById('jsonContentArea').innerHTML = ''; // Clear view area
    document.getElementById('saveChangesButton').style.display = 'none'; // Hide the save button
    document.getElementById('viewJsonTitle').value = ''; // Clear title input
}

function saveChanges() {
    if (currentKey) {
        const jsonContentArea = document.getElementById('jsonContentArea').innerText;
        const jsonTitleInput = document.getElementById('viewJsonTitle').value;
        try {
            const jsonObject = JSON.parse(jsonContentArea);
            localStorage.removeItem(currentKey);
            localStorage.setItem(jsonTitleInput, JSON.stringify(jsonObject));
            loadJsons();
        } catch (error) {
            alert('Invalid JSON content. Please check your changes.');
        }
    }
}