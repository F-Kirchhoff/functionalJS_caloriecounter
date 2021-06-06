
import view from "./View";
import app from "./App";
import update from "./Update";
import initModel from "./Model";


const node = document.getElementById("app");

app(initModel,update,view,node);