export function readAsDataURL(file) {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onloadend = () => {
      resolve(fr);
    };
  });
}

export function createElement(props) {
  const {
    tag, attributes, listeners, children, ...rest
  } = props;
  if (!tag) return children;
  const el = document.createElement(tag);
  if (attributes) {
    Object.keys(attributes).forEach((name) => {
      el.setAttribute(name, attributes[name]);
    });
  }
  if (listeners) {
    Object.keys(listeners).forEach((name) => {
      el[name] = listeners[name];
    });
  }
  if (children) {
    const childrenEl = children.map(createElement);
    childrenEl.forEach((child) => {
      el.appendChild(child);
    });
  }
  if (rest) {
    Object.keys(rest).forEach((name) => {
      el[name] = rest[name];
    });
  }
  return el;
}
