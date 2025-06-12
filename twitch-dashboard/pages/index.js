import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  // Destructure both data and status
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // Debug logging (optional) to see what status and session are:
  useEffect(() => {
    console.log("Session status:", status, "session:", session);
  }, [status, session]);

  // When authenticated, fetch Twitch user info
  useEffect(() => {
    // Only run when session is ready and authenticated
    if (status !== "authenticated") return;

    async function fetchUser() {
      setError(null);
      setUserData(null);
      try {
        const res = await fetch("/api/twitchUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: session.accessToken }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          setError(errorData.error || `Failed to fetch user: ${res.status}`);
          return;
        }
        const data = await res.json();
        // Expect data.data to be an array from Twitch API
        if (Array.isArray(data.data) && data.data.length > 0) {
          setUserData(data.data[0]);
        } else {
          setError("No user data returned");
        }
      } catch (e) {
        console.error("Fetch error:", e);
        setError("Network error fetching user");
      }
    }

    fetchUser();
  }, [status, session]);

  // Render based on status
  if (status === "loading") {
    // NextAuth is still checking session (e.g., reading cookie, verifying)
    return <p>Loading session...</p>;
  }

  if (status === "unauthenticated") {
    // Not signed in: prompt to sign in
    return (
      <div style={{ padding: "2rem", fontFamily: "Arial" }}>
        <p>You are not signed in.</p>
        <button onClick={() => signIn("twitch")}>Sign in with Twitch</button>
      </div>
    );
  }

  // status === "authenticated" from here on
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>
          Error fetching Twitch profile: {error}
        </p>
      )}

      {userData ? (
        <div style={{ marginTop: "1rem" }}>
          <h1>Welcome, {userData.display_name}</h1>
            <img src={userData.profile_image_url} />
            <p><strong>Username:</strong> {userData.login}</p>
            <p><strong>Type:</strong> {userData.type || "user"}</p>
            <p><strong>Broadcaster:</strong> {userData.broadcaster_type || "none"}</p>
            <p><strong>Bio:</strong> {userData.description}</p>
            <p><strong>View Count:</strong> {userData.view_count}</p>
            <p><strong>Joined:</strong> {new Date(userData.created_at).toLocaleDateString()}</p>
        </div>
      ) : !error ? (
        // If authenticated but userData not yet loaded and no error
        <p style={{ marginTop: "1rem" }}>Loading Twitch profile...</p>
      ) : null}
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
