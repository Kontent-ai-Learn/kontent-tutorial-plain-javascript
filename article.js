// Reload page on hash change
const renderHash = () => {
  window.history.go();
};

window.addEventListener("hashchange", renderHash, false);

// 404 message
const notFound = "<p>That article could not be found.</p>";

// Create article container
const app = document.getElementById("app");
const articleContainer = document.createElement("div");
articleContainer.setAttribute("class", "article");
app.appendChild(articleContainer);

let articleSlug = location.hash.slice(1);

const Kc = window["kenticoCloudDelivery"];

const deliveryClient = new Kc.DeliveryClient({
  projectId: "975bf280-fd91-488c-994c-2f04416e5ee3"
});

deliveryClient
  .items()
  .type("article")
  .equalsFilter("elements.url_pattern", articleSlug)
  .queryConfig({
    urlSlugResolver: (link, context) => {
      // Link to article hash
      if (link.type === "article") {
        return {
          url: `article.html#${link.urlSlug}`
        };
      }
      // Handle coffee links
      if (link.type === "coffee") {
        return {
          url: `coffee.html#${link.urlSlug}`
        };
      }
      return { url: "unsupported-link" };
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
    if (response.items && response.items.length) {
      let article = response.items[0];

      let headerImage = document.createElement("img");
      headerImage.setAttribute("class", "article-header");
      headerImage.src = article.teaser_image.value[0].url + "?w=500&h=500";

      let title = document.createElement("h2");
      title.setAttribute("class", "article-title");
      title.innerText = article.title.value;

      let body = document.createElement("div");
      body.setAttribute("class", "article-description");
      body.innerHTML = article.body_copy.resolveHtml();

      articleContainer.appendChild(headerImage);
      articleContainer.appendChild(title);
      articleContainer.appendChild(body);
    }
  })
  .catch(err => {
    app.innerHTML = notFound;
    console.log("error: " + err);
  });
