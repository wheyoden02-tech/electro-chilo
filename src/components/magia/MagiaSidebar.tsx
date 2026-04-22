import React, { useState } from 'react';
import { GameData } from '@/lib/googleSheets';
import { sendWebhookData } from '@/lib/n8nWebhook';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, HardDrive, Send, Loader2, MessageSquarePlus } from 'lucide-react';
import { toast } from 'sonner';

interface MagiaSidebarProps {
  selectedGames: GameData[];
  totalGB: number;
}

export const MagiaSidebar: React.FC<MagiaSidebarProps> = ({ selectedGames, totalGB }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [requiereSD, setRequiereSD] = useState(false);
  const [juegosExtra, setJuegosExtra] = useState('');
  const [showExtraInput, setShowExtraInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOverLimit = totalGB > 60;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGames.length === 0 && juegosExtra.trim() === '') {
      toast.error('Agrega al menos un juego a tu lista o escribe uno en la caja de texto adicional.');
      return;
    }

    setIsSubmitting(true);
    
    // Formatear la lista de juegos como un texto HTML simple para que el email lo muestre bonito
    const juegosFormateados = selectedGames
      .map((g, index) => `<strong>${index + 1}.</strong> ${g.nombre} <em>(${g.tamañoGB.toFixed(1)} GB)</em>`)
      .join('<br>');

    const payload = {
      nombre,
      email,
      whatsapp,
      juegosSeleccionados: selectedGames,
      totalGB,
      requiereSD,
      juegosExtra: juegosExtra.trim() !== '' ? juegosExtra : 'Ninguno'
    };

    const success = await sendWebhookData(payload);
    
    setIsSubmitting(false);

    if (success) {
      toast.success('¡Lista enviada! Jorge la revisará pronto. 🎮');
      // Limpiamos solo los datos del cliente para que pueda hacer otro pedido si quiere
      setNombre('');
      setWhatsapp('');
      setRequiereSD(false);
      setJuegosExtra('');
      setShowExtraInput(false);
    } else {
      toast.error('Hubo un error al enviar tu lista. Intenta de nuevo.');
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
      {/* HUD Header */}
      <div className="mb-6 border-b border-white/10 pb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <HardDrive className="h-6 w-6 text-[#00ffcc]" />
          ESTADO DE MAGIA
        </h2>
      </div>

      {/* Progress / Counter */}
      <div className="mb-8 space-y-4">
        <div className="flex items-end justify-between">
          <span className="text-sm font-medium text-zinc-400">Total Acumulado</span>
          <span className={`text-3xl font-black tracking-tighter ${isOverLimit ? 'text-yellow-400' : 'text-[#00ffcc]'}`}>
            {totalGB.toFixed(1)} <span className="text-lg">GB</span>
          </span>
        </div>
        
        {/* Decorative progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div 
            className={`h-full transition-all duration-500 ${isOverLimit ? 'bg-yellow-400' : 'bg-[#00ffcc]'}`}
            style={{ width: `${Math.min((totalGB / 128) * 100, 100)}%` }} // Reference 128GB as full for visual
          />
        </div>

        {isOverLimit && (
          <div className="flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 text-sm text-yellow-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
            <p>
              ¡Atención! Tu lista supera los 60GB, considera una SD de mayor capacidad o seleccionar la opción debajo.
            </p>
          </div>
        )}
      </div>

      {/* Summary of items */}
      <div className="mb-6 flex-[1.5] overflow-auto rounded-lg bg-white/5 p-5 min-h-[260px]">
        <h3 className="mb-1 text-base font-semibold text-zinc-200">Juegos Seleccionados ({selectedGames.length})</h3>
        <p className="mb-4 text-xs text-zinc-500">
          Revisa tu selección y asegúrate de completar tus datos de contacto más abajo para que podamos confirmar tu Magia y coordinar la instalación.
        </p>
        {selectedGames.length === 0 ? (
          <p className="text-sm text-zinc-500">Aún no hay juegos en tu lista.</p>
        ) : (
          <ul className="space-y-2 text-sm text-zinc-400">
            {selectedGames.map(g => (
              <li key={g.id} className="flex justify-between border-b border-white/5 pb-1">
                <span className="truncate pr-4">{g.nombre}</span>
                <span className="shrink-0">{g.tamañoGB.toFixed(1)} GB</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div>
            <Label htmlFor="nombre" className="text-zinc-400">Nombre o Nickname</Label>
            <Input 
              id="nombre" 
              required 
              value={nombre} 
              onChange={e => setNombre(e.target.value)}
              className="mt-1 border-white/10 bg-black text-white focus-visible:ring-[#00ffcc]" 
            />
          </div>
          <div>
            <Label htmlFor="whatsapp" className="text-zinc-400">WhatsApp</Label>
            <Input 
              id="whatsapp" 
              type="tel"
              required 
              value={whatsapp} 
              onChange={e => setWhatsapp(e.target.value)}
              className="mt-1 border-white/10 bg-black text-white focus-visible:ring-[#00ffcc]" 
              placeholder="+56 9..."
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-zinc-400">Correo Electrónico</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="mt-1 border-white/10 bg-black text-white focus-visible:ring-[#00ffcc]" 
            />
          </div>
        </div>

        {/* Extra Games Option */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowExtraInput(!showExtraInput)}
            className="flex w-full items-center gap-2 text-left text-sm font-medium text-zinc-400 hover:text-[#00ffcc] transition-colors"
          >
            <MessageSquarePlus className="h-4 w-4" />
            ¿No está tu juego en la lista?
          </button>
          
          {showExtraInput && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <Label htmlFor="juegosExtra" className="text-xs text-zinc-500 mb-1 block">
                No te preocupes, escribe los que necesites y lo solucionamos:
              </Label>
              <textarea
                id="juegosExtra"
                rows={3}
                value={juegosExtra}
                onChange={e => setJuegosExtra(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-black p-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#00ffcc] focus:outline-none focus:ring-1 focus:ring-[#00ffcc]"
                placeholder="Ej: Mario RPG, The Witcher 3..."
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 rounded-lg border border-white/10 bg-white/5 p-3">
          <Checkbox 
            id="sd" 
            checked={requiereSD}
            onCheckedChange={(checked) => setRequiereSD(checked as boolean)}
            className="border-white/30 data-[state=checked]:bg-[#00ffcc] data-[state=checked]:text-black"
          />
          <Label htmlFor="sd" className="cursor-pointer text-sm font-medium text-white">
            Necesito adquirir una SD extra 💾
          </Label>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting || (selectedGames.length === 0 && juegosExtra.trim() === '')}
          className="w-full bg-[#00ffcc] py-6 text-lg font-bold text-black hover:bg-[#00ccaa] disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Send className="mr-2 h-5 w-5" />
          )}
          {isSubmitting ? 'ENVIANDO...' : 'ENVIAR LISTA DE MAGIA'}
        </Button>
      </form>
    </div>
  );
};
