import Axios from "axios";
import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { CraftableItem } from "./RatioCalculator";

export interface ItemsDropdownProps {
  selectionCallback: Function
}

interface DropdownState {
  placeholder: string;
  items: Array<CraftableItem>
}

export class ItemsDropdown extends React.Component<ItemsDropdownProps, DropdownState> {
  constructor(props: ItemsDropdownProps) {
    super(props);
    this.state = {
      placeholder: "Loading...",
      items: [],
    };
  }

  componentDidMount() {
    Axios.get("http://ec2-54-237-125-48.compute-1.amazonaws.com/api/craftableItems").then((response) => {
      this.setState({
        items: response.data,
        placeholder: "Select Item"
      });
    });
  }

  render() {
    return <DropdownButton
      className="craftable-item-dropdown"
      title={ this.state.placeholder }
      variant="info"
      size="lg"
    >
      { this.state.items.map((i) => (
        <Dropdown.Item
          key={i.id}
          onClick={() => {
            this.props.selectionCallback(i.id);
            this.setState({...this.state, placeholder: i.displayName});
          }}
          className="input-select-dropdown"
          variant="primary"
          size="lg"
        >
          {i.displayName}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  }
}
