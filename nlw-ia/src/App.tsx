import { Github, Wand2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Textarea } from './components/ui/textarea';
import { Label } from './components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import { Slider } from './components/ui/slider';
import { VideoInputForm } from './components/video-input-form';
import { PromptSelect } from './components/prompt-select';
import { useState } from 'react';
import { useCompletion } from 'ai/react';
import Logo from './assets/favicon.png';

export function App() {
  const [temperature, setTemperature] = useState(0.5);
  const [videoId, setVideoId] = useState<string | null>(null);

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return (
    <div className="min-h-screen min-w-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <div className="flex items-center justify-center gap-2">
          <img src={Logo} alt="logo" width={40} height={40} />
          <h1 className="text-2xl font-bold">Upload AI</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com 💜 no NLW da Rocketseat
          </span>

          <Separator orientation="vertical" className="h-6" />

          <Button variant={'outline'}>
            <a
              href="https://github.com/SantosVicente/NLW-IA"
              className="flex items-center"
              target="_blank"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </a>
          </Button>
        </div>
      </div>

      {/*flex-1 ocupa todo o resto do espaço */}
      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Inclua o prompt para a IA..."
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Resultado gerado pela IA..."
              readOnly
              value={completion}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável{' '}
            <code className="text-violet-400">{'${transcription}'}</code> no seu
            prompt para adicionar o conteúdo da transcrição do vídeo selecionado
          </p>
        </div>

        <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUploaded={setVideoId} />

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <PromptSelect onPromptSelected={setInput} />
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select disabled defaultValue="gpt3.5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-Turbo 16K</SelectItem>
                </SelectContent>
              </Select>

              <span className="block text-xs text-muted-foreground italic">
                Você poderá customizar esta opção em breve!
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperatura</Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
                className="w-full"
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />
            </div>

            <span className="block text-xs text-muted-foreground italic">
              Valores mais altos geram textos mais criativos, mas menos
              coerentes
            </span>

            <Separator />

            <Button disabled={isLoading} type="submit" className="w-full">
              Gerar texto
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}
