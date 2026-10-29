export interface GenerateAnthemParams {
  mode: 'clip' | 'full'; // 'clip' = 30s VIP entry clip, 'full' = full-length event anthem
  prompt?: string;
  eventType?: string;
  artistName?: string;
  genre?: string;
  tempo?: string;
  instruments?: string;
  vibe?: string;
}

export interface GeneratedAnthemResponse {
  success: boolean;
  audioBase64: string;
  mimeType: string;
  duration: number;
  modelUsed: string;
  title: string;
  lyricsOrNotes?: string;
  isFallback?: boolean;
}

export async function generateAnthemTrack(params: GenerateAnthemParams): Promise<GeneratedAnthemResponse> {
  const response = await fetch('/api/music/generate-anthem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}
