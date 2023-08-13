tell application "Google Chrome"
    execute front window's active tab javascript "document.documentElement.outerHTML"
end tell
