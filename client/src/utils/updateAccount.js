export async function updateAccount(headersArg, body) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/update`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      ...headersArg,
    },
    body: JSON.stringify(body),
  });
  return response;
}

