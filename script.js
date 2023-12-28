document.addEventListener('DOMContentLoaded', () => {
    let isRecording = false;
    let recordedChunks = [];
    // let recordedAudioUrls = [];

    const recordButton = document.getElementById('recordButton');
    // const playButton = document.getElementById('playButton');

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            let timer = 0;
            let timerInterval;

            mediaRecorder.onstart = () => {
                timer = 0;
                timerInterval = setInterval(() => {
                    timer++;
                    const minutes = Math.floor(timer / 60);
                    const seconds = timer % 60;
                    const timerString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    document.getElementById('timer').textContent = timerString;
                }, 1000);
            };

            mediaRecorder.onstop = () => {
                clearInterval(timerInterval);
                const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);

                // document.getElementById('timer').style.color = 'black';

                const chatContainer = document.getElementById('chat-container');

                // Bubble element for the recorded message
                const bubbleElement = document.createElement('div');
                bubbleElement.classList.add('bubble', 'bubble-right');

                // Adding a play icon inside the bubble
                const playIcon = document.createElement('div');
                playIcon.classList.add('play-icon');
                playIcon.addEventListener('click', () => {
                    const audio = new Audio(audioUrl);
                    audio.play();
                });
                bubbleElement.appendChild(playIcon);

                // Text message indicating the recording is saved
                const messageElement = document.createElement('div');
                messageElement.textContent = 'Click to play, recording saved';
                bubbleElement.appendChild(messageElement);

                chatContainer.appendChild(bubbleElement);

            };

            recordButton.onclick = () => {
                if (!isRecording) {
                    recordButton.classList.add('recording');

                } else {
                    recordButton.classList.remove('recording');
                }

                if (!isRecording) {
                    recordedChunks = [];
                    mediaRecorder.start();
                    recordButton.textContent = 'Stop Recording';
                    isRecording = true;
                } else {
                    mediaRecorder.stop();
                    recordButton.textContent = 'Record';
                    isRecording = false;
                }
            };
        })
        .catch((error) => {
            console.error('Error accessing microphone:', error);
        });
});