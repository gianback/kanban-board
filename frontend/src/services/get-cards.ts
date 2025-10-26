import { API_URL } from "@/utils/constants";

export async function getCards() {
  try {
    const response = await fetch(`${API_URL}/card`);

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.log(error);
  }
}
