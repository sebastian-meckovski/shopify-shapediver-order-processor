async function createShapediverExport(sessionId, exportId, parameters) {
  const headers = new Headers();
  headers.append("accept", "application/json, text/plain, */*");
  headers.append("accept-language", "en-US,en;q=0.9,lt;q=0.8");
  headers.append("content-type", "application/json");
  headers.append("origin", "http://localhost:3000");
  headers.append("priority", "u=1, i");
  headers.append("referer", "http://localhost:3000/");
  headers.append("sec-ch-ua", '"Microsoft Edge";v="135", "Not-A.Brand";v="8", "Chromium";v="135"');
  headers.append("sec-ch-ua-mobile", "?0");
  headers.append("sec-ch-ua-platform", '"Windows"');
  headers.append("sec-fetch-dest", "empty");
  headers.append("sec-fetch-mode", "cors");
  headers.append("sec-fetch-site", "cross-site");
  headers.append(
    "user-agent",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0"
  );
  headers.append("x-shapediver-builddate", "2025-03-04T15:18:46.787Z");
  headers.append("x-shapediver-buildversion", "3.3.8.12");
  headers.append("x-shapediver-origin", "http://localhost:3000");
  // headers.append("x-shapediver-sessionengineid", "4e5b8841-cede-473b-bf83-4e2865391bc0");

  const body = JSON.stringify({
    exports: { id: exportId },
    parameters: parameters,
  });


  const requestOptions = {
    method: "PUT",
    headers: headers,
    body: body,
    redirect: "follow",
  };

  const url = `https://sdr8euc1.eu-central-1.shapediver.com/api/v2/session/${sessionId}/export`;

  try {
    const response = await fetch(url, requestOptions);
    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

module.exports = {
  createShapediverExport,
};
