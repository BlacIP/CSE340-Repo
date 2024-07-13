document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("errorModal");
    const span = document.getElementsByClassName("close")[0];
    const hasErrors = document.getElementById("hasErrors");
  
    // Display the modal if the hidden input field has value "true"
    if (hasErrors && hasErrors.value === 'true') {
      modal.style.display = "block";
    }
  
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }
  
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  });


  document.addEventListener("DOMContentLoaded", function() {
    var items = document.querySelectorAll(".Inventory-maanagement li");
  
    items.forEach(function(item) {
      item.addEventListener("click", function() {
        var link = item.querySelector("a");
        if (link) {
          link.click();
        }
      });
    });
  });
  