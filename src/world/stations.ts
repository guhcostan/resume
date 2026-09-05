import type { Activity, Point } from "./routine";
export type Destination =
  | "projects"
  | "about"
  | "experience"
  | "rest"
  | "dogs"
  | "fitness"
  | "run"
  | "surf"
  | "food";
export type Station = {
  id: Destination;
  label: [string, string];
  hint: [string, string];
  position: Point;
  size: Point;
};
// Hit volumes follow the objects, so picking remains correct after camera rotation/zoom.
export const stations: Station[] = [
  {
    id: "projects",
    label: ["Programar", "Code"],
    hint: ["Computador · abrir projetos", "Computer · open projects"],
    position: [-1.1, 1.65, -1.8],
    size: [2.3, 1.1, 0.8],
  },
  {
    id: "about",
    label: ["Tomar um café", "Have a coffee"],
    hint: ["Caneca · sobre mim", "Mug · about me"],
    position: [-0.85, 0.58, 2.05],
    size: [0.7, 0.55, 0.65],
  },
  {
    id: "experience",
    label: ["Escolher um livro", "Pick a book"],
    hint: ["Biblioteca · minha trajetória", "Library · my journey"],
    position: [2, 0.65, -0.8],
    size: [0.75, 0.85, 2.4],
  },
  {
    id: "rest",
    label: ["Descansar um pouco", "Take a rest"],
    hint: ["Pufe · recarregar as ideias", "Beanbag · recharge"],
    position: [-1.98, 0.4, 1.5],
    size: [1.25, 0.7, 1.2],
  },
  {
    id: "dogs",
    label: ["Fazer carinho", "Pet the dogs"],
    hint: [
      "Golden & chihuahua · a melhor companhia",
      "Golden & chihuahua · best company",
    ],
    position: [0.85, 0.4, 2.3],
    size: [1.95, 0.8, 0.95],
  },
  {
    id: "fitness",
    label: ["Fazer um treino", "Work out"],
    hint: ["Pesos · uma série rápida", "Weights · a quick set"],
    position: [-2.64, 0.25, -0.18],
    size: [0.55, 0.5, 0.6],
  },
  {
    id: "run",
    label: ["Aquecer para correr", "Warm up for a run"],
    hint: ["Tênis · movimento faz bem", "Shoes · keep moving"],
    position: [-2.63, 0.2, 0.5],
    size: [0.6, 0.4, 0.5],
  },
  {
    id: "surf",
    label: ["Treinar o equilíbrio", "Practice balance"],
    hint: [
      "Prancha · pensando na próxima onda",
      "Surfboard · dreaming of the next wave",
    ],
    position: [2.5, 2, -2.4],
    size: [0.7, 1.35, 0.3],
  },
  {
    id: "food",
    label: ["Fazer um lanche", "Have a snack"],
    hint: ["Bandeja · uma pausa gostosa", "Tray · a tasty break"],
    position: [1.55, 1.3, -1.55],
    size: [0.65, 0.4, 0.65],
  },
];
export const activityLabels: Record<Activity, [string, string]> = {
  walk: ["Caminhando pelo quarto", "Walking around the room"],
  sit: ["Sentando para programar", "Sitting down to code"],
  code: ["Programando uma nova ideia", "Coding a new idea"],
  stand: ["Levantando da mesa", "Leaving the desk"],
  reach: ["Pegando a caneca", "Picking up the mug"],
  coffee: ["Tomando um café", "Enjoying a coffee"],
  "return-cup": ["Devolvendo a caneca", "Putting the mug back"],
  recline: ["Acomodando no pufe", "Settling into the beanbag"],
  sleep: ["Descansando um pouquinho", "Taking a little rest"],
  wake: ["Hora de levantar", "Getting up"],
  read: ["Folheando um livro", "Leafing through a book"],
  pet: ["Fazendo carinho nos cachorros", "Petting the dogs"],
  exercise: ["Mais uma repetição", "One more rep"],
  jog: ["Aquecendo para a corrida", "Warming up for a run"],
  balance: ["Treinando para a próxima onda", "Practicing for the next wave"],
  eat: ["Aproveitando um lanchinho", "Enjoying a little snack"],
};
