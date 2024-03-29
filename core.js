// Define main container
const app = document.getElementById('app');

// Function for creating and appending elements
const addToElementbyId = (elementType, id, parent) => {
  const element = document.createElement(elementType);
  element.setAttribute('id', id);
  parent.appendChild(element);
  return element;
};

// Set up Kontent delivery
const Kk = window['kontentDelivery'];
const deliveryClient = new Kk.createDeliveryClient({
  projectId: '975bf280-fd91-488c-994c-2f04416e5ee3'
});

// Function for adding elements to DOM with specific attributes
const createElement = (elementType, classToAdd, attribute, attributeValue) => {
  const element = document.createElement(elementType);
  element.setAttribute('class', classToAdd);

  // Set attribute value based on the attribute required
  attribute === 'href'
    ? (element.href = attributeValue)
    : attribute === 'innerHTML'
    ? (element.innerHTML = attributeValue)
    : attribute === 'innerText'
    ? (element.innerText = attributeValue)
    : attribute === 'src'
    ? (element.src = attributeValue)
    : undefined;

  return element;
};

// Error messages
const reportErrors = err => {
  console.error(err);
  app.innerHTML = `<p>An error occured 😞:</p><p><i>${err}</i></p>`;
};
