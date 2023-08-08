chrome.action.onClicked.addListener((tab) => {
  console.log("Attempting action command");
  chrome.action.setBadgeText({ text: "⌛️" });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: contentScriptFunc,
      args: ["action"],
    },
    async function (payload) {
      try {
        const data = payload?.[0]?.result;

        if (!data) {
          throw "Missing data";
        }

        console.log("Extension result", data);

        const res = await fetch("http://localhost:5000/api/v1/search", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const postResult = await res.json();

        console.log("POST result", postResult);

        if (postResult?.success) {
          chrome.action.setBadgeText({ text: "✅" });
        }
      } catch (e) {
        console.error(e);
        chrome.action.setBadgeText({ text: "❌" });
      }
    }
  );
});

async function contentScriptFunc(name, append = false) {
  function removeSpansRecursively(node) {
    if (!node) {
      return;
    }

    // We can't remove the elements while we're iterating over the childNodes
    // collection, so we keep a list of nodes to remove later.
    let spansToRemove = [];

    for (let child of node.childNodes) {
      // Recurse into child nodes
      removeSpansRecursively(child);

      if (
        child.nodeType === Node.ELEMENT_NODE &&
        child.tagName.toLowerCase() === "span"
      ) {
        // Mark span elements for removal
        spansToRemove.push(child);
      }
    }

    for (let span of spansToRemove) {
      // Replace the span with its children
      while (span.firstChild) {
        span.parentNode.insertBefore(span.firstChild, span);
      }

      // Remove the empty span element
      span.parentNode.removeChild(span);
    }
  }

  function cleanNode(node) {
    if (!node) return null;

    // Create a clone of the node
    let clone = node.cloneNode(true);

    // // Function to recursively remove attributes
    // function recursiveRemoveAttributes(node) {
    //   while (node.attributes.length > 0) {
    //     node.removeAttribute(node.attributes[0].name);
    //   }
    //   // Recursively call the function for all children of the node
    //   for (let i = 0; i < node.children.length; i++) {
    //     recursiveRemoveAttributes(node.children[i]);
    //   }
    // }

    // // Start the recursive removal of attributes
    // recursiveRemoveAttributes(clone);

    // // Clean up span elements
    // removeSpansRecursively(clone);

    // // Remove redundant nodes
    // removeRedundantDivs(clone);

    // Return the outerHTML of the modified clone
    return clone.outerHTML;
  }

  function removeRedundantDivs(node) {
    // Check each child node
    for (let child of Array.from(node.childNodes)) {
      removeRedundantDivs(child);
    }

    // If the node is a div and all its child nodes are also divs
    if (
      node.nodeName === "DIV" &&
      Array.from(node.childNodes).every(
        (child) =>
          child.nodeType === Node.ELEMENT_NODE && child.nodeName === "DIV"
      )
    ) {
      // If the node has a parent, replace the node with its children
      if (node.parentNode) {
        while (node.firstChild) {
          node.parentNode.insertBefore(node.firstChild, node);
        }
        node.parentNode.removeChild(node);
      }
    }
  }

  const selectionText = window.getSelection()?.toString();

  console.log("COPY SELECTION", selectionText);

  let payload = {};
  if (selectionText && selectionText.length > 0) {
    payload = {
      text: selectionText,
    };
  }

  console.log("CONTENT SCRIPT ARGS/FN", name, append, selectionText, payload);

  // We're appending data to the messages, return.
  if (append === true || selectionText) {
    return payload;
  }

  // Continue with markdown node
  const nodeFns = [
    ".MarkdownOutput",
    ".page .markdown",
    '[data-track-load="description_content"]',
    ".splitPane .paneContent",
    ".problem-statement-container",
    ".hackdown-content"
  ];
  const cleanFoundNodes = [];

  try {
    const iframes = document.querySelectorAll("iframe");

    nodeFns.forEach((selector) => {
      const local = document.querySelector(selector);
      cleanFoundNodes.push(cleanNode(local));

      if (iframes.length) {
        iframes.forEach((iframe) => {
          try {
            const inIframe =
              iframe.contentWindow.document.querySelector(selector);
            cleanFoundNodes.push(cleanNode(inIframe));
          } catch (e) {
            console.log(`Error accessing iframe content: ${e.message}`);
          }
        });
      }
    });
  } catch (e) {
    console.log("Error finding nodes", e);
  }

  console.log("foudn nodes", cleanFoundNodes);

  const nodeHTML = cleanFoundNodes.filter(Boolean)?.[0];

  if (!nodeHTML) {
    console.log("Markdown not found");
    return;
  }

  console.log("Sending", nodeHTML);
  // try to detect
  payload = {
    html: nodeHTML,
  };

  return payload;
}

chrome.commands.onCommand.addListener(async function (command) {
  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  chrome.action.setBadgeText({ text: "⌛️" });
  switch (command) {
    case "execute-paste": {
      console.log("Attempting execute-paste");
      const res = await fetch("http://localhost:5000/api/v1/search/paste", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const result = await res.json();

      if (result?.success) {
        chrome.action.setBadgeText({ text: "✅" });
      }
      return result;
    }
    case "execute-add":
      {
        const tab = await getCurrentTab();

        console.log("Attempting add-data on tab", tab);
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            func: contentScriptFunc,
            args: ["action", true],
          },
          async function (payload) {
            console.log("Add data result", payload);

            const data = payload?.[0]?.result;

            if (!data) {
              throw "Missing return data";
            }

            const res = await fetch("http://localhost:5000/api/v1/search/add", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });

            const result = await res.json();

            if (result?.success) {
              chrome.action.setBadgeText({ text: "✅" });
            }

            return result;
          }
        );
        return;
      }
      return;
  }

  chrome.action.setBadgeText({ text: "❌" });
});
