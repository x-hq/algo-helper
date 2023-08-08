// Get the active element
const activeElement = document.activeElement;

console.log("Pasting into the active element");
// Read the clipboard
navigator.clipboard.readText().then((text) => {
  console.log("Clipboard text", text);
  let index = 0;

  // Limit the text length to 500 characters
  text = text.substring(0, 500);

  // Function to "type" a letter
  const typeLetter = () => {
    if (index >= text.length) {
      clearInterval(typeInterval);
      return;
    }

    activeElement.value += text[index];
    index += 1;
  };

  // Start "typing"
  const typeInterval = setInterval(typeLetter, 100);
});
