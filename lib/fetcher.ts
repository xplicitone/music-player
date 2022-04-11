// abstract away http fetching mechanism. use hook later on that needs this. needs to be abstracted away otherwise a lot of manual work
export default function fetcher(url: string, data = undefined) {
  return fetch(`${window.location.origin}/api${url}`, {
    method: data ? "POST" : "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
