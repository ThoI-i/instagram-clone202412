
class CarouselManager {

  // 생성자
  constructor(container) {
    // 캐러셀을 감싸는 전체 부모태그
    this.container = container;

    // 이미지 트랙(실제 이미지가 배치될 공간)
    this.track = this.container.querySelector('.carousel-track');
    
    // 실제 이미지 파일 배열
    this.slides = [];
  }

  // 초기 이미지파일 배열 받기
  init(files) {
    this.slides = files;
    // 슬라이드 띄우기
    this.setUpPreview();
  }

  // 슬라이드 이미지 렌더링
  setUpPreview() {
    // 이미지 트랙 리셋
    this.track.innerHTML = '';

    this.slides.forEach(file => { 
      // 이미지 생성
      const $img = document.createElement('img');
      // raw file을 image url로 변환
      $img.src = URL.createObjectURL(file);

      // 이미지를 감쌀 박스 생성
      const $slideDiv = document.createElement('div');
      $slideDiv.classList.add('carousel-slide');
      $slideDiv.append($img);

      this.track.append($slideDiv);
    });
  }

}

export default CarouselManager;