let currentIndex = 0;
const videosPerView = 4;

const carouselState = {};

function scrollCarousel(carouselId, direction) {
  const wrapper = document.getElementById(carouselId);
  const track = wrapper.querySelector('.carousel-track');
  const items = track.querySelectorAll('.video-item');
  const itemWidth = items[0].offsetWidth;
  const videosPerView = 4;

  const totalItems = items.length;
  const maxIndex = Math.ceil(totalItems / videosPerView) - 1;

  // Track scroll state per carousel
  if (!carouselState[carouselId]) {
    carouselState[carouselId] = 0;
  }

  carouselState[carouselId] += direction;
  if (carouselState[carouselId] < 0) carouselState[carouselId] = 0;
  if (carouselState[carouselId] > maxIndex) carouselState[carouselId] = maxIndex;

  const scrollAmount = itemWidth * videosPerView * carouselState[carouselId];
  track.style.transform = `translateX(-${scrollAmount}px)`;
}




     function openModalWithVideo(src) {
       const modal = document.getElementById("videoModal");
       const container = document.getElementById("modalVideoContainer");
       const modalVideo = `<video src="${src}" controls autoplay></video>`;
       container.innerHTML = modalVideo;
       modal.style.display = "flex";
     }
 
     function closeModal() {
       const modal = document.getElementById("videoModal");
       const container = document.getElementById("modalVideoContainer");
       modal.style.display = "none";
       container.innerHTML = "";
     }
 
     function showPreview(container) {
       const img = container.querySelector('img');
       const video = container.querySelector('video');
       img.style.display = 'none';
       video.style.display = 'block';
       video.currentTime = 0;
       video.play();
     }
 
     function hidePreview(container) {
       const img = container.querySelector('img');
       const video = container.querySelector('video');
       video.pause();
       video.style.display = 'none';
       img.style.display = 'block';
     }
   
