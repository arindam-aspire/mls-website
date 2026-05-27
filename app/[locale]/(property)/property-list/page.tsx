import type { Metadata } from "next";
import PropertyListScreen from "@/src/features/property/screens/PropertyListScreen";

export const metadata: Metadata = {
  title: "Property List",
};

export default function PropertyListPage() {
  return <PropertyListScreen />;
}
