import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user and initial stream data once on auth
  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchUserAndStream() {
      setError(null);
      setUserData(null);
      setStreamData(null);

      try {
        // Fetch user data
        const userRes = await fetch("/api/twitchUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: session.accessToken }),
        });

        if (!userRes.ok) {
          const errorData = await userRes.json().catch(() => ({}));
          setError(errorData.error || `Failed to fetch user: ${userRes.status}`);
          return;
        }

        const userDataJson = await userRes.json();
        if (!Array.isArray(userDataJson.data) || userDataJson.data.length === 0) {
          setError("No user data returned");
          return;
        }
        const user = userDataJson.data[0];
        setUserData(user);

        // Fetch stream data using the user ID
        const streamRes = await fetch("/api/streamStatus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: session.accessToken, userId: user.id }),
        });

        if (!streamRes.ok) {
          const errorData = await streamRes.json().catch(() => ({}));
          setError(errorData.error || `Failed to fetch stream: ${streamRes.status}`);
          return;
        }

        const streamDataJson = await streamRes.json();
        if (Array.isArray(streamDataJson.data) && streamDataJson.data.length > 0) {
          setStreamData(streamDataJson.data[0]);
        } else {
          setStreamData(null); // no stream live
        }
      } catch (e) {
        console.error("Fetch error:", e);
        setError("Network error fetching data");
      }
    }

    fetchUserAndStream();
  }, [status, session]);

  // Poll stream data every 30 seconds ONLY if stream is live
  useEffect(() => {
    if (!session?.accessToken || !userData?.id || !streamData) {
      // No live stream or missing data, no polling
      return;
    }

    async function fetchStream() {
      try {
        const res = await fetch("/api/streamStatus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: session.accessToken, userId: userData.id }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          setError(errorData.error || `Failed to fetch stream: ${res.status}`);
          setStreamData(null); // stop polling if error
          return;
        }

        const streamDataJson = await res.json();
        if (Array.isArray(streamDataJson.data) && streamDataJson.data.length > 0) {
          setStreamData(streamDataJson.data[0]);
        } else {
          // Stream went offline — stop polling
          setStreamData(null);
        }
      } catch (e) {
        console.error("Fetch error:", e);
        setError("Network error fetching stream");
        setStreamData(null);
      }
    }

    const interval = setInterval(fetchStream, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [session, userData, streamData]);

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <div style={{ padding: "2rem", fontFamily: "Arial" }}>
        <p>You are not signed in.</p>
        <button onClick={() => signIn("twitch")}>Sign in with Twitch</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {userData ? (
        <div style={{ marginTop: "1rem" }}>
          <h1>Welcome, {userData.display_name}</h1>
          <img src={userData.profile_image_url} alt="Profile" />
          <p><strong>Username:</strong> {userData.login}</p>
          <p><strong>Type:</strong> {userData.type || "user"}</p>
          <p><strong>Broadcaster:</strong> {userData.broadcaster_type || "none"}</p>
          <p><strong>Bio:</strong> {userData.description}</p>
          <p><strong>View Count:</strong> {userData.view_count}</p>
          <p><strong>Joined:</strong> {new Date(userData.created_at).toLocaleDateString()}</p>

          {streamData ? (
            <div style={{ marginTop: "1rem" }}>
              <h2>Current Stream Status:</h2>
              <p><strong>Title:</strong> {streamData.title}</p>
              <p><strong>Game:</strong> {streamData.game_name || "N/A"}</p>
              <p><strong>Viewer Count:</strong> {streamData.viewer_count}</p>
              <p><strong>Started At:</strong> {new Date(streamData.started_at).toLocaleString()}</p>
            </div>
          ) : (
            <p style={{ marginTop: "1rem" }}>The user is not currently streaming.</p>
          )}
        </div>
      ) : (
        !error && <p style={{ marginTop: "1rem" }}>Loading Twitch profile...</p>
      )}

      <button onClick={() => signOut()} style={{ marginTop: "2rem" }}>
        Sign out
      </button>
    </div>
  );
}
