const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString();
};