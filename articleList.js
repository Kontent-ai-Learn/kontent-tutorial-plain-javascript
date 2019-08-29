const app = document.getElementById("app");

const articleList = document.createElement("div");
articleList.setAttribute("id", "article-list");
app.appendChild(articleList);

var Kc = window["kenticoCloudDelivery"];

var deliveryClient = new Kc.DeliveryClient({
  projectId: "975bf280-fd91-488c-994c-2f04416e5ee3"
});

deliveryClient
  .items()
  .type("article")
  .toPromise()
  .then(response => {
    response.items.forEach(item => {
      let card = document.createElement("div");
      card.setAttribute("class", "card");

      let link = document.createElement("a");
      link.href = "./article.html#" + item.url_pattern.value;

      let teaser = document.createElement("img");
      teaser.setAttribute("class", "article-teaser");
      teaser.src = item.teaser_image.value[0].url + "?w=500&h=500";

      let title = document.createElement("h2");
      title.setAttribute("class", "article-title");
      title.innerText = item.title.value;

      let description = document.createElement("div");
      description.setAttribute("class", "article-description");
      description.innerHTML = item.body_copy.value.substring(0, 300);

      articleList.appendChild(card);

      card.appendChild(link);

      link.appendChild(teaser);
      link.appendChild(title);
      link.appendChild(description);
    });
  });
