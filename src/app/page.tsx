import App from "../app/app/page";
import Sudoku from "../app/sudoku/page";
import Footnote from "../app/footnote/page";
import FlappyBirdGame from "./flappyBird/page";
import Contra from "./contra/page";
import Snake from "./snake/page"
import Tree from "./compo/trees"
import Ludo from "./ludo/page";

export default function Home() {
  return (
    <div className="bg-amber-200 border-[.5rem] border-dashed border-emerald-300">
      <Tree/>
      <App />
      <Sudoku />
      <FlappyBirdGame />
      <Contra />
      <Snake/>
      <Ludo/>
      <Footnote />
    </div>
  );
}
