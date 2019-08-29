// Reload page on hash change
const renderHash = () => {
  window.history.go();
};

window.addEventListener("hashchange", renderHash, false);

// 404 message
const notFound = "<p>That article could not be found.</p>"

// Create article container
const app = document.getElementById("app");
const articleContainer = document.createElement("div");
articleContainer.setAttribute("class", "article");
app.appendChild(articleContainer);

var articleSlug = location.hash.slice(1);

var Kc = window["kenticoCloudDelivery"];

var deliveryClient = new Kc.DeliveryClient({
  projectId: "975bf280-fd91-488c-994c-2f04416e5ee3"
});

deliveryClient
  .items()
  .type("article")
  .equalsFilter("elements.url_pattern", articleSlug)
  .queryConfig({
    urlSlugResolver: (link, context) => {
      // Link to article hash
      if (link.type == "article") {
        return { 
          url: `article.html#${link.urlSlug}` 
        };
      }
      // For coffee links, redirect to React site
      if (link.type == "coffee") {
        return {
          url: `article.html#${link.urlSlug}`
        };
      }
      return { url: "unsupported-link" };
    }
  })
  .toPromise()
  .then(response => {
    var article = response.items[0];

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
  })
  .catch(err => {
    app.innerHTML = notFound
    console.log('error: ' + err)
  });
