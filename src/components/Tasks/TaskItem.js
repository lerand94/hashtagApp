import classes from "./TaskItem.module.css";
import useHttp from "../../hooks/use-http";

import edit from "../../assets/edit.svg";
import deleteImg from "../../assets/delete.svg";
import { Fragment, useRef, useState } from "react";

const TaskItem = (props) => {
  const editRef = useRef();

  const [isEdit, setIsEdit] = useState(false);

  const { sendRequest: sendTaskRequest } = useHttp();

  const transformText = (
    <div>
      {props.children.split(" ").map((word, index) =>
        word.startsWith("#") ? (
          <span key={index} className={classes.hash}>
            {word}{" "}
          </span>
        ) : (
          <span key={index}>{word} </span>
        )
      )}
    </div>
  );

  const deleteNoteHandler = async () => {
    sendTaskRequest({
      url:
        `https://hashtags-547cd-default-rtdb.firebaseio.com\n` +
        `\n/notes/${props.id}.json`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    props.onDeleteTask(props.id);
  };

  const editNoteHandler = async () => {
    setIsEdit(true);
  };

  const submitEditHandler = (event) => {
    event.preventDefault();

    const editValue = editRef.current.value;

    const hashs = [];
    editValue.split(" ").map((word, index) => {
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

    sendTaskRequest({
      url:
        `https://hashtags-547cd-default-rtdb.firebaseio.com\n` +
        `\n/notes/${props.id}.json`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: { text: editValue, hashtags: hashs },
    });

    setIsEdit(false);

    props.onEditTask({ text: editValue, hashtags: hashs, id: props.id });
  };
  return (
    <Fragment>
      {isEdit && (
        <li className={classes.task}>
          <form className={classes["edit-form"]} onSubmit={submitEditHandler}>
            <input type="text" defaultValue={props.children} ref={editRef} />
            <button>
              <img src={edit} onClick={submitEditHandler} alt="edit" />
            </button>
          </form>
        </li>
      )}
      {!isEdit && (
        <li className={classes.task}>
          {transformText}
          <div className={classes.actions}>
            <img src={edit} onClick={editNoteHandler} alt="edit" />
            <img src={deleteImg} onClick={deleteNoteHandler} alt="delete" />
          </div>
        </li>
      )}
    </Fragment>
  );
};

export default TaskItem;
