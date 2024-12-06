function diffUsingJS(viewType) {
    "use strict";
    var byId = function (id) { return document.getElementById(id); },
        baseText = byId("baseText").value,
        newText = byId("newText").value,
        sortOn = document.getElementById('sorton').checked;

    try {
        if (sortOn) {
            baseText = JSON.stringify(sortJSONKeys(JSON.parse(baseText)), null, 2);  // Format and sort the JSON string
        } else {
            baseText = JSON.stringify(JSON.parse(baseText), null, 2);  // Just format the JSON string
        }
    } catch (e) {
        alert('Left JSON is invalid. Please check your input.');
        return;
    }

    try {
        if (sortOn) {
            newText = JSON.stringify(sortJSONKeys(JSON.parse(newText)), null, 2);  // Format and sort the JSON string
        } else {
            newText = JSON.stringify(JSON.parse(newText), null, 2);  // Just format the JSON string
        }
    } catch (e) {
        alert('Right JSON is invalid. Please check your input.');
        return;
    }

    var base = difflib.stringAsLines(baseText),
        newtxt = difflib.stringAsLines(newText),
        sm = new difflib.SequenceMatcher(base, newtxt),
        opcodes = sm.get_opcodes(),
        diffoutputdiv = byId("diffoutput");

    diffoutputdiv.innerHTML = "";

    var diffView = diffview.buildView({
        baseTextLines: base,
        newTextLines: newtxt,
        opcodes: opcodes,
        baseTextName: "Left Json",
        newTextName: "Right Json",
        contextSize: null,
        viewType: viewType
    });

    diffoutputdiv.appendChild(diffView);

    // Apply Highlight.js to the diff output
    diffoutputdiv.querySelectorAll('td').forEach((block) => {
        block.classList.add('json');
        hljs.highlightElement(block);
    });
}

function sortJSONKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(sortJSONKeys);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).sort().reduce((result, key) => {
            result[key] = sortJSONKeys(obj[key]);
            return result;
        }, {});
    }
    return obj;
}

function updateDiff() {
    const viewType = document.querySelector('input[name="_viewtype"]:checked').id === 'sidebyside' ? 0 : 1;
    diffUsingJS(viewType);
}

document.getElementById('sidebyside').addEventListener('click', updateDiff);
document.getElementById('inline').addEventListener('click', updateDiff);
document.getElementById('sorton').addEventListener('click', updateDiff);
document.getElementById('sortoff').addEventListener('click', updateDiff);

window.onload = function () {
    const baseText = localStorage.getItem('leftJson');
    const newText = localStorage.getItem('rightJson');
    console.log(baseText);
    console.log(newText);
    if (baseText !== null) {
        document.getElementById('baseText').value = baseText;
    }
    if (newText !== null) {
        document.getElementById('newText').value = newText;
    }
    if(newText !== null || baseText !== null){
        updateDiff();
    }
};

document.getElementById('baseText').addEventListener('input', function () {
    localStorage.setItem('leftJson', this.value);
});
document.getElementById('newText').addEventListener('input', function () {
    localStorage.setItem('rightJson', this.value);
});