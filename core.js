// Define main container
const app = document.getElementById("app");

// Function for creating and appending elements
const addToElementbyId = (elementType, id, parent) => {
  const element = document.createElement(elementType);
  element.setAttribute("id", id);
  parent.appendChild(element);
  return element;
};

// Set up Kentico Cloud delivery
const Kc = window["kenticoCloudDelivery"];
const deliveryClient = new Kc.DeliveryClient({
  projectId: "975bf280-fd91-488c-994c-2f04416e5ee3"
});

// Function for adding elements to DOM with specific attributes
const createElement = (elementType, classToAdd, attribute, attributeValue) => {
  const element = document.createElement(elementType);
  element.setAttribute("class", classToAdd);

  // Set attribute value based on the attribute required
  attribute === "href"
    ? (element.href = attributeValue)
    : attribute === "innerHTML"
    ? (element.innerHTML = attributeValue)
    : attribute === "innerText"
    ? (element.innerText = attributeValue)
    : attribute === "src"
    ? (element.src = attributeValue)
    : undefined;

  return element;
};

// Set link based on type
const resolveUrl = link => {
  urlLocation =
    link.type === "article"
      ? `article.html#${link.urlSlug}`
      : link.type === "coffee"
      ? `coffee.html#${link.urlSlug}`
      : "unsupported-link";
  return { url: urlLocation };
};

// Resolved hosted videos
const resolveLinkedItems = item => {
  if (item.system.type === "hosted_video") {
    const videoID = item.video_id.value;

    // Check if a video host exists
    const videoHost =
      item.video_host.value && item.video_host.value.length
        ? item.video_host.value[0].codename
        : undefined;
    if (videoHost) {
      // Return based on hosting provider
      return videoHost === "youtube"
        ? `<iframe src="https://www.youtube.com/embed/${videoID}" width="560" height="315" frameborder="0"></iframe>`
        : `<iframe src="https://player.vimeo.com/video/${videoID}" width="560" height="315" allowfullscreen frameborder="0"></iframe>`;
    }
    return "";
  }
  return "";
};

// Error messages
const notFound = "<p>That article could not be found.</p>";
const unknownError =
  "<p>An error occured 😞. Check the console for more details.</p>";
const reportErrors = err => {
  console.error(err);
  app.innerHTML = unknownError;
};
