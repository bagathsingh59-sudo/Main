import { UpdateEditor } from "./UpdateEditor";

export default function UpdateEditPage({ params }: { params: { id: string } }) {
  return <UpdateEditor updateId={params.id} />;
}
