alert('Documento vinculado ao javascript');
alert('versao ULTIMA');

let mediaRecorder;
let recordedChunks = [];
let stream;

async function startCapture() {
    try {
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: {
                echoCancellation: true, // Adiciona cancelamento de eco
                noiseSuppression: true // Adiciona supressão de ruído
            }
        });
        const video = document.getElementById('video');
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
        };

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.onstop = handleStop;
        mediaRecorder.start();

        document.getElementById('stop').disabled = false;
    } catch (err) {
        console.error("Erro ao capturar a tela: ", err);
    }
}

function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
}

function handleStop() {
    const blob = new Blob(recordedChunks, {
        type: 'video/mp4'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'captura.mp4';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
}

function stopCapture() {
    mediaRecorder.stop();
    stream.getTracks().forEach(track => track.stop());
    document.getElementById('stop').disabled = true;
}

document.getElementById('start').addEventListener('click', () => {
    startCapture();
});

document.getElementById('stop').addEventListener('click', () => {
    stopCapture();
});