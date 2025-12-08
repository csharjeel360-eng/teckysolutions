// utils/markdownUtils.js

// SIMPLE AND RELIABLE MARKDOWN TO HTML CONVERTER
export const simpleMarkdownToHtml = (markdown) => {
  if (!markdown) return '';
  
  // Debug logs removed for markdown processing

  const lines = markdown.split('\n');
  const processedLines = [];
  let inList = false;
  let currentParagraph = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const paragraphText = currentParagraph.join(' ').trim();
      if (paragraphText) {
        // Process inline formatting within the paragraph
        let processedText = paragraphText
          // Color tags - must come first to preserve color inside other formatting
          .replace(/\{color:(#[0-9A-Fa-f]{6}|[a-zA-Z]+)\}(.*?)\{\/color\}/g, '<span style="color: $1;">$2</span>')
          // Bold - must come before italic
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          // Italic
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          // Links
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
          // Inline code
          .replace(/`(.*?)`/g, '<code>$1</code>');

        processedLines.push(`<p>${processedText}</p>`);
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (inList) {
      processedLines.push('</ul>');
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Check for headers
    if (line.startsWith('# ')) {
      flushParagraph();
      flushList();
      processedLines.push(`<h1>${line.substring(2)}</h1>`);
      continue;
    }
    
    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      processedLines.push(`<h2>${line.substring(3)}</h2>`);
      continue;
    }
    
    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      processedLines.push(`<h3>${line.substring(4)}</h3>`);
      continue;
    }

    // Check for lists
    if (line.startsWith('- ')) {
      flushParagraph();
      if (!inList) {
        processedLines.push('<ul>');
        inList = true;
      }
      
      // Process list item content
      let itemContent = line.substring(2)
        // Color tags first
        .replace(/\{color:(#[0-9A-Fa-f]{6}|[a-zA-Z]+)\}(.*?)\{\/color\}/g, '<span style="color: $1;">$2</span>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Code
        .replace(/`(.*?)`/g, '<code>$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      
      processedLines.push(`<li>${itemContent}</li>`);
      continue;
    }

    // Check for blockquotes
    if (line.startsWith('> ')) {
      flushParagraph();
      flushList();
      processedLines.push(`<blockquote>${line.substring(2)}</blockquote>`);
      continue;
    }

    // Check if line is already HTML (from image replacement)
    if (line.startsWith('<div') || line.startsWith('<img') || line.startsWith('<h') || line.startsWith('<blockquote') || line.startsWith('<ul') || line.startsWith('<li')) {
      flushParagraph();
      flushList();
      processedLines.push(line);
      continue;
    }

    // Regular text - add to current paragraph
    currentParagraph.push(line);
  }

  // Flush any remaining content
  flushParagraph();
  flushList();

  const result = processedLines.join('\n');
  // Processed HTML ready
  
  return result;
};

// ADVANCED CONVERTER FOR EDITOR PREVIEW
export const convertMarkdownToHtml = (markdown = '', contentImages = [], options = {}) => {
  if (!markdown) return '<p class="text-gray-400 italic">Start writing your content...</p>';

  // Advanced markdown processing

  let html = String(markdown);

  // Replace image placeholders with actual images
  if (contentImages && contentImages.length > 0) {
    contentImages.forEach((image) => {
      if (image && image.id && image.url) {
        const placeholder = `![${image.alt || 'Blog image'}](image:${image.id})`;
        const imageHtml = `
          <div class="content-image my-6 text-center">
            <img 
              src="${image.url}" 
              alt="${image.alt || 'Blog image'}" 
              class="max-w-full h-auto rounded-lg shadow-md mx-auto"
              style="max-height: 500px; object-fit: contain;"
              loading="lazy"
            />
            ${image.alt && image.alt !== 'Blog image' ? 
              `<p class="text-sm text-gray-600 mt-2 italic">${image.alt}</p>` : ''}
          </div>
        `;
        
        const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedPlaceholder, 'g');
        html = html.replace(regex, imageHtml);
        
        // Replaced image placeholder
      }
    });
  }

  // Use the simple converter for the rest
  return simpleMarkdownToHtml(html);
};