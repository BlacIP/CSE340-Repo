document.addEventListener('DOMContentLoaded', function() {
    const detailButtons = document.querySelectorAll('.details-btn');

    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const detailId = this.getAttribute('data-id');
            const detailsContent = document.getElementById(detailId);

            if (detailsContent.style.display === "none" || !detailsContent.style.display) {
                detailsContent.style.display = "block";
            } else {
                detailsContent.style.display = "none";
            }
        });
    });

    const modal = document.getElementById("flashModal");
    const closeBtn = document.querySelector(".close");

    if (modal) {
      const flashMessage = modal.querySelector(".flash-message").innerText;
      if (flashMessage.trim() !== "") {
        modal.style.display = "block";
      }

      closeBtn.onclick = function() {
        modal.style.display = "none";
      }

      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
    }
  });