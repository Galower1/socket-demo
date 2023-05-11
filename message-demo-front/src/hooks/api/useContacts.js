import { useQuery } from "@tanstack/react-query";

export function useContacts() {
  return useQuery(["contacts"], () =>
    fetch(`${import.meta.env.VITE_CONTACTS_URL}/contacts`).then((response) => response.json())
  );
}
