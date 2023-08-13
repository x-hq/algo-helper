from pynput.keyboard import Key, Listener

def on_press(key):
    try:
        print(key.char, end='', flush=True)
    except AttributeError:
        if key == Key.space:
            print(' ', end='', flush=True)
        elif key == Key.enter:
            print('\n', end='', flush=True)

def on_release(key):
    if key == Key.esc:
        # Stop the listener
        return False

# Start listening to the keyboard
with Listener(on_press=on_press, on_release=on_release) as listener:
    listener.join()