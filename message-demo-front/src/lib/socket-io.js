import { io } from "socket.io-client";

const CONTACTS_URL = import.meta.env.VITE_CONTACTS_URL;

const urlParams = new URL(window.location);
export const TOKEN = urlParams.searchParams.get("token");

export const socket = io(CONTACTS_URL, {
  auth: {
    token: TOKEN,
  },
});
