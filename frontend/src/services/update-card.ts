import type { Status } from "@/interfaces/card";
import { API_URL } from "@/utils/constants";

export async function updateStatusCard(id: string, status: Status) {
  try {
    const response = await fetch(`${API_URL}/card/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
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
