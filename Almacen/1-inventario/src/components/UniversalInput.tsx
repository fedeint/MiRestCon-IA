import { useState, useRef } from "react";
import { Mic, MicOff, ImagePlus, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface UniversalInputProps {
  onSubmit: (data: { text: string; audioBlob?: Blob; imageFile?: File }) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function UniversalInput({
  onSubmit,
  placeholder = 'Ej: "ingresar 10 kg de arroz proveedor Juan" o sube una imagen/voucher...',
  disabled = false,
}: UniversalInputProps) {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartRecording = async () => {
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
        toast({ title: "Audio grabado", description: "Audio listo para enviar" });
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast({ title: "Error", description: "No se pudo acceder al micrófono", variant: "destructive" });
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Formato no válido", description: "Solo se aceptan imágenes", variant: "destructive" });
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearAudio = () => setAudioBlob(null);

  const handleSubmit = () => {
    if (!text.trim() && !audioBlob && !imageFile) return;
    onSubmit({
      text: text.trim(),
      audioBlob: audioBlob || undefined,
      imageFile: imageFile || undefined,
    });
    setText("");
    clearImage();
    clearAudio();
  };

  const hasContent = text.trim() || audioBlob || imageFile;

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      {/* Header label */}
      <div className="px-4 pt-3 pb-1">
        <span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
          Entrada universal — Texto · Audio · Imagen
        </span>
      </div>

      {/* Attachments preview */}
      {(imagePreview || audioBlob) && (
        <div className="px-4 pt-2 flex gap-3 flex-wrap">
          {imagePreview && (
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-16 w-16 object-cover rounded-lg border border-border"
              />
              <button
                onClick={clearImage}
                className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {audioBlob && (
            <div className="relative group flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 text-sm text-muted-foreground">
              <Mic className="w-4 h-4 text-primary" />
              <span>Audio grabado</span>
              <button
                onClick={clearAudio}
                className="ml-1 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Text input + actions */}
      <div className="p-3 flex items-end gap-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isRecording}
          className="min-h-[44px] max-h-[120px] resize-none border-0 bg-secondary rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-primary/30"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        <div className="flex gap-1.5 shrink-0">
          {/* Image button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            title="Subir imagen"
          >
            <ImagePlus className="w-4 h-4" />
          </Button>

          {/* Audio button */}
          <Button
            type="button"
            variant={isRecording ? "destructive" : "ghost"}
            size="icon"
            className={`h-9 w-9 rounded-lg ${
              isRecording
                ? "animate-pulse"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={disabled}
            title={isRecording ? "Detener grabación" : "Grabar audio"}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>

          {/* Send button */}
          <Button
            type="button"
            size="icon"
            className="h-9 w-9 rounded-lg gradient-primary text-primary-foreground disabled:opacity-40"
            onClick={handleSubmit}
            disabled={disabled || !hasContent}
            title="Enviar"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
