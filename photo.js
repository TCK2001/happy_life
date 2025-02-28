document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('capture-btn');
    const photoFrame = document.getElementById('photo-frame');
    const colorButtons = document.querySelector('.color-buttons');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    const homeBtn = document.getElementById('home-btn');
    const colorPicker = document.getElementById('color-picker');
    const retakeBtn = document.getElementById('retake-btn'); // Retake Button

    let photoCount = 0;
    const maxPhotos = 4;
    const photosTaken = [];

    // 요소 확인
    if (!video || !canvas || !captureBtn) {
        console.error('Required elements are missing.');
        return;
    }

    // 카메라 시작 함수
    function startCamera() {
        const constraints = {
            video: { width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: 'user' }
        };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    console.log(`Video resolution: ${video.videoWidth}x${video.videoHeight}`);
                };
            })
            .catch(err => {
                console.error('Camera access error:', err);
                alert('Unable to access the camera.');
            });
    }

    // 카메라 중지 함수
    function stopCamera() {
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
    }

    // 사진 촬영 함수
    captureBtn.addEventListener('click', function() {
        if (photoCount < maxPhotos) {
            const context = canvas.getContext('2d');
            const videoWrapper = document.getElementById('video-wrapper');
            canvas.width = videoWrapper.offsetWidth;
            canvas.height = videoWrapper.offsetHeight;

            const videoAspect = video.videoWidth / video.videoHeight;
            const wrapperAspect = videoWrapper.offsetWidth / videoWrapper.offsetHeight;
            let sx = 0, sy = 0, sWidth = video.videoWidth, sHeight = video.videoHeight;

            if (videoAspect > wrapperAspect) {
                sWidth = video.videoHeight * wrapperAspect;
                sx = (video.videoWidth - sWidth) / 2;
            } else if (videoAspect < wrapperAspect) {
                sHeight = video.videoWidth / wrapperAspect;
                sy = (video.videoHeight - sHeight) / 2;
            }

            context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
            const imgDataURL = canvas.toDataURL('image/jpeg');
            photosTaken.push(imgDataURL);

            const img = document.createElement('img');
            img.src = imgDataURL;
            photoFrame.appendChild(img);

            updatePreview(); // 미리보기 업데이트
            photoCount++; // 👉 사진 개수 증가

            updateButtons(); // 버튼 상태 업데이트

            if (photoCount === maxPhotos) {
                captureBtn.disabled = true;
                colorButtons.style.display = 'block';
                downloadBtn.style.display = 'block';
                shareBtn.style.display = 'block';
            }
            else {
                colorButtons.style.display = 'none';
                downloadBtn.style.display = 'none';
                shareBtn.style.display = 'none';
            }
        }
    });

    // 🖼️ 미리보기 업데이트 함수 (모든 사진 출력)
    function updatePreview() {
        photoFrame.innerHTML = ""; // 기존 사진 제거
        photosTaken.forEach((imgSrc) => {
            const img = document.createElement('img');
            img.src = imgSrc;
            photoFrame.appendChild(img);
        });
    }

    // 🔄 Retake 버튼 클릭 시 마지막 사진 삭제
    retakeBtn.addEventListener("click", function () {
        if (photoCount > 0) {
            photoCount--; // 카운트 감소
            photosTaken.pop(); // 마지막 사진 제거
            updatePreview(); // 미리보기 업데이트
            updateButtons(); // 버튼 상태 업데이트
            
            if (photoCount === maxPhotos) {
                captureBtn.disabled = true;
                colorButtons.style.display = 'block';
                downloadBtn.style.display = 'block';
                shareBtn.style.display = 'block';
            }
            else {
                colorButtons.style.display = 'none';
                downloadBtn.style.display = 'none';
                shareBtn.style.display = 'none';
            }
        }
    });

    // ⚙️ 버튼 상태 업데이트 함수
    function updateButtons() {
        // Retake 버튼 상태 업데이트
        retakeBtn.style.display = (photoCount > 0) ? "block" : "none";

        // Download & Share 버튼 활성화 (사진이 4장일 때만)
        const isComplete = (photoCount === maxPhotos);
        downloadBtn.disabled = !isComplete;
        shareBtn.disabled = !isComplete;

        // Capture 버튼 활성화 (4장 이하일 때만)
        captureBtn.disabled = isComplete;
    }

    // 🎨 색상 선택기 이벤트
    if (colorPicker) {
        colorPicker.addEventListener('input', function () {
            photoFrame.style.backgroundColor = this.value;
        });
    }

    // 📥 다운로드 함수 (파일명: 현재 날짜+시간)
    downloadBtn.addEventListener('click', function () {
        if (photoCount === maxPhotos && typeof html2canvas === 'function') {
            html2canvas(photoFrame, { scale: 2 }).then(canvas => {
                const link = document.createElement('a');

                // 현재 날짜 및 시간 가져오기 (YYYYMMDD_HHMMSS 형식)
                const now = new Date();
                const timestamp = now.getFullYear() +
                    String(now.getMonth() + 1).padStart(2, '0') +
                    String(now.getDate()).padStart(2, '0') + "_" +
                    String(now.getHours()).padStart(2, '0') +
                    String(now.getMinutes()).padStart(2, '0') +
                    String(now.getSeconds()).padStart(2, '0');

                link.download = `photo_${timestamp}.png`; // 파일 이름 지정
                link.href = canvas.toDataURL('image/png', 1.0);
                link.click();
            });
        }
    });

    // 📤 공유 함수 (파일명 포함)
    shareBtn.addEventListener('click', function () {
        if (photoCount === maxPhotos && typeof html2canvas === 'function') {
            html2canvas(photoFrame).then(canvas => {
                canvas.toBlob(blob => {
                    if (navigator.share) {
                        // 현재 날짜 및 시간 가져오기 (YYYYMMDD_HHMMSS 형식)
                        const now = new Date();
                        const timestamp = now.getFullYear() +
                            String(now.getMonth() + 1).padStart(2, '0') +
                            String(now.getDate()).padStart(2, '0') + "_" +
                            String(now.getHours()).padStart(2, '0') +
                            String(now.getMinutes()).padStart(2, '0') +
                            String(now.getSeconds()).padStart(2, '0');

                        const file = new File([blob], `photo_${timestamp}.jpg`, { type: 'image/jpeg' });
                        navigator.share({
                            files: [file],
                            title: 'Photo Booth Image',
                            text: 'Check out my Photo Booth images!'
                        }).catch(() => alert('Sharing is not supported on this browser.'));
                    } else {
                        alert('Sharing is not supported on this browser.');
                    }
                });
            });
        }
    });

    // 🔄 사진 초기화 함수
    function resetPhotos() {
        photoCount = 0;
        photosTaken.length = 0;
        photoFrame.innerHTML = ""; // 사진 삭제
        updateButtons();
    }

    homeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        stopCamera();
        resetPhotos();
        window.location.href = 'index.html';
    });

    // 초기 버튼 상태 설정
    updateButtons();

    // 페이지 로드 시 카메라 시작
    startCamera();
});