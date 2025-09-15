// netlify/functions/pdf-proxy.js

export async function handler(event) {
  const url = event.queryStringParameters.url;
  if (!url) {
    return {
      statusCode: 400,
      body: "Missing url parameter"
    };
  }

  try {
    // Récupère le PDF distant
    const res = await fetch(url);
    if (!res.ok) {
      return {
        statusCode: res.status,
        body: `Error fetching file: ${res.statusText}`
      };
    }

    // Renvoie le PDF avec les bons headers
    const buffer = await res.arrayBuffer();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=file.pdf",
        "Access-Control-Allow-Origin": "*" // facultatif, mais utile si réutilisé ailleurs
      },
      body: Buffer.from(buffer).toString("base64"),
      isBase64Encoded: true
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: `Internal error: ${e.message}`
    };
  }
}
