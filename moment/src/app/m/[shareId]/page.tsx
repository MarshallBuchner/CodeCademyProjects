import { SharedMomentClient } from "./SharedMomentClient";

export default async function SharedMomentPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  return <SharedMomentClient shareId={shareId} />;
}
