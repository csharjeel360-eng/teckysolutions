// FIXED: Shared markdown -> HTML converter 
export default function convertMarkdownToHtml(markdown = '', contentImages = [], options = {}) {
  const title = options.title || '';

  if (!markdown) return '<p class="text-gray-400 italic">Start writing your content...</p>';

  let html = String(markdown);

  // Debug logs removed for markdown conversion

  // ✅ FIXED: Replace image placeholders FIRST - handle multiple formats
  if (contentImages && contentImages.length > 0) {
    contentImages.forEach((image) => {
      if (image && (image.public_id || image.id)) {
        const imageId = image.public_id || image.id;
        
        // ✅ FIXED: Try MULTIPLE placeholder formats
        const placeholderFormats = [
          // Format 1: Standard format with public_id
          `![${image.alt || 'Blog image'}](image:${image.public_id})`,
          // Format 2: With temporary ID
          `![${image.alt || 'Blog image'}](image:${image.id})`,
          // Format 3: Your actual format (from your content)
          `![${image.alt || 'Blog image'}](image:ecommerce/${image.public_id})`,
          `![${image.alt || 'Blog image'}](image:ecommerce/${image.id})`,
          // Format 4: Just the ID without "ecommerce/"
          `![${image.alt || 'Blog image'}](image:${imageId})`
        ];

        const imageUrl = image.url || image.secure_url || image.src || '';
        const finalSrc = imageUrl || `https://via.placeholder.com/800x400/cccccc/333333?text=${encodeURIComponent(image.alt || 'Image')}`;
        
        const imageHtml = `
          <div class="my-6 text-center">
            <img 
              src="${finalSrc}" 
              alt="${image.alt || 'Blog image'}" 
              class="max-w-full h-auto rounded-lg shadow-md mx-auto"
              style="max-height: 400px; object-fit: contain;"
              loading="lazy"
              onerror="this.onerror=null;this.src='https://via.placeholder.com/800x400/ff6b6b/ffffff?text=Image+Not+Found'"
            />
            ${image.alt && image.alt !== 'Blog image' ? 
              `<p class="text-sm text-gray-600 mt-2 italic">${image.alt}</p>` : ''}
          </div>
        `;

        // Try each placeholder format
        let replaced = false;
        for (const placeholder of placeholderFormats) {
          if (placeholder && html.includes(placeholder)) {
            const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedPlaceholder, 'g');
            html = html.replace(regex, imageHtml);
            // Replaced image placeholder
            replaced = true;
            break;
          }
        }

        if (!replaced) {
          // No matching placeholder found for image
        }
      }
    });
  }

  // ✅ FIXED: Check if any image placeholders remain
  const remainingPlaceholders = html.match(/!\[.*?\]\(image:[^)]+\)/g);
  if (remainingPlaceholders) {
    // Remaining image placeholders detected
    
    // Try to replace remaining placeholders with generic image
    remainingPlaceholders.forEach(placeholder => {
      const genericImageHtml = `
        <div class="my-6 text-center bg-yellow-100 border border-yellow-400 rounded-lg p-4">
          <p class="text-yellow-700">Image placeholder: ${placeholder}</p>
          <p class="text-sm text-yellow-600">This image could not be loaded</p>
        </div>
      `;
      const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedPlaceholder, 'g');
      html = html.replace(regex, genericImageHtml);
    });
  }

  // Convert markdown to HTML
  const lines = String(html).split('\n');
  const processedLines = [];
  let inList = false;
  let inCodeBlock = false;
  let codeBlockContent = [];
  let paragraphBuffer = [];

  const flushParagraphBuffer = () => {
    if (paragraphBuffer.length === 0) return;
    const paragraphText = paragraphBuffer.join(' ').trim();
    if (paragraphText === '') {
      paragraphBuffer = [];
      return;
    }

    let processedLine = paragraphText;
    
    // Process all inline formatting including color tags
    // Use a more robust approach to handle nested formatting
    processedLine = processedLine
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/__(.*?)__/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/_(.*?)_/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono border">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>');
    
    // Process color tags LAST to preserve them through other formatting
    processedLine = processedLine.replace(/\{color:(#[0-9A-Fa-f]{6}|[a-zA-Z]+)\}(.*?)\{\/color\}/g, '<span style="color: $1 !important;">$2</span>');

    const isImageOnly = processedLine.startsWith('<img') || (processedLine.startsWith('<div') && processedLine.includes('<img'));

    if (isImageOnly) {
      processedLines.push(processedLine);
    } else {
      processedLines.push(`<p class="my-4 leading-relaxed text-gray-700">${processedLine}</p>`);
    }

    paragraphBuffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    let rawLine = lines[i];
    let line = rawLine.trim();

    // Code blocks
    if (line.startsWith('```')) {
      flushParagraphBuffer();
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockContent = [];
      } else {
        inCodeBlock = false;
        processedLines.push(`<pre class="bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto border border-gray-300"><code>${codeBlockContent.join('\n')}</code></pre>`);
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(rawLine);
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraphBuffer();
      if (inList) { processedLines.push('</ul>'); inList = false; }
      const level = headingMatch[1].length;
      let text = headingMatch[2];
      // Process color tags in headings
      text = text.replace(/\{color:(#[0-9A-Fa-f]{6}|[a-zA-Z]+)\}(.*?)\{\/color\}/g, '<span style="color: $1;">$2</span>');
      const sizes = ['text-4xl','text-3xl','text-2xl','text-xl','text-lg','text-base'];
      const sizeClass = sizes[Math.min(level-1, sizes.length-1)];
      processedLines.push(`<h${level} class="${sizeClass} font-bold mt-8 mb-4 text-gray-900">${text}</h${level}>`);
      continue;
    }

    // Lists
    const unorderedMatch = line.match(/^[-*]\s+(.*)$/);
    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (unorderedMatch) {
      flushParagraphBuffer();
      if (!inList) {
        processedLines.push('<ul class="list-disc ml-6 my-4 space-y-2">');
        inList = true;
      }
      let listContent = unorderedMatch[1];
      // Process color tags in list items
      listContent = listContent.replace(/\{color:(#[0-9A-Fa-f]{6}|[a-zA-Z]+)\}(.*?)\{\/color\}/g, '<span style="color: $1;">$2</span>');
      processedLines.push(`<li class="text-gray-700">${listContent}</li>`);
      continue;
    }
    if (orderedMatch) {
      flushParagraphBuffer();
      if (!inList) {
        processedLines.push('<ol class="list-decimal ml-6 my-4 space-y-2">');
        inList = true;
      }
      processedLines.push(`<li class="text-gray-700">${orderedMatch[1]}</li>`);
      continue;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      flushParagraphBuffer();
      if (inList) { processedLines.push('</ul>'); inList = false; }
      processedLines.push(`<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 text-gray-600 italic bg-blue-50 rounded-r-lg">${line.substring(2)}</blockquote>`);
      continue;
    }

    // Blank line
    if (line === '') {
      flushParagraphBuffer();
      if (inList) { processedLines.push('</ul>'); inList = false; }
      continue;
    }

    // Normal text
    paragraphBuffer.push(line);
  }

  // Flush any remaining content
  flushParagraphBuffer();
  if (inList) processedLines.push('</ul>');

  const result = processedLines.join('\n');
  return result;
}