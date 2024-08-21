const codeInputs = [];
for (let i = 1; i <= 6; i++) {
    codeInputs.push(document.getElementById(`code-input-${i}`));
}

for (let i = 0; i < codeInputs.length; i++) {
    codeInputs[i].addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length === 1) {
            if (codeInputs[i+1]) {
                codeInputs[i+1].disabled = false;
                codeInputs[i+1].focus();
            }
        }
        if (this.value.length > 1) {
            this.value = this.value.slice(0, 1);
        }
    });

    codeInputs[i].addEventListener('keydown', function(event) {
        if (event.key === 'Backspace') {
            if (this.value.length === 0 && codeInputs[i-1]) {
                codeInputs[i-1].focus();
                codeInputs[i-1].value = '';
                for (let j = i; j < codeInputs.length; j++) {
                    codeInputs[j].disabled = true;
                }
            } else {
                this.value = '';
                for (let j = i + 1; j < codeInputs.length; j++) {
                    codeInputs[j].disabled = true;
                }
            }
        }
    });
}
document.getElementById('btn-send').addEventListener('click', (e) => {
    e.preventDefault();
    let code = '';
    for (let i = 0; i < codeInputs.length; i++) {
        code += codeInputs[i].value;
    }
    if (!code) return;

    const url = '/api/login/byCode';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: code })
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/chat';
            }
        })
        .catch(error => console.log(error));
});
