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
      // Set link based on type
      urlLocation =
        link.type === "article"
          ? `article.html#${link.urlSlug}`
          : link.type === "coffee"
          ? `coffee.html#${link.urlSlug}`
          : "unsupported-link";
      return { url: urlLocation };
    },
    richTextResolver: (item, context) => {
      // Resolved hosted videos
      if (item.system.type === "hosted_video") {
        const videoID = item.video_id.value;

        // Check if a video host exists
        const videoHost =
          item.video_host.value && item.video_host.value.length
            ? item.video_host.value[0]
            : undefined;
        if (videoHost) {
          // Return based on hosting provider
          return videoHost.codename === "youtube"
            ? `<iframe src="https://www.youtube.com/embed/${videoID}" width="560" height="315" frameborder="0"></iframe>`
            : `<iframe src="https://player.vimeo.com/video/${videoID}" width="560" height="315" allowfullscreen frameborder="0"></iframe>`;
        }
        return;
      }
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
