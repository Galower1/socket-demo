import { io } from "socket.io-client";

const URL = import.meta.env.VITE_CONTACTS_URL;

const TOKEN = window.localStorage.getItem("AUTH_TOKEN");

export const socket = io(URL, {
  auth: {
    token: TOKEN,
  },
});
