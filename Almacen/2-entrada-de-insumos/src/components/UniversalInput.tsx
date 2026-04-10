import { useState, useRef } from "react";
import { Mic, MicOff, ImagePlus, MessageSquareText, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface UniversalInputProps {
  onTextSubmit?: (text: string) => void;
  onAudioCapture?: (blob: Blob) => void;
  onImageUpload?: (file: File) => void;
}

type InputMode = "text" | "audio" | "image";

const UniversalInput = ({ onTextSubmit, onAudioCapture, onImageUpload }: UniversalInputProps) => {
  const { toast } = useToast();
  const [mode, setMode] = useState<InputMode>("text");
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Audio ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast({
        title: "Error de micrófono",
        description: "No se pudo acceder al micrófono. Verifica los permisos.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // --- Image ---
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Archivo muy grande", description: "Máximo 10 MB", variant: "destructive" });
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Submit ---
  const handleSubmit = () => {
    if (mode === "text" && text.trim()) {
      onTextSubmit?.(text.trim());
      setText("");
      toast({ title: "Texto enviado", description: "Se procesará con IA cuando esté habilitada." });
    } else if (mode === "audio" && audioBlob) {
      onAudioCapture?.(audioBlob);
      setAudioBlob(null);
      toast({ title: "Audio capturado", description: "Se procesará con IA cuando esté habilitada." });
    } else if (mode === "image" && imageFile) {
      onImageUpload?.(imageFile);
      clearImage();
      toast({ title: "Imagen subida", description: "Se procesará con IA cuando esté habilitada." });
    } else {
      toast({ title: "Sin datos", description: "Ingresa texto, graba audio o sube una imagen.", variant: "destructive" });
    }
  };

  const modeButtons: { key: InputMode; icon: React.ReactNode; label: string }[] = [
    { key: "text", icon: <MessageSquareText className="h-4 w-4" />, label: "Texto" },
    { key: "audio", icon: <Mic className="h-4 w-4" />, label: "Audio" },
    { key: "image", icon: <ImagePlus className="h-4 w-4" />, label: "Imagen" },
  ];

  return (
    <div className="rounded-xl border-2 border-dashed border-primary/30 bg-accent/30 p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">
          📥 Entrada rápida — texto, audio o imagen
        </p>
        <div className="flex gap-1">
          {modeButtons.map((m) => (
            <Button
              key={m.key}
              variant={mode === m.key ? "default" : "outline"}
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setMode(m.key)}
            >
              {m.icon}
              {m.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Text mode */}
      {mode === "text" && (
        <div className="space-y-2">
          <Textarea
            placeholder='Ej: "ingresar 10 kg de arroz proveedor Juan a S/ 3.50"'
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[60px] resize-none bg-background"
          />
        </div>
      )}

      {/* Audio mode */}
      {mode === "audio" && (
        <div className="flex flex-col items-center gap-3 py-4">
          {isRecording ? (
            <>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 animate-pulse rounded-full bg-destructive" />
                <span className="text-sm font-medium text-destructive">Grabando...</span>
              </div>
              <Button variant="destructive" size="lg" onClick={stopRecording} className="gap-2">
                <MicOff className="h-5 w-5" />
                Detener grabación
              </Button>
            </>
          ) : (
            <>
              {audioBlob ? (
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Audio listo para enviar</span>
                  <Button variant="ghost" size="sm" onClick={() => setAudioBlob(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Presiona para dictar la entrada de insumos
                </p>
              )}
              <Button variant="outline" size="lg" onClick={startRecording} className="gap-2">
                <Mic className="h-5 w-5 text-primary" />
                Iniciar grabación
              </Button>
            </>
          )}
        </div>
      )}

      {/* Image mode */}
      {mode === "image" && (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-40 rounded-lg border object-contain"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6"
                onClick={clearImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-background py-8 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-primary"
            >
              <ImagePlus className="h-5 w-5" />
              Subir factura, boleta o foto de productos
            </button>
          )}
        </div>
      )}

      {/* Submit */}
      <div className="mt-3">
        <Button onClick={handleSubmit} className="w-full gap-2" size="sm">
          Procesar entrada
        </Button>
      </div>
    </div>
  );
};

export default UniversalInput;
