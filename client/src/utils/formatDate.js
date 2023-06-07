export function formatDate(date, showTime = true) {
  const event = new Date(date);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return showTime
    ? event.toLocaleTimeString("en-US", options)
    : event.toLocaleDateString("en-US", options);
}
