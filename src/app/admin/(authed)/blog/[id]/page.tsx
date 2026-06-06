import { BlogEditor } from "./BlogEditor";

export default function BlogEditPage({ params }: { params: { id: string } }) {
  return <BlogEditor postId={params.id} />;
}
