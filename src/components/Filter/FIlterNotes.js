import Section from "../UI/Section";
import classes from "./FilterNotes.module.css";
import FilterNoteItem from "./FilterNoteItem";
import { useState } from "react";

const FilterNotes = (props) => {
  const [isSelected, setIsSelected] = useState(false);
  const selectedFilterHandler = (filter) => {
    setIsSelected(!isSelected);
    props.onFilterNotes(filter);
  };

  return (
    <Section>
      <div className={classes.container}>
        {
          <ul className={classes.filter}>
            {props.items.map((note, index) => (
              <FilterNoteItem
                key={index}
                onSelectFilter={selectedFilterHandler}
                isSelected={props.activeFilter}
              >
                {note}
              </FilterNoteItem>
            ))}
          </ul>
        }
      </div>
    </Section>
  );
};

export default FilterNotes;
