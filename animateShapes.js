document.addEventListener("DOMContentLoaded", function() {
    // 모든 도형을 선택
    const shapes = document.querySelectorAll('.rectangle');
    
    shapes.forEach(shape => {
        // 각 도형에 대해 0~2000ms의 랜덤한 딜레이를 생성
        const delay = Math.random() * 2000;  

        // 랜덤한 딜레이 후에 도형의 투명도를 변경하여 도형을 보이게 만듭니다.
        setTimeout(() => {
            shape.style.opacity = '1';
        }, delay);
    });
});
