import classes from "./FilterNoteItem.module.css";

const FilterNoteItem = (props) => {
  const filterHandler = (e) => {
    if (props.isSelected !== e.target.innerText) {
      props.onSelectFilter(e.target.innerText);
    } else {
      props.onSelectFilter("");
    }
  };

  const filterClasses =
    props.isSelected === props.children
      ? [classes.active, classes.note].join(" ")
      : classes.note;
  return (
    <li className={filterClasses} onClick={filterHandler}>
      {props.children}
    </li>
  );
};
export default FilterNoteItem;
