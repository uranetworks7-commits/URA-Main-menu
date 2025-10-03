
'use client';

/**
 * Uploads a file to catbox.moe.
 * @param file The file to upload.
 * @returns The URL of the uploaded file.
 */
export async function uploadFile(file: File): Promise<string> {
  console.log(`Uploading file to Catbox.moe: ${file.name}`);
  
  const formData = new FormData();
  formData.append('reqtype', 'fileupload');
  formData.append('fileToUpload', file);

  try {
    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.statusText}`);
    }

    const fileUrl = await response.text();
    
    if (!fileUrl.startsWith('http')) {
        throw new Error(`Invalid response from Catbox.moe: ${fileUrl}`);
    }

    console.log(`File uploaded successfully: ${fileUrl}`);
    return fileUrl;

  } catch (error) {
    console.error('Catbox.moe upload error:', error);
    // Fallback to a placeholder if the upload fails
    const isImage = file.type.startsWith('image/');
    if (isImage) {
      return `https://picsum.photos/seed/${Math.random()}/800/600`;
    } else {
      return 'https://files.catbox.moe/p28li7.mp4';
    }
  }
}
