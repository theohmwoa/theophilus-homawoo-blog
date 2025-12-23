import React from 'react';
import { BlogPost } from '../types';
import { Tag } from './UI';
import { ArrowLeft } from 'lucide-react';

// --- Blog List Item ---
interface BlogListItemProps {
  post: BlogPost;
  onClick: (id: string) => void;
}

export const BlogListItem: React.FC<BlogListItemProps> = ({ post, onClick }) => {
  return (
    <article 
      onClick={() => onClick(post.id)}
      className="group cursor-pointer border-b border-neutral-200 py-12 hover:bg-neutral-50 transition-colors duration-300"
    >
      <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
        <div className="md:col-span-3 text-neutral-500 font-mono text-sm">
          {post.date}
        </div>
        <div className="md:col-span-9">
          <h2 className="text-2xl md:text-3xl font-light mb-4 group-hover:underline decoration-1 underline-offset-4">
            {post.title}
          </h2>
          <p className="text-neutral-600 font-light leading-relaxed mb-6 max-w-2xl">
            {post.excerpt}
          </p>
          <div className="flex gap-2 flex-wrap">
            {post.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
          </div>
        </div>
      </div>
    </article>
  );
};

// --- Blog Detail View ---
interface BlogDetailProps {
  post: BlogPost;
  onBack: () => void;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ post, onBack }) => {
  const formatText = (text: string) => {
    return text.split(/(\*\*.*?\*\*|\*.*?\*)/).map((chunk, i) => {
      if (chunk.startsWith('**') && chunk.endsWith('**')) {
          return <strong key={i} className="font-semibold text-black">{chunk.slice(2, -2)}</strong>;
      }
      if (chunk.startsWith('*') && chunk.endsWith('*')) {
          return <em key={i} className="italic">{chunk.slice(1, -1)}</em>;
      }
      return chunk;
    });
  };

  const renderContent = (content: string) => {
    // 1. Split by Code Blocks first to preserve their internal structure (newlines)
    const codeBlockRegex = /(```[\s\S]*?```)/g;
    const sections = content.split(codeBlockRegex);

    return sections.map((section, sectionIndex) => {
      // Handle Code Block
      if (section.startsWith('```') && section.endsWith('```')) {
        const code = section.replace(/^```\w*\n?/, '').replace(/```$/, '');
        return (
            <div key={`code-${sectionIndex}`} className="relative mb-8 mt-6">
                <div className="absolute top-0 left-0 bg-black text-white text-[10px] px-2 py-1 uppercase tracking-widest font-mono">Code</div>
                <pre className="bg-neutral-50 p-6 pt-10 font-mono text-xs md:text-sm overflow-x-auto text-neutral-800 border border-neutral-200 whitespace-pre">
                    {code}
                </pre>
            </div>
        );
      }

      // Handle Standard Markdown (split by double newline)
      if (!section.trim()) return null;

      const parts = section.split('\n\n');
      return (
        <React.Fragment key={`section-${sectionIndex}`}>
        {parts.map((part, partIndex) => {
          const key = `${sectionIndex}-${partIndex}`;
          
          if (!part.trim()) return null;

          // Headers
          if (part.startsWith('## ')) {
            return <h2 key={key} className="text-2xl font-normal mt-12 mb-6 text-black tracking-tight">{part.replace('## ', '')}</h2>;
          }
          if (part.startsWith('### ')) {
            return <h3 key={key} className="text-xl font-medium mt-8 mb-4 text-black">{part.replace('### ', '')}</h3>;
          }
          
          // Blockquotes
          if (part.startsWith('> ')) {
            return (
                <blockquote key={key} className="border-l-2 border-black pl-6 italic text-xl text-neutral-600 mb-8 mt-8 py-2 bg-neutral-50/50">
                    {formatText(part.replace(/^> /, ''))}
                </blockquote>
            )
          }

          // Lists
          if (part.trim().startsWith('- ')) {
            const items = part.split('\n').filter(line => line.trim().startsWith('- ')).map(i => i.replace(/^- /, ''));
            return (
              <ul key={key} className="list-disc pl-5 md:pl-6 mb-6 space-y-2 text-neutral-700 marker:text-black">
                {items.map((item, i) => {
                     // Handle bolding inside list items
                     return <li key={i} className="pl-2">{formatText(item)}</li>
                })}
              </ul>
            );
          }

          return <p key={key} className="mb-6 leading-relaxed text-neutral-800 text-lg font-light">{formatText(part)}</p>;
        })}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="animate-fade-in px-6 md:px-12 py-12 max-w-4xl mx-auto w-full">
      <button 
        onClick={onBack}
        className="flex items-center text-neutral-500 hover:text-black mb-8 group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase tracking-widest text-xs">Back to Thoughts</span>
      </button>

      <header className="mb-12">
        <div className="flex flex-wrap gap-4 items-center mb-6 text-sm text-neutral-500 font-mono border-b border-neutral-100 pb-6">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-normal leading-tight mb-8 text-balance">
          {post.title}
        </h1>
        <div className="flex gap-2">
          {post.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
        </div>
      </header>

      <div className="prose prose-lg prose-neutral max-w-none">
        {renderContent(post.content)}
      </div>
      
      <div className="mt-20 pt-10 border-t border-neutral-200 flex justify-between items-center text-neutral-400 font-mono text-sm">
         <p>End of file.</p>
         <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-black">Return to top ↑</button>
      </div>
    </div>
  );
};