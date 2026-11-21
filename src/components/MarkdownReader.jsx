import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownReader = ({ content }) => {
  return (
    <div className="markdown-body" style={{ color: '#aaa', fontSize: '1.1rem', lineHeight: 1.8 }}>
      <ReactMarkdown
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={atomDark}
                language={match[1]}
                PreTag="div"
                customStyle={{ borderRadius: '12px', padding: '1.5rem', margin: '1.5rem 0', background: '#0d0d11', border: '1px solid rgba(255,255,255,0.1)' }}
                {...props}
              />
            ) : (
              <code className={className} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px', color: '#ff9ff3' }} {...props}>
                {children}
              </code>
            )
          },
          h1: ({node, ...props}) => <h1 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '1.5rem', marginTop: '2rem', fontFamily: 'Outfit' }} {...props} />,
          h2: ({node, ...props}) => <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '1rem', marginTop: '2rem', fontFamily: 'Outfit' }} {...props} />,
          h3: ({node, ...props}) => <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.8rem', marginTop: '1.5rem', fontFamily: 'Outfit' }} {...props} />,
          p: ({node, ...props}) => <p style={{ marginBottom: '1.5rem' }} {...props} />,
          ul: ({node, ...props}) => <ul style={{ marginBottom: '1.5rem', paddingLeft: '2rem' }} {...props} />,
          li: ({node, ...props}) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
          a: ({node, ...props}) => <a style={{ color: 'var(--accent-glow-strong)', textDecoration: 'underline' }} target="_blank" rel="noreferrer" {...props} />,
          blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: '4px solid var(--accent-glow-strong)', paddingLeft: '1rem', color: '#888', fontStyle: 'italic', margin: '1.5rem 0' }} {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownReader;
