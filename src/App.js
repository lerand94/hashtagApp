import React, { useEffect, useState } from "react";

import Tasks from "./components/Tasks/Tasks";
import NewTask from "./components/NewTask/NewTask";
import useHttp from "./hooks/use-http";
import FilterNotes from "./components/Filter/FIlterNotes";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [activeFilter, setActiveFilter] = useState("");

  const { isLoading, error, sendRequest: fetchTasks } = useHttp();

  const transformTasks = (tasksObj) => {
    const loadedTasks = [];
    const loadedFilters = [];

    for (const taskKey in tasksObj) {
      if (typeof tasksObj[taskKey]["hashtags"] !== "undefined") {
        loadedTasks.push({
          id: taskKey,
          text: tasksObj[taskKey].text,
          hashtags: tasksObj[taskKey].hashtags,
        });
      } else {
        loadedTasks.push({
          id: taskKey,
          text: tasksObj[taskKey].text,
          hashtags: [],
        });
      }
      if (typeof tasksObj[taskKey]["hashtags"] !== "undefined") {
        if (tasksObj[taskKey].hashtags.length > 1) {
          tasksObj[taskKey].hashtags.map((hash) => {
            if (!loadedFilters.includes(hash.toString())) {
              loadedFilters.push(hash.toString());
            }
          });
        } else {
          if (!loadedFilters.includes(tasksObj[taskKey].hashtags.toString())) {
            loadedFilters.push(tasksObj[taskKey].hashtags.toString());
          }
        }
      }
    }

    setFilters(loadedFilters);
    setTasks(loadedTasks);
  };

  useEffect(() => {
    fetchTasks(
      {
        url:
          "https://hashtags-547cd-default-rtdb.firebaseio.com\n" +
          "\n/notes.json",
      },
      transformTasks
    );
  }, [fetchTasks]);

  const taskAddHandler = (task) => {
    if (task.hashtags.length > 0) {
      const newFilters = [...filters];
      task.hashtags.map((hashtag) => {
        if (!filters.includes(hashtag.toString())) {
          newFilters.push(hashtag.toString());
        }
      });
      setFilters([...newFilters]);
    }
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  const taskDeleteHandler = (id) => {
    const updatedTasks = tasks.filter((item) => item.id !== id);
    const deletedTask = tasks.filter((item) => item.id === id)[0].hashtags[0];
    const countOfDeletedHashs = tasks.filter((item) =>
      item.hashtags.includes(deletedTask)
    );
    if (countOfDeletedHashs.length === 1) {
      setFilters(filters.filter((item) => item !== deletedTask));
    }
    setTasks(updatedTasks);
  };

  const taskEditHandler = (task) => {
    const oldFilterTask = tasks.filter((item) => item.id === task.id)[0]
      .hashtags[0];
    if (oldFilterTask === undefined) {
      if (task.hashtags.length > 0) {
        setFilters([...filters, task.hashtags[0]]);
      }
    } else {
      const updatedFilters = filters.map((item) => {
        if (item !== oldFilterTask) {
          return item;
        } else {
          return task.hashtags[0];
        }
      });
      setFilters(updatedFilters);
    }
    const updatedTasks = tasks.map((item) => {
      if (item.id === task.id) {
        return { text: task.text, hashtags: task.hashtags, id: task.id };
      } else {
        return item;
      }
    });

    setTasks(updatedTasks);
  };

  const filterHandler = (filter) => {
    const filteredNotesArray = tasks.filter((task) =>
      task.hashtags.includes(filter)
    );
    setActiveFilter(filter);

    setFilteredNotes(filteredNotesArray);
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      {filters.length > 0 && (
        <FilterNotes
          items={filters}
          onFilterNotes={filterHandler}
          activeFilter={activeFilter}
        />
      )}
      <Tasks
        items={filteredNotes.length > 0 ? filteredNotes : tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
        onDeleteTask={taskDeleteHandler}
        onEditTask={taskEditHandler}
      />
    </React.Fragment>
  );
}

export default App;
