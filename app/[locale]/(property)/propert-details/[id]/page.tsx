import type { Metadata } from "next";
import PropertyDetailsScreen from "@/src/features/property/screens/PropertyDetailsScreen";
import { buildPageMetadata } from "@/src/lib/metadata/buildPageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("propertyDetails");
}

type PropertyDetailsPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { id } = await params;

  return <PropertyDetailsScreen propertyId={id} />;
}
