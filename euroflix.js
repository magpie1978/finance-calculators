let currentIndex = 0;
const videosPerView = 4;

function scrollCarousel(direction) {
  const track = document.getElementById('carouselTrack');
  const items = track.querySelectorAll('.video-item');
  const itemWidth = items[0].offsetWidth;
  const totalItems = items.length;

  const maxIndex = Math.ceil(totalItems / videosPerView) - 1;

  currentIndex += direction;
  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > maxIndex) currentIndex = maxIndex;

  const scrollAmount = itemWidth * videosPerView * currentIndex;
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
   
