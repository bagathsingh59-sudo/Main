"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Render markdown body of a blog post with brand typography.
 *
 * We deliberately avoid `rehype-raw` so embedded raw HTML in a post is
 * rendered as escaped text. That keeps the admin editor from being an
 * XSS surface even if you later let multiple authors in.
 */
export function BlogArticleBody({ content }: { content: string }) {
  return (
    <div className="prose prose-lg prose-navy max-w-none prose-headings:font-display prose-headings:tracking-tight prose-headings:text-navy-900 prose-h2:mt-12 prose-h2:text-[1.6rem] prose-h3:mt-9 prose-h3:text-[1.25rem] prose-p:text-[1.05rem] prose-p:leading-[1.78] prose-p:text-navy-900/80 prose-a:font-medium prose-a:text-navy-600 prose-a:underline-offset-2 hover:prose-a:text-navy-700 prose-strong:text-navy-900 prose-li:text-navy-900/80 prose-blockquote:border-l-teal-500 prose-blockquote:bg-mist/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-navy-900/85 prose-code:rounded prose-code:bg-mist prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:text-navy-700 prose-code:before:hidden prose-code:after:hidden prose-img:rounded-2xl prose-img:shadow-soft prose-table:text-[0.95rem] prose-th:bg-mist/60 prose-th:font-semibold">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
