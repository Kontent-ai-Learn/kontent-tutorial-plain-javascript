// Reload page on hash change
const renderHash = () => {
  window.history.go();
};
window.addEventListener('hashchange', renderHash, false);

// Define which article is being retrieved
const articleSlug = location.hash.slice(1);

// Create article container
const articleContainer = addToElementbyId('div', 'article', app);

// Call for article info
deliveryClient
  .items()
  .type('article')
  .equalsFilter('elements.url_pattern', articleSlug)
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
      response.data.items && response.data.items.length ? response.data.items[0] : undefined;

    // 404 message if not found
    if (!article) {
      app.innerHTML = '<p>That article could not be found.</p>';;
      return;
    }

    // Update title
    document.title = `Article | ${article.system.name}`;

    // Transform image 
    const transformedImageUrl = Kk.transformImageUrl(article.elements.teaser_image.value[0].url)
      .withDpr(2)
      .withCompression('lossless')
      .withHeight(300)
      .withWidth(300)
      .getUrl();

    // Create nodes
    const headerImage = createElement(
      'img',
      'article-header',
      'src',
      transformedImageUrl
    );
    const title = createElement(
      'h2',
      'article-title',
      'innerText',
      article.elements.title.value
    );

    const richTextElement = article.elements.body_copy;

    const rteResolver = Kk.createRichTextHtmlResolver().resolveRichText({
      element: richTextElement,
      linkedItems: Kk.linkedItemsHelper.convertLinkedItemsToArray(response.data.linkedItems),
      urlResolver: (linkId, linkText, link) => {
        const urlLocation =
          link.type === 'article'
            ? `article.html#${link.urlSlug}`
            : link.type === 'coffee'
              ? `coffee.html#${link.urlSlug}`
              : 'unsupported-link';
        return { linkUrl: urlLocation };
      },
      contentItemResolver: (itemId, item) => {
        if (item.system.type === 'hosted_video') {
          const videoID = item.elements.video_id.value;

          // Check if a video host exists
          const videoHost =
            item.elements.video_host.value && item.elements.video_host.value.length
              ? item.elements.video_host.value[0].codename
              : undefined;
          if (videoHost) {
            // Return based on hosting provider
            const htmlCode = videoHost === 'youtube'
              ? `<iframe src='https://www.youtube.com/embed/${videoID}' width='560' height='315' frameborder='0'></iframe>`
              : `<iframe src='https://player.vimeo.com/video/${videoID}' width='560' height='315' allowfullscreen frameborder='0'></iframe>`;

            return {
              contentItemHtml: htmlCode
            };

          }
        }
        return {
          contentItemHtml: ''
        };
      }
    });

    const body = createElement(
      'div',
      'article-description',
      'innerHTML',
      rteResolver.html
    );

    // Add nodes to DOM
    articleContainer.classList.add('card');
    articleContainer.append(headerImage, title, body);
    return;
  })
  .catch(err => {
    reportErrors(err);
  });
