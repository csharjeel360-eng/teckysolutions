import React, { useRef, useEffect, useState } from 'react';
import { Image, Bold, Italic, Link, List, Quote, Code, Heading1, Heading2, X } from 'lucide-react';

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Write your content here...",
  contentImages = [],
  onContentImagesChange,
  onImageUpload
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const handleInput = (e) => {
    onChange(e.target.value);
  };

  // Insert text at cursor position
  const insertTextAtCursor = (before, after = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || defaultText;
    
    const newValue = 
      value.substring(0, start) + 
      before + 
      textToInsert + 
      after + 
      value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position
    const newCursorPos = start + before.length + textToInsert.length + after.length;
    setTimeout(() => {
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  // ✅ FIXED: IMPROVED image upload with BETTER placeholder consistency
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
    
      // Focus textarea first to ensure we have the correct cursor position
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
      }
    
      // Create temporary URL for preview
      const tempUrl = URL.createObjectURL(file);
      const altText = prompt('Enter image description (alt text):', 'Blog image') || 'Blog image';
    
      // ✅ FIXED: Use SIMPLE temporary ID that matches backend expectations
      const tempId = `temp-${Date.now()}`;
    
      // Image upload started (debug removed)
    
      // ✅ FIXED: Use EXACT placeholder format that backend expects
      const placeholderText = `![${altText}](image:${tempId})`;
    
      const newImage = {
        file: file,
        url: tempUrl,
        alt: altText,
        id: tempId, // Temporary ID for client-side tracking
        temp: true,
        uploading: true,
        placeholder: placeholderText // ✅ Store the exact placeholder
      };
    
      // Get current cursor position BEFORE any state changes
      const cursorPos = textarea?.selectionStart ?? value.length;
      // Cursor position captured for insertion
    
      // Add to content images state
      const updatedContentImages = [...contentImages, newImage];
      onContentImagesChange(updatedContentImages);
    
      // Insert markdown image syntax at the exact cursor position
      const markdownImage = `\n${placeholderText}\n`;
      const beforeCursor = value.substring(0, cursorPos);
      const afterCursor = value.substring(cursorPos);
      const newContent = beforeCursor + markdownImage + afterCursor;
    
      // Updated content with image placeholder
    
      onChange(newContent);
    
      // Set cursor position after image for next typing
      const newCursorPos = cursorPos + markdownImage.length;
    
      // Wait for state update then set cursor
      setTimeout(() => {
        if (textarea) {
          textarea.setSelectionRange(newCursorPos, newCursorPos);
          textarea.focus();
        }
      }, 0);
    
      // If onImageUpload prop is provided, use it for actual upload
      if (onImageUpload) {
        try {
          const uploadedImage = await onImageUpload(file, tempId, altText);
          
          // Image uploaded successfully (debug removed)
          
          // ✅ FIXED: Update the image with server data
          if (uploadedImage.public_id) {
            const finalContentImages = updatedContentImages.map(img => 
              img.id === tempId 
                ? { 
                    ...img, 
                    url: uploadedImage.url,
                    public_id: uploadedImage.public_id,
                    uploading: false, 
                    temp: false,
                    // ✅ Keep the SAME placeholder format but with public_id
                    placeholder: `![${altText}](image:${uploadedImage.public_id})`
                  }
                : img
            );
            onContentImagesChange(finalContentImages);
            
            // ✅ FIXED: Update content to replace temporary ID with public_id
            const oldPlaceholder = `![${altText}](image:${tempId})`;
            const newPlaceholder = `![${altText}](image:${uploadedImage.public_id})`;
            
            if (value.includes(oldPlaceholder)) {
              const updatedContent = value.replace(
                new RegExp(oldPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                newPlaceholder
              );
              onChange(updatedContent);
            }
          }
        } catch (uploadError) {
          console.error('❌ Image upload failed:', uploadError);
        
          // Mark image as failed but keep it
          const failedContentImages = updatedContentImages.map(img => 
            img.id === tempId 
              ? { ...img, uploading: false, uploadError: uploadError.message }
              : img
          );
          onContentImagesChange(failedContentImages);
        
          alert(`Image upload failed: ${uploadError.message}. The image will remain as a local preview.`);
        }
      } else {
        // Just mark as done if no upload handler
        const finalContentImages = updatedContentImages.map(img => 
          img.id === tempId 
            ? { ...img, uploading: false }
            : img
        );
        onContentImagesChange(finalContentImages);
      }
    
      // Clean up file input
      event.target.value = '';
    
    } catch (error) {
      console.error('Error handling image:', error);
      alert('Error handling image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove image
  const removeImage = (imageId) => {
    // Removing image (debug removed)
  
    // Find the image to get its placeholder
    const imageToRemove = contentImages.find(img => img.id === imageId);
    if (!imageToRemove) {
      return;
    }
  
    const placeholder = imageToRemove.placeholder || `![${imageToRemove.alt}](image:${imageId})`;
    // Placeholder to remove computed
  
    // Remove ONLY this specific image's placeholder from content
    let newContent = value;
    const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const placeholderRegex = new RegExp(escapedPlaceholder, 'g');
    newContent = newContent.replace(placeholderRegex, '');
  
    // Clean up extra newlines
    newContent = newContent.replace(/\n\n\n+/g, '\n\n');
  
    onChange(newContent);
  
    // Remove ONLY the specific image from contentImages array
    const updatedImages = contentImages.filter(img => img.id !== imageId);
    onContentImagesChange(updatedImages);
  
    // Revoke object URL if it's a local preview
    if (imageToRemove.url && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }
  };

  // Formatting functions
  const formatHeading1 = () => {
    insertTextAtCursor('\n# ', '\n', 'Heading 1');
  };

  const formatHeading2 = () => {
    insertTextAtCursor('\n## ', '\n', 'Heading 2');
  };

  const formatBold = () => {
    insertTextAtCursor('**', '**', 'bold text');
  };

  const formatItalic = () => {
    insertTextAtCursor('*', '*', 'italic text');
  };

  const formatLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const linkText = selectedText || 'link text';
    const url = prompt('Enter URL:', 'https://');
    
    if (url) {
      insertTextAtCursor('[', `](${url})`, linkText);
    }
  };

  const formatBulletList = () => {
    insertTextAtCursor('\n- ', '\n', 'List item');
  };

  const formatCode = () => {
    insertTextAtCursor('\n```\n', '\n```\n', '// Your code here');
  };

  const formatQuote = () => {
    insertTextAtCursor('\n> ', '\n', 'Quote text');
  };

  // ✅ FIXED: IMPROVED markdown to HTML conversion with BETTER image handling
  const convertToHTML = (markdown) => {
    if (!markdown) return '<p class="text-gray-400 italic">Start writing your content...</p>';
    
    // Converting markdown to HTML for preview
    
    let html = markdown;
    
    // ✅ FIXED: BETTER image placeholder replacement for preview
    contentImages.forEach((image, idx) => {
      if (image && image.url) {
        // Try multiple placeholder formats that might be in the content
        const possiblePlaceholders = [
          image.placeholder,
          `![${image.alt}](image:${image.id})`,
          `![${image.alt}](image:${image.public_id})`,
          `![${image.alt || 'Blog image'}](image:${image.id})`,
          `![${image.alt || 'Blog image'}](image:${image.public_id})`,
          // Fallback: any image placeholder with this image's ID
          new RegExp(`!\\[.*?\\]\\(image:${image.id}\\)`),
          new RegExp(`!\\[.*?\\]\\(image:${image.public_id}\\)`)
        ];

        const imageHtml = `
          <div class="blog-image-preview my-4 text-center border border-gray-200 rounded-lg p-4 bg-white">
            <img 
              src="${image.url}" 
              alt="${image.alt}" 
              class="max-w-full h-auto rounded-lg shadow-sm mx-auto"
              style="max-height: 300px; object-fit: contain;"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"
            />
            <div class="hidden text-red-500 text-sm">Image failed to load</div>
            ${image.alt && image.alt !== 'Blog image' ? 
              `<p class="text-sm text-gray-600 mt-2 italic">${image.alt}</p>` : ''}
            <div class="mt-2 text-xs">
              ${image.uploading ? 
                `<span class="text-blue-500">⏳ Uploading...</span>` : 
                image.uploadError ? 
                `<span class="text-red-500">❌ Upload failed: ${image.uploadError}</span>` :
                image.temp ? 
                `<span class="text-orange-500">📱 Local preview</span>` :
                `<span class="text-green-500">✅ Uploaded</span>`
              }
              ${image.public_id ? `<div class="text-gray-400 mt-1">ID: ${image.public_id}</div>` : ''}
            </div>
          </div>
        `;
        
        let replaced = false;
        
        // Try each possible placeholder format
        for (const placeholder of possiblePlaceholders) {
          if (!placeholder) continue;
          
          try {
            if (typeof placeholder === 'string' && html.includes(placeholder)) {
              const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const regex = new RegExp(escapedPlaceholder, 'g');
              html = html.replace(regex, imageHtml);
              replaced = true;
              break;
            } else if (placeholder instanceof RegExp) {
              const matches = html.match(placeholder);
              if (matches && matches.length > 0) {
                html = html.replace(placeholder, imageHtml);
                replaced = true;
                break;
              }
            }
          } catch (error) {
            console.warn(`Error replacing placeholder for image ${idx}:`, error);
          }
        }
        
        if (!replaced) {
          console.warn(`❌ Could not find placeholder for image ${idx}`, {
            id: image.id,
            public_id: image.public_id,
            placeholder: image.placeholder
          });
        }
      }
    });

    // Process the rest of the markdown
    const lines = html.split('\n');
    const processedLines = [];
    let inList = false;
    let inCodeBlock = false;
    let codeBlockContent = [];
    let inParagraph = false;
    let paragraphContent = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      // Handle code blocks
      if (line.startsWith('```')) {
        if (inParagraph && paragraphContent.length > 0) {
          processedLines.push(`<p class="my-3 leading-relaxed text-gray-700">${paragraphContent.join(' ')}</p>`);
          paragraphContent = [];
          inParagraph = false;
        }

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
        codeBlockContent.push(line);
        continue;
      }

      // Close list if needed
      if (inList && !line.startsWith('- ') && line !== '') {
        processedLines.push('</ul>');
        inList = false;
      }

      // Handle empty lines
      if (line === '') {
        if (inParagraph && paragraphContent.length > 0) {
          processedLines.push(`<p class="my-3 leading-relaxed text-gray-700">${paragraphContent.join(' ')}</p>`);
          paragraphContent = [];
          inParagraph = false;
        }
        if (!inList) {
          processedLines.push('<br>');
        }
        continue;
      }

      // Handle headings
      if (line.startsWith('# ')) {
        if (inParagraph && paragraphContent.length > 0) {
          processedLines.push(`<p class="my-3 leading-relaxed text-gray-700">${paragraphContent.join(' ')}</p>`);
          paragraphContent = [];
          inParagraph = false;
        }
        processedLines.push(`<h1 class="text-2xl font-bold mt-6 mb-3 text-gray-900">${line.substring(2)}</h1>`);
        continue;
      }
      if (line.startsWith('## ')) {
        if (inParagraph && paragraphContent.length > 0) {
          processedLines.push(`<p class="my-3 leading-relaxed text-gray-700">${paragraphContent.join(' ')}</p>`);
          paragraphContent = [];
          inParagraph = false;
        }
        processedLines.push(`<h2 class="text-xl font-bold mt-5 mb-2 text-gray-900">${line.substring(3)}</h2>`);
        continue;
      }
      if (line.startsWith('### ')) {
        if (inParagraph && paragraphContent.length > 0) {
          processedLines.push(`<p class="my-3 leading-relaxed text-gray-700">${paragraphContent.join(' ')}</p>`);
          paragraphContent = [];
          inParagraph = false;
        }
        processedLines.push(`<h3 class="text-lg font-bold mt-4 mb-2 text-gray-900">${line.substring(4)}</h3>`);
        continue;
      }

      // Handle bullet lists
      if (line.startsWith('- ')) {
        if (inParagraph && paragraphContent.length > 0) {
          processedLines.push(`<p class="my-3 leading-relaxed text-gray-700">${paragraphContent.join(' ')}</p>`);
          paragraphContent = [];
          inParagraph = false;
        }
        if (!inList) {
          processedLines.push('<ul class="list-disc ml-6 my-3 space-y-1">');
          inList = true;
        }
        const itemContent = line.substring(2);
        processedLines.push(`<li class="text-gray-700">${itemContent}</li>`);
        continue;
      }

      // Handle blockquotes
      if (line.startsWith('> ')) {
        if (inParagraph && paragraphContent.length > 0) {
          processedLines.push(`<p class="my-3 leading-relaxed text-gray-700">${paragraphContent.join(' ')}</p>`);
          paragraphContent = [];
          inParagraph = false;
        }
        processedLines.push(`<blockquote class="border-l-4 border-blue-500 pl-3 py-1 my-3 text-gray-600 italic bg-blue-50 rounded-r">${line.substring(2)}</blockquote>`);
        continue;
      }

      // Check if line contains an image (already processed)
      const isImageLine = line.includes('blog-image-preview');
      
      if (isImageLine) {
        if (inParagraph && paragraphContent.length > 0) {
          processedLines.push(`<p class="my-3 leading-relaxed text-gray-700">${paragraphContent.join(' ')}</p>`);
          paragraphContent = [];
          inParagraph = false;
        }
        processedLines.push(line);
      } else {
        // Regular text - add to current paragraph
        if (!inParagraph) {
          inParagraph = true;
        }

        // Process inline formatting for regular text
        let processedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
          .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono border">$1</code>')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>');

        paragraphContent.push(processedLine);
      }
    }

    // Close any open paragraph
    if (inParagraph && paragraphContent.length > 0) {
      processedLines.push(`<p class="my-3 leading-relaxed text-gray-700">${paragraphContent.join(' ')}</p>`);
    }

    // Close any open list
    if (inList) {
      processedLines.push('</ul>');
    }

    return processedLines.join('\n');
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Hidden file input for image uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 bg-gray-50 border-b border-gray-300">
        <button
          type="button"
          onClick={formatHeading1}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={formatHeading2}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={formatBold}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={formatItalic}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={formatLink}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          title="Insert Link"
        >
          <Link className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingImage}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
          title="Insert Image"
        >
          <Image className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={formatBulletList}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={formatCode}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={formatQuote}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
      </div>

      {/* Textarea Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          placeholder={placeholder}
          className="w-full p-4 min-h-[400px] resize-y border-none focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed"
          style={{ 
            fontFamily: 'monospace',
            minHeight: '400px',
            lineHeight: '1.6'
          }}
        />
      </div>

      {/* Content Images Preview */}
      {contentImages.length > 0 && (
        <div className="border-t border-gray-300 bg-gray-50">
          <div className="p-3 text-sm font-medium text-gray-700 border-b border-gray-300 flex justify-between items-center">
            <span>Uploaded Images ({contentImages.length})</span>
            <span className="text-xs text-gray-500">Click × to remove individual images</span>
          </div>
          <div className="p-3 flex flex-wrap gap-3">
            {contentImages.map((image, index) => (
              <div key={image.id} className="relative group">
                <img 
                  src={image.url} 
                  alt={image.alt}
                  className="w-20 h-20 object-cover rounded border border-gray-300 shadow-sm"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden absolute inset-0 bg-red-100 border border-red-300 rounded flex items-center justify-center">
                  <div className="text-red-600 text-xs text-center px-1">Failed to load</div>
                </div>
                
                {/* Upload status */}
                {image.uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                    <div className="text-white text-xs">Uploading...</div>
                  </div>
                )}
                {image.uploadError && (
                  <div className="absolute inset-0 bg-red-100 border border-red-300 rounded flex items-center justify-center">
                    <div className="text-red-600 text-xs text-center px-1">Failed</div>
                  </div>
                )}
                
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  title="Remove this image"
                >
                  <X className="w-3 h-3" />
                </button>
                
                <div className="text-xs text-gray-600 mt-1 truncate max-w-20">
                  {image.alt}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {image.temp ? 'Local' : 'Uploaded'}
                </div>
                <div className="text-xs text-gray-500 mt-1 truncate max-w-20">
                  ID: {image.public_id || image.id}
                </div>
                <div className="text-xs text-blue-500 mt-1 truncate max-w-20" title={image.placeholder}>
                  Placeholder: {image.placeholder?.substring(0, 20)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="border-t border-gray-300">
        <div className="p-3 bg-gray-50 text-sm font-medium text-gray-700 border-b border-gray-300 flex justify-between items-center">
          <span>Preview</span>
          <span className="text-xs text-gray-500 font-normal">
            {value.length} characters, {value.split(/\s+/).length} words
          </span>
        </div>
        <div 
          className="p-6 bg-white min-h-[200px] prose prose-sm max-w-none"
          style={{ 
            minHeight: '200px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: '1.6'
          }}
        >
          {value ? (
            <div 
              dangerouslySetInnerHTML={{ __html: convertToHTML(value) }}
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            />
          ) : (
            <p className="text-gray-400 italic">Preview will appear here as you type...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;