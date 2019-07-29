// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  var currentId;

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

  $(".delete-saved-article").on("click", function(event) {
    console.log("Delete click");
    var id = $(this).data("id");
    console.log(id);
    // Send the DELETE request.
    $.ajax("/articles/" + id, {
      type: "DELETE"
    }).then(function() {
      console.log("Deleted saved article", id);
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

  $(".note-it").on("click", function(event) {
    console.log("Note It click");
    var id = $(this).data("id");
    console.log(id);
    currentId = id;
    // Clear the form to start
    $(".db-notes").empty();
    $("#new-note").val("");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "GET",
      url: "/populatedarticle/" + currentId
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log("Get notes");
        console.log(data);
        console.log(data[0].notes[0].body);
        // Clear the form after submitting
        var outStr = "";
        $(".db-notes").empty();
        data[0].notes.forEach(element => {
          console.log(element);
          $(".db-notes").append(
            $(
              "<li class='list-group-item'>" +
                element.body +
                "<button type='button' class='btn btn-danger btn-sm float-right btn-deletenote' data='" +
                element._id +
                "'>X</button></li>"
            )
          );
          // outStr = outStr + element.body + "\n";
        });
        // $(".db-notes").val(outStr);
      });

    $("#noteModal").modal("show");
  });

  // Add a note
  $("#noteBtn").on("click", function(event) {
    event.preventDefault();

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + currentId,
      data: {
        // Value taken from note textarea
        body: $("#new-note")
          .val()
          .trim()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log("Added a new note");
        console.log(data);
        // Clear the form after submitting
        $(".db-notes").empty();
        $("#new-note").val("");

        $("#noteModal").modal("hide");
        location.reload();
      });
  });

  // $('.btn-deletenote').click(function (event) {})
  $(document).on("click", ".btn-deletenote", function() {
    event.preventDefault();
    console.log($(this).attr("data"));
    const id = $(this).attr("data");
    console.log(id);
    $.ajax(`/note/${id}`, {
      type: "DELETE"
    }).then(function() {
      $("#noteModal").modal("toggle");
    });
  });
});
