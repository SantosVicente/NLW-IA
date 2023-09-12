import { FileVideo, Github, Upload, Wand2 } from "lucide-react"; 
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Slider } from "./components/ui/slider";

export function App() {
  return (
    <div className="min-h-screen min-w-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-2xl font-bold">Upload AI</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com 💜 no NLW da Rocketseat
          </span>

          <Separator orientation="vertical" className="h-6" />

          <Button variant={"outline"}>
            <Github className="w-4 h-4 mr-2"/>
            GitHub
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
            />
            <Textarea 
              className="resize-none p-4 leading-relaxed"
              placeholder="Resultado gerado pela IA..." 
              readOnly 
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável <code className="text-violet-400">{'${transcription}'}</code> no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado
          </p>
        </div>
        
        <aside className="w-80 space-y-6">
          <form className="space-y-6">
            <label 
              htmlFor="video"
              className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-zinc-200 hover:border-zinc-600 transition-colors"
            >
              <FileVideo className="w-4 h-4"/>
              Selecione um vídeo
            </label>

            {/*sr-only faz o mesmo que display none, mas mantém ele no DOM, ou seja, ele continua clicável*/} 
            <input type="file" id="video" accept="video/mp4" className="sr-only" /> 

            <Separator />

            <div className="space-y-1">
              <Label htmlFor="transcription-prompt">
                Prompt de Transcrição
              </Label>
              <Textarea 
                id="transcription-prompt"
                className="h-20 leading-relaxed resize-none"
                placeholder="Inclua palavras-chave relacionadas ao vídeo separadas por vírgula ( , )"
              />
            </div>

            <Button variant="default" type="submit" className="w-full">
              Carregar Vídeo
              <Upload className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <Separator />

          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <Select >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um prompt..."/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="titleYt">Título do YouTube</SelectItem>
                  <SelectItem value="descriptionYt">Descrição do YouTube</SelectItem>
                </SelectContent>
              </Select>

              <span className="block text-xs text-muted-foreground italic">
                Você poderá customizar esta opção em breve!
              </span>
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select disabled defaultValue="gpt3.5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-Turbo</SelectItem>
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
              />
            </div>

            <Separator />

            <Button type="submit" className="w-full">
              Gerar Texto
              <Wand2 className="w-4 h-4 ml-2"/>
            </Button>
          </form>
        </aside>
      </main>  
    </div>
  )
}