import * as R from "ramda";
const MSGS = {
  SHOW_FORM: "SHOW_FORM",
  MEAL_INPUT: "MEAL_INPUT",
  CALORIE_INPUT: "CALORIE_INPUT",
  ADD_MEAL:"ADD_MEAL",
  EDIT_MEAL: "EDIT_MEAL",
  REMOVE_MEAL: "REMOVE_MEAL",
}

export function showFormMsg(showForm) {
  return {
    type: MSGS.SHOW_FORM,
    showForm,
  }
}
export function updateMealMsg(description) {
  return {
    type: MSGS.MEAL_INPUT,
    description,
  }
}
export function updateCalorieMsg(calories) {
  return {
    type: MSGS.CALORIE_INPUT,
    calories,
  }
}
export function addMealMsg() {
  return {
    type: MSGS.ADD_MEAL,
  }
}
export function editMealMsg(meal) {
  return {
    type: MSGS.EDIT_MEAL,
    meal,
  }
}
export function removeMealMsg(id) {
  return {
    type: MSGS.REMOVE_MEAL,
    id,
  }
}


function update(msg,model) {
  switch (msg.type) {

    case MSGS.SHOW_FORM: {
      const { showForm } = msg;  
      return {
        ...model,
        showForm,
        description: "",
        calories: 0,
        editID: showForm ? model.editID : null,
      };
    }

    case MSGS.MEAL_INPUT: {
      const { description } = msg;  
      return {
        ...model,
        description,
      };
    }

    case MSGS.CALORIE_INPUT: {
      const calories = R.pipe(
        parseInt,
        R.defaultTo(0),
      )(msg.calories);
      return {
        ...model,
        calories,
      };
    }

    case MSGS.ADD_MEAL: {
      return model.editID === null ? 
        add(msg,model) : 
        updateMeal(msg,model);
    }

    case MSGS.EDIT_MEAL: {
      const {description, calories, _id} = msg.meal;
      return {
        ...model,
        showForm: true,
        editID: _id,
        description,
        calories
      }
    }

    case MSGS.REMOVE_MEAL: {
      const updatedMeals = removeMeal(msg.id, model.meals);
      return {
        ...model,
        meals: updatedMeals,
      }
    }

    default:
      return model;
    }
  }

  

function removeMeal(id, meals) {
  return meals.filter( meal => meal._id !== id );
}

function updateMeal(msg,model) {
  const { meals, description, calories, editID } = model;
  const updatedMeals = meals.map(meal => {
    return meal._id === editID ?
      {...meal, description, calories} :
      meal;
  });
  return {
    ...model,
    meals: updatedMeals,
    editID: null,
    description: "",
    calories: 0,
    showForm: false,
  }
}

function add(msg,model) {
  const { meals, description, calories, nextID } = model;
  return description === "" ? model : {
    ...model,
    meals: [
      ...meals,
      {
        description,
        calories,
        _id: nextID,
      }
    ],
    nextID: nextID + 1,
    description: "",
    calories: 0,
    showForm: false,
  }
}

export default update;


