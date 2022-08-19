import Section from "../UI/Section";
import TaskForm from "./TaskForm";
import useHttp from "../../hooks/use-http";

const NewTask = (props) => {
  const { isLoading, error, sendRequest: sendTaskRequest } = useHttp();

  const createTask = (taskText, taskData) => {
    const generatedId = taskData.name;
    const hashs = [];
    taskText.split(" ").map((word, index) => {
      if (word.startsWith("#")) {
        if (hashs.includes(word)) {
          return;
        } else {
          hashs.push(word);
        }
      } else {
        return;
      }
    });
    const createdTask = {
      id: generatedId,
      text: taskText,
      hashtags: hashs,
    };

    props.onAddTask(createdTask);
  };

  const enterTaskHandler = async (taskText) => {
    console.log(taskText);
    const hashs = [];
    taskText.split(" ").map((word, index) => {
      if (word.startsWith("#")) {
        if (hashs.includes(word)) {
          return;
        } else {
          hashs.push(word);
        }
      } else {
        return;
      }
    });
    console.log(hashs);

    sendTaskRequest(
      {
        url:
          "https://hashtags-547cd-default-rtdb.firebaseio.com\n" +
          "\n/notes.json",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { text: taskText, hashtags: hashs },
      },
      createTask.bind(null, taskText)
    );
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewTask;
