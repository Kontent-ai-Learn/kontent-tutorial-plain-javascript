// Add list container to app
const articleList = addToElementbyId("div", "article-list", app);

// Call for a list of all articles
deliveryClient
  .items()
  .type("article")
  .toPromise()
  .then(response => {
    response.items.forEach(item => {
      // Create nodes
      const card = createElement("div", "card");
      const link = createElement(
        "a",
        "link",
        "href",
        "./article.html#" + item.url_pattern.value
      );
      const teaser = createElement(
        "img",
        "article-teaser",
        "src",
        item.teaser_image.value && item.teaser_image.value.length
          ? item.teaser_image.value[0].url + "?w=500&h=500"
          : undefined
      );
      const title = createElement(
        "h2",
        "article-title",
        "innerText",
        item.title.value
      );
      const description = createElement(
        "div",
        "article-description",
        "innerHTML",
        item.summary.value
      );

      // Add nodes to DOM
      articleList.appendChild(card);
      card.appendChild(link);
      link.append(teaser, title, description);
    });
  })
  .catch(err => {
    reportErrors(err);
  });
