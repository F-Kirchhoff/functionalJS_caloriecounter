import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
import * as R from "ramda";
import { 
  showFormMsg, 
  updateMealMsg, 
  updateCalorieMsg,
  addMealMsg, 
  editMealMsg,
  removeMealMsg,
} from "./Update";

const { pre, div, h1, button, input, label, form, td, th, tr, table, i } = hh(h);


function cell(style,cellContent) {
  return td({ className: `pa2 ${style}` },cellContent)
}
const mealHead = tr({ className: "striped--near-white"},[
  th({ className:"pa2 w-50" }, "Description"),
  th({ className:"pa2 w-30" }, "Calories"),
  th({ className:"pa2 w-20" }),
])
function mealRow(dispatch, meal) {
  return tr({ className: "striped--near-white" }, [
    cell("w-50",meal.description),
    cell("w-30 tr",meal.calories),
    cell("w-20 flex", mealButtonSet(dispatch, meal)),
  ])
}
function totalRow(meals) {
  const total = R.pipe(
    R.map( meal => meal.calories ),
    R.sum,
  )(meals);
  
  return tr({ className: "bt b" }, [
    cell("w-50 tr bt","Total:"),
    cell("w-30 tr bt", total),
    cell("bt w-20"),
  ])
}

function mealButtonSet(dispatch,meal) {
  return [
    button( { 
      className: "bn bg-transparent",
      onclick: () => dispatch(editMealMsg(meal)),
      }, i( { className: "far fa-edit"})),
    button( { 
      className: "bn bg-transparent",
      onclick: () => dispatch(removeMealMsg(meal._id)),
      }, i( { className: "far fa-trash-alt"})),
  ];
};




function fieldSet(fieldName,inputValue,oninput) {
  return div({ className: "ma1 flex justify-between"}, [
    label({ 
      className: "",
      for: fieldName,
    }, `${fieldName}:`),
    input({ 
      className: "w-70",
      name: fieldName,
      value: inputValue,
      oninput,
    }),
  ]);
}

function buttonSet(dispatch) {
  return div({className: "pv1"}, [
    button( {
      className: "f3 bn pv2 ph3 mh1 bg-blue white",
      type: "submit",
    },"save"),
    button( {
      className: "f3 bn pv2 ph3 mh1 bg-grey white",
      onclick: () => dispatch(showFormMsg(false)),
    },"cancel"),
  ])
}



function mealsTableView(dispatch, meals) {
  return table({ className: "w-100 mt3 collapse" },[
    mealHead,
    ...meals.map( meal => mealRow(dispatch,meal)),
    totalRow(meals),
  ])
}

function formView(dispatch,model) {
  const {description, showForm, calories} = model;
  if (showForm) {
    return form({ 
      className: "", 
      onsubmit: (e) => {
        e.preventDefault();
        dispatch(addMealMsg());
      },
    }, [
      fieldSet("meal",description,(e) => dispatch(updateMealMsg(e.target.value))),
      fieldSet("calories",calories == "0" ? "" : calories, (e) => dispatch(updateCalorieMsg(e.target.value))),
      buttonSet(dispatch),
    ]);
  } else {
    return button( { 
      className: "f3 bn pv2 ph3 bg-blue white",
      onclick: () => dispatch(showFormMsg(true)),
    }, "add meal");
  }
}



function view(dispatch,model) {
  return div( {className: "mw6 center bg-white pa4 pt1 br3"}, [
    h1({ className: "f2 pv2 bb"}, "Calorie Counter"),
    formView(dispatch,model),
    mealsTableView(dispatch, model.meals),
    // pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;