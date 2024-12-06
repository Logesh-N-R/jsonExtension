document.addEventListener("DOMContentLoaded", function () {
  // Function to format and display JSON with Highlight.js
  function formatAndDisplayJSON(inputId, outputId) {
      const input = document.getElementById(inputId).value;
      const output = document.getElementById(outputId).querySelector('code');
      try {
          const jsonObj = JSON.parse(input);
          const formattedJson = JSON.stringify(jsonObj, null, 2);
          output.textContent = formattedJson;
          hljs.highlightElement(output);
      } catch (e) {
          output.textContent = "Invalid JSON";
      }
  }

  // Load saved JSON from localStorage on page load
  window.onload = function () {
      const inputText = localStorage.getItem("formattedJson");
      if (inputText !== null) {
          document.getElementById("inputText").value = inputText;
          formatAndDisplayJSON("inputText", "formattedinputText");
      }
  };

  // Update localStorage and reformat JSON on input change
  document.getElementById("inputText").addEventListener("input", function () {
      localStorage.setItem("formattedJson", this.value);
      formatAndDisplayJSON("inputText", "formattedinputText");
  });
});