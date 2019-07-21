// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  $(".delete-article").on("click", function(event) {
    var id = $(this).data("id");
    console.log("Delete click");

    // Reload the page to get the updated list
    location.reload();
  });

  $(".save-it").on("click", function(event) {
    var id = $(this).data("id");
    console.log("Save click");
  });

  $(".delete-burger").on("click", function(event) {
    var id = $(this).data("id");

    // Send the DELETE request.
    $.ajax("/api/burgers/" + id, {
      type: "DELETE"
    }).then(function() {
      console.log("Deleted burger", id);
      // Reload the page to get the updated list
      location.reload();
    });
  });
});
