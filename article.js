// Reload page on hash change
const renderHash = () => {
  window.history.go();
};
window.addEventListener("hashchange", renderHash, false);

// Define which article is being retrieved
const articleSlug = location.hash.slice(1);

// Create article container
const articleContainer = addToElementbyId("div", "article", app);

// Call for article info
deliveryClient
  .items()
  .type("article")
  .equalsFilter("elements.url_pattern", articleSlug)
  .queryConfig({
    urlSlugResolver: (link, context) => {
      return resolveUrl(link);
    },
    richTextResolver: (item, context) => {
      return resolveLinkedItems(item);
    }
  })
  .toPromise()
  .then(response => {
    // Check if article found before adding
    const article =
      response.items && response.items.length ? response.items[0] : undefined;

    // 404 message if not found
    if (!article) {
      app.innerHTML = notFound;
      return;
    }

    // Create nodes
    const headerImage = createElement(
      "img",
      "article-header",
      "src",
      article.teaser_image.value[0].url + "?w=500&h=500"
    );
    const title = createElement(
      "h2",
      "article-title",
      "innerText",
      article.title.value
    );
    const body = createElement(
      "div",
      "article-description",
      "innerHTML",
      article.body_copy.resolveHtml()
    );

    // Add nodes to DOM
    articleContainer.append(headerImage, title, body);
    return;
  })
  .catch(err => {
    reportErrors(err);
  });
