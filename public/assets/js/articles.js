// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  $(".delete-article").on("click", function(event) {
    console.log("Delete click");
    var id = $(this).data("id");
    console.log(id);
    // Send the DELETE request.
    $.ajax("/articles/" + id, {
      type: "DELETE"
    }).then(function() {
      console.log("Deleted article", id);
      // Reload the page to get the updated list
      location.reload();
    });

  });

  $(".save-it").on("click", function(event) {
    console.log("Save click");
    var id = $(this).data("id");
    console.log(id);

    $.ajax("/articles/" + id, {
      type: "PUT"
    }).then(function() {
      console.log("Updated article", id);
      // Reload the page to get the updated list
      location.reload();
    });

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
