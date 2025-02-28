document.addEventListener('DOMContentLoaded', function() {
    const topSlider = document.querySelector('.top-slider');
    const bottomSlider = document.querySelector('.bottom-slider');
    const photos = [
        'index_folder/photo1.png',
        'index_folder/photo2.png',
        'index_folder/photo3.png',
        'index_folder/photo4.png',
        'index_folder/photo5.png'
    ];

    console.log('Top slider:', topSlider);
    console.log('Bottom slider:', bottomSlider);

    // 슬라이더 트랙 생성 함수
    function createSliderTrack(container) {
        const sliderTrack = container.querySelector('.slider-track');
        const fragment = document.createDocumentFragment();

        // 사진 3번 반복 (15장)
        for (let i = 0; i < 3; i++) {
            photos.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = 'Life four-cut';
                img.onerror = () => console.error(`Image load failed: ${src}`);
                fragment.appendChild(img);
            });
        }

        sliderTrack.appendChild(fragment);
        console.log('Slider track added successfully:', sliderTrack.children.length, 'images');
    }

    // Add tracks to top and bottom sliders
    createSliderTrack(topSlider);
    createSliderTrack(bottomSlider);

    // Start button event
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            window.location.href = 'photo.html';
        });
    } else {
        console.error('start-btn not found.');
    }
});