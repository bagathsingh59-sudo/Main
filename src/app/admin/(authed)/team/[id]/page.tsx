import { TeamMemberEditor } from "./TeamMemberEditor";

export default function TeamMemberEditPage({ params }: { params: { id: string } }) {
  return <TeamMemberEditor memberId={params.id} />;
}
