// components/Blogs/BlogContent.jsx
import React from 'react';
import convertMarkdownToHtml from '../../utils/markdownToHtml';

const BlogContent = ({ content, processedContent, contentImages = [] }) => {
  // Debug logs removed for production

  // Use shared converter from `src/utils/markdownToHtml.js` for consistent output

  // Main render function
  const renderContent = () => {
    // If we have processed content, decide whether it's already HTML or markdown
    if (processedContent && processedContent.trim()) {
      const trimmed = processedContent.trim();

      // If the server encoded HTML as entities (e.g. &lt;img ... &gt;), decode common entities
      const decodeEntities = (input) => {
        if (!input || typeof input !== 'string') return input;
        let str = input;

        // Repeat decode pass to handle double-encoded entities (e.g. &amp;lt; -> &lt; -> <)
        let prev;
        do {
          prev = str;
          // First decode ampersands so &amp;lt; becomes &lt;
          str = str.replace(/&amp;/g, '&');
          // Then decode common named entities
          str = str.replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&quot;/g, '"')
                   .replace(/&#39;/g, "'")
                   .replace(/&nbsp;/g, ' ');
          // Decode numeric entities like &#34; or &#x22;
          str = str.replace(/&#(\d+);/g, (m, code) => String.fromCharCode(parseInt(code, 10)));
          str = str.replace(/&#x([0-9a-fA-F]+);/g, (m, code) => String.fromCharCode(parseInt(code, 16)));
        } while (str !== prev);

        return str;
      };

      // First check raw trimmed for HTML tags
      let looksLikeHtml = /<[^>]+>/.test(trimmed);

      // If not, check if it contains encoded HTML entities and decode
      let decoded = trimmed;
        if (!looksLikeHtml && /&lt;|&gt;|&amp;lt;|&amp;gt;/.test(trimmed)) {
        decoded = decodeEntities(trimmed);
        looksLikeHtml = /<[^>]+>/.test(decoded);
      }

      if (looksLikeHtml) {
        // Process color tags in HTML content
        let processedHtml = decoded;
        processedHtml = processedHtml.replace(/\{color:(#[0-9A-Fa-f]{6}|[a-zA-Z]+)\}(.*?)\{\/color\}/g, '<span style="color: $1 !important;">$2</span>');
        
        return (
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: processedHtml }} 
          />
        );
      }

      // If processedContent doesn't look like HTML, treat it as markdown and convert
      // processedContent treated as markdown if not HTML
      const htmlFromProcessed = convertMarkdownToHtml(processedContent, contentImages);
      return (
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: htmlFromProcessed }} 
        />
      );
    }

    // If we have raw content, convert markdown to HTML
    if (content && content.trim()) {
      const htmlContent = convertMarkdownToHtml(content, contentImages);
      return (
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
      );
    }

    return (
      <div className="text-center py-8 text-gray-500">
        <p>No content available for this blog post.</p>
      </div>
    );
  };

  return (
    <div className="blog-content-wrapper">
      {renderContent()}
    </div>
  );
};

export default BlogContent;