import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const AMPSENTRIX_PRICING = [
  { model: "iPhone 12 / Mini / Pro", price: "$70.000" },
  { model: "iPhone 12 Pro Max", price: "$73.000" },
  { model: "iPhone 13 Mini", price: "$72.000" },
  { model: "iPhone 13", price: "$73.000" },
  { model: "iPhone 13 Pro", price: "$78.000" },
  { model: "iPhone 13 Pro Max", price: "$79.000" },
  { model: "iPhone 14", price: "$75.000" },
  { model: "iPhone 14 Plus / Pro", price: "$78.000" },
  { model: "iPhone 14 Pro Max", price: "$80.000" },
  { model: "iPhone 15", price: "$75.000" },
  { model: "iPhone 15 Plus", price: "$78.000" },
  { model: "iPhone 15 Pro", price: "$80.000" },
  { model: "iPhone 15 Pro Max", price: "$83.000" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0 },
};

const AmpsentrixSection = () => {
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const apiRef = useRef<CarouselApi | null>(null);

  useEffect(() => {
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, []);

  const handleSetApi = (api: CarouselApi) => {
    apiRef.current = api;

    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }

    autoplayRef.current = setInterval(() => {
      apiRef.current?.scrollNext();
    }, 2400);
  };

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_hsl(var(--primary)/0.2),_transparent_45%),radial-gradient(circle_at_80%_10%,_hsl(var(--accent)/0.12),_transparent_40%),linear-gradient(to_bottom,_transparent,_hsl(var(--background))_88%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 md:px-8">
        <motion.div
          className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="space-y-5">
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              Cambio de Baterías{" "}
              <span className="bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">
                Ampsentrix Plus Extended
              </span>
            </h2>
            <p className="max-w-2xl text-sm text-zinc-300 sm:text-base md:text-lg">
              Baterías premium con mayor autonomía, rendimiento estable y montaje
              profesional para mantener la experiencia original de tu iPhone.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-white/[0.03] p-2 shadow-[0_0_60px_hsl(var(--primary)/0.18)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-cyan-300/20" />
            <img
              src="/Ampsentrix.webp"
              alt="Batería Ampsentrix Plus Extended"
              className="relative z-10 h-[250px] w-full rounded-2xl object-cover sm:h-[320px] md:h-[360px]"
            />
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
          className="relative"
        >
          <Carousel
            opts={{ align: "start", loop: true }}
            setApi={handleSetApi}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {AMPSENTRIX_PRICING.map((item, idx) => (
                <CarouselItem
                  key={`${item.model}-${idx}`}
                  className="basis-full pl-3 md:basis-1/2 lg:basis-1/3 md:pl-4"
                >
                  <motion.div
                    className="group h-full rounded-2xl border border-primary/25 bg-white/[0.03] p-[1px] shadow-[0_0_30px_hsl(var(--primary)/0.12)]"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.03,
                      ease: "easeOut",
                    }}
                  >
                    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.25)]">
                      <p className="text-base font-semibold text-white sm:text-lg">
                        {item.model}
                      </p>
                      <span className="mt-3 inline-flex w-fit rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                        7% Más Capacidad
                      </span>

                      <div className="mt-5">
                        <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                          Total
                        </p>
                        <p className="mt-1 text-3xl font-extrabold text-primary">
                          {item.price}
                        </p>
                      </div>

                      <a
                        href="https://wa.me/56929810915"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-primary/40 bg-primary/90 px-4 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:bg-primary hover:shadow-[0_0_24px_hsl(var(--primary)/0.5)]"
                      >
                        Agendar Reparación
                      </a>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-2 border-primary/35 bg-zinc-950/80 text-primary hover:bg-zinc-900 sm:left-3" />
            <CarouselNext className="right-2 border-primary/35 bg-zinc-950/80 text-primary hover:bg-zinc-900 sm:right-3" />
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

export default AmpsentrixSection;