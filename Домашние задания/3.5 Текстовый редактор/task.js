const editor = document.getElementById('editor');
const clearButton = document.getElementById('clear');

const saveText = localStorage.getItem('editorContent')
if (saveText) {
    editor.value = saveText;
}

editor.addEventListener('input', () => {
    localStorage.setItem('editorContent', editor.value);
});

clearButton.addEventListener('click', () => {
    editor.value = '';

    localStorage.removeItem('editorContent')
});