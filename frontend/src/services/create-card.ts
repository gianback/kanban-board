import { API_URL } from "@/utils/constants";

interface Props {
  autor: string;
  title: string;
  description?: string;
  priority: string;
}

export async function createCard(payload: Props) {
  try {
    const response = await fetch(`${API_URL}/card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}
