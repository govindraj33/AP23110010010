export async function log(stack, level, packageName, message, token) {
  try {
    const response = await fetch(
      "http://20.207.122.201/evaluation-service/logs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stack: stack,
          level: level,
          package: packageName,
          message: message,
        }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    // silently fail (do not use console.log as per rules)
    return null;
  }
}