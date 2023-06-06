export function formatDate(date) {
  const event = new Date(date);
  const options = {
    day: "2-digit",
    year: "2-digit",
    month: "long",
    weekday: "short",
  };
  return event.toLocaleDateString("en-US", options);
}

