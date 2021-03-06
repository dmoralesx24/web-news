$(document).ready(function() {
  // Setting a reference to the article-container div where all the dynamic content will go
  // Adding event listeners to any dynamically generated "save article"
  // and "scrape new article" buttons
  initPage();
  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.save-article", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);
  $(".clear").on("click", handleArticleClear);

  // Empty the article container, run an AJAX request for any saved headlines
  function initPage() {
    $.getJSON("/articles", function(data) {
      // For each one
      // console.log(data);
      articleContainer.empty();
      // If we have headlines, render them to the page
      if (data && data.length) {
        renderArticles(data);
      } else {
        // Otherwise render a message explaining we have no articles
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    // This function handles appending HTML containing our article data to the page
    // We are passed an array of JSON containing all available articles in our database
    var articleCards = [];
    // We pass each article JSON object to the createCard function which returns a bootstrap
    // card with our article data inside
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    // Once we have all of the HTML for the articles stored in our articleCards array,
    // append them to the articleCards container
    articleContainer.append(articleCards);
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
        $("<a class='btn btn-success save-article'>Save Article</a>")
      )
    );

    var cardBody = $("<div class='card-body'>").text(article.body);

    card.append(cardHeader, cardBody);

    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to remove or open notes for
    card.attr("data-id", article._id);
    // We return the constructed card jQuery element
    return card;
  }

  // a message for an empty article
  function renderEmpty() {
    // This function renders some HTML to the page explaining we don't have any articles to view
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }

  // saving the articles
  function handleArticleSave() {
    // This function is triggered when the user wants to save an article
    // When we rendered the article initially, we attached a javascript object containing the headline id
    // to the element using the .data method. Here we retrieve that.
    let card = $(this).parents(".card");
    let articleId = $(this)
      .parents(".card")
      .attr("data-id");

    let articleLink = card.find(".article-link").attr("href");

    let articleTitle = card.find(".article-link").text();

    let articleBody = card.find(".card-body").text();

    // Using a patch method to be semantic since this is an update to an existing record in our collection
    $.ajax({
      method: "POST",
      url: "/save/" + articleId,
      data: {
        title: articleTitle,
        link: articleLink,
        body: articleBody
      }
    }).then(function(data) {
      // Run the initPage function again. This will reload the entire list of articles
    });

    // this will delete the article out of this db and just post it into the saved articles
    $.ajax({
      method: "DELETE",
      url: "/articles/" + articleId
    }).then(function(data) {
      // Remove card from page
      $(this)
        .parents(".card")
        .remove();
      initPage();
    });
  }

  function handleArticleScrape() {
    // This function handles the user clicking any "scrape new article" buttons
    $.get("/scrape").then(function(data) {
      // If we are able to successfully scrape the NYTIMES and compare the articles to those
      // already in our collection, re render the articles on the page
      // and let the user know how many unique articles we were able to save
      initPage();
      bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
    });
  }

  // this will clear the articles out
  function handleArticleClear() {
    $.ajax({
      method: "DELETE",
      url: "/articles"
    }).then(function(data) {
      articleContainer.empty();
      initPage();
    });
  }
});
