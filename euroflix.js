
    function scrollCarousel(direction) {
       const track = document.getElementById('carouselTrack');
       const scrollAmount = 1200;
       track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
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
   
