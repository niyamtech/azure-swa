const ADDRESS_ENDPOINT = "https://geocode.maps.co/search";

export async function fetchAddressSuggestions(query) {
  if (!query || query.trim().length < 4) {
    return [];
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const url = new URL(ADDRESS_ENDPOINT);
    url.searchParams.set("q", query);
    url.searchParams.set("countrycodes", "au");

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Address lookup failed: ${response.status}`);
    }

    const results = await response.json();

    return Array.isArray(results)
      ? results.slice(0, 5).map((entry) => ({
          id: entry.place_id,
          label: entry.display_name,
        }))
      : [];
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Address lookup error", error);
    }
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
