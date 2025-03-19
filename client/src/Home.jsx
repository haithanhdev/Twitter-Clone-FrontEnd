import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";
import { Link } from "react-router-dom";

const getGoogleAuthUrl = () => {
  const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URI } = import.meta.env;
  const url = `https://accounts.google.com/o/oauth2/v2/auth`;
  const query = {
    client_id: VITE_GOOGLE_CLIENT_ID,
    redirect_uri: VITE_GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    prompt: "consent",
    access_type: "offline",
  };
  const queryString = new URLSearchParams(query).toString();
  return `${url}?${queryString}`;
};
const googleOAuthUrl = getGoogleAuthUrl();

export default function Home() {
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));
  const profile = JSON.parse(localStorage.getItem("profile")) || {};
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.reload();
  };
  return (
    <>
      <div>
        <span href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </span>
        <span href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </span>
      </div>
      <h2>HLS STREAMING</h2>
      <MediaPlayer
        title="Sprite Fight"
        src="http://localhost:4000/static/video-hls/_DkWQj1kPVGzD1LVhPYx5/master.m3u8"
        aspectRatio={16 / 9}
        crossOrigin=""
      >
        <MediaProvider />
        <PlyrLayout
          // thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
          icons={plyrLayoutIcons}
        />
      </MediaPlayer>
      <h1>Google OAuth 2.0</h1>
      <p className="read-the-docs">
        {isAuthenticated ? (
          <>
            <span>
              Hello my <strong>{profile.username}</strong>, you are logged in
            </span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to={googleOAuthUrl}>Login with Google</Link>
        )}
      </p>
    </>
  );
}
