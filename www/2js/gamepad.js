
const gamepadMap = {
    buttons: {
        0: 'Enter', // A
        1: 'Backspace', // B
        2: 'Space', // X
        3: 'KeyY', // Y
        4: 'PageUp', // L1
        5: 'PageDown', // R1
        8: 'Home', // Select
        9: 'Escape', // Start
        12: 'ArrowUp', // D-pad up
        13: 'ArrowDown', // D-pad down
        14: 'ArrowLeft', // D-pad left
        15: 'ArrowRight', // D-pad right
    },
    axes: {
        0: { 'negative': 'ArrowLeft', 'positive': 'ArrowRight' }, // Left stick horizontal
        1: { 'negative': 'ArrowUp', 'positive': 'ArrowDown' }, // Left stick vertical
    }
};

let lastButtons = {};
let lastAxes = {};
let gamepadIndex = -1;

function findGamepad() {
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            gamepadIndex = i;
            return;
        }
    }
}

window.addEventListener('gamepadconnected', (event) => {
    console.log('Gamepad connected:', event.gamepad.id);
    findGamepad();
});

window.addEventListener('gamepaddisconnected', (event) => {
    console.log('Gamepad disconnected:', event.gamepad.id);
    gamepadIndex = -1;
});

function handleGamepadInput() {
    if (gamepadIndex === -1) {
        findGamepad();
        return;
    }

    const gamepad = navigator.getGamepads()[gamepadIndex];
    if (!gamepad) return;

    // Buttons
    for (let i = 0; i < gamepad.buttons.length; i++) {
        const button = gamepad.buttons[i];
        const lastButton = lastButtons[i] || { pressed: false };

        if (button.pressed && !lastButton.pressed) {
            const key = gamepadMap.buttons[i];
            if (key) {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
            }
        }
        lastButtons[i] = { pressed: button.pressed };
    }

    // Axes
    for (let i = 0; i < gamepad.axes.length; i++) {
        const value = gamepad.axes[i];
        const lastValue = lastAxes[i] || 0;
        const mapping = gamepadMap.axes[i];

        if (mapping) {
            if (value < -0.5 && lastValue >= -0.5) {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: mapping.negative }));
            } else if (value > 0.5 && lastValue <= 0.5) {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: mapping.positive }));
            }
        }
        lastAxes[i] = value;
    }
}

export function startGamepadPolling() {
    setInterval(handleGamepadInput, 100);
}
