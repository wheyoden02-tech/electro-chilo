/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Marquee } from '@/components/ui/marquee';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const reviews = [
  { name: 'María José', city: 'Castro', body: 'Recuperaron mis datos del iPhone después de un daño por humedad. Seco el servicio.', img: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=100&h=100&fit=crop' },
  { name: 'Carlos A.', city: 'Ancud', body: 'Arreglo de Joy-Con drift. El Switch quedó como nuevo.', img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop' },
  { name: 'Javiera Muñoz', city: 'Dalcahue', body: 'Microsoldadura en iPhone 12. Ningún técnico quería tomarlo.', img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop' },
  { name: 'Pedro Campos', city: 'Quellón', body: 'Upgrade de RAM y SSD en mi notebook. Vuela.', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop' },
  { name: 'Francisca', city: 'Castro', body: 'El mejor servicio técnico de la isla. Honestos y rápidos.', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
  { name: 'Tomás Vera', city: 'Chonchi', body: 'Revivieron mi Switch Lite después de un golpe fuerte. Magia.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { name: 'Elena R.', city: 'Achao', body: 'Data recovery de mi disco externo. Pensé que lo había perdido todo.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { name: 'Diego Mancilla', city: 'Ancud', body: 'Cambio de batería y dock del Switch. Excelente trabajo.', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
  { name: 'Catalina Ruiz', city: 'Castro', body: 'Mi MacBook quedó impecable después de la limpieza profunda.', img: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=100&h=100&fit=crop' },
  { name: 'José Luis', city: 'Quellón', body: 'Reparación de placa iPhone. Servicio profesional.', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop' },
  { name: 'Dominga', city: 'Dalcahue', body: 'Mi notebook no encendía. Lo arreglaron en 24 horas.', img: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100&h=100&fit=crop' },
  { name: 'Ignacio', city: 'Castro', body: 'Reparación de HDMI en PS4. Excelente.', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop' },
  { name: 'Camila', city: 'Chonchi', body: 'Cambio de pantalla iPhone con repuestos de alta calidad.', img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop' },
  { name: 'Carolina', city: 'Achao', body: 'Mi disco duro murió y lograron rescatar mis fotos familiares.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { name: 'Miguel', city: 'Ancud', body: 'Joy-Con drift eliminado, quedó perfecto.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { name: 'Fabiola', city: 'Castro', body: 'Limpieza interna de mi PC. Bajó 20° en juegos.', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop' },
  { name: 'Rodrigo', city: 'Quellón', body: 'Reparación de placa base. Muy recomendados.', img: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=100&h=100&fit=crop' },
  { name: 'Valentina', city: 'Dalcahue', body: 'Mi Switch no cargaba. Lo solucionaron rápido.', img: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100&h=100&fit=crop' },
  { name: 'Sebastián', city: 'Chonchi', body: 'iPhone con corto. Ahora funciona perfecto.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { name: 'Paola', city: 'Achao', body: 'Rescataron documentos vitales de mi notebook.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' }
];

function ReviewCard({ img, name, city, body }: any) {
  return (
    <Card className="w-28 md:w-32 bg-card/40 backdrop-blur-md border-white/5 shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={img} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs font-bold leading-tight">{name}</p>
            <p className="text-[9px] text-primary uppercase">{city}</p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground italic leading-relaxed">"{body}"</p>
      </CardContent>
    </Card>
  );
}

export default function TrustSection() {
  const columns = 6;
  const speeds = ['[--duration:22s]', '[--duration:28s]', '[--duration:33s]', '[--duration:40s]', '[--duration:45s]', '[--duration:25s]'];

  return (
    <section className="relative w-full overflow-hidden py-10">
      <div className="w-full h-[80vh] min-h-[700px] overflow-hidden relative [perspective:1000px]">
        <div
          className={cn(
            'absolute inset-0 flex',
            'transform-gpu',
            'rotate-x-[15deg] rotate-y-[-5deg] rotate-z-[5deg]'
          )}
        >
          {/* GRID DE COLUMNAS */}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 w-full h-full gap-3 px-3">
            {Array.from({ length: columns }).map((_, i) => (
              <Marquee
                key={i}
                vertical
                reverse={i % 2 === 0}
                className={cn('w-full h-full flex-col', speeds[i])}
              >
                {reviews.map((r, idx) => (
                  <ReviewCard key={idx} {...r} />
                ))}
              </Marquee>
            ))}
          </div>
        </div>

        {/* FADES SUPERIORES E INFERIORES */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background z-20"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background z-20"></div>
      </div>
    </section>
  );
}