import Axios from "axios";
import React from "react";
import { Button, FormControl, InputGroup, Table } from "react-bootstrap";
import { ItemsDropdown } from "./ItemsDropdown";

export interface CraftableItem {
  id: string;
  displayName: string;
  itemsPerMinute?: number;
}

interface RatioCalculatorState {
  selectedItemId?: string,
  targetItemsPerMinute: number,
  ingredients: Array<CraftableItem>
}

export class RatioCalculator extends React.Component<{}, RatioCalculatorState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      selectedItemId: undefined,
      targetItemsPerMinute: 0,
      ingredients: []
    };
  }

  updateTargetItemsPerMinute = (updatedValue: number) => {
    this.setState({
      ...this.state,
      targetItemsPerMinute: updatedValue,
    });
  }

  updateSelectedItemId = (updatedValue: string) => {
    this.setState({
      ...this.state,
      selectedItemId: updatedValue,
    });
  }

  getRatios = () => {
    if (this.state.selectedItemId && this.state.targetItemsPerMinute) {
      Axios.get("http://ec2-54-237-125-48.compute-1.amazonaws.com/api/craftableItems/calculateRatios", {
        params: {
          craftableItemId: this.state.selectedItemId,
          itemsPerMinuteTarget: this.state.targetItemsPerMinute
        }
      }).then((response) => {
        console.log(response.data);
        this.setState({
          ...this.state,
          ingredients: response.data
        });
      });
    }
  }

  render() {
    return <div>
      <header className="ratio-calculator-header">
      <p className="instruction-text">
        Select a craftable resource from the dropdown, enter your target number of items per minute, and hit submit
      </p>
      </header>
        <div className="inputs">
          <InputGroup>
            <ItemsDropdown selectionCallback={this.updateSelectedItemId}/>
            <FormControl
              className="items-per-minute-input"
              type="number"
              value={this.state?.targetItemsPerMinute}
              onChange={(e) => this.updateTargetItemsPerMinute(Number(e.target.value))}
              size="lg" />
            <Button
              className="submit-button"
              size="lg"
              onClick={() => this.getRatios()}
              variant="primary">
              Submit
            </Button>
          </InputGroup>
          <div className="results-container">
            <Table
              variant="success"
              size="lg">
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th>Required Items Per Minute</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.ingredients.map((result: CraftableItem) => {
                    return <tr>
                      <td>{result.displayName}</td>
                      <td>{result.itemsPerMinute}</td>
                    </tr>
                  })}
                </tbody>
              </Table>
            </div>
        </div>
    </div>
  }
}
