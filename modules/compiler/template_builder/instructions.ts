export const createElement = (name: string) => `document.createElement(${name})`;
export const setAttribute = (name: string, value: string) => `document.setAttribute(${name},${value})`;