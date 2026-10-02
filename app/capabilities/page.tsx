// app/capabilities/page.tsx
import { Navbar } from "@/components/navbar";
import Capabilities from "@/components/Capabilities";
import capabilitiesData from "@/data/capabilities.json";
import type { CapabilityUI } from "@/types/capability";

export const dynamic = "force-static";

export default function CapabilitiesPage() {
  const capabilities = capabilitiesData as CapabilityUI[];

  return (
    <>
      <Navbar />
      <Capabilities capabilities={capabilities} />
    </>
  );
}
