export const setCookie = (item, itemName) => {
  localStorage.setItem(item, JSON.stringify(itemName));
};

