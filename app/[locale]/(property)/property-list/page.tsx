import type { Metadata } from "next";
import PropertyListScreen from "@/src/features/property/screens/PropertyListScreen";
import { buildPageMetadata } from "@/src/lib/metadata/buildPageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("propertyList");
}

export default function PropertyListPage() {
  return <PropertyListScreen />;
}
