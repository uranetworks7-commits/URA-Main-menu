
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }
    
    // Forward the file to Catbox.moe
    const catboxFormData = new FormData();
    catboxFormData.append('reqtype', 'fileupload');
    catboxFormData.append('fileToUpload', file);

    const catboxResponse = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: catboxFormData,
    });

    if (!catboxResponse.ok) {
        const errorText = await catboxResponse.text();
        console.error('Catbox API Error:', errorText);
        return NextResponse.json({ error: `Catbox API Error: ${catboxResponse.statusText}` }, { status: catboxResponse.status });
    }

    const catboxUrl = await catboxResponse.text();

    if (!catboxUrl.startsWith('http')) {
        console.error('Invalid response from Catbox:', catboxUrl);
        return NextResponse.json({ error: 'Invalid response from Catbox API' }, { status: 500 });
    }

    return NextResponse.json({ url: catboxUrl });

  } catch (error) {
    console.error('Upload API route error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
