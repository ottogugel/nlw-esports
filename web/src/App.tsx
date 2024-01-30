import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CreateAdBanner } from "./components/CreateAdBanner";
import { GameBanner } from "./components/GameBanner";

import "./styles/main.css";

import logoImg from "./assets/logo-nlw-esports.svg";
import { CreateAdModal } from "./components/CreateAdModal";
import axios from "axios";
import { CaretLeft, CaretRight } from "phosphor-react";

interface Game {
  id: string;
  title: string;
  bannerUrl: string;
  _count: {
    ads: number;
  };
}

function App() {

  const [loaded, setLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    mode: "free-snap",
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    breakpoints: {
      "(min-width: 400px)": {
        slides: { perView: 1.5, spacing: 16 },
      },
      "(min-width: 600px": {
        slides: { perView: 3.25, spacing: 16 },
      },
      "(min-width: 800px": {
        slides: { perView: 4.25, spacing: 16 },
      },
      "min-width: 1000px": {
        slides: { perView: 3.25, spacing: 16 },
      },
      "min-width: 1200px": {
        slides: { perView: 6.25, spacing: 16 },
      },
    },
    slides: { perView: 1.25, spacing: 16, origin: 'center'}
  });

  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    axios("http://localhost:3333/games").then((response) => {
      setGames(response.data);
    });
  }, []);

  return (
    <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
      <img src={logoImg} alt="" />
      <h1 className="text-6xl text-white font-black mt-20">
        Your{" "}
        <span className="text-transparent bg-nlw-gradient bg-clip-text">
          duo
        </span>{" "}
        is here.
      </h1>

      {games.length > 0 && (
        <div className="w-full navigation-wrapper relative px-4 md:px-0">
          <div ref={sliderRef} className="mt-16 keen-slider">
            {games.map((game) => {
              return (
                <GameBanner
                  key={game.id}
                  title={game.title}
                  bannerUrl={game.bannerUrl}
                  adsCount={game._count.ads}
                />
              );
            })}
          </div>

          <button
            className="absolute top-1/2 md:-left-12 w-12 h-12 translate-y-1/2"
            onClick={(e: any) => {
              e.stopPropagation() || instanceRef.current?.prev();
            }}
          >
            <CaretLeft size={40} color="rgb(161, 161, 170)" />
          </button>

          <button
            className="absolute top-1/2 -right-0 md:-right-12 w-12 h-12 translate-y-1/2"
            onClick={(e: any) => {
              e.stopPropagation() || instanceRef.current?.next();
            }}
          >
            <CaretRight size={40} color="rgb(161, 161, 170)" />
          </button>
        </div>
      )}

      <Dialog.Root>
        <CreateAdBanner />

        <CreateAdModal />
      </Dialog.Root>
    </div>
  );
}

export default App;
