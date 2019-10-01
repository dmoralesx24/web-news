
$(document).ready(function() {

 
    $.getJSON("/articles", function(data) {
      // For each one
    renderArticles(data);
    });
  


  function renderArticles(article) {
    let articleCards = [];
    
    for(let i = 0; i < article.length; i++) {
        articleCards.push(createCard(article[i]));
    };

    $("#articles").append(articleCards);
  }

  function createCard(article) {
    // This function takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article card
    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", article.link)
          .text(article.title),
        $("<a class='btn btn-success save-article'>Save Article</a>"),
        $("<a class='btn btn-secondary notes'>Article Notes</a>")
      )
    );

    var cardBody = $("<div class='card-body'>").text(article.body);

    card.append(cardHeader, cardBody);
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to save
    card.attr("data-id", article._id);
    // We return the constructed card jQuery element
    return card;
  };

  // this will scrape new articles
  $(".scrape-new").on("click", function() {
    $.getJSON("/scrape", function(data) {
      location.reload();
    })
  })

  // this will clear the articles out 
  $(".clear").on("click", function() {
    $("#articles").empty();
  });

  // Whenever someone clicks the note button
  $(document).on("click",".btn.notes", function() {
    // Empty the notes from the note section
    // Save the id from the article
    let thisId = $(this)
    .parents(".card").attr("data-id");
    $(".modal").modal("show");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $(".modal-title").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $(".modal-body").append("<p>Note Title</p>");
        $(".modal-body").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $(".modal-body").append("<p>Text</p>");
        $(".modal-body").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $(".modal-footer").append("<button class='btn btn-success save-note'>Save Note</button>")
        $(".btn.save-note").attr("data-id='" + data._id);

        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });

  // When you click the savenote button
  $(document).on("click", ".btn.save-note", function() {
    // Grab the id associated with the article from the submit button
    // let noteData;
    // let newNote = $("#titleinput #bodyinput").val()

    // if(newNote) {
    //   noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
    //   $.post("/articles/", noteData).then(function() {
    //     // When complete, close the modal
    //     modal.hideAll();
    //   });
    // }

    // Run a POST request to change the note, using what's entered in the inputs

    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
      });
    // Also, remove the values entered in the input and textarea for note entry

    $("#titleinput").val("");
    $("#bodyinput").val("");
    $(".modal").modal("hide");

  });

});
  