import Section from "../UI/Section";
import TaskItem from "./TaskItem";
import classes from "./Tasks.module.css";

const Tasks = (props) => {
  let taskList = <h2>No notes found. Start adding some!</h2>;

  if (props.items.length > 0) {
    taskList = (
      <ul>
        {props.items.map((task) =>
          task.hashtags !== undefined ? (
            <TaskItem
              key={task.id}
              hash={task.hashtags}
              id={task.id}
              onFetch={props.onFetch}
              onDeleteTask={props.onDeleteTask}
              onEditTask={props.onEditTask}
            >
              {task.text}
            </TaskItem>
          ) : (
            <TaskItem key={task.id} id={task.id} hash={[]}>
              {task.text}
            </TaskItem>
          )
        )}
      </ul>
    );
  }

  let content = taskList;

  if (props.error) {
    content = <button onClick={props.onFetch}>Try again</button>;
  }

  if (props.loading) {
    content = "Loading tasks...";
  }

  return (
    <Section>
      <div className={classes.container}>{content}</div>
    </Section>
  );
};

export default Tasks;
