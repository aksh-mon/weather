import App from "../app/app/page";
import Sudoku from "../app/sudoku/page"
import RoadRunner from "../app/roadRunner/page"
import Footnote from "../app/footnote/page"
export default function Home() {
  return (
    <div className="bg-amber-200 border-[.5rem] border-dashed border-emerald-300">
     <App/> 
     <Sudoku/>
     <RoadRunner/>
     <Footnote/>

    </div>
  );
}
