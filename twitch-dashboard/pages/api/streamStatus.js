export default async function handler(req, res) {
  const { accessToken } = req.body;
  const userId = req.body.userId;

  if (!accessToken) {
    return res.status(400).json({ error: "Access token missing" });
  }

  try {
    const response = await fetch("https://api.twitch.tv/helix/streams?user_id=${userId}", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Twitch stream data" });
  }
}
