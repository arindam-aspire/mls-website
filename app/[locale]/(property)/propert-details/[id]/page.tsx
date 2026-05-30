import type { Metadata } from "next";
import PropertyDetailsScreen from "@/src/features/property/screens/PropertyDetailsScreen";

export const metadata: Metadata = {
  title: "Property Details",
};

type PropertyDetailsPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { id } = await params;

  return <PropertyDetailsScreen propertyId={id} />;
}
