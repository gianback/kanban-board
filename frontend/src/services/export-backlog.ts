export async function exportBacklog(email: string) {
  try {
    const response = await fetch("http://localhost:3000/n8n-webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    console.log(response);

    if (response.ok) {
      return {
        success: true,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}
