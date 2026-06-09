import type { Metadata } from "next";
import InquiriesScreen from "@/src/features/property/screens/InquiriesScreen";
import { buildPageMetadata } from "@/src/lib/metadata/buildPageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("inquiries");
}

export default function InquiriesPage() {
  return <InquiriesScreen />;
}
