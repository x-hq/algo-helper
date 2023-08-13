export const sendAsHTMLOrText = async (html: string | null, text: string | null) => {
  const payload = {
    ...(text && { text }),
    ...(html && { html }),
  };

  if (Object.keys(payload).length === 0) {
    throw new Error("No content to send");
  }

  // const res = await fetch(`${process.env.APP_URL}
  const res = await fetch(`${process.env.APP_URL}/api/search`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  const response = await res.json();

  return response;
};
