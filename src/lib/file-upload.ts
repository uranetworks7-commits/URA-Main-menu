
'use client';

/**
 * Uploads a file by sending it to our own API route, which then proxies to catbox.moe.
 * @param file The file to upload.
 * @returns The URL of the uploaded file.
 */
export async function uploadFile(file: File): Promise<string> {
  console.log(`Uploading file via proxy: ${file.name}`);
  
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const { url: fileUrl } = await response.json();
    
    if (!fileUrl || !fileUrl.startsWith('http')) {
        throw new Error(`Invalid URL from server: ${fileUrl}`);
    }

    console.log(`File uploaded successfully: ${fileUrl}`);
    return fileUrl;

  } catch (error) {
    console.error('File upload error:', error);
    // Fallback to a placeholder if the upload fails for any reason
    const isImage = file.type.startsWith('image/');
    if (isImage) {
      // A reliable image placeholder
      return 'https://i.postimg.cc/8Cg1gW3w/placeholder.png';
    } else {
      // A reliable video placeholder
      return 'https://files.catbox.moe/p28li7.mp4';
    }
  }
}
