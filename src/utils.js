export function showMessage(message) {
    const messageBox = document.getElementById('message-box');
    document.getElementById('message-text').innerText = message;
    messageBox.style.display = 'block';
};

export function hideMessage() {
    document.getElementById('message-box').style.display = 'none';
};