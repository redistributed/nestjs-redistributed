import * as os from "os";
export default function getLocalIp() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const dev in interfaces) {
    const iface = interfaces[dev];
    for (let i = 0; i < iface.length; i++) {
      const addr = iface[i];
      if (addr.family === "IPv4" && !addr.internal) {
        addresses.push(addr.address);
      }
    }
  }

  return addresses;
}
