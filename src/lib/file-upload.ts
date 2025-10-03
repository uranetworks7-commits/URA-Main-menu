
'use client';

// This is a mock file upload service.
// In a real application, you would replace this with a call to a
// proper file storage service like Firebase Storage, AWS S3, or Cloudinary.

export async function uploadFile(file: File): Promise<string> {
  console.log(`Simulating upload for file: ${file.name}`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real implementation, you'd get the URL from the upload service.
  // For now, we'll return a static placeholder based on the file type.
  const isImage = file.type.startsWith('image/');
  
  if (isImage) {
    // Return a random image from picsum.photos for variety
    const randomId = Math.floor(Math.random() * 1000);
    console.log(`Returning placeholder image URL: https://picsum.photos/seed/${randomId}/800/600`);
    return `https://picsum.photos/seed/${randomId}/800/600`;
  } else {
    // Return a static video URL
    console.log('Returning placeholder video URL');
    return 'https://files.catbox.moe/p28li7.mp4';
  }
}
