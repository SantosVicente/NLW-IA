import { FileVideo, Upload } from 'lucide-react';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useMemo, useRef, useState } from 'react';
import { getFFmpeg } from '@/lib/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { api } from '@/lib/axios';

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success';

const statusMessages = {
  converting: 'Convertendo...',
  uploading: 'Carregando...',
  generating: 'Transcrevendo...',
  success: 'Sucesso!',
};

export function VideoInputForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('waiting');

  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }

    const selectedFile = files[0];

    setVideoFile(selectedFile);
  }

  async function convertVideoToAudio(video: File) {
    console.log('Convertendo vídeo para áudio...');

    const ffmpeg = await getFFmpeg();

    await ffmpeg.writeFile('input.mp4', await fetchFile(video));

    /*     ffmpeg.on('log', message => {
      console.log('FFMPEG:', message);
    }); */

    ffmpeg.on('progress', (progress) => {
      console.log('Convert Progress:' + Math.round(progress.progress * 100));
    });

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20K',
      '-acodec',
      'libmp3lame',
      'output.mp3',
    ]);

    console.log('teste3');

    const data = await ffmpeg.readFile('output.mp3');

    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' });
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg',
    });

    console.log('Convert Finished');

    return audioFile;
  }

  async function handleUploadVideo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;

    if (!videoFile) {
      return;
    }

    // converter o vídeo em áudio com WebAssembly -> https://ffmpegwasm.netlify.app/

    setStatus('converting');

    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();

    data.append('file', audioFile);

    setStatus('uploading');

    const response = await api.post('/videos', data);

    const videoId = response.data.video.id;

    setStatus('generating');

    await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    });

    setStatus('success');
  }

  const previewUrl = useMemo(() => {
    if (!videoFile) {
      return null;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <label
        htmlFor="video"
        className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-zinc-200 hover:border-zinc-600 transition-colors"
      >
        {previewUrl ? (
          <video
            src={previewUrl}
            controls={false}
            className="pointer-events-none absolute inset-0 w-full h-full object-cover rounded-md"
          />
        ) : (
          <>
            <FileVideo className="w-4 h-4" />
            Selecione um vídeo
          </>
        )}
      </label>

      {/*sr-only faz o mesmo que display none, mas mantém ele no DOM, ou seja, ele continua clicável*/}
      <input
        type="file"
        id="video"
        accept="video/mp4"
        onChange={handleFileSelected}
        className="sr-only"
      />

      <Separator />

      <div className="space-y-1">
        <Label htmlFor="transcription-prompt">Prompt de Transcrição</Label>
        <Textarea
          ref={promptInputRef}
          disabled={status !== 'waiting'}
          id="transcription-prompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Inclua palavras-chave relacionadas ao vídeo separadas por vírgula ( , )"
        />
      </div>

      <Button
        data-success={status === 'success'}
        disabled={status !== 'waiting'}
        variant="default"
        type="submit"
        className="w-full data-[success=true]:bg-emerald-400 data-[success=true]:text-zinc-800"
      >
        {status === 'waiting' ? (
          <>
            Carregar Vídeo
            <Upload className="w-4 h-4 ml-2" />
          </>
        ) : (
          statusMessages[status]
        )}
      </Button>
    </form>
  );
}
