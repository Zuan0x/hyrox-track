const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const path = require('path');
const { v4 : uuid } = require('uuid');

const PORT = process.env.PORT || 3000;

let todos = [
  {
    id: uuid(),
    name: 'Sled push',
    done: true
  },
];

let exercises = [
  {
    id: "1",
    name: 'SkiErg',
    todo: '1000m SkiErg',
    description: "The first HYROX workout station is 1000m on the Ski Erg. This erg predominantly targets the arm, shoulder & core muscles, however when done efficiently, it also involves muscles in the lower body – making the Ski Erg a full body workout.",
    flipped: false
  },
  {
    id: "2",
    name: 'Sled Push',
    todo: "50m Sled Push 152kg",
    description: "The second workout station is 50m of Sled Push. This is one station you do not want to come unprepared for… so make sure you try it out at least once before your race and invest in some grippy shoes! This movement targets the lower body muscles, including the entire posterior chain, core & anterior thigh muscles in particular.",
    flipped: false
  },
  {
    id: "3",
    name: 'Sled Pull',
    todo: "50m Sled Pull 103kg",
    description: "Get ready to use your glutes, back, biceps & the entire trunk during workout station three – 50m of Sled Pull.",
    flipped: false
  },
  {
    id: "4",
    name: 'Burpee Broad Jump',
    todo: "80m Burpee Broad Jump",
    description: "Born in 1939, the fourth workout station is a full body workout that is both loved and hated at the same time. Trying these for the first time may feel hard, but many of our regular athletes now consider this station to be one of their favourites!",
    flipped: false
  },
  {
    id: "5",
    name: 'Rowing',
    todo: '1000m Row',
    description: "Station number five is the second ergometer in this fitness race. 1000m of rowing marks the beginning of the second half of your HYROX race.",
    flipped: false
  },
  {
    id: "6",
    name: 'Farmers Carry 2x24kg',
    todo: "200m Farmers Carry",
    description: "For 200m of Farmers Carry, engagement of your upper back muscles, core & grip strength is required. This workout station is easy to practise on your weekly shop…",
    flipped: false
  },
  {
    id: "7",
    name: 'Sandbag Lunges',
    todo: '100m Sandbag Lunges 20kg',
    description: "10, 20 or 30 kilograms on your back whilst lunging? Welcome to workout station number seven. Primarily targets the thigh and glute muscles, this one is a burner…",
    flipped: false
  },
  {
    id: "8",
    name: 'Wall Balls',
    todo: '100 Wall Balls 6kg',
    description: "The final station… Wall Balls. With the finish line in sight, it’s time to finish your race in style & join the #HYROXFAMILY.",
    flipped: false
  },
];

const getItemsLeft = () => todos.filter(t => !t.done).length;

const app = express();
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  const { filter } = req.query;
  let filteredTodos = [];
  switch(filter) {
    case 'all':
      filteredTodos = todos;
      break;
    case 'active':
      filteredTodos = todos.filter(t => !t.done);
      break;
    case 'completed':
      filteredTodos = todos.filter(t => t.done);
      break;
    default:
      filteredTodos = todos;
  }

  res.render('index', { todos: filteredTodos, filter, itemsLeft: getItemsLeft(), exercises });
});

app.post('/todos', (req, res) => {
  const { todo } = req.body;
  const newTodo = { 
    id: uuid(),
    name: todo, 
    done: false 
  };
  todos.push(newTodo);
  let template = pug.compileFile('views/includes/todo-item.pug');
  let markup = template({ todo: newTodo});
  template = pug.compileFile('views/includes/item-count.pug');
  markup  += template({ itemsLeft: getItemsLeft()});
  res.send(markup);
});

app.get('/todos/edit/:id', (req, res) => {
  const { id } = req.params;
  const todo = todos.find(t => t.id === id);
  let template = pug.compileFile('views/includes/edit-item.pug');
  let markup = template({ todo });
  res.send(markup);
});

app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todo = todos.find(t => t.id === id);
  todo.done = !todo.done;
  let template = pug.compileFile('views/includes/todo-item.pug');
  let markup = template({ todo });
  template = pug.compileFile('views/includes/item-count.pug');
  markup  += template({ itemsLeft: getItemsLeft()});
  res.send(markup);
});

app.post('/todos/update/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const todo = todos.find(t => t.id === id);
  todo.name = name;
  let template = pug.compileFile('views/includes/todo-item.pug');
  let markup = template({ todo });
  template = pug.compileFile('views/includes/item-count.pug');
  markup  += template({ itemsLeft: getItemsLeft()});
  res.send(markup);
});

app.delete('/todos/:id', (req,res) => {
  const { id } = req.params;
  const idx = todos.find(t => t === id);
  todos.splice(idx, 1);
  const template = pug.compileFile('views/includes/item-count.pug');
  const markup  = template({ itemsLeft: getItemsLeft()});
  res.send(markup);
});

app.post('/todos/clear-completed', (req, res) => {
  const newTodos = todos.filter(t => !t.done);
  todos = [...newTodos];
  let template = pug.compileFile('views/includes/todo-list.pug');
  let markup = template({ todos });
  template = pug.compileFile('views/includes/item-count.pug');
  markup  += template({ itemsLeft: getItemsLeft()});
  res.send(markup);
});

app.post('/exercises/:id', (req, res) => {
  const { id } = req.params;
  const exercise = exercises.find(e => e.id === id);
  exercise.flipped = !exercise.flipped;
  
  let template = exercise.flipped? pug.compileFile('views/components/exercise-card-back.pug') : pug.compileFile('views/components/exercise-card-front.pug');
  let markup = template({ exercise });
  res.send(markup);
});

app.listen(PORT);

console.log('Listening on port: ' + PORT);
