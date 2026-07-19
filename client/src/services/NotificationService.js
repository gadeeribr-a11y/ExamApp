export function notify(message, type = "info") {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("examapp:notify", {
      detail: { message, type },
    })
  );
}

export default { notify };
