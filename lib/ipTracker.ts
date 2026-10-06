export async function getClientIp(request: Request): Promise<string> {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "Unknown";
}

export async function getGeoLocation(ip: string) {
  if (!ip || ip === "Unknown" || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return null;
  }
  
  try {
    // 1500 ms timeout to prevent slowing down the request significantly
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,isp`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) return null;
    
    const data = await res.json();
    if (data.status === "success") {
      return {
        country: data.country,
        region: data.regionName,
        geoCity: data.city,
        isp: data.isp,
      };
    }
  } catch (error) {
    console.error("IP Geo location fetch failed:", error);
  }
  
  return null;
}
